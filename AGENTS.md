# Wildwood project instructions

The user requests that every completed task be committed and pushed to the GitHub repository `failimus48-max/wildwood`, with default branch `main`. Publishing completed changes is authorized; do not ask for permission again for routine game updates. Do not commit credentials, signing keys, original proprietary game assets, emulator profiles, or build caches.

Before publishing game changes, run `node tools/bundle.cjs` and `node tools/verify-bundle.cjs`. Commit the generated `game/manifest.json` alongside the changed assets. The Android updater reads this file. Preserve exact game bytes using `.gitattributes`.

Keep Android build caches and large test files on D: because C: has limited free space. The app targets Google Pixel 8a and other Android 8+ devices. Test touch controls, landscape layout, save persistence and affected gameplay; report any device testing limitation accurately.

The APK downloads game assets automatically. Native Java, Android manifest, permissions and Android build changes require rebuilding the APK. Keep signing keys private and consistent, update the native version code for such changes, and verify the APK signature before publishing `downloads/Wildwood.apk` with a matching `downloads/SHA256SUMS`.
