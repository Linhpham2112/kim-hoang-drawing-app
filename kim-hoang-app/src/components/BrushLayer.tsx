import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface PaintStroke {
  id: number;
  color: string;
  width: number;
  /** Points in 0–1 normalised stamp space. */
  points: Array<{ x: number; y: number }>;
}

/**
 * Pig ornament tracing. Rooster freehand painting is archived — rooster color
 * is effort-based rub-to-reveal on ColorScreen instead.
 */
export function BrushLayer({
  width,
  height,
  strokes,
}: {
  width: number;
  height: number;
  strokes: PaintStroke[];
}) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {strokes.map((s) => {
          if (s.points.length < 2) return null;
          const d = s.points
            .map((p, i) => {
              const x = p.x * width;
              const y = p.y * height;
              return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
            })
            .join(' ');
          return (
            <Path
              key={s.id}
              d={d}
              stroke={s.color}
              strokeWidth={s.width}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity={0.92}
            />
          );
        })}
      </Svg>
    </View>
  );
}
