import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius } from '../theme/tokens';

/**
 * WoodChips — burst of wood-coloured chips on each carve tap.
 */
interface WoodChipsProps {
  trigger: number;
}

const CHIP_COUNT = 18;
const CHIP_COLORS = [Colors.surfaceWoodLight, Colors.surfaceWood, Colors.inkBrown, Colors.surfaceWoodMid];

export function WoodChips({ trigger }: WoodChipsProps) {
  return (
    <View pointerEvents="none" style={styles.container}>
      {Array.from({ length: CHIP_COUNT }).map((_, i) => (
        <Chip key={i} index={i} trigger={trigger} />
      ))}
    </View>
  );
}

function Chip({ index, trigger }: { index: number; trigger: number }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    if (trigger === 0) return;
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25;
    const dist = 48 + Math.random() * 88;
    const dx = Math.cos(angle) * dist;
    const peak = -(36 + Math.random() * 58);

    opacity.value = 1;
    tx.value = 0;
    ty.value = 0;
    scale.value = 0.55 + Math.random() * 0.5;
    tx.value = withTiming(dx, { duration: 680 });
    ty.value = withSequence(
      withTiming(peak, { duration: 240 }),
      withTiming(96 + Math.random() * 24, { duration: 540 }),
    );
    rotate.value = withTiming((Math.random() - 0.5) * 820, { duration: 720 });
    opacity.value = withSequence(
      withTiming(1, { duration: 50 }),
      withTiming(0, { duration: 680 }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const size = 5 + (index % 4) * 2.5;
  const backgroundColor = CHIP_COLORS[index % CHIP_COLORS.length];

  return (
    <Animated.View
      style={[styles.chip, { width: size, height: size * 0.72, backgroundColor }, style]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    position: 'absolute',
    borderRadius: Radius.sm,
  },
});
