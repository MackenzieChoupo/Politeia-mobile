del .\politeia.apk && ionic cordova build android --prod --release && apksigner -sigalg SHA1withRSA -digestalg SHA1 -keystore politeia.keystore "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" politeiaKS --storepass poli17932486 && zipalign -v 4 "platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk" politeia.apk