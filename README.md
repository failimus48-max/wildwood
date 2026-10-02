# Wildwood

An offline 3D mythical animal sandbox inspired by Animal Jam and the woodland atmosphere of William and Sly. All game logic, meshes, music and poetry are original. This repository does not include the Animal Jam launcher, proprietary models or extracted font.

The dialog panels have textured stonework and gently swaying moss borders with original curling botanical ornament inspired by William Morris. The theme is generated as local inline SVG in CSS, works offline, and respects reduced-motion preferences.

Bobo is a bespoke plush axolotl NPC by the grassy pond, with a pale pink round face, darker feathery gills, glossy black eyes, embroidered smile, blue patterned body and soft feet, based on the user's reference plush. Talk to Bobo using E or Talk / read. The pond sits entirely off the main path, at (21,12); Bobo waits at (26,14).

## Pixel 8a performance

Touch devices use a 30 FPS target, a 1.25 render pixel-ratio cap (adaptively reduced to 0.85 when measured CPU drawing cost is high), cached NPC meshes refreshed at 12 Hz, cached skies, reduced weather particles and 30 FPS creator previews. World rendering drops to 12 FPS behind menus. The Android header uses density-aware sizing and respects camera cutout/system insets. These settings are tested with a landscape 873 × 393 CSS viewport at 2.75 device scale, approximating a Pixel 8a display. Actual device FPS and thermal behavior have not been measured on a physical Pixel 8a.

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

The fairytale interface uses locally bundled Berkshire Swash by Astigmatic (SIL Open Font License), with readable book serif dialogue. The font and license travel with offline game updates.
