import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { STEP_GUIDES, type GuideId } from '../data/stepGuides';
import { Colors, FontSize, Fonts, LineHeight, Radius, Spacing } from '../theme/tokens';
import { Button } from './Button';
import { PaperTexture } from './texture/PaperTexture';

interface InstructionPopupProps {
  guideId: GuideId;
  visible: boolean;
  onDismiss: () => void;
  /** Expand past a padded parent so the wash covers the whole screen. */
  coverInset?: { top: number; left: number; right: number; bottom: number };
}

/**
 * Full-screen instruction card in Vietnamese — paper sheet on ink wash,
 * chu-sa seal with the step number. Blocks the step until the child taps through.
 */
export function InstructionPopup({
  guideId,
  visible,
  onDismiss,
  coverInset,
}: InstructionPopupProps) {
  const guide = STEP_GUIDES[guideId];
  const opacity = useSharedValue(0);
  const lift = useSharedValue(18);

  useEffect(() => {
    if (!visible) {
      opacity.value = 0;
      lift.value = 18;
      return;
    }
    opacity.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.quad) });
    lift.value = withTiming(0, { duration: 320, easing: Easing.out(Easing.cubic) });
  }, [visible, opacity, lift]);

  const washStyle = useAnimatedStyle(() => ({ opacity: opacity.value * 0.72 }));
  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: lift.value }],
  }));

  if (!visible) return null;

  return (
    <View
      accessibilityViewIsModal
      importantForAccessibility="yes"
      style={[
        styles.layer,
        coverInset && {
          top: -coverInset.top,
          left: -coverInset.left,
          right: -coverInset.right,
          bottom: -coverInset.bottom,
        },
      ]}
    >
      <Animated.View pointerEvents="auto" style={[styles.wash, washStyle]} />
      <Animated.View style={[styles.card, cardStyle]}>
        <View style={styles.textureClip} pointerEvents="none">
          <PaperTexture variant="cream" intensity={0.35} seed={13} />
        </View>
        <View style={styles.seal}>
          <Text style={styles.sealText}>{guide.step}</Text>
        </View>
        <Text style={styles.eyebrow}>Hướng dẫn</Text>
        <Text style={styles.title}>{guide.title}</Text>
        <View style={styles.rule} />
        {guide.lines.map((line) => (
          <Text key={line} style={styles.line}>
            {line}
          </Text>
        ))}
        <View style={styles.cta}>
          <Button
            labelVi={guide.cta}
            accessibilityLabel={guide.cta}
            onPress={() => {
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onDismiss();
            }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  wash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.inkBrown,
  },
  card: {
    zIndex: 1,
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.surfacePaper,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: 2,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    overflow: 'visible',
    marginTop: 22,
  },
  textureClip: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    borderRadius: 2,
  },
  seal: {
    position: 'absolute',
    top: -18,
    right: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accentMadder,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  sealText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.heading,
    color: Colors.pigmentWhite,
  },
  eyebrow: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.accentMadder,
    marginBottom: Spacing.xs,
    zIndex: 1,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: FontSize.heading,
    color: Colors.inkBlack,
    lineHeight: FontSize.heading * LineHeight.viet,
    zIndex: 1,
  },
  rule: {
    height: 2,
    backgroundColor: Colors.inkBlack,
    opacity: 0.18,
    marginVertical: Spacing.md,
  },
  line: {
    fontFamily: Fonts.body,
    fontSize: FontSize.body,
    color: Colors.inkBlack,
    lineHeight: FontSize.body * LineHeight.viet,
    marginBottom: Spacing.sm,
    zIndex: 1,
  },
  cta: {
    marginTop: Spacing.md,
    zIndex: 1,
  },
});
