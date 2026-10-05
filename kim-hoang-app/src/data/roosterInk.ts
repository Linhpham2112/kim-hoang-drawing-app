import { Colors } from '../theme/tokens';

export type RoosterInkId =
  | 'yellow'
  | 'vermilion'
  | 'crimson'
  | 'maroon'
  | 'rose'
  | 'white'
  | 'black';

/** Light-to-dark plates — kid rubs one pass per ink, in this order. */
export const ROOSTER_INK_ORDER: RoosterInkId[] = [
  'yellow',
  'vermilion',
  'crimson',
  'maroon',
  'rose',
  'white',
  'black',
];

export const ROOSTER_BRUSH_SWATCHES: Array<{
  id: RoosterInkId;
  color: string;
  labelVi: string;
  labelEn: string;
}> = [
  { id: 'yellow', color: '#F6E56B', labelVi: 'Vàng', labelEn: 'Yellow' },
  { id: 'vermilion', color: '#E31B23', labelVi: 'Đỏ', labelEn: 'Vermilion' },
  { id: 'crimson', color: Colors.accentMadder, labelVi: 'Đỏ thắm', labelEn: 'Crimson' },
  { id: 'maroon', color: '#6B1420', labelVi: 'Đỏ sẫm', labelEn: 'Maroon' },
  { id: 'rose', color: '#ED2258', labelVi: 'Hồng', labelEn: 'Rose' },
  { id: 'white', color: '#F7F5FA', labelVi: 'Trắng', labelEn: 'White' },
  { id: 'black', color: Colors.inkBlack, labelVi: 'Đen', labelEn: 'Black' },
];

export function nextRoosterInk(revealed: RoosterInkId[]): RoosterInkId | null {
  for (const id of ROOSTER_INK_ORDER) {
    if (!revealed.includes(id)) return id;
  }
  return null;
}

export function roosterInkPlate(id: RoosterInkId) {
  return ROOSTER_BRUSH_SWATCHES.find((p) => p.id === id);
}

export function roosterInkComplete(revealed: RoosterInkId[]): boolean {
  return ROOSTER_INK_ORDER.every((id) => revealed.includes(id));
}
