import { StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { PIG_ORNAMENTS } from '../assets/motifs/pigOrnaments';
import { Colors } from '../theme/tokens';

/** Faint shadow lines — ear cloud + flank spiral (colour print only, not in pig_bw). */
export function PigOrnamentGhost({ width, height }: { width: number; height: number }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.wrap]}>
      <SvgXml xml={PIG_ORNAMENTS} width={width} height={height} color={Colors.accentMadder} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    opacity: 0.32,
  },
});
