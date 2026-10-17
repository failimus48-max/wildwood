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

Woodland foliage: 90 taller rounded trees, 273 fern clumps, folded leaf blades and midribs, shader-driven gentle wind and a bounded pool of fluttering leaves that settle and recycle. Rain and clouds strengthen the breeze slightly. Mobile uses fewer canopy segments and 36 loose leaves (72 on desktop); paused islands freeze the wind and falling leaves.

Lavender flower spikes and creamy white cup-shaped tulips grow in grass patches across the island and beside the commons. They share the gentle foliage wind and use cached geometry for mobile.

Tree varieties now include willow, bare dead trees, deciduous trees, oak, spruce and flowering trees. Canopies use individual folded leaves with seeded variation in outline, width, curl, size, orientation and colour, rather than solid ellipsoid crowns. Willow strands hang down, oaks have lobed blades and broad branches, spruce has tiered needle sprays, and flowering crowns carry pink blossom petals. Dead trees do not shed leaves.

A giant oak in the western grass at (-27, 14) has a thick trunk, spreading roots, and an arched wooden door boarded shut with three nailed planks. It is a scenery landmark.

The ancient oak is now about 26 metres tall with a broad furrowed trunk, raised bark ridges, spreading roots and visible grain in its nailed door boards. At night, amber light peeks through the narrow slat gaps and paints thin strips across the ground; it fades away in daylight.

Terrain has five rolling hills, smooth height-following movement and camera, fine procedural grass grain, and patchy grass/soil colouring. Paths, the pond and important buildings retain level clearings. Ancient oak roots are angular, forked and taper below the surface into raised earth banks.

Woodland trees now stand roughly 11–22 metres tall relative to the plush characters, with much thicker tapered trunks. Raised bark ridges and irregular radial surfaces replace smooth narrow stems. Each ordinary tree has a varied branching root system: flared bases, uneven bends, tapering forks and tips below the ground surface. Trunk collision radii follow the thicker geometry, while existing paths and clearings stay accessible.

Dense groundcover adds tens of thousands of individually folded grass blades and low broadleaf plants, about 18–42 cm tall to partly cover paws. It is generated once, follows terrain heights and sways in the GPU shader. Mobile uses fewer blades; paths, water, buildings and the oak door approach stay clear.

Tree trunks and root bases carry irregular layered moss patches. Pond shading now uses ripple-derived surface normals, Fresnel sky reflection, sun/moon specular highlights and moving dappled shimmer. Reflections are a lightweight environment approximation rather than mirrored scene objects; splash-driven waves preserve their strength and fade naturally.

Each woodland tree has its own stable trunk-thickness factor, independent of its height, ranging from 70% to 160% of its species baseline. Bark, moss, root width and collision bounds follow that thickness; the ancient oak remains the broad landmark.

Meadow coverage now has four times as many broader, overlapping grass blades (about 24–51 cm tall), with broadleaf weeds, speckled mushrooms and hanging bluebell flowers. Grass is divided into cached spatial chunks: nearby blades use full geometry and distant blades use a broader simplified layer. Plants remain in both detail levels; paths and important approaches stay open.

Solid scenery collision now includes rock groups, furniture, shrine, NPCs, cottage walls and exposed roots, with height-aware contacts and small movement substeps to prevent tunnelling. Low steps and flexible grass/flowers remain passable; jumping clears low obstacles. The cottage hill is a height-following surface, with dense grass on its back and top, mottled ground texture and leafy bushes.
Solid object tops support landings; characters step onto low ledges, fall naturally when walking off them, and can jump again after landing. Physics uses bounded substeps so collision and water splashes remain consistent at lower frame rates.

Character anatomy uses smooth continuous torso, skull and muzzle profiles, smaller eyes, articulated legs and hocks, individual toes or hooves, pointed ears, whiskers and curved tails. Owls and phoenixes have two feet and layered folded feathers. The blue spirit bunny and Bobo keep their reference-inspired plush identity; Bobo gains a smoother neck transition and subtle toe seams. All creator options and saved looks remain supported.

The Forest Fox has a dedicated sculpted model inspired by the supplied fox reference: seated idle pose, tall rounded triangular ears with inset panels, almond eyes, pointed cheek fur, overlapping chest fur, tapered forelegs with toe grooves and a curled brush tail. Movement uses a four-legged walking pose. Other species retain their existing models, and fox wings, horns, colours and alternate tails remain customisable.

