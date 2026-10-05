import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '../theme/tokens';
import { HardStackShadow } from './texture/HardStackShadow';

/**
 * WoodBlockFrame — carving face + plank edge. Hard stack depth, no soft blur.
 */
interface WoodBlockFrameProps {
  width: number;
  height: number;
  children: ReactNode;
}

export function woodBlockOuterSize(width: number, height: number) {
  const edgeBottom = Math.max(7, Math.round(height * 0.022));
  const edgeRight = Math.max(5, Math.round(width * 0.014));
  return { width: width + edgeRight, height: height + edgeBottom, edgeBottom, edgeRight };
}

export function WoodBlockFrame({ width, height, children }: WoodBlockFrameProps) {
  const { edgeBottom, edgeRight } = woodBlockOuterSize(width, height);

  return (
    <View style={{ width: width + edgeRight, height: height + edgeBottom }}>
      <HardStackShadow offset={4} color={Colors.inkBlack} style={{ opacity: 0.22 }} />
      <View style={[styles.wrap, { width: width + edgeRight, height: height + edgeBottom }]}>
        <View
          style={[
            styles.face,
            {
              width,
              height,
              borderTopColor: Colors.pigmentWhite + 'A6',
              borderLeftColor: Colors.pigmentWhite + '66',
              borderBottomColor: Colors.surfaceWoodShade + '59',
              borderRightColor: Colors.surfaceWoodShade + '38',
            },
          ]}
        >
          {children}
        </View>

        <View
          pointerEvents="none"
          style={[
            styles.edgeBottom,
            {
              top: height - 1,
              width: width + edgeRight,
              height: edgeBottom,
            },
          ]}
        >
          <View style={styles.edgeBottomFace} />
          <View style={[styles.edgeBottomShade, { width: edgeRight }]} />
        </View>

        <View
          pointerEvents="none"
          style={[
            styles.edgeRight,
            {
              left: width - 1,
              top: edgeBottom * 0.35,
              width: edgeRight,
              height: height - edgeBottom * 0.35,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  face: {
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    backgroundColor: Colors.surfaceWoodLight,
  },
  edgeBottom: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  edgeBottomFace: {
    flex: 1,
    backgroundColor: Colors.surfaceWood,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceWoodShade,
  },
  edgeBottomShade: {
    backgroundColor: Colors.surfaceWoodMid,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surfaceWoodKnot,
  },
  edgeRight: {
    position: 'absolute',
    backgroundColor: Colors.surfaceWood,
    borderRightWidth: 1,
    borderRightColor: Colors.surfaceWoodShade,
  },
});
