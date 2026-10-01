# Wildwood

An offline 3D mythical animal sandbox inspired by Animal Jam and the woodland atmosphere of William and Sly. All game logic, meshes, music and poetry are original. This repository does not include the Animal Jam launcher, proprietary models or extracted font.

## Play

Desktop: open `game/index.html` in Chrome or Edge. Android: [download Wildwood.apk](downloads/Wildwood.apk?raw=true) and install it. Android 8 or newer and a current Android System WebView with WebGL support are required. The Android app uses landscape orientation.

Create one of 24 plush creatures, add wings and adornments, choose a colored soul flame, explore the island, splash in shallow water, read eight original runestone poems, decorate your cottage garden, and change the time and weather. There are no currencies or unlocks. Fernlight is an original ambient music composition synthesized locally.

Touch: left joystick moves; drag the world to orbit the camera; hold Run; tap Jump or Talk / read. Character creator and Home are in the bottom bar; Skies changes weather and time. Desktop uses WASD, Shift, Space, E, C, H, T and M.

## Automatic Android game updates

The APK bundles a playable version for the first offline launch. At startup, and when returning to the app after a minute, it checks the latest commit on `failimus48-max/wildwood`'s `main` branch. A manual Check updates button is also available. It downloads that exact commit, verifies every game file against `game/manifest.json`, then promotes the complete bundle atomically. Tap Play update or reopen to use it. Interrupted downloads leave the previous version intact. Saves use the same local origin for every version.

Only the `game/` bundle changes automatically. Native Android shell changes, permissions and dependencies require a new APK. The app never embeds GitHub credentials. GitHub outages, rate limits and offline conditions keep the saved game playable. This is a sideloaded app; no Play Store publishing is configured.

Before pushing game changes, run `node tools/bundle.cjs` to regenerate hashes. Commit the resulting manifest along with changed assets. All runtime files must be flat in `game/`, match the allowed extensions, and fit the updater's 8 MB per file / 32 MB bundle limits.

## Build Android

Java 17+ and Android SDK 36 are required. Run `node tools/bundle.cjs`, then `gradle -p android assembleDebug` using Gradle 8.13. Output: `android/app/build/outputs/apk/debug/app-debug.apk`. This sideload build is debug-signed, not a production store release. Keep the signing key private and consistent when rebuilding if you want Android to install over the prior app without losing saves.

Desktop game saves remain separate from Android saves. Import/export in the creator handles appearance designs, not complete world saves.