New explorers spawn at the centre of the den circle (-8, 23), facing the cottage. Existing saves move there once on this update; their appearance, soul, garden and sky settings stay intact, and later sessions resume the saved position. Home uses the same point. The fox blends smoothly between sitting, walking and a light cantering run, with reaching forelegs, hind-leg push-off, body rise and fall and a trailing tail. Hold Shift or the mobile run button to run.

Moon Bunny now uses a dedicated reference-inspired sculpt: a rounder, narrower head, tall inset ears, almond eyes, a small pink nose, subtle cheek tufts, layered chest fur, rounded haunches and grooved paws. It blends from a seated idle into a soft hopping gait. New bunny presets use warm cream; saved custom colours and mythical options remain supported. Pip uses the updated bunny shape.

Dire Wolf now shares the reference sculpture style with a distinct larger build: broader torso and paws, stronger muzzle, shorter pointed ears, a layered neck ruff and pale muzzle/chest markings. Its default fur is neutral gray, and the former default blue-gray wolf coat migrates to gray while custom colours remain intact. The model, creator framing and movement collision radius account for its 18% larger natural scale. It blends between sitting, walking and running.

Celestial Deer has a reference-inspired sculpted model with a slender neck, soft almond eyes, broad inset ears, small cloven hooves, pale chest fur and curved branching antlers. Its default warm brown coat has cream fawn spots that follow the torso surface. It blends from a relaxed standing pose into a graceful four-legged gait. Existing default deer looks gain the brown spotted coat; custom looks and alternate mythical options remain supported.

The deer now stands naturally on four legs, with a horizontal torso, slender forelegs and longer hind limbs articulated through forward stifles and rear hocks. A white ventral coat follows the belly surface, and the tail underside is white while its top stays brown. Antlers, fawn spots, custom looks and the graceful gait remain supported.



Deer anatomy is rebuilt around a level-backed torso, a deeper chest, a tapered croup and a connected neck. Forelegs and hind legs use a two-bone joint solver with fixed upper/lower limb lengths, with the hock above a long near-vertical rear cannon. The raised-rump vertex stretch is removed. Belly markings and fawn spots follow the torso surface, and the white tail underside remains.

The deer rear stance is straighter: reduced upper/lower hind-limb lengths bring the stifle closer to the hip-to-hock line, and the hock sits more directly over the hoof. The torso height and planted hoof positions remain the same.

The deer follows the winged fawn reference proportions with a shorter, rounder torso, shorter neck and softer, shorter muzzle. Its default look has compact upright feathered wings with layered individual feathers. Brown fur, antlers, fawn spots and white belly/tail underside remain. Existing deer without wings gain them once; custom wing types are preserved, and wings can still be changed or removed afterward.

The winged fawn has fuller figurine-inspired legs, with thicker upper limbs, softly curved tapered lower legs and larger rounded cloven hooves. The fixed-length joint rig and straighter rear stance are unchanged.

The deer upper hind legs have a fuller rounded hamstring contour behind the thigh. This volume follows the femur as the leg moves and tapers into the existing slimmer lower leg.

The deer's feathered wings rock from the shoulders in time with walking, with softer delayed feather-tip flex and stronger movement while running. Wing motion eases with the gait blend and follows the body's vertical movement.

The cat follows the rounded standing figurine reference: a stockier oval body, round face and circular inset eyes, short rounded muzzle, thick legs and substantial paws. Its natural tail stands upright with a rounded tip and gentle sway, including while idle. Walking and running keep the rounded proportions. Existing coat colors, patterns, wings, tails and accessories remain customizable.

The surrounding sea has gentle directional swells, fine procedural ripples, daylight-dependent reflections and a soft shoreline wash. A static annular mesh animates on the GPU, with fewer segments on mobile and no per-frame ocean mesh uploads. Sea motion pauses with the island and strengthens slightly in rainy weather. Original synthesized surf loops locally, grows louder near the coast, and follows the Sound toggle and app visibility pause. No network, audio samples or native APK rebuild is required. Run `node tools/verify-ocean.cjs` for the offline mobile check; set `WILDWOOD_MOBILE=0` for the desktop path. Browser checks cover changing wave pixels, shader errors, geometry limits, weather/pause behavior, generated audio, coastal volume and mute.

