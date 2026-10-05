import { StyleSheet, View } from 'react-native';

import { TOTAL_STEPS } from '../data/stepGuides';
import { Colors, Radius, Spacing } from '../theme/tokens';

export interface ProgressDotsProps {
  /** The current step, 1–TOTAL_STEPS. */
  current: number;
  accessibilityLabel?: string;
}

/**
 * Non-interactive step indicator for the caregiver.
 *
 * Purely visual — no tap handling. The active dot is larger and filled;
 * completed dots are filled; upcoming dots are hollow.
 */
export function ProgressDots({ current, accessibilityLabel }: ProgressDotsProps) {
  const steps = Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel ?? `Bước ${current} trên ${TOTAL_STEPS} / Step ${current} of ${TOTAL_STEPS}`}
      style={styles.row}
    >
      {steps.map((step) => {
        const isActive = step === current;
        const isDone = step < current;
        return (
          <View
            key={step}
            style={[
              styles.dot,
              (isActive || isDone) && styles.dotFilled,
              isActive && styles.dotActive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.inkBlack,
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: Colors.accentGold,
  },
  dotActive: {
    width: 20,
    height: 20,
    borderRadius: Radius.full,
    backgroundColor: Colors.inkBlack,
  },
});
