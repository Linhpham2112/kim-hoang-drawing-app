/**
 * Kim Hoàng design tokens — sampled from print scans (pig IMG_2442 / pig.svg,
 * rooster IMG_2444) and semantic UI roles. Prefer these over raw hex in UI.
 *
 * Sample notes (flat regions, avoid texture/shadow):
 * - Pig paper (SVG + scan): #D30101
 * - Rooster paper mean: ~#E8040A
 * - Rooster darker / son-ish: ~#A70E18
 * - Warm linework black (pig): #1A1008
 * - Rooster gold feathers: ~#C79256
 * - Rooster tail madder: ~#A62C41
 * - Cream fleck / reserved white: ~#EDE8D8 / #E2D8CA
 */

export const Colors = {
  // —— Semantic surfaces ——
  /** Primary art surface — saturated điệp red from the prints. */
  surfaceRed: '#D30101',
  /** Framed print-card red (same plate as pig paper; keep distinct for future). */
  surfaceCardRed: '#D30101',
  /** Cream / điệp working surface for text, tutorial, and tool screens. */
  surfacePaper: '#F5EDD8',
  /** Maple wood for carve/ink workbench only (not UI chrome). */
  surfaceWood: '#D2B896',
  surfaceWoodLight: '#E8D4B8',
  surfaceWoodMid: '#C4A882',
  surfaceWoodEdge: '#8B6B45',
  surfaceWoodDrum: '#6B5344',
  surfaceWoodDrumDark: '#4A382C',
  surfaceWoodStreak: '#D4BC98',
  surfaceWoodStreakDark: '#C0A47E',
  surfaceWoodKnot: '#A88C68',
  surfaceWoodGouge: '#9A7E5C',
  surfaceWoodShade: '#B8956E',

  // —— Ink & accents ——
  /** Warm brown-black from linework — not pure #000 (vibrates on red). */
  inkBlack: '#1A1008',
  inkBrown: '#3D2B1F',
  /** Gold from rooster feathers / active UI accent. */
  accentGold: '#C79256',
  /** Deep red-pink from rooster tail / pig spiral — headings & seals. */
  accentMadder: '#A62C41',
  /** Reserved white — slightly creamy, not #FFF. */
  pigmentWhite: '#EDE8D8',

  // —— Paper colour keys (stamp paper) — aliases kept for motifs / store ——
  paperRed: '#D30101',
  paperChuSa: '#D30101',
  paperSon: '#A70E18',
  paperRedLight: '#E8040A',
  paperRedDark: '#9E1B12',

  // —— Motif pigments (aliases; color maps / palette) ——
  pigmentRed: '#B5300A',
  pigmentYellow: '#D4A017',
  pigmentIndigo: '#2C3E6E',

  colorSuccess: '#4A7C59',
  /** Near-cream UI fill / label on dark fills. */
  colorWhite: '#FDFAF5',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 999,
} as const;

export const FontSize = {
  display: 36,
  heading: 24,
  body: 16,
  small: 12,
} as const;

export const LineHeight = {
  viet: 1.6,
} as const;

/** Layout breakpoints (pt) — landscape + iPad friendly */
export const Layout = {
  tabletMinShortEdge: 600,
  contentMaxWidthPhone: 480,
  contentMaxWidthTablet: 900,
  contentMaxWidthLandscape: 1024,
};

/**
 * Two UI faces.
 * display → large Vietnamese titles / brand headers
 * body → all kid-facing UI, instructions, buttons
 */
export const Fonts = {
  display: 'PlayfairDisplay_700Bold',
  body: 'BeVietnamPro_400Regular',
  bodySemiBold: 'BeVietnamPro_600SemiBold',
} as const;
