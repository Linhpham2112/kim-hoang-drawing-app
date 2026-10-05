import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../../theme/tokens';
import { mulberry32 } from '../../utils/seededRandom';
import { PaperGrain } from './PaperGrain';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

export type PaperTextureVariant = 'cream' | 'red';

export interface PaperTextureProps {
  variant: PaperTextureVariant;
  /** 0–1 overall strength. Default varies by variant. */
  intensity?: number;
  /** Seed for stable-but-random fleck scatter. */
  seed?: number;
}

type Fleck = { left: number; top: number; size: number; gold: boolean; opacity: number };

function buildFlecks(seed: number, count: number): Fleck[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    left: rand() * 100,
    top: rand() * 100,
    size: 0.8 + rand() * 2.8,
    gold: rand() > 0.42,
    opacity: 0.35 + rand() * 0.65,
  }));
}

/** Red điệp — darker toward edges (multiply-like vignette). */
function RedVignette({ intensity }: { intensity: number }) {
  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill} preserveAspectRatio="none">
      <Defs>
        <RadialGradient id="khRedVig" cx="50%" cy="46%" rx="68%" ry="62%">
          <Stop offset="0%" stopColor={Colors.surfaceRed} stopOpacity={0} />
          <Stop offset="58%" stopColor={Colors.paperRedDark} stopOpacity={0.07 * intensity} />
          <Stop offset="100%" stopColor={Colors.paperRedDark} stopOpacity={0.36 * intensity} />
        </RadialGradient>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#khRedVig)" />
    </Svg>
  );
}

/**
 * Reusable paper overlay — fiber grain + dense random flecks.
 * Decorative art surfaces only; keep intensity low on areas with text.
 */
export function PaperTexture({ variant, intensity, seed = 7 }: PaperTextureProps) {
  const strength = intensity ?? (variant === 'red' ? 0.85 : 0.55);
  const flecks = useMemo(
    () => buildFlecks(seed, variant === 'red' ? 140 : 110),
    [seed, variant],
  );

  return (
    <View pointerEvents="none" style={styles.layer}>
      <PaperGrain variant={variant} />
      {variant === 'red' ? <RedVignette intensity={strength} /> : null}
      <View style={[styles.fleckLayer, { opacity: 0.18 + strength * 0.22 }]}>
        {flecks.map((f, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              borderRadius: f.size / 2,
              opacity: f.opacity,
              backgroundColor: f.gold ? Colors.accentGold : Colors.pigmentWhite,
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  fleckLayer: {
    ...StyleSheet.absoluteFill,
  },
});
