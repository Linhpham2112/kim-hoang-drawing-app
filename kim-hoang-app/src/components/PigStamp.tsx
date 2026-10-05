import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { PIG_INK_LAYERS } from '../assets/motifs/pigAssets';
import { PIG_BLACK } from '../assets/motifs/pigBlack';
import { PIG_INK_ORDER, type PigInkId, pigInkComplete } from '../data/pigInk';
import { FadeInImage } from './FadeInImage';

/**
 * Black woodblock + reserved-white rub. Same mount-all-plates rule as the rooster.
 * Done is black + white on the red sheet — not a full pig.svg overlay.
 */
export function PigStamp({
  width,
  height,
  revealedLayers = [],
  pendingLayer,
  pendingOpacity,
  ghost = false,
}: {
  width: number;
  height: number;
  revealedLayers?: PigInkId[];
  pendingLayer?: PigInkId | null;
  pendingOpacity?: SharedValue<number>;
  ghost?: boolean;
}) {
  const done = pigInkComplete(revealedLayers);

  return (
    <View style={{ width, height }} pointerEvents="none">
      <SvgXml xml={PIG_BLACK} width={width} height={height} />
      {ghost && !done ? (
        <View style={[StyleSheet.absoluteFill, { width, height, opacity: 0.38 }]}>
          <FadeInImage source={PIG_INK_LAYERS.white} style={{ width, height }} resizeMode="stretch" />
        </View>
      ) : null}
      {PIG_INK_ORDER.map((id) => (
        <InkPlate
          key={id}
          source={PIG_INK_LAYERS[id]}
          width={width}
          height={height}
          on={revealedLayers.includes(id) || done}
          pending={pendingLayer === id && !revealedLayers.includes(id)}
          pendingOpacity={pendingOpacity}
        />
      ))}
    </View>
  );
}

function InkPlate({
  source,
  width,
  height,
  on,
  pending,
  pendingOpacity,
}: {
  source: ImageSourcePropType;
  width: number;
  height: number;
  on: boolean;
  pending: boolean;
  pendingOpacity?: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    if (on) return { opacity: 1 };
    if (pending && pendingOpacity) return { opacity: pendingOpacity.value };
    return { opacity: 0 };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { width, height }, style]} pointerEvents="none">
      <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="stretch" />
    </Animated.View>
  );
}
