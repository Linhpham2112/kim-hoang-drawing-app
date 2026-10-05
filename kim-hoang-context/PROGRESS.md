# PROGRESS.md — What's Done vs. What's Next

*Living status tracker for the Kim Hoàng Drawing App. Update this whenever work is completed or
new work is planned. Last updated: 2026-09-29.*

## Legend
- ✅ Done
- 🚧 In progress / partial
- ⬜ Not started
- 🔮 Deferred / future work (intentionally out of MVP scope)
- ❓ Blocked / needs a decision or external input

---

## Current State (one-line summary)

**Full flow ships on Expo SDK 57.** Nine header stages on seven play routes: Home → Motif → Carve → Roll black ink → Pick paper → Stamp → Color → Poem → Done. Home also opens a local artist gallery (Bộ Kiều mini album + singles) that is not a header stage. Carve and ink share `CarveScreen`. Paper pick and stamp share `PaperScreen`. The brayer is black only (Đen). Pig colour is one reserved-white plate; rooster colour is seven sequential plates. `BrushCursor` (bút lông, right-hand) follows the finger on Color. How-to cards reopen on every focus. Poem: rooster stamps scanned calligraphy; pig copy says the pig is already big enough. Next: Phase 9 polish (sounds, reduce-motion, VoiceOver).

---

## App Code (`kim-hoang-app/`)

| Item | Status | Notes |
|------|--------|-------|
| Expo scaffold | ✅ | SDK **57** |
| Navigation | ✅ | Seven play routes + gallery (`Gallery` / `GalleryAlbum` / `GalleryWork`); header `step/9` on the game only |
| Zustand store | ✅ | `carved`, `inked`, `pigInkLayers` (`white` only), `roosterInkLayers`, `poemAdded`. No letter picker, no `needsColoring()` |
| `ScreenShell` + `useLayout()` | ✅ | Landscape + iPad. Guides open on every `useFocusEffect` |
| Carve | ✅ | Coverage relief, tips, chips. Rooster relief fades in |
| Black ink roll | ✅ | `InkTools` Đen only; `InkRoller` until coverage; `setInked()` then Paper |
| Paper | ✅ | Chu sa / son; place + rotate; B&W `PrintedMotif uncolored` |
| Pig color | ✅ | One reserved-white plate (`pigInk.ts` / `pig-ink-white.png` / `PigStamp`) |
| Rooster color | ✅ | 7 plates, arm swatch then rub; ghost + always-mounted `Image`s |
| Colour cursor | ✅ | `BrushCursor` bút lông, right-hand, plate-coloured tuft |
| Rooster load UX | ✅ | `preloadRoosterAssets()` on Motif; `FadeInImage` on wood/paper |
| Poem + Done + save | ✅ | Rooster stamps `roosterPoem.ts`; pig poem stage says the pig is big enough; confetti; Camera Roll / share |
| Haptics | ✅ | Wired; **sounds** still ⬜ |
| Motif art | ✅ | Pig SVG traces + white PNG; rooster **v9 PNGs** via `roosterAssets.ts` |
| Artist gallery | ✅ | Bundled JPEGs in `assets/gallery/`; catalog `src/data/gallery.ts`; Bộ Kiều is a mini album packet |

---

## Documentation

| Item | Status | Notes |
|------|--------|-------|
| `CONTEXT.md` | ✅ | Overview + nine-stage stack |
| `SPEC.md` | ✅ | Constraints include black brayer; pig white plate |
| `USERFLOW.md` | ✅ | Screens, guides-on-focus, store |
| `DESIGN.md` | ✅ | Tokens in `tokens.ts`; brayer + `BrushCursor` |
| `CLAUDE.md` | ✅ | Agent rules (keep black roller; do not resurrect zone fill) |
| `SYSTEM.md` | ✅ | Screens, store, assets |
| `PROCESS.md` | ✅ | Scan → plates; why roller and sequential rub |
| `STORY.md` | ✅ | One-page project brief |
| `RESEARCH.md` | ✅ | Cultural + accessibility brief |
| `PROGRESS.md` | ✅ | This file |
| `README.md` / `kim-hoang-app/README.md` | ✅ | How to run |
| `kim-hoang-app/assets/gallery/README.md` | ✅ | How to add showcase prints |
| `AI.md` / `TASKS.md` | 🗑️ | Removed 2026-09-08 — described retired zone-fill plans |

---

