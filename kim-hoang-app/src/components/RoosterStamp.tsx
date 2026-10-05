import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import {
  ROOSTER_COLOR_ART,
  ROOSTER_INK_LAYERS,
  ROOSTER_LINE_ART,
} from '../assets/motifs/roosterAssets';
import { ROOSTER_INK_ORDER, type RoosterInkId, roosterInkComplete } from '../data/roosterInk';
import { FadeInImage } from './FadeInImage';

/**
 * B&W lines + faint colour guide. All seven ink Images stay mounted so a
 * finished plate never remounts (that was the ~400ms colour-reset flash).
 */
export function RoosterStamp({
  width,
  height,
  revealedLayers = [],
  pendingLayer,
  pendingOpacity,
  ghost = false,
}: {
  width: number;
  height: number;
  revealedLayers?: RoosterInkId[];
  pendingLayer?: RoosterInkId | null;
  pendingOpacity?: SharedValue<number>;
  ghost?: boolean;
}) {
  const done = roosterInkComplete(revealedLayers);

  return (
    <View style={{ width, height }} pointerEvents="none">
      <FadeInImage source={ROOSTER_LINE_ART} style={{ width, height }} resizeMode="stretch" />
      {ghost && !done ? (
        <View style={[StyleSheet.absoluteFill, { width, height, opacity: 0.38 }]}>
          <FadeInImage source={ROOSTER_COLOR_ART} style={{ width, height }} resizeMode="stretch" />
        </View>
      ) : null}
      {ROOSTER_INK_ORDER.map((id) => (
        <InkPlate
          key={id}
          source={ROOSTER_INK_LAYERS[id]}
          width={width}
          height={height}
          on={revealedLayers.includes(id) || done}
          pending={pendingLayer === id && !revealedLayers.includes(id)}
          pendingOpacity={pendingOpacity}
        />
      ))}
      {done ? (
        <Image
          source={ROOSTER_COLOR_ART}
          style={[StyleSheet.absoluteFill, { width, height }]}
          resizeMode="stretch"
        />
      ) : null}
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
