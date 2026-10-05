import { Asset } from 'expo-asset';
import type { ImageSourcePropType } from 'react-native';

import type { PigInkId } from '../../data/pigInk';

/** Reserved white lines from `pig.svg` — paper red and black ink omitted. */
export const PIG_INK_LAYERS: Record<PigInkId, ImageSourcePropType> = {
  white: require('../../../assets/motifs/pig-ink-white.png'),
};

const PRELOAD = Object.values(PIG_INK_LAYERS);

let inflight: Promise<void> | null = null;

/** Decode the white plate once. Safe to call from Motif mount and again on tap. */
export function preloadPigAssets(): Promise<void> {
  if (!inflight) {
    inflight = Asset.loadAsync(PRELOAD as number[]).then(() => undefined);
  }
  return inflight ?? Promise.resolve();
}
