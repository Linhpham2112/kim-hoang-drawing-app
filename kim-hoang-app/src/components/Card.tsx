import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { SPRING_BOUNCY } from '../utils/animations';
import { Colors, FontSize, Fonts, LineHeight, Radius, Spacing } from '../theme/tokens';

export interface CardProps {
  onPress: () => void;
  selected?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  children: ReactNode;
  /** e.g. "Sắp ra mắt / Coming soon" — shown as an overlay when disabled. */
  overlayLabel?: string;
}

/**
 * Selectable cream paper card (motif / paper picker).
 * Selected: accentGold ring. Flat — no offset shadow.
 */
export function Card({
  onPress,
  selected = false,
  disabled = false,
  accessibilityLabel,
  children,
  overlayLabel,
}: CardProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(1 - pressed.value * 0.03, SPRING_BOUNCY) }],
    };
  });

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
          styles.card,
          selected && styles.cardSelected,
          disabled && styles.disabled,
          animatedStyle,
        ]}
      >
        {children}

        {disabled && overlayLabel ? (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>{overlayLabel}</Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfacePaper,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.lg,
    minWidth: 140,
    minHeight: 140,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    overflow: 'hidden',
  },
  cardSelected: {
    borderColor: Colors.accentGold,
    borderWidth: 5,
    backgroundColor: Colors.colorWhite,
  },
  disabled: {
    opacity: 0.5,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.inkBlack + 'B3',
    paddingHorizontal: Spacing.sm,
  },
  overlayText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.pigmentWhite,
    textAlign: 'center',
    lineHeight: FontSize.body * LineHeight.viet,
  },
});
