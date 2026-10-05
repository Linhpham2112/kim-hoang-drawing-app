# SPEC.md — Product Specification

## Problem Statement

Children aged 5–8 with motor disabilities are excluded from creative art experiences because traditional tools assume:
- Fine motor precision (holding a brush, staying in lines)
- Sustained hand-eye coordination
- Ability to apply controlled pressure

Real-world visits to Vietnamese artisan villages (Kim Hoàng, Đông Hồ) let children carve molds, roll ink, stamp, and hand-color folk paintings — but this requires motor control that disabled children don't have. The app keeps that artisan sequence and relaxes precision: coverage-based carving, a black-ink brayer on the block, a B&W stamp, then colour on the paper (reserved white for the pig, sequential rub-to-reveal plates for the rooster).

## Cultural Grounding: Kim Hoàng Painting

Kim Hoàng painting (tranh Kim Hoàng) is a Vietnamese woodcut folk art from Kim Hoàng village, Hoài Đức, Hanoi. Key facts relevant to the app:

- **Origin:** 18th century, Lê dynasty era
- **Nearly extinct:** A 1915 flood destroyed most original woodblocks. By 1945 no one in the village made them. Restoration efforts began in 2015.
- **Signature technique:**
  1. Paper is pre-dyed with a mineral **red** — bột chu sa (cinnabar) or son đỏ (vermilion). Both are reds; there is **no yellow** paper in this app.
  2. A woodblock (jackfruit or canary wood) is **carved** in relief, then inked and **pressed** onto the paper.
  3. Depending on how the block is carved, the print is either a **solid block** or an **outline**:
     - **Solid print (e.g. Lợn / pig):** only the wood *outside* the drawn outline is carved away, so the whole shape stands in relief and prints as a filled black silhouette. In the village this often *is* the finished image; **in the app the child still rubs reserved white onto the paper** after the stamp. Red in the source art is the sheet, not a paint.
     - **Outline print (e.g. Gà / rooster):** the inside is also carved away, so only the lines stand in relief and print as a black outline. This is then **hand-colored** with mineral pigments.
  4. A poem or Chinese character (Phúc 福, Lộc 祿, Thọ 壽) is handwritten in the top-left corner. **In the app** the rooster stamps the scanned verse (`roosterPoem.ts`); there is no three-character picker. The pig visits the same stage and is told it does not need a poem.
- **Common motifs:** Lợn (pig), Gà (rooster), Trâu (buffalo), Cá (fish), wrestling figures, fairies
- **Color palette:** Black ink + white gypsum, red ochre/vermilion, yellow gardenia, indigo, on **red** paper
- **Each piece is unique** — same woodblock, different hand-coloring = slightly different outcome every time

This uniqueness principle is key to the app: the child's colouring (pig white plate, rooster rub order/timing) makes each print different, even using the same block.

## Target User

**Primary:** Children aged 5–8 with motor disabilities (limited fine motor control, may use single-finger tap, may have tremors or imprecision)

**Secondary (facilitators):** Parents, teachers, therapists who set up the app and may sit alongside

**Not the user:** Developers, administrators — they configure nothing in-session

## Core Design Constraints

1. **Tap-first navigation** — menus, swatches, Next/Back, and poem stamps are tap-driven. **Drag is allowed** on Carve (gouge), Carve ink-roll (brayer), Paper (place the block), Color (rub + hovering brush), and Poem (move the verse). Carving a whole area or rubbing in a plate by tapping alone is tedious.
2. **Tap targets minimum 80×80pt** — generous hit areas (pt = points, not px, on iOS)
3. **Maximum 4 choices on any screen** — cognitive load limit
4. **No time pressure** — no countdowns, no timeouts
5. **Every tap produces a visible result** — nothing silently fails
6. **Undo always accessible** — one large undo button, always visible during coloring
7. **Text is supplemental, not required** — every action is icon/image-first
8. **Vietnamese + English** — bilingual labels (Vietnamese primary, English secondary)
9. **Safe area insets respected** — no interactive elements behind notch or home indicator
10. **Haptic feedback on every meaningful action** — `expo-haptics` ImpactFeedback for stamps, ink dip, fills, selections, and a wrong swatch
11. **Landscape + iPad supported** — `orientation: default`; use `useLayout()` for responsive canvas width; safe area on all edges in landscape
12. **Artwork aspect ratio = the scan** — the woodblock, paper, and finished painting are a **portrait rectangle** matching the source scan (`1472 × 2016`, ≈ `0.73 : 1`). Never square. Central via `MOTIF_ASPECT` / `fitRect()` in `src/utils/rect.ts`.
13. **Print = B&W block onto paper** — place and press the carved, inked block onto the chosen red sheet. The impression is black only. Colour happens on Color, on that sheet.
14. **Black ink on the wood before stamp** — after carve, the child dips the brayer in Đen and rolls until the relief is covered. `setInked()` means the roller finished. Colour pigments are never rolled onto the block.

## Success Criteria for Portfolio

1. A working iPhone app (React Native + Expo) demonstrating the full flow end-to-end
2. Both MVP motifs functional through the full flow (block → carve → black ink roll → paper → B&W stamp → color on paper → poem → save):
   - **Pig** demonstrates the **solid-print** path, then reserved-white rub on the sheet
   - **Rooster** demonstrates the **outline-print + sequential hand-color** path (the coloring showcase)
3. Visually distinctive — looks like Kim Hoàng art direction, not a generic coloring app
4. Runs on a physical iPhone or iPad via Expo Go (SDK 57) or a dev / TestFlight build
5. Documented codebase with comments explaining design decisions
6. A separate `RESEARCH.md` explaining the cultural and accessibility research behind decisions
7. A local artist gallery, opened from Home and **not** counted as a game stage, showing village prints (singles + Bộ Kiều as a mini album)

## Out of Scope

- Voice control (including the AI voice draw-guide for the custom block)
- The **custom / blank woodblock** free-draw feature — shown as a "Coming soon" placeholder in MVP
- Backend / user accounts / a CMS for the gallery (prints are bundled; swap them by shipping a new build)
- Live AI model calls / zone-snap flood-fill (retired; rooster uses sequential plates)
- More than 2 motifs in MVP (pig + rooster; buffalo/fish/custom are future work)
- Multiplayer / sharing to social media
- App Store submission (TestFlight is sufficient for portfolio demo)
- Android support (iPhone only)
