import { useEffect } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Colors, Radius } from '../theme/tokens';

/**
 * Confetti — a one-shot celebratory burst of Kim Hoàng-palette pieces falling
 * from the top on mount. Decorative and non-interactive.
 */
const COUNT = 24;
const PIECE_COLORS = [
  Colors.surfaceRed,
  Colors.accentGold,
  Colors.accentMadder,
  Colors.pigmentYellow,
  Colors.pigmentWhite,
];

export function Confetti() {
  const { width, height } = useWindowDimensions();

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {Array.from({ length: COUNT }).map((_, i) => (
        <Piece key={i} index={i} width={width} height={height} />
      ))}
    </View>
  );
}

function Piece({ index, width, height }: { index: number; width: number; height: number }) {
  const y = useSharedValue(-30);
  const x = useSharedValue(Math.random() * width);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const delay = Math.random() * 400;
    const duration = 1800 + Math.random() * 1400;
    y.value = withDelay(delay, withTiming(height + 40, { duration, easing: Easing.in(Easing.quad) }));
    x.value = withDelay(
      delay,
      withTiming(x.value + (Math.random() - 0.5) * 120, { duration }),
    );
    rotate.value = withDelay(delay, withTiming((Math.random() - 0.5) * 900, { duration }));
    opacity.value = withDelay(delay + duration - 500, withTiming(0, { duration: 500 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: x.value }, { translateY: y.value }, { rotate: `${rotate.value}deg` }],
  }));

  const size = 8 + (index % 4) * 3;
  return (
    <Animated.View
      style={[
        styles.piece,
        { width: size, height: size * 1.6, backgroundColor: PIECE_COLORS[index % PIECE_COLORS.length] },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: Radius.sm,
  },
});
