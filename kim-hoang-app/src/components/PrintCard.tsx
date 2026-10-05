import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Radius, Spacing } from '../theme/tokens';
import { PaperTexture } from './texture/PaperTexture';

export interface PrintCardProps {
  children: ReactNode;
  /** Show điệp paper texture. Default true. */
  texture?: boolean;
  textureIntensity?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

/**
 * Framed Kim Hoàng print card — red điệp surface, warm-black double border.
 */
export function PrintCard({
  children,
  texture = true,
  textureIntensity,
  style,
  contentStyle,
}: PrintCardProps) {
  return (
    <View style={[styles.outer, style]}>
      <View style={styles.inner}>
        {texture ? <PaperTexture variant="red" intensity={textureIntensity} seed={11} /> : null}
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: Colors.surfaceCardRed,
    borderWidth: 5,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.md,
    padding: Spacing.xs,
    overflow: 'hidden',
  },
  inner: {
    borderWidth: 1.5,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceCardRed,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