## Build Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1–8 | Foundation through Poem/Done/save | ✅ |
| 9 | Polish — sounds, reduce-motion, VoiceOver/Switch Control | ⬜ |
| 10 | Portfolio write-up polish | 🚧 docs include gallery 2026-09-29 |

---

## Assets To Produce (built by agents in code)

| Asset | Status | Notes |
|-------|--------|-------|
| Pig traces (`pigArt` / `pigLineArt` / `pigBlack` / carve grid) | ✅ | Scan-aligned SVG |
| Pig white plate (`pig-ink-white.png` / `pigAssets.ts` / `pigInk.ts`) | ✅ | From `pig.svg`; red is paper |
| Rooster v9 PNGs + `roosterCarveGrid.ts` + `roosterInk.ts` | ✅ | Relief / B&W / colour / 7 plates |
| `WoodChips` / `CarveBlock` / `InkRoller` / `BrushCursor` / `PaintingView` / `RoosterStamp` / `saveImage.ts` | ✅ | Current flow plumbing |
| Artist showcase JPEGs + `gallery.ts` | ✅ | Singles + `bo-kieu/` album; ~1600px long edge |

---

## Placeholders Currently In The App (to be replaced)

| Placeholder | File | Resolved by |
|-------------|------|-------------|
| ~~Emoji instead of art~~ | Home/Motif/Carve/Poem/Done | ✅ Real motifs wired in (Agent 4). Home = 🐷→animated PigMotif, etc. |
| ~~Carve screen = text only~~ | `CarveScreen.tsx` | ✅ Coverage carve + black brayer |
| ~~Paper cards flat, no print reveal~~ | `PaperScreen.tsx` | ✅ B&W stamp → Color |
| ~~Color screen = placeholder text~~ | `ColorScreen.tsx` | ✅ Pig white plate / rooster 7 plates / `BrushCursor` |
| ~~Poem = no painting~~ | `PoemScreen.tsx` | ✅ Rooster stamps `roosterPoem.ts`; pig copy only |
| ~~Save button is a no-op~~ | `DoneScreen.tsx` | ✅ Phase 8 — captureRef → Camera Roll / share |
| Sounds not wired | flow screens | Phase 9 — needs stakeholder audio |
| Preview harness still registered | `_ComponentPreview` / `_MotifPreview` | Not the initial route (`Home` is); delete before shipping |
| Leftover rooster v5–v8 / `trace-rooster/` dumps | `assets/` | ✅ Removed 2026-09-08 |
| Default Expo icon + splash | `assets/` | Needs stakeholder art (below) |
| Paper reds `#D30101` / `#A70E18` | `theme/tokens.ts` | Confirm son đỏ off a physical print |

---

## Artifacts Needed From Stakeholder (human-provided)

*AI can't authoritatively source these — guesses would be wrong or legally risky.*

| # | Artifact | Priority | Why | Status |
|---|----------|----------|-----|--------|
| 1 | Reference photos of real Kim Hoàng **pig & rooster** paintings | 🔴 High | So motifs are traced faithful, not generic cartoons | ✅ Both traced; rooster ships as v9 PNGs |
| 2 | Exact **hex** for the two reds (chu sa + son đỏ) | 🔴 High | Placeholders in use now | 🟡 chu sa = `#D30101` (from pig.svg bg); son đỏ = `#A70E18` in `tokens.ts` — confirm off physical print |
| 3 | **Copyright clearance** on reference images | 🔴 High | Flagged in stakeholder notes | ✅ Original painter is Linh Pham |
| 4 | Confirm **rooster's traditional colors** | 🟡 Med | Historical accuracy | ✅ Seven plates from the colour scan (see `roosterInk.ts`) |
| 5 | **Sound effects** — carve (xoẹt), roll, stamp, fill, celebrate | 🟡 Med | Phase 9 polish | ❓ Needed (royalty-free or recorded) |
| 6 | **App icon + splash** art (Kim Hoàng style) | 🟢 Low | Branding | ❓ Needed |
| 7 | Optional **Vietnamese voice clips** (poem meanings, narration) | 🟢 Low | Accessibility polish | 🔮 Optional |
| 8 | **Paper grain texture** scan (or AI-generated) | 🟢 Low | Can generate a stand-in | 🔮 Optional |

