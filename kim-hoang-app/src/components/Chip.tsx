import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { SPRING_BOUNCY } from '../utils/animations';
import { Colors, FontSize, Fonts, Radius, Spacing } from '../theme/tokens';

export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  /** Optional icon/dot above the label (e.g. tip size). */
  leading?: ReactNode;
}

/**
 * Small sibling of the flat folk-print button — tool tips, etc.
 * Selected = accentGold fill + ink border for high-contrast kid targeting.
 */
export function Chip({
  label,
  selected = false,
  onPress,
  disabled = false,
  accessibilityLabel,
  leading,
}: ChipProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * 0.05, SPRING_BOUNCY) }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      hitSlop={Spacing.sm}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
    >
      <Animated.View
        style={[
          styles.chip,
          selected ? styles.chipSelected : styles.chipIdle,
          disabled && styles.disabled,
          animatedStyle,
        ]}
      >
        {leading ? <View style={styles.leading}>{leading}</View> : null}
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minWidth: 72,
    minHeight: 72,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipIdle: {
    backgroundColor: Colors.surfacePaper,
    borderColor: Colors.inkBlack,
  },
  chipSelected: {
    backgroundColor: Colors.accentGold,
    borderColor: Colors.inkBlack,
  },
  disabled: {
    opacity: 0.5,
  },
  leading: {
    marginBottom: 6,
    alignItems: 'center',
  },
  label: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    textAlign: 'center',
  },
  labelSelected: {
    color: Colors.inkBlack,
  },
});
