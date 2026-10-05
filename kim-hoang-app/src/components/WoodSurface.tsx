import Svg, { Ellipse, Path, Rect } from 'react-native-svg';

import { Colors } from '../theme/tokens';

/**
 * WoodSurface — a procedural wood texture drawn with react-native-svg. No image
 * assets or design tooling needed. Scales to fill any rectangle (grain stretches
 * with `preserveAspectRatio="none"`).
 *
 * Two tones:
 *  - `raised`  → the top surface of the block (the part that stays after carving,
 *                i.e. the motif in relief). Warm, lit.
 *  - `carved`  → the background that has been chiselled away. Darker + recessed,
 *                with scattered chisel/gouge marks so it reads as cut-out wood.
 */
interface WoodSurfaceProps {
  width: number;
  height: number;
  tone?: 'raised' | 'carved';
}

const RAISED = {
  base: Colors.surfaceWoodLight,
  streak: Colors.surfaceWoodStreak,
  knot: Colors.surfaceWoodMid,
};
const CARVED = {
  base: Colors.surfaceWood,
  streak: Colors.surfaceWoodStreakDark,
  knot: Colors.surfaceWoodKnot,
};

const GRAIN_Y = [10, 22, 33, 45, 56, 68, 80, 91];

/** Deterministic scatter of little chisel gouges across the carved background. */
const GOUGES = Array.from({ length: 22 }).map((_, i) => {
  const col = i % 5;
  const row = Math.floor(i / 5);
  const jitterX = ((i * 37) % 13) - 6;
  const jitterY = ((i * 53) % 11) - 5;
  return {
    x: 10 + col * 20 + jitterX,
    y: 12 + row * 19 + jitterY,
    len: 5 + ((i * 7) % 5),
    rot: ((i * 41) % 40) - 20,
  };
});

export function WoodSurface({ width, height, tone = 'raised' }: WoodSurfaceProps) {
  const c = tone === 'raised' ? RAISED : CARVED;
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <Rect x={0} y={0} width={100} height={100} fill={c.base} />

      {GRAIN_Y.map((y, i) => (
        <Path
          key={`g${i}`}
          d={`M-2 ${y} C 22 ${y - 3.5}, 44 ${y + 3}, 68 ${y - 2.5} S 102 ${y + 2}, 104 ${y}`}
          stroke={c.streak}
          strokeWidth={i % 2 ? 1.3 : 2.1}
          strokeOpacity={0.45}
          fill="none"
        />
      ))}

      <Ellipse
        cx={70}
        cy={28}
        rx={5.5}
        ry={3.2}
        stroke={c.knot}
        strokeWidth={1.4}
        strokeOpacity={0.55}
        fill="none"
      />
      <Ellipse cx={70} cy={28} rx={2} ry={1.1} fill={c.knot} fillOpacity={0.5} />

      {tone === 'carved' &&
        GOUGES.map((g, i) => (
          <Path
            key={`c${i}`}
            d={`M${g.x} ${g.y} q ${g.len / 2} ${g.len / 3}, ${g.len} 0`}
            stroke={Colors.surfaceWoodGouge}
            strokeWidth={1.6}
            strokeOpacity={0.55}
            fill="none"
            transform={`rotate(${g.rot} ${g.x} ${g.y})`}
          />
        ))}
    </Svg>
  );
}
