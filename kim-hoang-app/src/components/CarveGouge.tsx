import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { Colors } from '../theme/tokens';

/**
 * CarveGouge — one chisel/gouge strip (elongated cut, not a round pit).
 * Top-left light: darker along the top-left of the groove, lighter on the
 * bottom-right lip.
 */
interface CarveGougeProps {
  /** Centre of the strip in block coordinates */
  cx: number;
  cy: number;
  /** Long axis of the chisel stroke */
  length: number;
  /** Short axis — chisel width */
  width: number;
  /** Degrees, stroke direction */
  angle: number;
  seed: number;
}

export function CarveGouge({ cx, cy, length, width, angle, seed }: CarveGougeProps) {
  const id = `strip-${seed}`;

  return (
    <Svg
      style={{
        position: 'absolute',
        left: cx - length / 2,
        top: cy - width / 2,
        width: length,
        height: width,
        transform: [{ rotate: `${angle}deg` }],
      }}
      viewBox="0 0 100 20"
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={Colors.surfaceWoodShade} stopOpacity={1} />
          <Stop offset="45%" stopColor={Colors.surfaceWoodStreak} stopOpacity={1} />
          <Stop offset="78%" stopColor={Colors.surfaceWoodLight} stopOpacity={1} />
          <Stop offset="100%" stopColor={Colors.surfaceWoodLight} stopOpacity={0.95} />
        </LinearGradient>
      </Defs>
      <Rect x={0} y={0} width={100} height={20} rx={10} ry={10} fill={`url(#${id})`} />
      {/* groove lip — soft shadow on the top edge of the cut */}
      <Rect
        x={1}
        y={1}
        width={98}
        height={8}
        rx={8}
        ry={4}
        fill={Colors.surfaceWoodEdge}
        fillOpacity={0.28}
      />
    </Svg>
  );
}
