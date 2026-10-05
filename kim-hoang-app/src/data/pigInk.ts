import { Colors } from '../theme/tokens';

export type PigInkId = 'white';

/** Black is the stamp. The kid only rubs reserved white; red is the paper. */
export const PIG_INK_ORDER: PigInkId[] = ['white'];

export const PIG_BRUSH_SWATCHES: Array<{
  id: PigInkId;
  color: string;
  labelVi: string;
  labelEn: string;
}> = [{ id: 'white', color: Colors.pigmentWhite, labelVi: 'Trắng', labelEn: 'White' }];

export function nextPigInk(revealed: PigInkId[]): PigInkId | null {
  for (const id of PIG_INK_ORDER) {
    if (!revealed.includes(id)) return id;
  }
  return null;
}

export function pigInkPlate(id: PigInkId) {
  return PIG_BRUSH_SWATCHES.find((p) => p.id === id);
}

export function pigInkComplete(revealed: PigInkId[]): boolean {
  return PIG_INK_ORDER.every((id) => revealed.includes(id));
}
