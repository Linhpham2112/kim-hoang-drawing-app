import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, type SharedValue, useSharedValue, withTiming } from 'react-native-reanimated';

import { BrushCursor } from '../components/BrushCursor';
import { paperHex } from '../components/PaintingView';
import { PigStamp } from '../components/PigStamp';
import { RoosterStamp } from '../components/RoosterStamp';
import { ColorSwatch } from '../components/ColorSwatch';
import { ScreenShell } from '../components/ScreenShell';
import {
  nextPigInk,
  PIG_BRUSH_SWATCHES,
  PIG_INK_ORDER,
  pigInkComplete,
  pigInkPlate,
} from '../data/pigInk';
import {
  nextRoosterInk,
  ROOSTER_BRUSH_SWATCHES,
  ROOSTER_INK_ORDER,
  roosterInkComplete,
  roosterInkPlate,
} from '../data/roosterInk';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/useAppStore';
import { DEFAULT_PRINT_POS, fitRect, printScaleFor, stampRect } from '../utils/rect';
import { Colors, FontSize, Fonts, Radius, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Color'>;

/** Finger travel, in stamp-heights, to finish one ink pass. */
const RUB_PASSES = 1.8;

export function ColorScreen({ navigation }: Props) {
  const motif = useAppStore((s) => s.motif);

  useEffect(() => {
    if (motif !== 'pig' && motif !== 'rooster') {
      navigation.replace('Motif');
    }
  }, [motif, navigation]);

  if (motif === 'rooster') {
    return <RoosterColorScreen navigation={navigation} />;
  }
  if (motif !== 'pig') {
    return null;
  }
  return <PigColorScreen navigation={navigation} />;
}

function PigColorScreen({ navigation }: Pick<Props, 'navigation'>) {
  const pigInkLayers = useAppStore((s) => s.pigInkLayers);
  const revealPigInkLayer = useAppStore((s) => s.revealPigInkLayer);
  const undoPigInkLayer = useAppStore((s) => s.undoPigInkLayer);

  return (
    <SequentialRubScreen
      navigation={navigation}
      titleVi="Tô trắng con lợn"
      titleEn="Rub in the white"
      order={PIG_INK_ORDER}
      swatches={PIG_BRUSH_SWATCHES}
      revealed={pigInkLayers}
      nextLayer={nextPigInk(pigInkLayers)}
      done={pigInkComplete(pigInkLayers)}
      plate={pigInkPlate}
      reveal={revealPigInkLayer}
      undo={undoPigInkLayer}
      renderStamp={(w, h, revealed, pending, pendingOpacity) => (
        <PigStamp
          width={w}
          height={h}
          revealedLayers={revealed}
          pendingLayer={pending}
          pendingOpacity={pendingOpacity}
          ghost
        />
      )}
    />
  );
}

function RoosterColorScreen({ navigation }: Pick<Props, 'navigation'>) {
  const roosterInkLayers = useAppStore((s) => s.roosterInkLayers);
  const revealRoosterInkLayer = useAppStore((s) => s.revealRoosterInkLayer);
  const undoRoosterInkLayer = useAppStore((s) => s.undoRoosterInkLayer);

  return (
    <SequentialRubScreen
      navigation={navigation}
      titleVi="Tô màu con gà"
      titleEn="Rub in the colours"
      order={ROOSTER_INK_ORDER}
      swatches={ROOSTER_BRUSH_SWATCHES}
      revealed={roosterInkLayers}
      nextLayer={nextRoosterInk(roosterInkLayers)}
      done={roosterInkComplete(roosterInkLayers)}
      plate={roosterInkPlate}
      reveal={revealRoosterInkLayer}
      undo={undoRoosterInkLayer}
      renderStamp={(w, h, revealed, pending, pendingOpacity) => (
        <RoosterStamp
          width={w}
          height={h}
          revealedLayers={revealed}
          pendingLayer={pending}
          pendingOpacity={pendingOpacity}
          ghost
        />
      )}
    />
  );
}

function SequentialRubScreen<Id extends string>({
  navigation,
  titleVi,
  titleEn,
  order,
  swatches,
  revealed,
  nextLayer,
  done,
  plate,
  reveal,
  undo,
  renderStamp,
}: {
  navigation: Pick<Props, 'navigation'>['navigation'];
  titleVi: string;
  titleEn: string;
  order: readonly Id[];
  swatches: ReadonlyArray<{ id: Id; color: string; labelVi: string; labelEn: string }>;
  revealed: Id[];
  nextLayer: Id | null;
  done: boolean;
  plate: (id: Id) => { labelVi: string; labelEn: string } | undefined;
  reveal: (id: Id) => void;
  undo: () => void;
  renderStamp: (
    width: number,
    height: number,
    revealed: Id[],
    pending: Id | null,
    pendingOpacity: SharedValue<number>,
  ) => ReactNode;
}) {
  const motif = useAppStore((s) => s.motif);
  const paperColor = useAppStore((s) => s.paperColor);
  const printPos = useAppStore((s) => s.printPos) ?? DEFAULT_PRINT_POS;
  const printRot = useAppStore((s) => s.printRot) ?? 0;
  const layout = useLayout();

  const info = nextLayer ? plate(nextLayer) : null;

  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const travelRef = useRef(0);
  const finishingRef = useRef(false);
  const nextLayerRef = useRef<Id | null>(nextLayer);
  const armedRef = useRef(false);
  const [armed, setArmed] = useState(false);
  const [passProgress, setPassProgress] = useState(0);
  const pendingOpacity = useSharedValue(0);
  const brushX = useSharedValue(0);
  const brushY = useSharedValue(0);
  const brushVisible = useSharedValue(0);
  const activeColor =
    nextLayer != null
      ? (swatches.find((s) => s.id === nextLayer)?.color ?? Colors.inkBlack)
      : Colors.inkBlack;

  nextLayerRef.current = nextLayer;
  armedRef.current = armed;

  const { width: paperW, height: paperH } = fitRect(
    Math.min(layout.shortEdge * 0.72, 300),
    layout.height * 0.48,
  );
  const stamp = stampRect(paperW, paperH, printPos, printScaleFor(motif));
  const travelTarget = stamp.height * RUB_PASSES;

  useEffect(() => {
    travelRef.current = 0;
    finishingRef.current = false;
    lastPos.current = null;
    pendingOpacity.value = 0;
    setPassProgress(0);
    setArmed(false);
    brushX.value = stamp.width * 0.5;
    brushY.value = stamp.height * 0.42;
  }, [nextLayer, pendingOpacity, brushX, brushY]);

  useEffect(() => {
    brushVisible.value = withTiming(armed && !done ? 1 : 0, { duration: 160 });
  }, [armed, done, brushVisible]);

  const completeLayer = (layer: Id) => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    pendingOpacity.value = 1;
    reveal(layer);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const addTravel = (x: number, y: number, isStart: boolean) => {
    const layer = nextLayerRef.current;
    if (!layer || finishingRef.current || !armedRef.current) return;
    brushX.value = x;
    brushY.value = y;
    if (isStart) {
      lastPos.current = { x, y };
      travelRef.current += 14;
    } else {
      const prev = lastPos.current;
      lastPos.current = { x, y };
      if (!prev) return;
      const dist = Math.hypot(x - prev.x, y - prev.y);
      if (dist < 3) return;
      travelRef.current += dist;
    }
    const p = Math.min(1, travelRef.current / travelTarget);
    pendingOpacity.value = p;
    setPassProgress(p);
    if (p >= 1) completeLayer(layer);
  };

  const endRub = () => {
    lastPos.current = null;
  };

  const pan = Gesture.Pan()
    .enabled(!done && armed)
    .minPointers(1)
    .maxPointers(1)
    .onBegin((e) => {
      runOnJS(addTravel)(e.x, e.y, true);
    })
    .onUpdate((e) => {
      runOnJS(addTravel)(e.x, e.y, false);
    })
    .onEnd(() => {
      runOnJS(endRub)();
    });

  const pickPlate = (id: Id) => {
    if (revealed.includes(id)) return;
    if (id !== nextLayer) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    setArmed(true);
    void Haptics.selectionAsync();
  };

  const pass = revealed.length + 1;

  return (
    <ScreenShell
      step={7}
      titleVi={titleVi}
      titleEn={titleEn}
      onBack={() => navigation.goBack()}
      onNext={done ? () => navigation.navigate('Poem') : undefined}
      nextLabel="Tiếp theo / Next"
      scroll={false}
      guideId="color"
    >
      {!done && (
        <View style={[styles.paintTrack, { width: paperW }]}>
          <View style={[styles.paintFill, { width: `${Math.round(passProgress * 100)}%` }]} />
        </View>
      )}
      <View
        style={[
          styles.canvas,
          { width: paperW, height: paperH, backgroundColor: paperHex(paperColor) },
        ]}
      >
        <GestureDetector gesture={pan}>
          <View
            collapsable={false}
            style={{
              position: 'absolute',
              left: stamp.left,
              top: stamp.top,
              width: stamp.width,
              height: stamp.height,
              transform: [{ rotate: `${printRot}deg` }],
            }}
          >
            {renderStamp(stamp.width, stamp.height, revealed, armed ? nextLayer : null, pendingOpacity)}
            <BrushCursor x={brushX} y={brushY} visible={brushVisible} color={activeColor} />
          </View>
        </GestureDetector>
      </View>

      <View style={styles.swatchRow}>
        {swatches.map((s) => {
          const finished = revealed.includes(s.id);
          const isNext = s.id === nextLayer;
          const selected = isNext && armed;
          return (
            <View key={s.id} style={!isNext && !finished ? styles.swatchDim : undefined}>
              <ColorSwatch
                color={s.color}
                compact
                selected={selected}
                disabled={finished}
                accessibilityLabel={`${s.labelVi} / ${s.labelEn}`}
                onPress={() => pickPlate(s.id)}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.actions}>
        <Pressable
          accessibilityLabel="Hoàn tác màu / Undo colour"
          disabled={revealed.length === 0}
          onPress={() => {
            undo();
            void Haptics.selectionAsync();
          }}
          style={[styles.undoBtn, revealed.length === 0 && styles.undoDisabled]}
        >
          <Text style={styles.undoText}>Hoàn tác / Undo</Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>
        {done
          ? 'Đã tô xong — chạm Tiếp theo\nFinished — tap Next'
          : info && !armed
            ? `Chạm đĩa ${info.labelVi} (${pass}/${order.length}) rồi kéo bút lông\nTap ${info.labelEn} (${pass}/${order.length}), then brush`
            : info
              ? `Kéo bút lông ${info.labelVi} (${pass}/${order.length}) — ${Math.round(passProgress * 100)}%\nBrush ${info.labelEn} (${pass}/${order.length}) — hover until it fills`
              : ''}
      </Text>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  canvas: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.inkBlack,
    borderRadius: 6,
    overflow: 'hidden',
  },
  paintTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.inkBlack + '33',
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    alignSelf: 'center',
  },
  paintFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.accentGold,
  },
  swatchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  swatchDim: {
    opacity: 0.4,
  },
  actions: {
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  undoBtn: {
    minHeight: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.inkBlack,
    backgroundColor: Colors.surfacePaper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  undoDisabled: {
    opacity: 0.45,
  },
  undoText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
  },
  hint: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});
