# DESIGN.md — Visual Design System

## Design Philosophy

The app's visual identity is derived directly from Kim Hoàng painting materials:
- **Scarlet paper** as the ambient background temperature
- **Woodblock ink** (near-black, warm, not digital-cold) for outlines and text
- **Mineral pigments** (vermilion, gardenia yellow, gypsum white, indigo) as accent colors
- **Paper texture** throughout — nothing feels like a screen, everything feels like a surface

The UI chrome (buttons, navigation) should feel like wooden frames around paper — utilitarian, warm, tactile. Not "cute app" design. Not generic Material/Flat UI.

The game screens sit on **scarlet paper** (welcome, finished print) or **cream paper** (tools). The artist gallery is cream only — it is a looking-room, not the print the child is making. Do not put `step/9` or how-to cards there.

The single visual risk on the **game**: **the app's UI itself is printed on the same red paper as the paintings**. There is no neutral background. Everything exists on the material world of Kim Hoàng.

---

## Color Tokens

Canonical file: `kim-hoang-app/src/theme/tokens.ts` (sampled from the pig/rooster scans). Import from there — do not copy hex into components.

Current paper / ink keys:

```typescript
// excerpt — see tokens.ts for the full set
paperChuSa: '#D30101',  // bột chu sa
paperSon:   '#A70E18',  // son đỏ
inkBlack:   '#1A1008',
accentGold: '#C79256',
accentMadder: '#A62C41',
pigmentWhite: '#EDE8D8',
surfacePaper: '#F5EDD8',
surfaceWood: '#D2B896',  // carve bench only
```

Spacing / radius / type scale stay in the same `tokens.ts` file (`Spacing`, `Radius`, `FontSize`).

---

## Typography

**Display face:** `Playfair_Display_700` — load via `expo-font`
- Used for: Screen titles, motif labels
- Reason: Elegant serif with calligraphic roots — echoes the brushwork character of chữ thảo

**Body / UI face:** `BeVietnamPro_400`, `BeVietnamPro_600` — load via `expo-font`
- Used for: Buttons, labels, instructions
- Reason: Vietnamese-optimized sans-serif with proper diacritical support (ắ, ộ, ư, etc.). Critical on iOS.

**Calligraphy:** the rooster poem is the scanned stamp (`roosterPoem.ts`), not live Ma Shan Zheng text. `App.tsx` loads Playfair Display and Be Vietnam Pro only.

```typescript
// Type scale (in pts, not px)
export const FontSize = {
  display: 36,   // Screen titles
  heading: 24,   // Card labels
  body:    16,   // Instructions
  small:   12,   // Secondary labels, English subtitles
} as const;

export const LineHeight = {
  viet: 1.6,     // Vietnamese text needs extra room for diacritics
} as const;
```

Load fonts in `App.tsx` using `useFonts` from `expo-font`. Show the splash screen until fonts are ready via `expo-splash-screen`.

---

## Component System

All styles use React Native `StyleSheet.create()`. No CSS.

### Primary Button (Tap to Action)
```typescript
// components/Button.tsx — use Pressable + Animated.View (reanimated)
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.surfaceWood,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.md,
    paddingVertical: 20,
    paddingHorizontal: 32,
    minHeight: 80,              // iOS accessibility minimum
    alignItems: 'center',
    justifyContent: 'center',
    // Block shadow — woodblock aesthetic
    shadowColor: Colors.inkBlack,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,               // Android fallback
  },
  label: {
    fontFamily: 'BeVietnamPro_600',
    fontSize: FontSize.body,
    color: Colors.colorWhite,
  },
});
// On press: animate shadowOffset to {1,1} and translate by (3,3) via reanimated
```

### Motif / Paper Cards
```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceWood,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.lg,
    minWidth: 140,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: Colors.inkBlack,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});
// On press: spring animate scale to 0.97 + translate (4,4), revert on release
```

