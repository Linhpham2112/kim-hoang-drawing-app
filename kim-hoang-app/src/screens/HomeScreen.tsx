import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { PigMotif } from '../assets/motifs/PigMotif';
import { Button } from '../components/Button';
import { PrintCard } from '../components/PrintCard';
import { ScreenShell } from '../components/ScreenShell';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { useAppStore } from '../store/useAppStore';
import { MOTIF_ASPECT } from '../utils/rect';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const setCurrentStep = useAppStore((s) => s.setCurrentStep);
  const layout = useLayout();

  const bob = useSharedValue(0);
  useEffect(() => {
    bob.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 900, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [bob]);

  const bobStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bob.value }] }));

  const motifW = Math.min(layout.shortEdge * 0.42, 180);
  const motifH = motifW / MOTIF_ASPECT;

  return (
    <ScreenShell
      step={1}
      titleVi="Tranh Kim Hoàng"
      titleEn="Kim Hoàng Painting"
      showBack={false}
      guideId="home"
      surface="red"
    >
      <View style={styles.hero}>
        <Animated.View style={bobStyle}>
          <PrintCard contentStyle={styles.printPad}>
            <PigMotif width={motifW} height={motifH} />
          </PrintCard>
        </Animated.View>
        <Text style={styles.subtitle}>Chào mừng bé đến làng tranh Kim Hoàng</Text>
        <Text style={styles.subtitleEn}>Welcome to the Kim Hoàng painting village</Text>
      </View>

      <View style={styles.actions}>
        <Button
          labelVi="Bắt đầu vẽ!"
          labelEn="Start painting"
          accessibilityLabel="Bắt đầu vẽ / Start painting"
          variant="secondary"
          onPress={() => {
            setCurrentStep(2);
            navigation.navigate('Motif');
          }}
        />
        <Button
          labelVi="Xem tranh nghệ nhân"
          labelEn="Artists' gallery"
          accessibilityLabel="Xem tranh nghệ nhân / Artists' gallery"
          variant="primary"
          onPress={() => navigation.navigate('Gallery')}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  printPad: {
    padding: Spacing.sm,
  },
  subtitle: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.pigmentWhite,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
  subtitleEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.pigmentWhite,
    opacity: 0.85,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'stretch',
    gap: Spacing.md,
  },
});
