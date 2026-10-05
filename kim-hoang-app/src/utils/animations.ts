import {
  Easing,
  type SharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const SPRING_BOUNCY = { damping: 15, stiffness: 400 };

export const FILL_SPREAD_TIMING = {
  duration: 400,
  easing: Easing.out(Easing.cubic),
};

export function animateStampPress(
  scaleValue: SharedValue<number>,
  yValue: SharedValue<number>,
): void {
  scaleValue.value = withSequence(
    withTiming(0.9, { duration: 120 }),
    withTiming(1.05, { duration: 120 }),
    withSpring(1, SPRING_BOUNCY),
  );
  yValue.value = withSequence(
    withTiming(8, { duration: 120 }),
    withTiming(-4, { duration: 120 }),
    withSpring(0, SPRING_BOUNCY),
  );
}

export function animateShake(xValue: SharedValue<number>): void {
  xValue.value = withSequence(
    withTiming(-8, { duration: 60 }),
    withTiming(8, { duration: 60 }),
    withTiming(-8, { duration: 60 }),
    withTiming(0, { duration: 60 }),
  );
}
