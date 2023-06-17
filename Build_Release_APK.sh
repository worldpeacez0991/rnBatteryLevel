# Open Git Bash in this folder (Right click, 'Git Bash here')
# $ source Build_Release_APK.sh (to avoid cd and run issues)
# Why not ./Build_Release_APK.sh, this will fail when you cd and run commands

rootFolderPath=$(pwd)

mkdir -p android/app/src/main/assets

npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

cd android/app/src/main/res
rm -rf drawable-*

cd ../../../../
./gradlew assembleRelease

cd ../
echo "Release APK is found here:: $rootFolderPath/android/app/build/outputs/apk/release/app-release.apk"