A weathered wooden dock connects directly to the northern end of the central path at (0, -29), crossing the beach and reaching a wider platform over the sea at z=-53. Individual planks, grain marks, nail heads, timber supports and rope rails use local geometry. The deck supports walking/jumping, rails have collision, and dock positions survive save/reload without expanding the rest of the island boundary. Run `node tools/verify-dock.cjs` for movement/support/save checks across character sizes; set `WILDWOOD_DOCK=1` when running `tools/verify-ocean.cjs` for in-game traversal, reload and jump checks.

The minimap is now an original antique fantasy chart, with aged parchment, engraved coastlines and sea strokes, inked woods and hills, calligraphy place names, a compass rose and small landmark symbols. World coordinates, the northern dock and the red directional player marker remain accurate. Static artwork is cached locally at high resolution; only the marker is redrawn. The compass button opens/closes the map on desktop and mobile, with viewport bounds and dialog isolation checked by `node tools/verify-map.cjs` (`WILDWOOD_MOBILE=0` selects desktop).

The wider interface matches the antique map: original sepia line icons replace colorful emoji in the HUD, player portrait, creature/wing choices and sky controls. Parchment panels, inked borders, toned vine ornament and matching touch buttons share one local SVG icon set and CSS theme. Appearance color swatches and small soul-color samples retain their functional colors, and the 3D world/preview colors are unchanged. `node tools/verify-ink-ui.cjs` checks mobile icon coverage, accessible controls, appearance choices and weather controls offline; use `WILDWOOD_MOBILE=0` for desktop.

Main-screen controls have subtle sepia rococo scroll borders: round engraved curls on the header icons and portrait, with lighter corner flourishes on navigation, weather and touch buttons. The decoration uses small local SVG backgrounds, adds no animation, and ignores pointer input so hit areas and labels remain usable.

The Nightlight Boat is moored beyond the dock tip: a three-dimensional crescent hull, gently billowed star-crested sail and warm masthead lantern. It bobs softly with the sea clock and pauses with the island. At night, pale star-like halos gather around the hull and moon tips while the lantern glows more strongly. Its name appears by the boat. Solid geometry is cached between small pose updates and uses fewer than 12,000 vertices. `node tools/verify-nightlight-boat.cjs` checks geometry, bobbing and day/night glow; the dock mode in `tools/verify-ocean.cjs` also checks the nighttime view in game.

The Nightlight Boat uses an icy-blue palette, with a pale blue crescent hull, frosted sail, silver-blue fittings and cool blue lantern/star halos at night.

The Nightlight Boat now has an upright crescent silhouette inspired by the moon-seat reference, with a tall curved back and a wide cushioned bench in its lower curve. At the dock tip, press E or use Talk / read to rest in the seat, then interact again to return; movement, Jump or Go home also returns you to the dock. The seat and camera follow its gentle bob while the saved location stays safely on the dock. Icy-blue coloring, the sail, top lantern and nighttime glow remain. Dock-mode browser checks cover mobile and keyboard seating/return in addition to the dock tests.

A second icy-blue lantern hangs on a fine chain from the upper tip of the upright crescent. Its silver-blue frame and luminous glass bob with the boat, with a stronger soft halo at night. The masthead lantern remains in place.

The lantern hanging from the crescent tip has warm orange luminous glass and an amber-orange halo, contrasting with the boat’s icy-blue hull.

Cloud Unicorn now has a dedicated reference-inspired cream model with a long curved neck, fine equine legs and hooves, large leaf-shaped ears, a slim muzzle, inset almond eyes, a flowing strand mane and tail, and a tapered spiraled horn. Select Cloud Unicorn in the character creator to use the new default look. Walking/running uses the fixed-length deer limb rig, and custom colors, wings, tails, horns and soul choices remain available. The unicorn uses a stable tube frame for its long neck and hair without changing the other species.

The unicorn has substantially longer legs to match the reference silhouette: its shoulders and hips are raised by 0.58 model units, with longer fixed-length upper/lower limbs and longer cannons. Hoof positions stay grounded, the barrel and long neck move upward together, and the flowing tail reaches down to the lower legs. Preview framing and optional adornments follow the taller proportions. The deer rig remains unchanged.

Cloud Unicorn now defaults to cream feathered wings attached at its raised shoulders. Layered feathers sway with its walking/running rhythm. Existing unwinged unicorn saves gain the wings once; custom wing types are preserved, and choosing no wings afterward remains persistent.

The unicorn feathered wings are about 41% larger, with taller feathers and a broader spread that still pivots from the shoulders.

