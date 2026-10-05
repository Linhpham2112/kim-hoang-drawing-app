import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import { ROOSTER_POEM_ASPECT } from '../assets/motifs/roosterPoem';
import { Button } from '../components/Button';
import { PaintingView } from '../components/PaintingView';
import { PrintCard } from '../components/PrintCard';
import { ScreenShell } from '../components/ScreenShell';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/useAppStore';
import { clampPoemPos, DEFAULT_POEM_POS, MOTIF_ASPECT } from '../utils/rect';
import { Colors, FontSize, Fonts, LineHeight, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Poem'>;

export function PoemScreen({ navigation }: Props) {
  const motif = useAppStore((s) => s.motif);
  const poemAdded = useAppStore((s) => s.poemAdded);
  const poemPos = useAppStore((s) => s.poemPos) ?? DEFAULT_POEM_POS;
  const addPoem = useAppStore((s) => s.addPoem);
  const setPoemPos = useAppStore((s) => s.setPoemPos);
  const layout = useLayout();

  const width = Math.min(layout.shortEdge * 0.55, 260);
  const height = width / MOTIF_ASPECT;

  const startNx = useSharedValue(poemPos.nx);
  const startNy = useSharedValue(poemPos.ny);

  useEffect(() => {
    if (motif !== 'pig' && motif !== 'rooster') {
      navigation.replace('Motif');
    }
  }, [motif, navigation]);

  if (motif !== 'pig' && motif !== 'rooster') {
    return null;
  }

  if (motif === 'pig') {
    return (
      <ScreenShell
        step={8}
        titleVi="Góc thơ"
        titleEn="Add the poem"
        onBack={() => navigation.goBack()}
        onNext={() => {
          useAppStore.getState().setCurrentStep(9);
          navigation.navigate('Done');
        }}
        nextLabel="Xong! / Done ✓"
        scroll={false}
        guideId="poemPig"
      >
        <PrintCard texture={false} contentStyle={styles.printPad}>
          <PaintingView width={width} framed={false} />
        </PrintCard>
        <Text style={styles.reasonVi}>Con lợn đã to đủ rồi — không cần thêm thơ.</Text>
        <Text style={styles.reasonEn}>
          The pig is already big enough — no poem on this print.
        </Text>
      </ScreenShell>
    );
  }

  const stampPoem = (nx?: number, ny?: number) => {
    if (nx != null && ny != null) {
      setPoemPos(clampPoemPos(nx, ny, ROOSTER_POEM_ASPECT));
    }
    addPoem();
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const movePoem = (nx: number, ny: number) => {
    setPoemPos(clampPoemPos(nx, ny, ROOSTER_POEM_ASPECT));
  };

  const nudge = () => {
    void Haptics.selectionAsync();
  };

  const drag = Gesture.Pan()
    .enabled(poemAdded)
    .onStart(() => {
      startNx.value = poemPos.nx;
      startNy.value = poemPos.ny;
    })
    .onUpdate((e) => {
      runOnJS(movePoem)(startNx.value + e.translationX / width, startNy.value + e.translationY / height);
    })
    .onEnd(() => {
      runOnJS(nudge)();
    });

  return (
    <ScreenShell
      step={8}
      titleVi="Góc thơ"
      titleEn="Add the poem"
      onBack={() => navigation.goBack()}
      onNext={poemAdded ? () => navigation.navigate('Done') : undefined}
      nextLabel="Xong! / Done ✓"
      scroll={false}
      guideId="poem"
    >
      <GestureDetector gesture={drag}>
        <View>
          <PrintCard texture={false} contentStyle={styles.printPad}>
            <PaintingView
              width={width}
              framed={false}
              poemGhost
              onPressPosition={poemAdded ? undefined : (nx, ny) => stampPoem(nx, ny)}
            />
          </PrintCard>
        </View>
      </GestureDetector>

      <Text style={styles.prompt}>
        {poemAdded
          ? 'Kéo để đổi chỗ / Drag to move it'
          : 'Viết bài thơ mực đen lên giấy đỏ / Write the black-ink poem on the red paper'}
      </Text>

      {!poemAdded ? (
        <View style={styles.action}>
          <Button
            labelVi="Thêm thơ"
            labelEn="Add the poem"
            accessibilityLabel="Thêm thơ / Add the poem"
            onPress={() => stampPoem()}
          />
        </View>
      ) : null}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  printPad: {
    padding: Spacing.xs,
  },
  reasonVi: {
    fontFamily: Fonts.display,
    fontSize: FontSize.body + 2,
    lineHeight: (FontSize.body + 2) * LineHeight.viet,
    color: Colors.inkBlack,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
  reasonEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.75,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  prompt: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.85,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  action: {
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
  },
});
