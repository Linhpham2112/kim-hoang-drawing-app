# System

How the running app is arranged. Paths are from the repo root unless noted. Product rules live in `SPEC.md`. Taps and store fields live in `USERFLOW.md`. Why a gesture exists lives in `PROCESS.md`. Agent rules live in `CLAUDE.md`. New showcase JPEGs are described in `kim-hoang-app/assets/gallery/README.md`.

## Layout

| Path | Role |
|------|------|
| `kim-hoang-app/` | Expo app |
| `kim-hoang-app/src/screens/` | One file per navigator route |
| `kim-hoang-app/src/components/` | Block, stamp, roller, brush cursor, shell |
| `kim-hoang-app/src/store/useAppStore.ts` | Session state |
| `kim-hoang-app/src/data/` | Plate order, guides, palette, gallery catalog |
| `kim-hoang-app/src/assets/motifs/` | Baked SVG strings and asset maps |
| `kim-hoang-app/assets/motifs/` | Runtime motif PNGs (game plates) |
| `kim-hoang-app/assets/gallery/` | Artist JPEGs for the gallery |
| `kim-hoang-app/assets/references/` | Scans and source SVGs (not loaded at runtime) |
| `kim-hoang-app/scripts/` | Retrace / recolor / poem bake |
| `kim-hoang-context/` | Product writing |

`App.tsx` loads fonts, wraps the tree in gesture-handler and safe area, then mounts `src/navigation/AppNavigator.tsx`.

## Routes

The live stack in `src/navigation/types.ts` is Home, Gallery, GalleryAlbum, GalleryWork, Motif, Carve, Paper, Color, Poem, Done. Preview routes `_Preview` and `_MotifPreview` stay in the navigator for component work. The live start route is Home.

The game header shows `step/9`. Gallery screens skip `ScreenShell` and are outside that count. Carve holds stages 3 and 4 (carve, then roll ink). Paper holds stages 5 and 6 (pick paper, then stamp). `TOTAL_STEPS` lives in `src/data/stepGuides.ts`.

| Stage | Screen | `guideId` |
|-------|--------|-----------|
| 1 Home | `HomeScreen` | `home` |
| 2 Motif | `MotifScreen` | `motif` |
| 3 Carve | `CarveScreen` while `!carved` | `carve` |
| 4 Ink | same screen after carve | `ink` |
| 5 Paper | `PaperScreen` before a sheet is chosen | `paper` |
| 6 Stamp | `PaperScreen` after a sheet is chosen | `print` |
| 7 Color | `ColorScreen` | `color` |
| 8 Poem | `PoemScreen` | `poem` or `poemPig` |
| 9 Done | `DoneScreen` | `done` |

`ScreenShell` opens the matching card whenever the screen is focused or `guideId` changes. The `?` button opens it again. `seenGuides` is still written on dismiss; it does not block the auto-open.

## Artist gallery

Home opens the gallery. The list of works is `src/data/gallery.ts`. Image files sit in `assets/gallery/` (that folder has its own README). Screens are `GalleryScreen` (Bộ Kiều packet plus a grid of singles), `GalleryAlbumScreen`, and `GalleryWorkScreen`. They use `GalleryShell` and `GalleryHeader` on cream paper, with no `step/9` and no how-to card. The session store is unused.

`require()` of a JPEG only registers an asset id. The bitmap decodes when a gallery `<Image>` mounts. Motif still preloads pig and rooster plates only (`preloadPigAssets` / `preloadRoosterAssets`). Do not call `Asset.loadAsync` on gallery files from Home, Motif, or App. The album packet mounts three sheets, not all eight. Singles use `FlatList` windowing. Shipped files have a long edge of about 1600px, so a 4000px scan is not decoded in the grid.

## Store

`useAppStore` (Zustand) holds one session: `motif`, `carved`, `inked`, `paperColor`, `printed`, `printPos`, `printRot`, `pigInkLayers`, `roosterInkLayers`, `handColored`, `poemAdded`, `poemPos`, `currentStep`.

