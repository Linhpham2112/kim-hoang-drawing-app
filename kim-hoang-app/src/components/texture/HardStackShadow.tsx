import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '../../theme/tokens';

export interface HardStackShadowProps {
  offset?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

/** Hard-offset stacked sheet — print depth without iOS soft blur. */
export function HardStackShadow({
  offset = 5,
  color = Colors.inkBlack,
  style,
}: HardStackShadowProps) {
  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          top: offset,
          left: offset,
          backgroundColor: color,
          opacity: 0.88,
        },
        style,
      ]}
    />
  );
}
