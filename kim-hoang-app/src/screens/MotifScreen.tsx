import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { type ReactNode, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { preloadPigAssets } from '../assets/motifs/pigAssets';
import { PigMotif } from '../assets/motifs/PigMotif';
import { preloadRoosterAssets } from '../assets/motifs/roosterAssets';
import { RoosterMotif } from '../assets/motifs/RoosterMotif';
import { Card } from '../components/Card';
import { ScreenShell } from '../components/ScreenShell';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { type Motif, useAppStore } from '../store/useAppStore';
import { MOTIF_ASPECT } from '../utils/rect';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Motif'>;

function WarmPulse({ active, children }: { active: boolean; children: ReactNode }) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (active) {
      opacity.value = withRepeat(
        withSequence(withTiming(0.62, { duration: 320 }), withTiming(1, { duration: 320 })),
        -1,
        false,
      );
    } else {
      cancelAnimation(opacity);
      opacity.value = 1;
    }
  }, [active, opacity]);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

export function MotifScreen({ navigation }: Props) {
  const motif = useAppStore((s) => s.motif);
  const setMotif = useAppStore((s) => s.setMotif);
  const layout = useLayout();
  const wide = layout.isLandscape || layout.isTablet;
  const artW = wide ? 112 : 92;
  const artH = artW / MOTIF_ASPECT;
  const [warming, setWarming] = useState(false);

  useEffect(() => {
    void preloadRoosterAssets();
    void preloadPigAssets();
  }, []);

  const pick = async (m: Motif) => {
    if (warming && m === 'rooster') return;
    setMotif(m);
    if (m === 'rooster') {
      setWarming(true);
      try {
        await preloadRoosterAssets();
      } catch {
        // Fade-in on carve/paper still covers a cold decode.
      }
      setWarming(false);
    }
    navigation.navigate('Carve');
  };

  return (
    <ScreenShell
      step={2}
      titleVi="Chọn mộc bản gỗ"
      titleEn="Choose a woodblock"
      onBack={() => navigation.goBack()}
      guideId="motif"
    >
      <View style={[styles.grid, wide && styles.gridWide]}>
        <Card
          accessibilityLabel="Con Lợn / Pig"
          selected={motif === 'pig'}
          onPress={() => pick('pig')}
        >
          <View style={styles.tile}>
            <PigMotif width={artW} height={artH} />
          </View>
          <Text style={styles.labelVi}>Con Lợn</Text>
          <Text style={styles.labelEn}>Pig</Text>
        </Card>

        <Card
          accessibilityLabel="Con Gà / Rooster"
          selected={motif === 'rooster' || warming}
          onPress={() => void pick('rooster')}
        >
          <WarmPulse active={warming}>
            <View style={styles.tile}>
              <RoosterMotif width={artW} height={artH} mode="outline" />
            </View>
          </WarmPulse>
          <Text style={styles.labelVi}>Con Gà</Text>
          <Text style={styles.labelEn}>Rooster</Text>
        </Card>

        <Card
          accessibilityLabel="Tự vẽ, sắp ra mắt / Custom, coming soon"
          disabled
          overlayLabel="Sắp ra mắt / Coming soon"
          onPress={() => undefined}
        >
          <View style={[styles.customArt, { width: artW, height: artH }]}>
            <Text style={styles.customPlus}>+</Text>
          </View>
          <Text style={styles.labelVi}>Tự Vẽ</Text>
          <Text style={styles.labelEn}>Custom</Text>
        </Card>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  gridWide: {
    flexWrap: 'nowrap',
  },
  labelVi: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.inkBlack,
  },
  labelEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.7,
  },
  tile: {
    backgroundColor: Colors.paperChuSa,
    borderRadius: 8,
    padding: Spacing.xs,
  },
  customArt: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  customPlus: {
    fontFamily: Fonts.display,
    fontSize: 72,
    color: Colors.inkBlack,
    opacity: 0.7,
  },
});
