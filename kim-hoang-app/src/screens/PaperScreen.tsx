import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { paperHex, PrintedMotif } from '../components/PaintingView';
import { ScreenShell } from '../components/ScreenShell';
import { PaperTexture } from '../components/texture/PaperTexture';
import { WoodBlockFrame, woodBlockOuterSize } from '../components/WoodBlockFrame';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { type PaperColor, useAppStore } from '../store/useAppStore';
import { DEFAULT_PRINT_POS, fitRect, printScaleFor, ROOSTER_STAMP_OVERFLOW } from '../utils/rect';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Paper'>;

const PAPERS: Array<{ id: PaperColor; labelVi: string; labelEn: string }> = [
  { id: 'chuSa', labelVi: 'Chu Sa', labelEn: 'Cinnabar' },
  { id: 'son', labelVi: 'Son Đỏ', labelEn: 'Vermilion' },
];

/**
 * Place the carved woodblock on the red paper and press — B&W impression only.
 * Colour is painted on this sheet afterwards, not rolled on the block.
 */
export function PaperScreen({ navigation }: Props) {
  const motif = useAppStore((s) => s.motif);
  const setPaperColor = useAppStore((s) => s.setPaperColor);
  const setPrintPos = useAppStore((s) => s.setPrintPos);
  const setPrintRot = useAppStore((s) => s.setPrintRot);
  const setPrinted = useAppStore((s) => s.setPrinted);
  const layout = useLayout();

  const blockMotif = motif === 'rooster' ? 'rooster' : 'pig';

  const [chosen, setChosen] = useState<PaperColor | null>(null);
  const [stamping, setStamping] = useState(false);
  const [beat, setBeat] = useState<'place' | 'press' | 'lift'>('place');

  const maxW = Math.min(layout.width - 48, layout.isTablet ? 400 : 340);
  const maxH = layout.height * (layout.isLandscape ? 0.58 : 0.5);
  const { width: pw, height: ph } = fitRect(maxW, maxH);
  const printScale = printScaleFor(blockMotif);
  const stampW = pw * printScale;
  const stampH = ph * printScale;
  const outer = woodBlockOuterSize(stampW, stampH);

  const nx = useSharedValue(DEFAULT_PRINT_POS.nx);
  const ny = useSharedValue(DEFAULT_PRINT_POS.ny);
  const rot = useSharedValue(0);
  const startNx = useSharedValue(DEFAULT_PRINT_POS.nx);
  const startNy = useSharedValue(DEFAULT_PRINT_POS.ny);
  const startRot = useSharedValue(0);

  const liftY = useSharedValue(0);
  const pressScale = useSharedValue(1);
  const blockOpacity = useSharedValue(1);
  const inkReveal = useSharedValue(0);

  const roosterLeft = ROOSTER_STAMP_OVERFLOW.left;
  const roosterRight = ROOSTER_STAMP_OVERFLOW.right;
  const roosterTop = ROOSTER_STAMP_OVERFLOW.top;
  const roosterBottom = ROOSTER_STAMP_OVERFLOW.bottom;

  const clampPos = (x: number, y: number) => {
    'worklet';
    const m = printScale / 2;
    if (blockMotif === 'rooster') {
      return {
        nx: Math.min(1 - m + printScale * roosterRight, Math.max(m - printScale * roosterLeft, x)),
        ny: Math.min(1 - m + printScale * roosterBottom, Math.max(m - printScale * roosterTop, y)),
      };
    }
    return {
      nx: Math.min(1 - m, Math.max(m, x)),
      ny: Math.min(1 - m, Math.max(m, y)),
    };
  };

  const drag = Gesture.Pan()
    .enabled(!stamping)
    .maxPointers(1)
    .onStart(() => {
      startNx.value = nx.value;
      startNy.value = ny.value;
    })
    .onUpdate((e) => {
      const next = clampPos(
        startNx.value + e.translationX / pw,
        startNy.value + e.translationY / ph,
      );
      nx.value = next.nx;
      ny.value = next.ny;
    });

  const twist = Gesture.Rotation()
    .enabled(!stamping)
    .onStart(() => {
      startRot.value = rot.value;
    })
    .onUpdate((e) => {
      rot.value = startRot.value + (e.rotation * 180) / Math.PI;
    });

  const blockGesture = Gesture.Simultaneous(drag, twist);

  const blockStyle = useAnimatedStyle(() => ({
    opacity: blockOpacity.value,
    transform: [
      { translateX: nx.value * pw - stampW / 2 },
      { translateY: ny.value * ph - stampH / 2 + liftY.value },
      { rotate: `${rot.value}deg` },
      { scale: pressScale.value },
    ],
  }));

  const printStyle = useAnimatedStyle(() => ({
    opacity: inkReveal.value > 0 ? 1 : 0,
    transform: [
      { translateX: nx.value * pw - stampW / 2 },
      { translateY: ny.value * ph - stampH / 2 },
      { rotate: `${rot.value}deg` },
    ],
  }));

  const choosePaper = (paper: PaperColor) => {
    setPaperColor(paper);
    setChosen(paper);
    void Haptics.selectionAsync();
  };

  const stamp = () => {
    if (stamping) return;
    setStamping(true);
    setPrintPos({ nx: nx.value, ny: ny.value });
    setPrintRot(rot.value);
    setPrinted();
    setBeat('press');
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    pressScale.value = withSequence(
      withTiming(0.92, { duration: 160, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }),
    );
    inkReveal.value = withTiming(1, { duration: 480, easing: Easing.out(Easing.cubic) });

    setTimeout(() => {
      setBeat('lift');
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      liftY.value = withTiming(-ph * 0.42, {
        duration: 520,
        easing: Easing.out(Easing.cubic),
      });
      blockOpacity.value = withTiming(0, { duration: 420 });
    }, 480);

    setTimeout(() => {
      navigation.navigate('Color');
    }, 1300);
  };

  if (chosen) {
    const hint =
      beat === 'place'
        ? 'Kéo mộc bản tới chỗ muốn đóng — rồi nhấn Đóng dấu'
        : beat === 'press'
          ? 'Đóng dấu!'
          : 'Nhấc mộc bản — hình in nằm trên giấy';

    return (
      <ScreenShell
        step={6}
        titleVi="Đóng dấu"
        titleEn="Stamp the print"
        onBack={stamping ? undefined : () => setChosen(null)}
        showBack={!stamping}
        scroll={false}
        onNext={stamping ? undefined : stamp}
        nextLabel="Đóng dấu / Stamp"
        guideId="print"
      >
        <View
          style={[styles.stage, { width: pw, height: ph, backgroundColor: paperHex(chosen) }]}
        >
          <PaperTexture variant="red" intensity={0.75} seed={29} />
          <Animated.View
            pointerEvents="none"
            style={[styles.print, { width: stampW, height: stampH }, printStyle]}
          >
            <PrintedMotif motif={blockMotif} width={stampW} height={stampH} uncolored />
          </Animated.View>

          <GestureDetector gesture={blockGesture}>
            <Animated.View
              collapsable={false}
              style={[styles.block, { width: outer.width, height: outer.height }, blockStyle]}
            >
              <WoodBlockFrame width={stampW} height={stampH}>
                <View style={styles.center}>
                  <PrintedMotif
                    motif={blockMotif}
                    width={stampW * 0.92}
                    height={stampH * 0.92}
                    uncolored
                  />
                </View>
              </WoodBlockFrame>
            </Animated.View>
          </GestureDetector>
        </View>

        <Text style={styles.hint}>{hint}</Text>
        {!stamping ? (
          <View style={styles.rotateRow}>
            <Pressable
              accessibilityLabel="Xoay trái"
              onPress={() => {
                rot.value = withTiming(rot.value - 15, { duration: 180 });
                void Haptics.selectionAsync();
              }}
              style={styles.rotateBtn}
            >
              <Text style={styles.rotateMark}>↺</Text>
            </Pressable>
            <Pressable
              accessibilityLabel="Xoay phải"
              onPress={() => {
                rot.value = withTiming(rot.value + 15, { duration: 180 });
                void Haptics.selectionAsync();
              }}
              style={styles.rotateBtn}
            >
              <Text style={styles.rotateMark}>↻</Text>
            </Pressable>
          </View>
        ) : null}
      </ScreenShell>
    );
  }

  return (
    <ScreenShell
      step={5}
      titleVi="Chọn giấy nền"
      titleEn="Choose paper"
      onBack={() => navigation.goBack()}
      guideId="paper"
    >
      <View style={[styles.row, layout.isLandscape && styles.rowLandscape]}>
        {PAPERS.map((paper) => (
          <Pressable
            key={paper.id}
            accessibilityLabel={`${paper.labelVi} / ${paper.labelEn}`}
            onPress={() => choosePaper(paper.id)}
            style={[styles.card, { backgroundColor: paperHex(paper.id) }]}
          >
            <PaperTexture variant="red" intensity={0.6} seed={paper.id === 'son' ? 31 : 23} />
            <Text style={styles.labelVi}>{paper.labelVi}</Text>
            <Text style={styles.labelEn}>{paper.labelEn}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint}>Chọn giấy → đóng dấu / Pick paper → stamp</Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'center',
  },
  rowLandscape: {
    gap: Spacing.xl,
  },
  card: {
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: 2,
    width: 150,
    height: 206,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    overflow: 'hidden',
  },
  labelVi: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.heading,
    color: Colors.pigmentWhite,
    zIndex: 1,
  },
  labelEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.pigmentWhite,
    opacity: 0.9,
    zIndex: 1,
  },
  hint: {
    marginTop: Spacing.lg,
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.7,
    textAlign: 'center',
  },
  rotateRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  rotateBtn: {
    minWidth: 56,
    minHeight: 56,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: 8,
    backgroundColor: Colors.surfacePaper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rotateMark: {
    fontSize: 28,
    color: Colors.inkBlack,
    lineHeight: 32,
  },
  stage: {
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: 2,
    borderWidth: 2,
    borderColor: Colors.inkBlack,
  },
  block: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 4,
  },
  print: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    overflow: 'hidden',
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
