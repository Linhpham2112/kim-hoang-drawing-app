import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { SPRING_BOUNCY } from '../utils/animations';
import { Colors, FontSize, Fonts, LineHeight, Radius, Spacing } from '../theme/tokens';

export interface ButtonProps {
  labelVi: string;
  labelEn?: string;
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel: string;
  variant?: 'primary' | 'secondary';
}

/**
 * Flat folk-print button — one primary + one secondary style app-wide.
 * Primary: inkBlack fill, cream text. Secondary: cream fill, ink text.
 * Thin double-line border echoes the print frame. No offset drop-shadow.
 */
export function Button({
  labelVi,
  labelEn,
  onPress,
  disabled = false,
  accessibilityLabel,
  variant = 'primary',
}: ButtonProps) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const t = pressed.value;
    return {
      transform: [{ scale: withSpring(1 - t * 0.04, SPRING_BOUNCY) }],
    };
  });

  const isSecondary = variant === 'secondary';
  const labelColor = isSecondary ? Colors.inkBlack : Colors.pigmentWhite;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={Spacing.md}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={styles.pressable}
    >
      <Animated.View
        style={[
          styles.button,
          isSecondary ? styles.buttonSecondary : styles.buttonPrimary,
          disabled && styles.disabled,
          animatedStyle,
        ]}
      >
        <Text style={[styles.labelVi, { color: labelColor }]}>{labelVi}</Text>
        {labelEn ? (
          <Text style={[styles.labelEn, { color: labelColor }]}>{labelEn}</Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'stretch',
  },
  button: {
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.md,
    minHeight: 80,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.inkBlack,
  },
  buttonSecondary: {
    backgroundColor: Colors.surfacePaper,
  },
  disabled: {
    opacity: 0.5,
  },
  labelVi: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.heading,
    textAlign: 'center',
    lineHeight: FontSize.heading * LineHeight.viet,
  },
  labelEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    textAlign: 'center',
    opacity: 0.85,
    marginTop: Spacing.xs / 2,
  },
});
