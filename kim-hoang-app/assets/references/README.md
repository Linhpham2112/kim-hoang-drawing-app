# Reference traces

Stakeholder scans and working traces for the motif components. The app loads baked files under `assets/motifs/`, not this folder.

## Pig

- `IMG_2442.JPG` is the source print. Runtime black ink (`pigBlack.ts`) and carve grooves (`pigLineArt.ts`) are retraced from it. Reserved white the child rubs on Color comes from `pig.svg` (`pig-ink-white.png` via `pigAssets.ts`). `pigOrnaments.ts` is still baked by `build.py` and is not the colour plate.
- Rebuild traces: `python3 scripts/build.py` (needs `potrace`, `numpy`, `pillow`, `scipy`). Writes the motif TS files plus `trace/blk.min.svg`, `trace/pig_ornaments.min.svg`, `trace/lines.min.svg`, `trace/pig_preview.png`.
- Rebuild the white plate: `python3 scripts/build_pig_plates.py` from `pig.svg`.
- Stamp / carve viewBox: `0 0 1472 2016`. Faces left. Only black + white; red is the paper. Outer scan halo and edge specks stripped.

## Rooster

Working in-app set is v9 (736×1008, half of the 1472×2016 plate):

| File | Used for |
|------|----------|
| `assets/motifs/rooster-relief-v9.png` | Motif picker + carve guide |
| `assets/motifs/rooster-print-bw-v9.png` | B&W stamp |
| `assets/motifs/rooster-color-v9.png` | Ghost + finished overlay |
| `assets/motifs/rooster-ink-*-v9.png` | Seven rub plates (see `src/data/roosterInk.ts`) |

Wired through `src/assets/motifs/roosterAssets.ts`. Carve grid: `roosterCarveGrid.ts` (16×22).
Source SVGs: `rooster_bw.svg` (leave as-is; the plate is clean), `rooster_colored.svg` (red chips to black, pink chips dropped: `python3 scripts/recolor_rooster.py`).
Poem calligraphy: `rooster_poem.svg` is a VTracer plate. The poem is on top, and a leftover black rectangle fills the rest of the 1280×2784 canvas. Rebuild the in-app stamp with `python3 scripts/build_poem.py` (drops that plate, tight-crops, svgo). Output: `src/assets/motifs/roosterPoem.ts`. Black ink only; never colourised.

## Format

- Prefer `viewBox="0 0 1472 2016"` (or a half-res PNG with the same aspect).
- Strip poem calligraphy and seals when possible. Keep the animal.
- Keep relief, B&W, colour, and ink plates pixel-aligned.
