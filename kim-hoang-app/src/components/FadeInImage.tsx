import { useCallback } from 'react';
import {
  type ImageResizeMode,
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const FADE_MS = 260;

/** Starts invisible; fades in when the bitmap is ready. Wood/paper stay visible underneath. */
export function FadeInImage({
  source,
  style,
  resizeMode = 'stretch',
  duration = FADE_MS,
}: {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
  duration?: number;
}) {
  const opacity = useSharedValue(0);
  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const onLoad = useCallback(() => {
    opacity.value = withTiming(1, { duration });
  }, [duration, opacity]);

  return (
    <Animated.Image source={source} resizeMode={resizeMode} style={[style, fade]} onLoad={onLoad} />
  );
}
