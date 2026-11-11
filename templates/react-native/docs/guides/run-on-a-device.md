# Running on a device

The app runs in a development build: an app of its own, with the native modules and the settings of `app.json`, that loads its JavaScript from Metro on your machine. You build it once, then Metro reloads the code as you save. You only build again after adding a native library or changing a native setting.

[Expo Go](https://expo.dev/go) still works with `npm run start:go`, as long as the app only uses modules of the Expo SDK. It cannot load any other native library, ignores the native settings of `app.json` and only runs the latest SDK, so treat it as a way to try the app, not to work on it.

## Android

A local build needs the Android SDK, with `ANDROID_HOME` pointing to it, and a JDK 17. [Android Studio](https://developer.android.com/studio) installs both.

`npm run android` builds the development build, installs it and opens it: on the emulator that is running, on a phone plugged in over USB with USB debugging on, or, when there is neither, on an emulator it starts. Add `-- --device` to pick one from the list. Expo forwards Metro's port over USB itself, so the phone does not need to be on the same network.

The first build takes a few minutes. Expo writes the native project to `android/`, which git ignores: it is generated from `app.json` and the config plugins, so a native setting goes there, never into `android/`.

## A USB phone the SDK does not see

On WSL2, the adb of the Android SDK runs in Linux and does not see USB devices, while the `adb.exe` of Windows does and runs from WSL. Unzip [the Windows platform-tools](https://dl.google.com/android/repository/platform-tools-latest-windows.zip) in your Windows profile, then:

```sh
export ADB=/mnt/c/Users/<you>/platform-tools/adb.exe
npm run phone
```

`npm run phone` (`scripts/phone.ts`) finds the phone, forwards Metro's port with `adb reverse`, builds and installs the development build when the phone does not have it yet, starts Metro on `localhost` and opens the app on it. `PHONE=<serial>` picks a phone when several are plugged in. It works the same with any adb, outside WSL2 too.

Metro still runs in WSL: Windows forwards its `localhost` to WSL, so the phone reaches it through `adb reverse`.

## iOS

`npm run ios` builds the development build and opens it in the iOS simulator, or on an iPhone plugged in with `-- --device`. It needs a Mac with Xcode.

Without a Mac, [EAS Build](https://docs.expo.dev/develop/development-builds/create-a-build/) builds it in the cloud with the `development` profile of `eas.json`: `npx eas-cli build --profile development --platform ios`. Installing it on an iPhone needs an Apple Developer account. Until then, Expo Go is the free way to see the app on an iPhone.

## The browser

`npm run web` opens the app in the browser. It is the quickest way to check a screen, but it runs React Native Web, not the native views.
