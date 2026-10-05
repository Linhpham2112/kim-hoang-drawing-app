import { PALETTE } from './palette';

/**
 * Reference palette maps for future motifs (buffalo, fish). Pig and rooster use
 * traced SVG artwork directly — not zone fills.
 */
export const PIG_COLOR_MAP: Record<string, string> = {
  body: PALETTE.white,
  'ear-left': PALETTE.red,
  'ear-right': PALETTE.red,
  'eye-left': PALETTE.black,
  'eye-right': PALETTE.black,
  snout: PALETTE.red,
  tail: PALETTE.red,
  'leg-1': PALETTE.indigo,
  'leg-2': PALETTE.indigo,
  'leg-3': PALETTE.indigo,
  'leg-4': PALETTE.indigo,
  'belly-spot': PALETTE.yellow,
};

export const BUFFALO_COLOR_MAP: Record<string, string> = {
  body: PALETTE.indigo,
  'horn-left': PALETTE.white,
  'horn-right': PALETTE.white,
  eye: PALETTE.black,
  nose: PALETTE.red,
  'hoof-1': PALETTE.black,
  'hoof-2': PALETTE.black,
  'hoof-3': PALETTE.black,
  'hoof-4': PALETTE.black,
};

export const FISH_COLOR_MAP: Record<string, string> = {
  body: PALETTE.red,
  'scale-top': PALETTE.yellow,
  'scale-mid': PALETTE.white,
  tail: PALETTE.indigo,
  'fin-top': PALETTE.yellow,
  'fin-bottom': PALETTE.yellow,
  eye: PALETTE.black,
};

export type ColorableMotif = 'buffalo' | 'fish';

export const COLOR_MAPS = {
  pig: PIG_COLOR_MAP,
  buffalo: BUFFALO_COLOR_MAP,
  fish: FISH_COLOR_MAP,
} as const;