### Color Palette Swatch
```typescript
// NOTE: React Native StyleSheet has no `outline`. The selected ring is a wrapper
// View with its own border + padding; the swatch itself is the inner circle.
const styles = StyleSheet.create({
  ring: {                        // wrapper — the "selected" ring
    padding: 3,
    borderRadius: 34,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  ringSelected: {
    borderWidth: 3,
    borderColor: Colors.pigmentYellow,  // yellow ring on selection
    // scale 1.2 applied to the wrapper via reanimated
  },
  swatch: {
    width: 56,
    height: 56,
    borderRadius: 28,           // 50% — full circle
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    shadowColor: Colors.inkBlack,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});
```

### Canvas / Painting Area
```typescript
const styles = StyleSheet.create({
  canvasArea: {
    backgroundColor: Colors.surfacePaper,
    borderWidth: 4,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    shadowColor: Colors.inkBlack,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
});
// Paper texture: wrap in ImageBackground with paper-grain.png at opacity 0.15
```

### Woodblock & Carving (Carve & Ink screen)
```typescript
const styles = StyleSheet.create({
  woodBlock: {
    backgroundColor: Colors.surfaceWood,   // jackfruit wood
    borderWidth: 4,
    borderColor: Colors.inkBrown,
    borderRadius: Radius.sm,
    // Wood-grain texture: ImageBackground or subtle striped overlay
    shadowColor: Colors.inkBlack,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  woodChip: {                 // one falling chip (see components/WoodChips.tsx)
    position: 'absolute',
    width: 10,
    height: 6,
    backgroundColor: Colors.surfaceWoodLight,
    borderRadius: 2,
    // animate translateY (gravity), translateX (scatter), rotate, opacity via reanimated
  },
  // black-ink brayer after carve; colour pigments stay on the paper screen
});
```

- **Block shape:** a **portrait rectangle** matching the scan (`MOTIF_ASPECT`, ≈ `0.73:1`), **no frame/box**
  around it — the child is zoomed into the wood surface. Procedural grain via `WoodSurface`.
- **Carving visual (coverage-based relief):** the pig **line-art** (`pigLineArt.ts`) is drawn on the wood
  as a guide. The child clears the *background* by tapping/dragging; cleared wood becomes rough recessed
  **gouge blobs** (round, jittered, overlapping — never a grid of squares), leaving the motif standing in
  relief. Implemented in `CarveBlock`.
- **Chisel tips:** Fine / Medium / Wide selector changes the carve radius.
- **Black ink on the wood.** After carve, tap Đen, roll `InkRoller` until coverage is full, then Next to Paper. Pig preview is `PIG_BLACK`; rooster preview is `ROOSTER_LINE_ART`.
- **Rooster lines fade in** (`FadeInImage`, ~260ms) over grain that is already visible — never a blank hole.
- **Print = B&W block onto paper:** place/rotate the inked block, press, lift. Colour is a later screen.
- **Colour cursor:** `BrushCursor` is a bút lông (wood, bone ferrule, plate-coloured hair), right-hand hold.
- **Chips:** `WoodChips` burst at the touch point, falling with gravity easing.

---

## Layout

**Target devices:** iPhone and iPad, **landscape preferred** (portrait also supported)

- Rotate the device sideways for the main painting/carving canvas — wider layout
- iPad: `supportsTablet: true` in `app.json`; content scales up to ~900pt wide
- iPhone landscape: content up to ~1024pt wide; carving/paper blocks expand horizontally
- Use `useLayout()` hook for `isLandscape`, `isTablet`, and `contentMaxWidth`
- Safe area insets on all edges (not just top/bottom) for landscape notch/home indicator

```typescript
// app.json
"orientation": "default"   // allows portrait + landscape rotation
"ios": { "supportsTablet": true }
```

---

## Motion Design

