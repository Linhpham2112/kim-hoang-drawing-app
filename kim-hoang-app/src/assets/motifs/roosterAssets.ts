import { Asset } from 'expo-asset';
import type { ImageSourcePropType } from 'react-native';

import type { RoosterInkId } from '../../data/roosterInk';

export const ROOSTER_RELIEF: ImageSourcePropType = require('../../../assets/motifs/rooster-relief-v9.png');
export const ROOSTER_LINE_ART: ImageSourcePropType = require('../../../assets/motifs/rooster-print-bw-v9.png');
export const ROOSTER_COLOR_ART: ImageSourcePropType = require('../../../assets/motifs/rooster-color-v9.png');

export const ROOSTER_INK_LAYERS: Record<RoosterInkId, ImageSourcePropType> = {
  yellow: require('../../../assets/motifs/rooster-ink-yellow-v9.png'),
  vermilion: require('../../../assets/motifs/rooster-ink-vermilion-v9.png'),
  crimson: require('../../../assets/motifs/rooster-ink-crimson-v9.png'),
  maroon: require('../../../assets/motifs/rooster-ink-maroon-v9.png'),
  rose: require('../../../assets/motifs/rooster-ink-rose-v9.png'),
  white: require('../../../assets/motifs/rooster-ink-white-v9.png'),
  black: require('../../../assets/motifs/rooster-ink-black-v9.png'),
};

const PRELOAD = [
  ROOSTER_RELIEF,
  ROOSTER_LINE_ART,
  ROOSTER_COLOR_ART,
  ...Object.values(ROOSTER_INK_LAYERS),
];

let inflight: Promise<void> | null = null;

/** Decode every rooster plate once. Safe to call from Motif mount and again on tap. */
export function preloadRoosterAssets(): Promise<void> {
  if (!inflight) {
    inflight = Asset.loadAsync(PRELOAD as number[]).then(() => undefined);
  }
  return inflight ?? Promise.resolve();
}
