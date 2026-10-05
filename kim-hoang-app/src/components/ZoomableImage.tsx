import { useEffect, useState } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const MIN_SCALE = 1;
const MAX_SCALE = 4.2;

function clamp(n: number, min: number, max: number) {
  'worklet';
  return Math.min(max, Math.max(min, n));
}

/** Keep the print on screen while zoomed. */
function clampPan(x: number, y: number, scale: number, width: number, height: number) {
  'worklet';
  const maxX = ((scale - 1) * width) / 2;
  const maxY = ((scale - 1) * height) / 2;
  return {
    x: clamp(x, -maxX, maxX),
    y: clamp(y, -maxY, maxY),
  };
}

/**
 * Starts fitted (contain). Pinch on a spot to enlarge that spot; drag to move.
 * Double-tap or pinch back to the fit.
 */
export function ZoomableImage({
  source,
  width,
  height,
}: {
  source: ImageSourcePropType;
  width: number;
  height: number;
}) {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startTx = useSharedValue(0);
  const startTy = useSharedValue(0);
  const pinchFocalX = useSharedValue(0);
  const pinchFocalY = useSharedValue(0);
  const pinching = useSharedValue(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    scale.value = 1;
    tx.value = 0;
    ty.value = 0;
    setLive(false);
    const id = setTimeout(() => setLive(true), 400);
    return () => clearTimeout(id);
  }, [source, scale, tx, ty]);

  const pinch = Gesture.Pinch()
    .enabled(live)
    .onStart((e) => {
      pinching.value = true;
      startScale.value = scale.value;
      startTx.value = tx.value;
      startTy.value = ty.value;
      pinchFocalX.value = e.focalX;
      pinchFocalY.value = e.focalY;
    })
    .onUpdate((e) => {
      const next = clamp(startScale.value * e.scale, MIN_SCALE, MAX_SCALE);
      const originX = width / 2;
      const originY = height / 2;
      const dx = pinchFocalX.value - originX;
      const dy = pinchFocalY.value - originY;
      scale.value = next;
      const panned = clampPan(
        startTx.value + dx * (startScale.value - next) + (e.focalX - pinchFocalX.value),
        startTy.value + dy * (startScale.value - next) + (e.focalY - pinchFocalY.value),
        next,
        width,
        height,
      );
      tx.value = panned.x;
      ty.value = panned.y;
    })
    .onEnd(() => {
      pinching.value = false;
      if (scale.value <= 1.05) {
        scale.value = withTiming(1, { duration: 180 });
        tx.value = withTiming(0, { duration: 180 });
        ty.value = withTiming(0, { duration: 180 });
      }
    });

  const pan = Gesture.Pan()
    .enabled(live)
    .minDistance(12)
    .minPointers(1)
    .maxPointers(1)
    .onStart(() => {
      startTx.value = tx.value;
      startTy.value = ty.value;
    })
    .onUpdate((e) => {
      if (pinching.value || scale.value <= 1.05) return;
      const panned = clampPan(
        startTx.value + e.translationX,
        startTy.value + e.translationY,
        scale.value,
        width,
        height,
      );
      tx.value = panned.x;
      ty.value = panned.y;
    });

  const reset = Gesture.Tap()
    .enabled(live)
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 220 });
      tx.value = withTiming(0, { duration: 220 });
      ty.value = withTiming(0, { duration: 220 });
    });

  const gesture = Gesture.Simultaneous(reset, pinch, pan);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  return (
    <View style={[styles.slot, { width, height }]}>
      <GestureDetector gesture={gesture}>
        <Animated.View collapsable={false} style={[{ width, height }, imageStyle]}>
          <Animated.Image source={source} resizeMode="contain" style={{ width, height }} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
