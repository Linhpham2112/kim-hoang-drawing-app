# CLAUDE.md — Instructions for agents

How to work on this project.

## What you're building

A React Native + Expo iPhone/iPad app: a game-based drawing app for children aged 5–8 with motor disabilities, teaching Kim Hoàng Vietnamese folk painting.

App code: `kim-hoang-app/` (Expo SDK 57).

The flow (nine header stages): Home → Motif → Carve → Roll black ink → Paper → Stamp → Color → Poem → Done.

Home also opens an artist gallery (`Gallery` / `GalleryAlbum` / `GalleryWork`). That is not a header stage. Colour after the stamp is on the red paper. Black ink *is* rolled onto the wood (one plate: Đen) before Paper. No Phúc/Lộc/Thọ picker. No `needsColoring()` branch.

- Pig: solid relief → black brayer → black stamp → one white rub plate → poem stage explains no poem (pig is already big enough)
- Rooster: outline relief → black brayer → B&W stamp → seven rub plates (`roosterInk.ts`) → poem stamps `roosterPoem.ts`

Two MVP motifs. Custom/blank woodblock is "Coming soon". Paper is two reds (chu sa + son đỏ). Gallery prints are bundled JPEGs in `assets/gallery/`; catalog is `src/data/gallery.ts`.

## Read before you write any code

1. `SPEC.md` — product constraints
2. `USERFLOW.md` — screens, gestures, Zustand shape
3. `SYSTEM.md` — architecture
4. `DESIGN.md` + `kim-hoang-app/src/theme/tokens.ts` — tokens (never invent hex in UI)
5. `PROGRESS.md` — what is already true
6. Expo SDK 57 docs: https://docs.expo.dev/versions/v57.0.0/

Do not rebuild zone snap, `ROOSTER_COLOR_MAP` flood-fill, or guided/free colour mode. The ink roller on Carve is current product, not a leftover.

## Non-negotiable rules

1. TypeScript only — no `.js` files, no `any` types
2. Follow `theme/tokens.ts` — import tokens, don't hardcode hex in chrome
3. Tap targets ≥ 80pt where the child is choosing (cards, swatches, Next)
4. Drag is allowed on Carve, ink roll, Paper placement, colour rub, and moving the poem. Everything else stays tap
5. Aspect ratio = the scan. `MOTIF_ASPECT` / `fitRect()` in `src/utils/rect.ts`. Never square art
6. Print = B&W block onto paper. `PrintedMotif uncolored` on Paper; colour persists via `pigInkLayers` / `roosterInkLayers`
7. `react-native-reanimated` for motion (v4 + worklets). No `Animated` from React Native core
8. Zustand for app-level state
9. Bilingual labels — Vietnamese primary, English smaller below
10. Safe area + `useLayout()` on every screen
11. Haptics on meaningful taps (and wrong-swatch / wrong-ink error)
12. Rooster PNGs stay mounted. Never remount ink `Image`s per plate. Preload via `preloadRoosterAssets()`; fade lines in with `FadeInImage`
13. How-to cards open on every visit to a stage (`useFocusEffect` in `ScreenShell`)
14. Artist gallery stays off the game path. Do not import `src/data/gallery.ts` from Home, Motif, Carve, Paper, Color, Poem, or Done. Do not `Asset.loadAsync` gallery JPEGs on launch or Motif. Do not add Gallery to `stepGuides` / `AppStep` / `ScreenShell`. Decode happens only while gallery screens are mounted. Adding files: `kim-hoang-app/assets/gallery/README.md`.

## Motif art

Pig: `pigArt.ts` (picker), `pigLineArt.ts` (carve guide), `pigBlack.ts` (stamp + raised mask), `pigCarveGrid.ts`, white plate `assets/motifs/pig-ink-white.png` (`pigAssets.ts`). Red in `pig.svg` is paper.

Rooster: v9 at 736×1008 (`assets/motifs/rooster-*-v9.png`) via `roosterAssets.ts`. Outline picker / carve relief: `rooster-relief-v9.png`. Do not point runtime code at leftover v5–v8 dumps.

If you generate new bird art, keep stamp / relief / ink plates pixel-aligned and update `roosterCarveGrid.ts` if the silhouette changes.

Generic cartoon animals are wrong. Reference `RESEARCH.md` and the scans under `kim-hoang-app/assets/references/`.

## Keep PROGRESS.md updated

When you finish a slice, update the status tables and add a dated changelog line.

## What not to build

- No voice control
- No custom/blank woodblock free-draw
- No yellow paper
- No backend, login, or Firebase
- No social sharing beyond `expo-sharing`
- Do not implement AI stroke-completion Layer 3
- Do not resurrect zone-fill coloring
- Do not skip the black-ink roll or skip pig colouring (white plate after the stamp)
- Do not turn the gallery into a networked CMS; keep prints local
