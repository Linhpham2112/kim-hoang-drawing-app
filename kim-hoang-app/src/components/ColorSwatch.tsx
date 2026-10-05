import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { SPRING_BOUNCY } from '../utils/animations';
import { Colors, Spacing } from '../theme/tokens';

export interface ColorSwatchProps {
  color: string;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  /** Smaller face + tap target so a 7-ink row can wrap on a phone. */
  compact?: boolean;
}

const SWATCH_SIZE = 56;
const TAP_SIZE = 80;
const SWATCH_SIZE_COMPACT = 44;
const TAP_SIZE_COMPACT = 56;

/**
 * Round pigment swatch for the coloring palette.
 *
 * Visual circle is {@link SWATCH_SIZE}pt but the tap target is expanded to
 * ≥80pt (container + hitSlop). Selected state springs up 1.2x and shows a
 * yellow-pigment ring (reanimated).
 */
export function ColorSwatch({
  color,
  selected = false,
  onPress,
  disabled = false,
  accessibilityLabel,
  compact = false,
}: ColorSwatchProps) {
  const pressed = useSharedValue(0);
  const face = compact ? SWATCH_SIZE_COMPACT : SWATCH_SIZE;
  const tap = compact ? TAP_SIZE_COMPACT : TAP_SIZE;

  const animatedStyle = useAnimatedStyle(() => {
    const target = (selected ? 1.2 : 1) - pressed.value * 0.08;
    return {
      transform: [{ scale: withSpring(target, SPRING_BOUNCY) }],
    };
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      hitSlop={compact ? Spacing.sm : Spacing.md}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={[styles.tapArea, { minWidth: tap, minHeight: tap }]}
    >
      <Animated.View
        style={[
          styles.ring,
          {
            borderRadius: face / 2 + 6,
          },
          selected && styles.ringSelected,
          animatedStyle,
        ]}
      >
        <View
          style={[
            styles.swatch,
            {
              width: face,
              height: face,
              borderRadius: face / 2,
            },
            { backgroundColor: color },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tapArea: {
    minWidth: TAP_SIZE,
    minHeight: TAP_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    padding: 3,
    borderRadius: SWATCH_SIZE / 2 + 6,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  ringSelected: {
    borderColor: Colors.accentGold,
  },
  swatch: {
    width: SWATCH_SIZE,
    height: SWATCH_SIZE,
    borderRadius: SWATCH_SIZE / 2,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
  },
});