Snowy Owl replaces the old Moon Owl with a reference-inspired cream figurine: rounded head without ear tufts, pale facial discs, small blue eyes, a horn-coloured beak, sloping pear-shaped breast, scalloped folded feather wings, long layered tail and feathered legs with three forward toes. Its steps alternate with gentle body/wing motion. Custom colours, wing types and saved looks remain supported; the former default purple owl palette upgrades to ivory.

Starlight Ferret now follows the smooth ivory reference figurine: a continuous arched back and raised neck, tiny rounded ears, tapered head, short substantial limbs and an elongated gently curved tail. Walking/running blends into alternating steps with body and tail motion. Custom looks remain available, and the former default tan palette upgrades to ivory.

The reference ferret has a shorter, rounder skull and blunt muzzle, smaller ears moved back above the skull, a fuller neck and rounder mid-body. The face now projects roughly one third less from the neck than the previous version.

The ferret now has a low, nearly level back instead of a hump, a slimmer elongated torso, shorter legs and a lower neck/head carriage. Its compact face and ivory finish are retained.

The ferret has shorter, softer little legs and smaller rounded paws. Its body, head and tail sit 0.20 units lower, with smaller steps and paw lift to suit its compact stance.

The ferret has larger rounded black eyes with warm white catchlights and a tiny secondary glint. The previous default grey eyes upgrade to black; custom eye colours remain available.

Blue Tit is a new small playable songbird, following the round figurine reference with a compact head, tiny pointed beak, plump breast, short legs and toes, layered folded wings and narrow straight feather tail. It has blue crown/wings, white cheeks with a dark eye stripe, a yellow breast and a muted green back. Species scale is 0.62; custom size, colours, wings, tails, adornments and souls remain available. Its steps, body bob and folded wings move together.

Blue Tit proportions now follow the real bird reference: a compact head blending into a longer body, continuous sloping back, shorter visible legs, thin lengthwise folded wings and a longer narrow tail. The blue crown follows the skull surface, with dark eye stripe and collar framing white cheeks. The species stays small.

The Blue Tit face is now a single continuous skull. Removed the raised cheek discs, collar and separate crown geometry; cheek, crown and soft grey-blue facial markings are painted directly onto the skin. Larger dark eyes sit in clear pale areas with small highlights, distinct from the subtle eye stripe.

Blue Tit travels with synchronized two-footed hops instead of alternating steps. Both feet push off, tuck and land together; the entire body, eyes, wings, tail and adornments rise in the same hop. A small crouch softens landing, and running gives taller hops. Movement blends back to a still stance.

Ivory Cat is a separate selectable character alongside Star Cat, following the cream porcelain references. At rest it forms a low loaf with tucked paws and a curved tail beside its body. Moving smoothly raises it into a slender standing cat with long fine legs, almond eyes, large softly pointed ears and an upright tail; walking and running use coordinated steps. Colours, size, soul and optional wings, tails, horns and accessories remain customizable. The original Star Cat model is unchanged.

Ivory Cat anatomy is refined toward the reference photos: a longer slimmer torso with a tucked waist, narrower chest and neck, a smaller tapered skull and integrated short muzzle, slimmer paws and tail, and articulated stifles/hocks on the hind legs. The low tucked resting pose still blends into the standing gait.

Ivory Cat eyes now have curved upper and lower lids with gently tapered corners and a slight outer tilt, matching the soft almond shape in the references. The resting eyes are a little narrower than the alert standing eyes.

Ivory Cat walks with a four-beat feline gait: hind paw then forepaw on each side, a longer planted phase and a smooth lifted recovery. Paws follow narrow tracks, wrists and hocks flex during the swing, the shoulders and hips roll gently, and the head stays steadier. The upright tail counter-sways with a delay. Running blends toward paired bounds with longer reach and higher paw lift.

Porcelain Pony is a new separate playable character based on the cream figurines: long fine legs with pale stockings, compact hooves, a slender barrel, upright curved neck, short equine ears, dark eyes, a downward-tapered muzzle and a flowing side-swept mane, forelock and tail. It walks/runs using the articulated equine limb rig. Its default look has no horn or wings; all creator customization remains available.

Porcelain Pony has fuller hindquarters and thicker thighs, hocks, cannons and back hooves to match the reference. The skull, cheeks and muzzle are broader and softer, with slightly larger dark eyes, tiny highlights and ears/forelock repositioned for the bigger face.
