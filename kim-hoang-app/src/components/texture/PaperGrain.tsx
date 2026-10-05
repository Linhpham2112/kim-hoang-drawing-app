import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, Line, Pattern, Rect } from 'react-native-svg';

import { Colors } from '../../theme/tokens';

/** Procedural điệp fiber — horizontal grain + cross-hatch at low opacity. */
export const PaperGrain = memo(function PaperGrain({ variant }: { variant: 'cream' | 'red' }) {
  const stroke = variant === 'red' ? Colors.paperRedDark : Colors.inkBrown;
  const opacity = variant === 'red' ? 0.14 : 0.1;

  return (
    <Svg pointerEvents="none" style={StyleSheet.absoluteFill} preserveAspectRatio="none">
      <Defs>
        <Pattern id="khFiber" patternUnits="userSpaceOnUse" width={6} height={6}>
          <Line x1={0} y1={2.5} x2={6} y2={2.8} stroke={stroke} strokeWidth={0.35} opacity={0.55} />
          <Line x1={0} y1={5.1} x2={6} y2={4.7} stroke={stroke} strokeWidth={0.25} opacity={0.35} />
        </Pattern>
        <Pattern id="khCross" patternUnits="userSpaceOnUse" width={11} height={11}>
          <Line x1={0} y1={5.5} x2={11} y2={5.2} stroke={stroke} strokeWidth={0.2} opacity={0.25} />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#khFiber)" opacity={opacity} />
      <Rect width="100%" height="100%" fill="url(#khCross)" opacity={opacity * 0.65} />
    </Svg>
  );
});
