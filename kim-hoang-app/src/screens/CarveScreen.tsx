import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { CarveBlock, type CarveHandle } from '../components/CarveBlock';
import { CarveWorkbench } from '../components/CarveWorkbench';
import { Chip } from '../components/Chip';
import { InkPlate, InkRoller, INK_PLATES, type InkKind } from '../components/InkTools';
import { ScreenShell } from '../components/ScreenShell';
import { WoodBlockFrame, woodBlockOuterSize } from '../components/WoodBlockFrame';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/useAppStore';
import { fitRect } from '../utils/rect';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Carve'>;

const TIPS = [
  { key: 'fine', vi: 'Nhỏ', en: 'Fine', radius: 0, dot: 6 },
  { key: 'medium', vi: 'Vừa', en: 'Medium', radius: 1, dot: 18 },
  { key: 'wide', vi: 'To', en: 'Wide', radius: 2, dot: 40 },
] as const;

/** How much roller travel (in block heights) to fully ink the relief. */
const ROLL_PASSES = 3.2;

export function CarveScreen({ navigation }: Props) {
  const motif = useAppStore((s) => s.motif);
  const carved = useAppStore((s) => s.carved);
  const inked = useAppStore((s) => s.inked);
  const setCarved = useAppStore((s) => s.setCarved);
  const setInked = useAppStore((s) => s.setInked);
  const layout = useLayout();

  const [tipIdx, setTipIdx] = useState(1);
  const [progress, setProgress] = useState(carved ? 1 : 0);
  const [dippedInk, setDippedInk] = useState<InkKind | null>(null);
  const [rollerLoaded, setRollerLoaded] = useState(false);
  const [inkProgress, setInkProgress] = useState(inked ? 1 : 0);
  const carveRef = useRef<CarveHandle>(null);
  const lastRoll = useRef<{ x: number; y: number } | null>(null);
  const travelRef = useRef(0);
  const doneInk = useRef(inked);

  const isRooster = motif === 'rooster';
  const blockMotif: 'pig' | 'rooster' = isRooster ? 'rooster' : 'pig';

  const maxW = Math.min(layout.width - 48, layout.isTablet ? 460 : 380);
  const maxH = layout.height * (layout.isLandscape ? 0.55 : 0.46);
  const { width: blockW, height: blockH } = fitRect(maxW, maxH);
  const outer = woodBlockOuterSize(blockW, blockH);

  const ink = useSharedValue(inked ? 1 : 0);
  const rollerX = useSharedValue(blockW * 0.5);
  const rollerY = useSharedValue(blockH * 0.12);
  const rollerVisible = useSharedValue(0);

  const inking = carved && !inked;

  useEffect(() => {
    if (motif !== 'pig' && motif !== 'rooster') {
      navigation.replace('Motif');
    }
  }, [motif, navigation]);

  useEffect(() => {
    if (inking) {
      rollerVisible.value = 1;
      rollerX.value = blockW * 0.5;
      rollerY.value = blockH * 0.12;
    } else {
      rollerVisible.value = 0;
    }
  }, [inking, blockW, blockH, rollerVisible, rollerX, rollerY]);

  const rollerStyle = useAnimatedStyle(() => ({
    opacity: rollerVisible.value,
    transform: [
      { translateX: rollerX.value - blockW * 0.42 },
      { translateY: rollerY.value - 18 },
    ],
  }));

  const inkColor = dippedInk ? Colors.inkBlack : null;

  const dipBlack = () => {
    if (!inking || doneInk.current) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDippedInk('black');
    setRollerLoaded(true);
    rollerVisible.value = 1;
    rollerY.value = withTiming(blockH * 0.15, { duration: 220 });
  };

  const finishInk = () => {
    if (doneInk.current) return;
    doneInk.current = true;
    setInkProgress(1);
    ink.value = withTiming(1, { duration: 420 });
    setInked();
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const onRollStart = (x: number, y: number) => {
    if (!inking || !rollerLoaded || doneInk.current) return;
    lastRoll.current = { x, y };
    rollerX.value = x;
    rollerY.value = y;
    void Haptics.selectionAsync();
  };

  const onRollMove = (x: number, y: number) => {
    if (!inking || !rollerLoaded || doneInk.current) return;
    rollerX.value = x;
    rollerY.value = y;

    const prev = lastRoll.current;
    if (!prev) {
      lastRoll.current = { x, y };
      return;
    }
    const dist = Math.hypot(x - prev.x, y - prev.y);
    if (dist < 4) return;
    lastRoll.current = { x, y };

    travelRef.current += dist;
    const p = Math.min(1, travelRef.current / (blockH * ROLL_PASSES));
    setInkProgress(p);
    ink.value = p * 0.92;

    if (dist > 12) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (p >= 1) finishInk();
  };

  const onRollEnd = () => {
    lastRoll.current = null;
  };

  if (motif !== 'pig' && motif !== 'rooster') {
    return null;
  }

  const animalVi = isRooster ? 'gà' : 'lợn';
  const animalEn = isRooster ? 'Rooster' : 'Pig';

  const titleVi = !carved ? 'Khắc gỗ' : !inked ? 'Lăn mực' : 'Mộc bản xong';
  const titleEn = !carved ? 'Carve the block' : !inked ? 'Roll the ink' : 'Block is ready';
  const hintVi = !carved
    ? 'Mỗi lần chạm là một nhát đục — chụm hai ngón để phóng to'
    : !inked
      ? rollerLoaded
        ? 'Lăn con lăn qua lại trên hình nổi vài lần'
        : 'Chạm đĩa mực Đen để nhúng con lăn'
      : `Hình ${animalVi} đã lăn mực — chạm Tiếp theo để in lên giấy`;
  const hintEn = !carved
    ? 'Each tap is one chisel cut — pinch to lean in close'
    : !inked
      ? rollerLoaded
        ? 'Roll the brayer back and forth over the relief'
        : 'Tap the Black ink plate to load the roller'
      : `${animalEn} is inked — tap Next to stamp on paper`;

  return (
    <ScreenShell
      step={!carved ? 3 : 4}
      titleVi={titleVi}
      titleEn={titleEn}
      onBack={() => navigation.goBack()}
      onNext={inked ? () => navigation.navigate('Paper') : undefined}
      nextLabel="Tiếp theo / Next"
      scroll={false}
      guideId={!carved ? 'carve' : 'ink'}
    >
      <View style={styles.stage}>
        {!carved && (
          <View style={[styles.progressTrack, { width: blockW }]}>
            <Animated.View
              style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]}
            />
          </View>
        )}

        {inking && (
          <View style={[styles.progressTrack, { width: blockW }]}>
            <Animated.View
              style={[styles.inkFill, { width: `${Math.round(inkProgress * 100)}%` }]}
            />
          </View>
        )}

        <View>
          <CarveWorkbench
            width={outer.width}
            height={outer.height}
            carveEnabled={!carved}
            onCarveStart={(x, y) => carveRef.current?.pointerDown(x, y)}
            onCarveMove={(x, y) => carveRef.current?.pointerMove(x, y)}
            onCarveEnd={() => carveRef.current?.pointerUp()}
            rollEnabled={inking && rollerLoaded}
            onRollStart={onRollStart}
            onRollMove={onRollMove}
            onRollEnd={onRollEnd}
          >
            <WoodBlockFrame width={blockW} height={blockH}>
              <CarveBlock
                ref={carveRef}
                width={blockW}
                height={blockH}
                motif={blockMotif}
                tip={TIPS[tipIdx].radius}
                active={!carved}
                ink={ink}
                onProgress={setProgress}
                onComplete={setCarved}
              />

              {inking && (
                <Animated.View
                  pointerEvents="none"
                  style={[styles.rollerLayer, { width: blockW * 0.84 }, rollerStyle]}
                >
                  <InkRoller
                    width={blockW * 0.84}
                    inkColor={inkColor}
                    loaded={rollerLoaded}
                  />
                </Animated.View>
              )}
            </WoodBlockFrame>
          </CarveWorkbench>
        </View>

        {!carved && (
          <View style={styles.tips}>
            {TIPS.map((t, i) => (
              <Chip
                key={t.key}
                label={t.en}
                selected={i === tipIdx}
                accessibilityLabel={`Đầu khắc ${t.vi} / ${t.en} tip`}
                onPress={() => {
                  setTipIdx(i);
                  void Haptics.selectionAsync();
                }}
                leading={
                  <View
                    style={[
                      styles.tipDot,
                      { width: t.dot, height: t.dot, borderRadius: t.dot / 2 },
                    ]}
                  />
                }
              />
            ))}
          </View>
        )}

        {inking && (
          <View style={styles.plates}>
            {INK_PLATES.map((plate) => (
              <Pressable
                key={plate.id}
                accessibilityLabel={`Đĩa mực ${plate.labelVi} / ${plate.labelEn} ink`}
                onPress={dipBlack}
              >
                <InkPlate
                  color={plate.color}
                  labelVi={plate.labelVi}
                  labelEn={plate.labelEn}
                  selected={dippedInk === plate.id}
                  dipped={dippedInk === plate.id && rollerLoaded}
                />
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.hintVi}>{hintVi}</Text>
        <Text style={styles.hintEn}>{hintEn}</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.inkBlack + '40',
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.accentGold,
  },
  inkFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.inkBlack,
  },
  rollerLayer: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 8,
  },
  tips: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  tipDot: {
    backgroundColor: Colors.inkBlack,
  },
  plates: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    alignItems: 'flex-start',
  },
  hintVi: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.inkBlack,
    marginTop: Spacing.lg,
    textAlign: 'center',
  },
  hintEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.7,
    textAlign: 'center',
  },
});
