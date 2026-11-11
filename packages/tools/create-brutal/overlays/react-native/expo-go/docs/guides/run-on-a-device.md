# Running on a device

The app runs in [Expo Go](https://expo.dev/go), an app from the stores that loads your JavaScript from Metro on your machine. Nothing native is built: install Expo Go on the phone, run `npm start`, and scan the QR code it prints, with the camera on iOS or from Expo Go on Android. The phone has to reach your machine on the network; `npm start -- --tunnel` goes through a tunnel when it cannot.

`npm run android` and `npm run ios` open the app in Expo Go on an Android emulator or the iOS simulator, and `npm run web` in the browser.

## When Expo Go is no longer enough

Expo Go only holds the native modules of the Expo SDK. It cannot load any other native library, ignores the native settings of `app.json` (permissions, config plugins) and only runs the latest SDK. When the app needs one of these, move to a [development build](https://docs.expo.dev/develop/development-builds/introduction/): `npx expo install expo-dev-client`, then `npx expo run:android` or `npx expo run:ios` build the app and install it.
