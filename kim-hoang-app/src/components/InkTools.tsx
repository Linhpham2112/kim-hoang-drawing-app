import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Fonts, Radius, Spacing } from '../theme/tokens';

export type InkKind = 'black';

export const INK_PLATES: Array<{
  id: InkKind;
  color: string;
  labelVi: string;
  labelEn: string;
}> = [{ id: 'black', color: Colors.inkBlack, labelVi: 'Đen', labelEn: 'Black' }];

/** Brayer / ink roller for the carve bench. */
export function InkRoller({
  width,
  inkColor,
  loaded,
}: {
  width: number;
  inkColor: string | null;
  loaded: boolean;
}) {
  const drumH = 28;
  const handleW = Math.min(52, width * 0.22);

  return (
    <View style={[styles.roller, { width }]} pointerEvents="none">
      <View style={[styles.handleLeft, { width: handleW }]} />
      <View
        style={[
          styles.drum,
          {
            height: drumH,
            backgroundColor: loaded && inkColor ? inkColor : Colors.surfaceWoodDrum,
            borderColor: loaded ? Colors.pigmentWhite + '33' : Colors.inkBlack + '59',
          },
        ]}
      >
        <View style={styles.drumShine} />
        <View
          style={[
            styles.drumCore,
            { backgroundColor: loaded && inkColor ? inkColor : Colors.surfaceWoodDrumDark },
          ]}
        />
      </View>
      <View style={[styles.handleRight, { width: handleW }]} />
    </View>
  );
}

export function InkPlate({
  color,
  labelVi,
  labelEn,
  selected,
  dipped,
}: {
  color: string;
  labelVi: string;
  labelEn: string;
  selected?: boolean;
  dipped?: boolean;
}) {
  return (
    <View style={[styles.plateWrap, selected && styles.plateSelected]}>
      <View style={[styles.plate, { backgroundColor: color }, dipped && styles.plateDipped]}>
        <View style={styles.plateRim} />
        <View style={styles.plateGloss} />
      </View>
      <Text style={styles.plateVi}>{labelVi}</Text>
      <Text style={styles.plateEn}>{labelEn}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  roller: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
  },
  handleLeft: {
    height: 10,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: Colors.surfaceWoodMid,
    borderWidth: 1,
    borderColor: Colors.surfaceWoodEdge,
  },
  handleRight: {
    height: 10,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    backgroundColor: Colors.surfaceWoodMid,
    borderWidth: 1,
    borderColor: Colors.surfaceWoodEdge,
  },
  drum: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  drumShine: {
    position: 'absolute',
    top: 3,
    left: 8,
    right: 8,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.pigmentWhite + '38',
  },
  drumCore: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    height: 4,
    borderRadius: 2,
    opacity: 0.55,
  },
  plateWrap: {
    alignItems: 'center',
    minWidth: 72,
    padding: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  plateSelected: {
    borderColor: Colors.accentGold,
    backgroundColor: Colors.accentGold + '1F',
  },
  plate: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    overflow: 'hidden',
  },
  plateDipped: {
    transform: [{ scale: 0.92 }],
  },
  plateRim: {
    ...StyleSheet.absoluteFill,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: Colors.pigmentWhite + '1F',
  },
  plateGloss: {
    position: 'absolute',
    top: 8,
    left: 10,
    width: 16,
    height: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  plateVi: {
    marginTop: Spacing.xs,
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
  },
  plateEn: {
    fontFamily: Fonts.body,
    fontSize: 10,
    color: Colors.inkBlack,
    opacity: 0.65,
  },
});
