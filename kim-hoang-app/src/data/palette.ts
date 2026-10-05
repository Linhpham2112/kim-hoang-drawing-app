import { Colors } from '../theme/tokens';

/** Kid paint palette — values must stay aligned with Colors tokens. */
export const PALETTE = {
  black: Colors.inkBlack,
  red: Colors.pigmentRed,
  yellow: Colors.pigmentYellow,
  white: Colors.pigmentWhite,
  indigo: Colors.pigmentIndigo,
} as const;

export type PaletteColor = (typeof PALETTE)[keyof typeof PALETTE];
