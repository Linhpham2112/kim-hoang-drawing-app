import { StyleSheet } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Svg, { G, Path, Rect } from 'react-native-svg';

import { Colors } from '../theme/tokens';

const VW = 108;
const VH = 124;
const W = 132;
const H = 152;
/** Tip of the tuft, in viewBox space — mapped so the stroke lands on the finger. */
const TIP_VX = 40;
const TIP_VY = 116;
const TIP_X = (TIP_VX / VW) * W;
const TIP_Y = (TIP_VY / VH) * H;

/**
 * Bút lông in the same wood / ink language as the brayer.
 * Right-hand hold: handle up-right, tip down-left.
 */
export function BrushCursor({
  x,
  y,
  visible,
  color,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  visible: SharedValue<number>;
  color: string;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: visible.value,
    transform: [{ translateX: x.value - TIP_X }, { translateY: y.value - TIP_Y }],
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, style]}>
      <Svg width={W} height={H} viewBox={`0 0 ${VW} ${VH}`}>
        <G transform={`rotate(30 ${TIP_VX} ${TIP_VY})`}>
          {/* bamboo handle */}
          <Path
            d="M34 10 C34 7 37 6 40 6 C43 6 46 7 46 10 L49 62 C49 65 46 67 40 67 C34 67 31 65 31 62 Z"
            fill={Colors.surfaceWoodMid}
            stroke={Colors.inkBlack}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <Path
            d="M42 9 L47 62 C47 64 45 65.5 40 65.5 C38 65.5 36.5 65 36 64 L42 9 Z"
            fill={Colors.surfaceWoodShade}
          />
          <Path
            d="M37 12 L35.5 60"
            stroke={Colors.pigmentWhite}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={0.45}
          />
          <Rect x={32.5} y={26} width={15} height={3.2} rx={1} fill={Colors.surfaceWoodEdge} />
          <Rect x={32} y={44} width={16} height={3.2} rx={1} fill={Colors.surfaceWoodEdge} />

          {/* bone ferrule */}
          <Path
            d="M30 64 C30 61 34 60 40 60 C46 60 50 61 50 64 L50 74 C50 77 46 78 40 78 C34 78 30 77 30 74 Z"
            fill={Colors.pigmentWhite}
            stroke={Colors.inkBlack}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <Rect x={32} y={67.5} width={16} height={2} rx={0.8} fill={Colors.accentGold} />

          {/* hair tuft — plate colour */}
          <Path
            d="M32 76 C28 88 32 102 38 114 C39.5 117 40.5 117 42 114 C50 100 50 86 48 76 C45 72 35 72 32 76 Z"
            fill={color}
            stroke={Colors.inkBlack}
            strokeWidth={2.2}
            strokeLinejoin="round"
          />
          <Path
            d="M36 78 C34 92 37 106 40 114"
            fill="none"
            stroke={Colors.inkBlack}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.28}
          />
          <Path
            d="M40 77 C41 94 41.5 108 40.5 115"
            fill="none"
            stroke={Colors.inkBlack}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.22}
          />
          <Path
            d="M44 78 C46 92 44 104 42 113"
            fill="none"
            stroke={Colors.inkBlack}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.28}
          />
        </G>
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 12,
    shadowColor: Colors.inkBlack,
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 8,
  },
});
