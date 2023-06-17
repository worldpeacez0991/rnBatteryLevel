import RNSounds from '@gemedico/react-native-sounds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect } from 'react';
import { NativeModules, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useBatteryLevel } from 'react-native-device-info';

function BatteryStatus(): JSX.Element {
  const defaultLower = '30';
  let [lowerBatteryLimit, setChangeLowerLimit] = React.useState(defaultLower);

  const defaultUpper = '95';
  let [upperBatteryLimit, setChangeUpperLimit] = React.useState(defaultUpper);

  const [soundStatus, setChangeSoundStatus] = React.useState('ON');

  // Read existing value from AsyncStorage
  useEffect(() => {
    const getData_Once_from_AsyncStorage = async () => {
      try {

        let lowerLimit: any = await AsyncStorage.getItem("@storage_key_lowerBatteryLimit");
        console.log('READ1', lowerLimit);
        if (lowerLimit == null) { lowerLimit = defaultLower };
        setChangeLowerLimit(lowerLimit); // ignore error, this is lib error

        let upperLimit: any = await AsyncStorage.getItem("@storage_key_upperBatteryLimit");
        console.log('READ2', upperLimit);
        if (upperLimit == null) { upperLimit = defaultUpper };
        setChangeUpperLimit(upperLimit); // ignore error, this is lib error

        // const upperBatteryLimit = await AsyncStorage.getItem("@storage_key_upperBatteryLimit");
        // setChangeUpperLimit(upperBatteryLimit);  // ignore error, this is lib error

      } catch (err) {
        console.log(err);
      }
    };
    getData_Once_from_AsyncStorage();
  }, []); // Does not render during getting values, so give []


  let batteryLevelStr: string = useBatteryLevel()?.toFixed(2) * 100 + '%';

  playSound(soundStatus, batteryLevelStr, lowerBatteryLimit, upperBatteryLimit);
  
  return (
    <View style={styles.container}>

      <View style={styles.view1}>
        <View style={styles.view_limit}>
          <Text style={[styles.text1, { marginRight: 10 }]}>Sound :
          </Text>
          <TouchableOpacity
            onPress={() => {
              // Create/Update existing value from AsyncStorage 
              // AsyncStorage.removeItem('@storage_key_lowerBatteryLimit');
              if (lowerBatteryLimit != null) {
                AsyncStorage.setItem('@storage_key_lowerBatteryLimit', lowerBatteryLimit);
              }
              if (upperBatteryLimit != null) {
                AsyncStorage.setItem('@storage_key_upperBatteryLimit', upperBatteryLimit);
              }
              if (soundStatus.toUpperCase() === 'ON') {
                RNSounds.beep(false);
                StopSysSound();
                // FIXED, beep sound off when i unplug charging cable
                setChangeSoundStatus('OFF');
              } else {
                setChangeSoundStatus('ON');
              }
            }} >
            <View style={styles.button}>
              <Text style={[styles.buttonText, { textTransform: 'uppercase' }]}>{soundStatus}</Text>
            </View>
          </TouchableOpacity >
        </View>

        <View style={styles.view_limit}>
          <Text style={styles.text1}>Battery Lower Limit :
          </Text>
          <TextInput
            style={styles.input}
            onChangeText={setChangeLowerLimit}
            value={lowerBatteryLimit}
            keyboardType='numeric'

          />
        </View>

        <View style={styles.view_limit}>
          <Text style={styles.text1}>Battery Upper Limit :
          </Text>
          <TextInput
            style={[styles.input,{marginLeft: 12}]}
            onChangeText={setChangeUpperLimit}
            value={upperBatteryLimit}
            keyboardType='numeric'
          />
        </View>

        <Text style={styles.text1}>Battery Level : {batteryLevelStr}</Text>
      </View>

      <View style={styles.btn1}>
        <TouchableOpacity
          onPress={() => {
            playSound(soundStatus, batteryLevelStr, lowerBatteryLimit, upperBatteryLimit);
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Test alarm !</Text>
          </View>
        </TouchableOpacity>
      </View>



    </View>
  );
}

// Alarm logic
function playSound(soundStatus: string, batteryLevelStr: string, lowerBatteryLimit: string, upperBatteryLimit: string) {
  if (soundStatus.toUpperCase() === 'ON') {
    if (+batteryLevelStr.split('%')[0] < +lowerBatteryLimit || +batteryLevelStr.split('%')[0] > +upperBatteryLimit) {
      RNSounds.PlaySysSound(71);
    }
  }
}

function StopSysSound() {
  const ReactNativeModule = NativeModules.RNReactNativeSounds;
  if (Platform.OS === 'android') { ReactNativeModule.StopSysSound(); };
}

// </SafeAreaView>
function App(): JSX.Element {

  // FIXED, beep sound off when i start app
  StopSysSound();

  return (
    <View style={styles.container}>
      <BatteryStatus />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'

  },
  view1: {
    marginStart: 80,
    flexDirection: 'column',
    paddingBottom: 15,
  },
  view_limit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  text1: {
    fontSize: 20
  },
  btn1: {
    marginRight: 120,
    marginLeft: 80,
    marginVertical: 10
  },
  input: {
    height: 34,
    width: 50,
    marginLeft: 10,
    marginRight: 10,
    borderWidth: 1,
    paddingVertical: 0,
    paddingLeft: 14,
    fontSize: 20
  },

  button: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#25d15e',
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 15,
    textAlign: 'center',
  }

});

export default App;
