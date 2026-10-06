import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { STEP_GUIDES, type GuideId, type GuideLang } from '../data/stepGuides';
import { useAppStore } from '../store/useAppStore';
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
 * Full-screen instruction card — paper sheet on ink wash, chu-sa seal
 * with the step number. One language at a time: stacking Việt + English
 * on Color / Carve / Poem overflows a phone sheet. Choice sticks across stages.
 */
export function InstructionPopup({
  guideId,
  visible,
  onDismiss,
  coverInset,
}: InstructionPopupProps) {
  const guide = STEP_GUIDES[guideId];
  const lang = useAppStore((s) => s.guideLang);
  const setGuideLang = useAppStore((s) => s.setGuideLang);
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

  const isVi = lang === 'vi';
  const title = isVi ? guide.titleVi : guide.titleEn;
  const lines = isVi ? guide.linesVi : guide.linesEn;
  const cta = isVi ? guide.ctaVi : guide.ctaEn;
  const eyebrow = isVi ? 'Hướng dẫn' : 'How to';

  const pickLang = (next: GuideLang) => {
    if (next === lang) return;
    void Haptics.selectionAsync();
    setGuideLang(next);
  };

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
        <View style={styles.langRow}>
          <LangChip label="Việt" selected={isVi} onPress={() => pickLang('vi')} />
          <LangChip label="English" selected={!isVi} onPress={() => pickLang('en')} />
        </View>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.rule} />
        {lines.map((line) => (
          <Text key={line} style={styles.line}>
            {line}
          </Text>
        ))}
        <View style={styles.cta}>
          <Button
            labelVi={cta}
            accessibilityLabel={`${guide.ctaVi} / ${guide.ctaEn}`}
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

function LangChip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
      hitSlop={Spacing.sm}
      onPress={onPress}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff]}
    >
      <Text style={[styles.chipText, selected ? styles.chipTextOn : styles.chipTextOff]}>{label}</Text>
    </Pressable>
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
  langRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    zIndex: 1,
    paddingRight: 52,
  },
  chip: {
    borderWidth: 2,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  chipOn: {
    backgroundColor: Colors.inkBlack,
  },
  chipOff: {
    backgroundColor: 'transparent',
  },
  chipText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.small,
  },
  chipTextOn: {
    color: Colors.pigmentWhite,
  },
  chipTextOff: {
    color: Colors.inkBlack,
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