**Not needed from you:** fonts (Google Fonts, wired), the SVGs themselves (Agent 2 draws from #1), code, backend.

---

## Deferred / Future Work (🔮)

- 🔮 Custom / blank woodblock (placeholder in app now)
- 🔮 AI voice draw-guide + stroke completion (Layer 3)
- 🔮 Buffalo, fish motifs
- 🔮 App Store / TestFlight standalone build
- 🔮 Android

---

## Open Questions / Blocked (❓)

Son-đỏ hex confirmation, sounds, and icon/splash still open. They do not block the demo flow.

---

## Resolved

| Item | Resolution |
|------|------------|
| Expo Go SDK mismatch | Project is on **SDK 57** (use a matching Expo Go or a dev build) |
| Audio package | Install in Phase 9 (`expo-audio`) |
| Orientation | **`default`** — portrait + landscape; landscape preferred for canvas |
| VPN blocking dev server | Use tunnel mode (`npx expo start --tunnel`) or disable VPN |
| Copyright on the paintings | Original painter is Linh Pham |

---

## Key Deadline

- **End of August 2026** — demoable build for September ngoại khoá with disabled children.

---

## Recent Changelog

- **2026-09-29** — **Artist gallery (sibling of the game).** Home opens **Xem tranh nghệ nhân**: bundled JPEGs in `assets/gallery/`, catalog `src/data/gallery.ts`. Paintings by Linh Pham. Bộ Kiều is a mini album (`GalleryAlbumPacket` + eight plates), not eight loose tiles. Gallery screens use `GalleryShell`, not `ScreenShell` / `step/9` / Zustand. Prints are local (no backend). Decode stays off the carve/paint path (`require()` is an id; Motif still only preloads pig/rooster). Docs updated across `kim-hoang-context/` (including `PROCESS.md`: gallery JPEGs are resized, not potrace’d) plus `assets/gallery/README.md`.
- **2026-09-27** — **Black brayer + hovering brush + unique stages.** Restored the skipped ink-roll on Carve: one Đen plate, `InkRoller` until coverage, then Paper (`setInked()`). Colour stays on the sheet. Pig colour is reserved white only (`pig-ink-white.png`); reds in `pig.svg` are paper. Color follows a right-hand bút lông (`BrushCursor`). Header is nine unique stages (carve 3, ink 4; paper 5, stamp 6). How-to cards reopen on every screen focus. Docs across `kim-hoang-context/` and both READMEs match this flow.
- **2026-09-08** — **Rooster load UX (A+B) + docs catch-up.** Preload all v9 rooster plates on Motif
  (`preloadRoosterAssets` / `expo-asset`); wood and paper show immediately and line art fades in
  (`FadeInImage`). Docs rewritten to the current flow (carve → B&W stamp → colour on paper; pig
  brush / rooster sequential rub). Deleted obsolete `AI.md` and `TASKS.md` (zone-fill + ink-roller
  plans). `npx tsc --noEmit` clean.
- **2026-08-09** — **Relief carving fix: raise only the black ink** (stakeholder feedback — carving must
  also clear the *interior* reserves, e.g. inside the pig's ear). Traced a new **black-ink region** mask
  from the scan by RED channel (`magick -channel R -separate -threshold 35%` → `potrace` → `svgo` →
  `src/assets/motifs/pigBlack.ts`, `PIG_BLACK`, ~32 KB, viewBox 0 0 1472 2016). `CarveBlock` now
  protects/raises only `PIG_BLACK` instead of the full silhouette, so the ear interior, eye, spiral
  centre and flow-line reserves are **holes → carveable**, not raised: because they're not in the raised
  mask, the child clears them (incl. the ear interior) exactly like the background, while the black body
  can't be carved away. The `PIG_LINES` groove overlay shows where to carve. (An earlier pre-carved
  ellipse was removed — stakeholder wants the ear carvable, and it drew a visible oval.) Grayscale
  threshold was abandoned (dark-red paper read as ink). **Pixel-accurate completion (Option B):** baked a
  coarse **16×22 relief grid** from the same black-ink pass (`src/assets/motifs/pigCarveGrid.ts`,
  `PIG_RAISED` 92 raised / 260 carveable). `CarveBlock` now protects only raised cells and requires
  clearing *every* negative cell (~90%) — background **and** interior reserves incl. the ear — instead of
  the old outside-ellipse count. The ellipse is now the rooster-only fallback.
  Trace source kept at `assets/references/trace/blk.svg` + `blk.min.svg`. `npx tsc --noEmit` clean.
- **2026-08-09** — **Aspect ratio + print mechanic rework** (stakeholder). (1) Everything is now a
  **portrait rectangle** matching the scan (`1472×2016`) — new `src/utils/rect.ts` (`MOTIF_ASPECT`,
  `fitRect`); `CarveBlock` takes `width/height` (square cells, motif fills the block), `PaintingView`
  takes `width` (height derived), and Carve/Paper/Poem/Done/Motif/Home all use the rectangle. No more
  squares. (2) **Print = paper onto block**: `PaperScreen` reworked — after picking paper, the inked
  woodblock is shown (dark carved wood + inked design) and the child taps to **lay the paper sheet onto
  the block**; it presses (Heavy haptic), the print transfers onto the paper, then the paper lifts away
  carrying it → branch to Color/Poem. (3) **Chisel tips** retuned to Fine/Medium/Wide (radius 0/1/2).
  Docs updated (USERFLOW, SPEC, DESIGN, CLAUDE). `npx tsc --noEmit` clean.
- **2026-08-09** — Extracted real **pig line-art** from the original scan (`IMG_2442.JPG`) to serve as the
  carve guide (the "drawing on the woodblock"). Pipeline (all local, no design tooling): ImageMagick
  grayscale + median denoise + threshold @62% to isolate the WHITE linework → whiten scan-edge specks →
  `potrace` fill trace → `svgo`. Result: `src/assets/motifs/pigLineArt.ts` (`PIG_LINES`, ~37 KB single
  path, viewBox 0 0 1472 2016, aligns with `pigArt.ts`). Wired into `CarveBlock`: the pig line drawing
  now shows on the block from the start (contour, curl, lashed eye, haunch spiral, belly lashes, body
  lines) and fades out as ink rolls on — replaced the flat silhouette guide-tint. Trace source kept in
  `assets/references/trace/lines.svg` + `lines.min.svg`. `npx tsc --noEmit` clean. Installed brew
  `potrace` + `imagemagick`. TODO(perf): could reuse a light silhouette from this pass to replace the
  heavy `pigArt` mask on the carve screen. TODO: rooster still needs the same treatment from its scan.
- **2026-08-09** — Reworked carving into a **coverage-based** mechanic (stakeholder: not "3 taps and
  done"). New `CarveBlock`: an N×N cell grid you clear by **tapping (chisel+hammer) OR dragging (gouge)**.
  Carved cells become rough recessed "chips" (dark, bevelled = deeper); the motif stays raised in lit
  wood on top (can't be carved off); chips burst + haptics at the touch point. Completes at ~90% of the
  background (counted outside an approx motif ellipse so clearing the *visible* background is enough),
  then auto-fills the rest. Added **tip sizes** (small/med/large carve radius) + a **progress bar**.
  Block is **zoomed in** (bigger) with **no box/frame**. Then tap to ink → press → Paper. Removed the old
  tap-count `WoodBlock`. `useLayout` now exposes `longEdge`. `npx tsc --noEmit` clean. NOTE: relaxed the
  strict "tap-only" pillar on this screen (drag now allowed) per stakeholder. WATCH: device perf of the
  grid on drag; tune GRID/throttle if it stutters.
- **2026-08-09** — Rebuilt the Carve screen as a real **relief woodblock** (stakeholder feedback: it
  was just the print with a brown overlay). New `WoodBlock` component models relief printing correctly:
  everything except the motif is carved AWAY so the motif stands up in relief, then it inks, then the
  block presses onto paper. New `WoodSurface` draws procedural wood grain + chisel gouges (hybrid look,
  no design tooling). Uses `@react-native-masked-view/masked-view` to shape the raised area from the pig
  trace without recoloring the blob (motif rendered only twice for perf). Tap = chisel background away
  (`carve` 0→1, chips + haptics), then tap = roll ink (`ink` 0→1), then press → Paper. Also retired the
  hand-drawn pig entirely: `PigMotif` renders the real trace everywhere; Motif card got a red "mini-print"
  backing for contrast. `npx tsc --noEmit` clean. OPEN: a clean line-art pig outline would let the carve
  reveal lines individually (current trace is one solid blob).
- **2026-08-09** — Stakeholder provided a real pig trace (`assets/references/pig.svg`, VTracer, 1.3 MB).
  Optimized with svgo (→ 249 KB), stripped the red background, embedded as `src/assets/motifs/pigArt.ts`.
  `PigMotif` `mode="solid"` now renders this faithful trace via `SvgXml`; `mode="outline"` keeps the
  hand-drawn sketch (so carve→ink reveals sketch → real print). Home hero now shows the real pig.
  Paper red updated to the scan's `#D30101` (chu sa). `npx tsc --noEmit` clean. Rooster still stylized,
  awaiting its trace (will need segmenting into the 8 named zones).
- **2026-08-08** — Phase 3/5/6/7/8 (Agent 4): built the full interaction flow. Home (bobbing pig +
  `Button`), Motif (real `Card`s w/ motif art), Carve (tap-to-carve `WoodChips` burst + haptics →
  tap-to-ink roller sweep → auto-advance), Paper (stamp-press print reveal + pig→Poem / rooster→Color
  branch), Color (`MotifLayer` tap-to-fill via zoneSnap + guided/free + undo + completion → Next),
  Poem (`PaintingView` + 福/祿/壽 character stamp), Done (framed painting + `Confetti` + save to
  Camera Roll via `react-native-view-shot`/`expo-media-library`, share fallback). New: `WoodChips`,
  `Confetti`, `MotifLayer`, `PaintingView`, `saveImage.ts`. Haptics throughout. `npx tsc --noEmit`
  clean. NOTE: nav initial route still `_MotifPreview` (trace harness) — flip to `Home` to test the flow.
- **2026-08-08** — Reference scans received (real pig + rooster prints). Retraced both motifs to match:
  `PigMotif` now has the round body, âm-dương belly swirl (red core + light reserved spiral & ticks),
  forehead curl, lashed eye, and light reserved detail lines (solid mode) vs. ink linework (outline
  mode). `RoosterMotif` refaced RIGHT with a sweeping sickle tail; `ROOSTER_PATHS` + `ROOSTER_ZONES`
  centers re-measured. `ROOSTER_COLOR_MAP` (colorMaps.ts + AI.md) updated to the scan palette
  (comb=red, body=yellow, wing=white/cream, tail=red, beak/eye=black, legs=yellow; dropped indigo).
  Placeholder red nudged to `#C8241A` (provisional). Zone id contract unchanged; `npx tsc --noEmit` clean.
- **2026-08-08** — Phase 4 (Agent 2): built the two MVP motif SVGs — `PigMotif` (solid-print pig
  with `mode="outline" | "solid"`, no color zones) and `RoosterMotif` (outline-print rooster, 8
  fill-able zones via `AnimatedPath`, keys matching `ROOSTER_COLOR_MAP`: body, wing, comb, eye, beak,
  tail-feather, leg-1, leg-2). Replaced the empty `ROOSTER_ZONES` stub with 8 zones measured in
  viewBox (0–300) units (paths sourced from `RoosterMotif` so they can't drift); `zoneSnap.ts`
  already matched AI.md. All import tokens, no hardcoded hex, TS strict, no `any`; `npx tsc --noEmit`
  clean. Added TEMP `screens/_MotifPreview.tsx` routed as the initial route in `AppNavigator.tsx` (3
  lines marked `TEMP PREVIEW (Agent 2 — Motifs)`) for on-device verification — revert before shipping.
- **2026-08-08** — Phase 2 (Agent 3): built reusable UI components — `Button` (primary/secondary,
  reanimated press scale, wood + hard shadow), `Card` (spring bounce, selected ring, disabled
  overlay), `ColorSwatch` (80pt tap area, animated yellow ring), `ProgressDots` (non-interactive,
  1–7). All import tokens, no hardcoded hex, tap-only, reanimated-only; `npx tsc --noEmit` clean.
  Added TEMP `screens/_ComponentPreview.tsx` routed as the first screen in `AppNavigator.tsx` (3
  lines marked `TEMP PREVIEW`) for on-device verification — revert before shipping.
- **2026-08-08** — Added Placeholders + Artifacts-Needed tracking tables (what's stubbed in the app
  and what the stakeholder must provide: reference paintings, red hex, sounds, icon, copyright).
- **2026-08-08** — Landscape + iPad layouts (`useLayout`, `orientation: default`). SDK 54
  downgrade + `babel-preset-expo` fix for Expo Go. Added `kim-hoang-app/README.md`.
- **2026-08-07** — Phase 1 complete: `kim-hoang-app/` scaffolded, 7 routes, store, stub screens.
- **2026-08-07** — Docs reconciled to stakeholder spec (carve screen, two reds, pig/rooster).
- **2026-08-07** — Migrated docs to React Native + Expo.
