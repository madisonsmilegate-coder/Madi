# Mic Check — Android app

A WebView shell around `mic-check.html`. The whole game ships inside the APK,
runs offline, needs no permissions and makes no network calls.

## Building the APK

This project was written but **not compiled** in the environment that generated
it — that container has no Android SDK and its network policy blocks Google's
hosts, so neither the SDK nor the Android Gradle Plugin could be downloaded.
Everything here is valid and ready to build; it just needs a machine with the
SDK.

### Android Studio (easiest)
1. **File → Open** and select this `android/` folder.
2. Accept the prompt to install the missing SDK components (compileSdk 34,
   build-tools). Studio fetches them automatically.
3. **Run ▶** to install on a connected device, or
   **Build → Build Bundle(s)/APK(s) → Build APK(s)**.
4. The APK lands in `app/build/outputs/apk/debug/app-debug.apk`.

### Command line
Requires a JDK 17+ and the Android SDK, with `ANDROID_HOME` set:

```bash
cd android
gradle wrapper            # first time only, generates gradlew
./gradlew assembleDebug   # -> app/build/outputs/apk/debug/app-debug.apk
```

Install it with `adb install -r app/build/outputs/apk/debug/app-debug.apk`,
or copy the APK to the phone and open it (allow "install unknown apps").

A debug APK is signed with the local debug key, which is fine for personal
use and sideloading. For anything you would distribute, create a release
keystore and run `./gradlew assembleRelease`.

## What the shell does

`MainActivity` hosts a single WebView pointed at `file:///android_asset/index.html`:

- **JavaScript and DOM storage on** — career records, the ladder and VODs all
  live in `localStorage`, so DOM storage is required for progress to persist.
- **File and content access off** — the page is a local asset and has no reason
  to reach anything else on the device.
- **Back button** walks the page's history before leaving the app.
- **State saved on rotation**, so turning the phone mid-verse does not lose it.
- **Dark system bars** matching the game's background.

## Updating the game

`app/src/main/assets/index.html` is a copy of `mic-check.html` from the repo
root. After changing the game, re-copy it and rebuild:

```bash
cp ../mic-check.html app/src/main/assets/index.html
```
