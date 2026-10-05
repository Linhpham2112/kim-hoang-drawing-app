# Kim Hoàng drawing app

A game-based drawing app for children aged 5 to 8 with motor disabilities. It is a high school portfolio project covering product design, UI/UX, and research.

It follows a Kim Hoàng print: pick a woodblock, carve the relief, roll black ink, press a black impression onto pre-dyed red paper, then hand-color the sheet. Precision is relaxed (coverage carve, sequential colour plates). The rooster adds scanned poem calligraphy. The pig still visits the poem stage; no poem is added because the pig is already big enough.

Header stages (some share a screen): Home → Motif → Carve → Roll black ink → Pick paper → Stamp → Color → Poem → Done. Home also opens an artist gallery. That gallery sits outside the numbered stages.

## Read these files in order

1. `STORY.md`: one page on what the project is
2. `../kim-hoang-app/README.md`: how to run the app
3. `SYSTEM.md`: screens, store, assets, scripts
4. `USERFLOW.md`: screen-by-screen interactions and store fields
5. `PROCESS.md`: how scans became plates and how interactions were chosen
6. `RESEARCH.md`: cultural and accessibility brief
7. `SPEC.md`: product constraints
8. `DESIGN.md`: visual system; tokens live in `kim-hoang-app/src/theme/tokens.ts`
9. `PROGRESS.md`: status and changelog
10. `CONTEXT.md`: this overview
11. `CLAUDE.md`: rules for agents working in this repo

## Tech stack

React Native + Expo (iPhone + iPad). App code: `kim-hoang-app/`. Expo SDK 57 (`expo` ^57.0.17, `react-native` 0.86). Demo via Expo Go or a dev build.

- Pig: SVG traces (`pigArt.ts`, `pigLineArt.ts`, `pigBlack.ts`) plus white plate PNG from `pig.svg`
- Rooster: aligned v9 PNGs (736×1008) in `assets/motifs/`
- Libraries: `expo-asset`, `expo-font`, `expo-haptics`, `expo-media-library`, `expo-sharing`, `expo-splash-screen`, `react-native-svg`, `react-native-reanimated` 4, `react-native-gesture-handler`, `react-native-worklets`, React Navigation native stack, Zustand, `react-native-view-shot`
- No backend

## What the MVP does

- Game stack: seven play routes plus three gallery routes (`Gallery`, `GalleryAlbum`, `GalleryWork`); nine numbered stages (carve and ink share Carve; paper pick and stamp share Paper)
- Artist gallery from Home: bundled village prints, Bộ Kiều as one mini album. No backend. Skips `ScreenShell` and the session store
- How-to cards open on every visit to a stage (`useFocusEffect` in `ScreenShell`)
- Coverage relief carve (`CarveBlock`): tap or drag; Fine / Medium / Wide
- Black-ink brayer on the carved block (one plate: Đen). Next to Paper only after the roll completes
- Paper: chu sa or son đỏ; place/rotate; B&W stamp
- Pig color: one sequential rub plate (reserved white). Red is the paper
- Rooster color: seven sequential rub plates; `BrushCursor` follows the finger
- Assets preload on Motif; line art fades in on wood and paper
- Poem: rooster stamps `roosterPoem.ts`; pig copy only
- Save to Camera Roll / iOS share sheet
- Custom/blank woodblock: "Coming soon" only

Zone-snap flood fill is retired. The app assists with preload, fade-in, sequential plates, generous carve coverage, and the ink roll.

## Non-goals

- No user accounts or backend
- No voice control
- No multiplayer
- No App Store submission required for the portfolio demo
- No Android-first support (iOS is the target)
- No live model calls