`setMotif` clears carve, ink, paper, print, colour, and poem. `reset` (Done to paint again) returns to the initial object and the navigator resets to Home.

`currentStep` is updated as the child finishes carve, ink, paper pick, stamp, and poem. The visible number in the header comes from each screen's `step` prop, not from a subscriber on `currentStep`.

## Carve and ink

`CarveWorkbench` is pinch-zoom (carve only) plus a one-finger pan. After carve, `rollEnabled` drives the brayer.

`CarveBlock` tracks a 16×22 cell grid. Raised cells are the print (pig body / rooster ribs). About 92% of the carveable cells must clear. Tips are Fine, Medium, Wide. Each hit is one gouge along the grain; chips burst at the point.

Ink is a shared value from 0 to 1. Pig ink preview is `PIG_BLACK`. Rooster ink preview is `ROOSTER_LINE_ART`. The only plate is black (`InkTools.tsx`). Brown and red are not offered. `setInked` runs when roller travel fills the bar; Next then goes to Paper.

## Paper and stamp

`PaperScreen` picks chu sa (`#D30101`) or son (`#A70E18`), then lets the child drag and rotate the block. Stamp writes `printPos` and `printRot`, plays a press/lift, and reveals the black impression (`PrintedMotif` / `uncolored`). Aspect comes from `src/utils/rect.ts` (`MOTIF_ASPECT` is the 1472×2016 scan ratio). Scale and clamp differ for pig and rooster (`printScaleFor`, overflow constants).

## Color

`ColorScreen` is sequential rub-to-reveal for both animals. The child taps the next swatch, then drags on the stamp. Travel is measured in stamp-heights (`RUB_PASSES`). `BrushCursor` follows the finger: wood handle, bone ferrule, bristles in the plate colour, tip down-left.

Pig order is one plate, white (`pigInk.ts`, `pig-ink-white.png`). Red stays the paper. Rooster order is yellow, vermilion, crimson, maroon, rose, white, black (`roosterInk.ts`, `rooster-ink-*-v9.png`). Undo pops the last revealed id.

## Poem and done

Rooster: tap to stamp `roosterPoem.ts`, then drag. Pig: copy only, Next goes to Done. Done snapshots `PaintingView` with `react-native-view-shot` and saves through `expo-media-library` / `expo-sharing`.

## Motif files

Pig runtime:

- Black stamp / raised mask: `src/assets/motifs/pigBlack.ts`
- Carve grooves: `pigLineArt.ts`
- Picker art: `pigArt.ts`
- White rub plate: `assets/motifs/pig-ink-white.png` via `pigAssets.ts`
- Carve occupancy: `pigCarveGrid.ts`

Rooster runtime (v9, 736×1008):

- Relief, B&W print, colour ghost, seven ink PNGs: `roosterAssets.ts`
- Carve occupancy: `roosterCarveGrid.ts`
- Poem SVG string: `roosterPoem.ts`

Source scans and SVGs stay under `assets/references/`. Scripts:

| Script | Input | Output |
|--------|--------|--------|
| `scripts/build.py` | `IMG_2442.JPG` | pig black / lines / ornament traces (bake; not the Color plate) |
| `scripts/build_pig_plates.py` | `pig.svg` | white PNG + picker art |
| `scripts/recolor_rooster.py` | `rooster_colored.svg` | same file, red chips to black, pink dropped |
| `scripts/build_poem.py` | `rooster_poem.svg` | `roosterPoem.ts` |

`rooster_bw.svg` is left as the clean line plate.

## Look

Tokens are `src/theme/tokens.ts`. Surfaces are scarlet or cream paper; wood is for the bench. Ink outlines are warm black `#1A1008`. Type: Playfair Display on titles, Be Vietnam Pro on UI. Visual rules including the brayer and `BrushCursor` are in `DESIGN.md`.
