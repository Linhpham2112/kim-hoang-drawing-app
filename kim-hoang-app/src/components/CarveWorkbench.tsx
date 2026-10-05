import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const MIN_SCALE = 0.7;
const MAX_SCALE = 4.6;

/**
 * Free zoom / pan around the woodblock.
 * Carve mode: one finger carves. Ink mode: one finger rolls the brayer.
 * Pinch zooms; two-finger pan; double-tap resets.
 */
interface CarveWorkbenchProps {
  width: number;
  height: number;
  children: ReactNode;
  carveEnabled?: boolean;
  onCarveStart?: (x: number, y: number) => void;
  onCarveMove?: (x: number, y: number) => void;
  onCarveEnd?: () => void;
  /** Drag the inked roller across the face. */
  rollEnabled?: boolean;
  onRollStart?: (x: number, y: number) => void;
  onRollMove?: (x: number, y: number) => void;
  onRollEnd?: () => void;
}

export function CarveWorkbench({
  width,
  height,
  children,
  carveEnabled = false,
  onCarveStart,
  onCarveMove,
  onCarveEnd,
  rollEnabled = false,
  onRollStart,
  onRollMove,
  onRollEnd,
}: CarveWorkbenchProps) {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startTx = useSharedValue(0);
  const startTy = useSharedValue(0);
  const pinchFocalX = useSharedValue(0);
  const pinchFocalY = useSharedValue(0);
  const pinching = useSharedValue(false);

  const pinch = Gesture.Pinch()
    .enabled(!rollEnabled)
    .onStart((e) => {
      pinching.value = true;
      startScale.value = scale.value;
      startTx.value = tx.value;
      startTy.value = ty.value;
      pinchFocalX.value = e.focalX;
      pinchFocalY.value = e.focalY;
    })
    .onUpdate((e) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, startScale.value * e.scale));
      const originX = width / 2;
      const originY = height / 2;
      const dx = pinchFocalX.value - originX;
      const dy = pinchFocalY.value - originY;
      scale.value = next;
      tx.value = startTx.value + dx * (startScale.value - next) + (e.focalX - pinchFocalX.value);
      ty.value = startTy.value + dy * (startScale.value - next) + (e.focalY - pinchFocalY.value);
    })
    .onEnd(() => {
      pinching.value = false;
    });

  const pan = Gesture.Pan()
    .enabled(!rollEnabled)
    .minPointers(2)
    .maxPointers(2)
    .onStart(() => {
      startTx.value = tx.value;
      startTy.value = ty.value;
    })
    .onUpdate((e) => {
      if (pinching.value) return;
      tx.value = startTx.value + e.translationX;
      ty.value = startTy.value + e.translationY;
    });

  const reset = Gesture.Tap()
    .numberOfTaps(2)
    .enabled(!rollEnabled)
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 240 });
      tx.value = withTiming(0, { duration: 240 });
      ty.value = withTiming(0, { duration: 240 });
    });

  const start = onCarveStart;
  const move = onCarveMove;
  const end = onCarveEnd;

  const carve = Gesture.Pan()
    .enabled(carveEnabled && !!start && !!move && !!end)
    .maxPointers(1)
    .minDistance(0)
    .shouldCancelWhenOutside(false)
    .onBegin((e) => {
      if (start) runOnJS(start)(e.x, e.y);
    })
    .onUpdate((e) => {
      if (move) runOnJS(move)(e.x, e.y);
    })
    .onFinalize(() => {
      if (end) runOnJS(end)();
    });

  const rStart = onRollStart;
  const rMove = onRollMove;
  const rEnd = onRollEnd;

  const roll = Gesture.Pan()
    .enabled(rollEnabled && !!rStart && !!rMove && !!rEnd)
    .maxPointers(1)
    .minDistance(0)
    .shouldCancelWhenOutside(false)
    .onBegin((e) => {
      if (rStart) runOnJS(rStart)(e.x, e.y);
    })
    .onUpdate((e) => {
      if (rMove) runOnJS(rMove)(e.x, e.y);
    })
    .onFinalize(() => {
      if (rEnd) runOnJS(rEnd)();
    });

  const gesture = Gesture.Simultaneous(reset, pinch, pan, carve, roll);

  const benchStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  return (
    <View style={[styles.slot, { width, height }]}>
      <GestureDetector gesture={gesture}>
        <Animated.View collapsable={false} style={[{ width, height }, benchStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
