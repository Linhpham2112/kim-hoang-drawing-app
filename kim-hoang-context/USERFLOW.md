# USERFLOW.md — Screen-by-screen user flow

## Flow overview

```
[Home] → [Motif] → [Carve] → [Ink roll] → [Paper] → [Stamp] → [Color] → [Poem] → [Done]
  1         2         3           4           5         6         7        8        9
```

Routes: `Home`, `Motif`, `Carve`, `Paper`, `Color`, `Poem`, `Done` for the game. Gallery is `Gallery`, `GalleryAlbum`, `GalleryWork` — opened from Home, not numbered in `step/9`. Stages 3–4 are both `Carve`. Stages 5–6 are both `Paper`. Game header shows `step/9`.

The woodblock carves, then takes **black ink** from a brayer, then stamps that black onto red paper. Colour (and the rooster poem) happens on the sheet afterwards.

**Navigation:** `@react-navigation/native-stack`, `headerShown: false`. Game chrome is `ScreenShell`. Gallery chrome is `GalleryShell`. Back is `navigation.goBack()` except Home and Done. Initial route: `Home`.

**Gestures:** drag on carve, ink roll, paper placement, colour rub, and moving the poem. Navigation and swatches stay tap.

**Guides:** `ScreenShell` opens the stage card whenever the screen is focused or `guideId` changes (including after backing out and picking a motif again). `?` reopens it.

---

## Screen 1: Home

**Route:** `Home` · **step 1** · `guideId="home"`

Full-bleed red paper, bobbing `PigMotif`. Two taps:

1. "Bắt đầu vẽ!" → `Motif` (the nine-stage game)
2. "Xem tranh nghệ nhân" → `Gallery` (not a game stage; no store change)

---

## Beside the game: Artist gallery

**Routes:** `Gallery` · `GalleryAlbum` `{ albumId }` · `GalleryWork` `{ workId }`

Tap only. No `ScreenShell`, no `guideId`, no Zustand. Cream paper.

1. `Gallery` — Bộ Kiều as a fanned packet (`GalleryAlbumPacket`) above a **Tranh lẻ / Single prints** grid. Packet → `GalleryAlbum`. A single tile → `GalleryWork`.
2. `GalleryAlbum` — eight Kiều plates, numbered `1 / 8`. Tap a plate → `GalleryWork`.
3. `GalleryWork` — one print, `resizeMode="contain"`. Back pops to the album or the gallery.

Catalog: `src/data/gallery.ts`. Adding files: `kim-hoang-app/assets/gallery/README.md`.

---

## Screen 2: Pick woodblock

**Route:** `Motif` · **step 2** · `guideId="motif"`

1. Lợn / Pig → `setMotif('pig')` → Carve
2. Gà / Rooster → `preloadRoosterAssets()` (also starts on Motif mount) → Carve. Tile pulses while waiting
3. Tự vẽ / Custom → "Sắp ra mắt / Coming soon", not tappable

`setMotif` clears carve, ink, paper, print, colour, and poem.

Cards show outline art on chu-sa paper. Rooster outline is `rooster-relief-v9.png`.

---

## Screen 3–4: Carve then roll black ink

**Route:** `Carve`

Aspect: portrait rectangle from the scan (`MOTIF_ASPECT` / `fitRect()` in `src/utils/rect.ts`). Never square.

### Stage 3: Carve (`guideId="carve"`)

- Grain (`WoodSurface`) is visible immediately
- Pig: `PIG_LINES` guide; raised mask `PIG_BLACK` / `PIG_RAISED` (16×22). Ear, eye, spiral interiors are carveable holes
- Rooster: `rooster-relief-v9.png` fades in (`FadeInImage`). Raised cells from `roosterCarveGrid.ts`
- Tap (chisel) or drag (gouge). Fine / Medium / Wide. Chips + haptics
- Completes at ~92% of carveable cells; remainder fills. `setCarved()` (store `currentStep` 4)

### Stage 4: Ink (`guideId="ink"`)

- One plate: Đen / Black. Tap it to load the brayer (`InkRoller`)
- Drag across the relief until the ink bar fills (~3.2 block-heights of travel)
- Ink preview: pig `PIG_BLACK`; rooster `ROOSTER_LINE_ART`
- `setInked()` when full (`currentStep` 5). Next → Paper
- Next is hidden until inked

**State:** `carved`, `inked`

---

## Screen 5–6: Paper then stamp

**Route:** `Paper`

### Stage 5: Choose paper (`guideId="paper"`)

Tap Chu Sa or Son Đỏ → `setPaperColor` (`currentStep` 6).

### Stage 6: Stamp (`guideId="print"`)

Drag the block; rotate with two fingers or ↺ ↻. Stamp writes `printPos` / `printRot`, plays press/lift, reveals `PrintedMotif` uncolored (pig `PIG_BLACK`, rooster `rooster-print-bw-v9.png`). `setPrinted()` (`currentStep` 7) → Color.

**State:** `paperColor`, `printed`, `printPos`, `printRot`

---

## Screen 7: Color on the paper

**Route:** `Color` · **step 7** · `guideId="color"`

Hand-color the printed sheet. Tap the next swatch, then rub (~1.8 stamp-heights). Wrong swatch: error haptic. Undo pops the last plate. `BrushCursor` (bút lông, right-hand hold) follows the finger; bristles use the plate colour.

### Pig

Order: white only (`src/data/pigInk.ts`). Plate: `pig-ink-white.png`. Red is paper, not a swatch.

### Rooster

Order: yellow → vermilion → crimson → maroon → rose → white → black (`src/data/roosterInk.ts`). Ghost `rooster-color-v9.png`. Keep ink `Image`s mounted (`RoosterStamp`) so plates do not flash on remount.

**State:** `pigInkLayers` / `roosterInkLayers`, `handColored`

Next → Poem when complete.

---

## Screen 8: Poem

**Route:** `Poem` · **step 8**

### Rooster (`guideId="poem"`)

Stamp `roosterPoem.ts` (from `rooster_poem.svg` via `scripts/build_poem.py`). Tap the sheet to place; drag after it is on. Next → Done. `addPoem()` sets `currentStep` 9.

**State:** `poemAdded`, `poemPos`

### Pig (`guideId="poemPig"`)

No letter. Copy: "Con lợn đã to đủ rồi — không cần thêm thơ." Next → Done (`setCurrentStep(9)`).

---

## Screen 9: Done

**Route:** `Done` · **step 9** · `guideId="done"`

"Vẽ lại / Paint again" → `reset()` → stack reset to Home. "Lưu / Save" → `utils/saveImage.ts`.

---

## State shape (Zustand)

Canonical file: `src/store/useAppStore.ts`

```typescript
type Motif = 'pig' | 'rooster' | 'custom';
type PaperColor = 'chuSa' | 'son';
type AppStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface AppState {
  motif: Motif | null;
  carved: boolean;
  inked: boolean; // brayer finished
  paperColor: PaperColor | null;
  printed: boolean;
  printPos: { nx: number; ny: number };
  printRot: number;
  handColored: boolean;
  pigInkLayers: PigInkId[];
  roosterInkLayers: RoosterInkId[];
  poemAdded: boolean;
  poemPos: { nx: number; ny: number };
  currentStep: AppStep;
  selectedColor: string | null;
  soundEnabled: boolean;
  seenGuides: Partial<Record<GuideId, boolean>>;
}
```

There is no `needsColoring()`, `paintStrokes` session list, or `colorMap` / guided-free toggle. Both animals color on paper after the black stamp.
