# Process

How pictures became files the app can load. Motif scans became something a child can carve and stamp. Gallery JPEGs stayed finished prints. Cultural background is in `RESEARCH.md`. File names and scripts are in `SYSTEM.md`. How to drop in another showcase file is `kim-hoang-app/assets/gallery/README.md`.

## Starting pictures

The motifs come from stakeholder scans of existing prints, not from drawings made for the app. The pig scan is `kim-hoang-app/assets/references/IMG_2442.JPG`. The rooster working set was aligned to the same portrait plate, 1472×2016, later halved to 736×1008 PNGs (v9) so decode stays cheap on a phone.

The first job was to decide what each pixel *is*. A Kim Hoàng sheet is already red. Black is the woodblock. White gypsum sits on top of that red. Anything that is only paper should never become a “paint” the child applies.

That split sounds obvious and failed several times in practice. JPEG halo around the pig read as extra ink. Scanner pink on the red field looked like a third colour. A vector trace of the poem left a black rectangle the size of the canvas under the characters. If those stay in, the stamp looks dirty and the colour step paints the background.

## Pig: ink, white, paper

`scripts/build.py` traces `IMG_2442.JPG` with potrace after a numpy mask. Low red is treated as black ink. High green and blue together are reserved white. Saturated red is paper and is dropped. Small holes in the ink (under 90 px) are filled as dust. A 6 px rim around the silhouette is stripped so the JPEG halo never becomes ornament. Loose marks outside the body are thrown away.

An early carve/stamp from a cropped “pig_bw” plate lost the round ears and looked chipped. The live pig went back to the full round animal. The white the child rubs now comes from `pig.svg` through `scripts/build_pig_plates.py`: same pixel grid as the raster, a 2% inset so corner drips never count as paint, black and paper red omitted. The file is `assets/motifs/pig-ink-white.png`.

Colour on the pig was tried as a full `pig.svg` overlay and as a multi-colour fade, the way the rooster reveals plates. Both skipped the real sequence (black stamp first, then white only). The reds in the SVG are the sheet. The colour step for the pig is one plate: trắng / white.

## Rooster: plates that sit on each other

The rooster is an outline print. The carve guide is a relief PNG. The stamp is a B&W PNG. Colour is seven PNGs in light-to-dark order (yellow, vermilion, crimson, maroon, rose, white, black). They have to share one crop. If a plate shifts a pixel, the rub looks like a second rooster.

`rooster_bw.svg` was clean enough to leave alone. `rooster_colored.svg` still had red chips that belonged in the line and pink chips that belonged to the paper. `scripts/recolor_rooster.py` turns those reds to black and drops the pinks.

The poem started as `rooster_poem.svg`, a VTracer plate: calligraphy on top, leftover black field under it. `scripts/build_poem.py` drops any subpath that covers most of the canvas, tight-crops the ink, runs svgo, and writes `roosterPoem.ts`. The poem stays black. It is never a colour plate.

## Gallery prints: show the sheet, do not trace it

The artist gallery is a different job from pig and rooster. Those two had to become a woodblock: ink vs white vs paper, aligned plates, a carve grid. Gallery pictures are already finished village prints. The child looks at them; they never go on the bench.

So they were not run through `build.py` / potrace / ink-plate scripts. Unicode names and CamScanner titles were renamed to ASCII (`lon-doc.jpg`, `bo-kieu/01-tuong-ngo.jpg`). Long edge was capped around 1600px because two Mã đáo scans were 4000–5700px and 5–7 MB — that size is fine in Photos, not in a `FlatList`. Bộ Kiều stayed one album folder, not eight motif plates.

Catalog rows and titles live in `src/data/gallery.ts`. Correct a Kiều plate name there if the chữ Hán was misread.

## What the child does (and what we stopped doing)

Carve is coverage, not a drawing test. The block is a 16×22 grid. Raised cells are the design and cannot be cut. The child clears about 92% of the rest with Fine, Medium, or Wide gouges. A tap is one bite along the grain. That matches “each tap is a chisel cut” better than a flood fill.

Ink on the wood was skipped for a while so colour would only happen on paper. The village sequence still has a brayer. The `roller_and_brush` work put the roll back: one black dish, drag until the bar fills, then stamp. Wrong colours are not on that bench.

Colour on paper is effort, not region snap. An earlier rooster path used a colour map and flood fill. It looked smart and fought messy fingers. Sequential plates mean: tap the next dish, rub until the layer appears, undo if needed. A bút lông cursor (wood, ferrule, plate-coloured hair) follows the finger so the tool is visible above a right hand.

Stamp placement was tightened and then loosened. After the rooster print grew about 20%, clamp math had to allow more travel left and down or the block could not sit where a print would. The poem clamp was opened on both axes so the verse could sit higher and further right without becoming a black slab.

## Interaction rules that stayed

Tap targets stay large. There is no clock. Vietnamese is the first language on every label. Haptics fire on carve, dip, stamp, and a wrong swatch. How-to cards are Vietnamese and open every time a stage is entered, including after the child backs out and picks the pig again.

## What is still out

Custom / blank woodblock is a “coming soon” card. There is no voice guide, no live model, no extra motifs. Zone-snap colouring stays retired. Android is not the demo target.

The asset scripts are local and boring on purpose: classify pixels, drop trash, write the files the app already imports. The judgment is in what counts as ink, white, or paper.