All animations use `react-native-reanimated` (v4 + worklets). Key principles:
- **Spring physics** for card selection (bouncy = satisfying for children)
- **Rooster and pig plates** fade via opacity on always-mounted `Image`s (pending rub + revealed)
- **Designed decode wait:** wood/paper first, line art `withTiming` ~260ms on `onLoad`
- **No looping animations** except Home bob and the Motif preload pulse
- **Respect `AccessibilityInfo.isReduceMotionEnabled()`** when adding new motion — not fully wired yet

```typescript
// src/utils/animations.ts
import { withSpring, withTiming, withSequence, withDelay, Easing } from 'react-native-reanimated';

// Spring config for card selection
export const SPRING_BOUNCY = { damping: 15, stiffness: 400 };

// Stamp press — call on a shared value controlling scale + translateY
export function animateStampPress(scaleValue: SharedValue<number>, yValue: SharedValue<number>) {
  scaleValue.value = withSequence(
    withTiming(0.9, { duration: 120 }),
    withTiming(1.05, { duration: 120 }),
    withSpring(1, SPRING_BOUNCY)
  );
  yValue.value = withSequence(
    withTiming(8, { duration: 120 }),
    withTiming(-4, { duration: 120 }),
    withSpring(0, SPRING_BOUNCY)
  );
}

// Plate reveal — opacity on always-mounted ink Images
export const FILL_SPREAD_TIMING = { duration: 400, easing: Easing.out(Easing.cubic) };

// Canvas shake (wrong swatch)
export function animateShake(xValue: SharedValue<number>) {
  xValue.value = withSequence(
    withTiming(-8, { duration: 60 }),
    withTiming(8, { duration: 60 }),
    withTiming(-8, { duration: 60 }),
    withTiming(0, { duration: 60 })
  );
}
```

---

## Artist gallery

Not a game stage. Chrome is `GalleryShell` on `Colors.surfacePaper`. Tiles are ink-bordered sheets (`GalleryTile`), not `PrintCard` red frames — those frames are for the child's own print.

**Bộ Kiều** is a mini album, not a ninth single. `GalleryAlbumPacket` shows three real plates fanned (cover plus two peeking) on hard ink offsets (`HardStackShadow`), then a title slip (**Mini album · 8 tranh / Bộ Kiều**) and a red woodblock-style seal (**8 tấm**). Singles sit under a **Tranh lẻ / Single prints** heading. Inside the album, plates are numbered `1 / 8`.

Do not illustrate an album as one thumbnail with a "Bộ" badge.

---

## Motif Art

- **Pig** is SVG (`SvgXml`) from the scan traces — `pigArt.ts` / `pigLineArt.ts` / `pigBlack.ts`. White rub plate is `pig-ink-white.png` from `pig.svg`. ViewBox matches the scan (`0 0 1472 2016`), not a 300×300 cartoon.
- **Rooster** on-device art is **aligned v9 PNGs** (736×1008): relief, B&W print, full colour, seven ink plates. `RoosterMotif` outline mode uses the relief PNG. Do not reintroduce zoned SVG fills for the colour step.
- Style: thick woodblock line, flat pigment, frontal, naive-craftsman — not realistic, not generic cartoon.

---

## Accessibility Checklist

- [ ] All tap targets ≥ 80×80pt (use `hitSlop` to expand without changing visuals)
- [ ] Drag only where intended (carve, ink roll, paper place, colour rub, poem drag); elsewhere `Pressable`
- [ ] Color is never the only indicator (always paired with shape/label)
- [ ] Text contrast ≥ 4.5:1 on all backgrounds
- [ ] `accessibilityLabel` on every interactive element
- [ ] `AccessibilityInfo.isReduceMotionEnabled()` respected — animations disabled if true
- [ ] All UI text in both Vietnamese and English
- [ ] No time limits on any interaction
- [ ] Undo accessible on all action screens
- [ ] Safe area insets respected on all screens (`useSafeAreaInsets`)
- [ ] Haptic feedback on stamp, ink dip, fill, and wrong swatch (`expo-haptics`)
