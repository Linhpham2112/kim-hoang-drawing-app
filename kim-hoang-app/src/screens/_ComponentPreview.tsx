import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ColorSwatch } from '../components/ColorSwatch';
import { ProgressDots } from '../components/ProgressDots';
import { TOTAL_STEPS } from '../data/stepGuides';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

/**
 * TEMPORARY dev preview for Phase 2 components. Not part of the real flow.
 * Wired as the first route in AppNavigator so it can be exercised on-device.
 * Remove this screen (and its route) once the components are integrated.
 */

const SWATCH_COLORS = [
  { color: Colors.inkBlack, vi: 'Đen', en: 'Black' },
  { color: Colors.pigmentRed, vi: 'Đỏ', en: 'Red' },
  { color: Colors.pigmentYellow, vi: 'Vàng', en: 'Yellow' },
  { color: Colors.pigmentWhite, vi: 'Trắng', en: 'White' },
  { color: Colors.pigmentIndigo, vi: 'Chàm', en: 'Indigo' },
] as const;

export function ComponentPreview() {
  const insets = useSafeAreaInsets();

  const [buttonPresses, setButtonPresses] = useState(0);
  const [cardSelected, setCardSelected] = useState<0 | 1 | null>(null);
  const [swatchIndex, setSwatchIndex] = useState(0);
  const [step, setStep] = useState(1);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing.lg,
          paddingBottom: insets.bottom + Spacing.xxl,
          paddingLeft: insets.left + Spacing.lg,
          paddingRight: insets.right + Spacing.lg,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Component Preview</Text>

      {/* 1. Buttons */}
      <Text style={styles.sectionLabel}>1. Button — presses: {buttonPresses}</Text>
      <View style={styles.stack}>
        <Button
          labelVi="Bắt đầu vẽ!"
          labelEn="Start painting"
          accessibilityLabel="Bắt đầu vẽ / Start painting"
          onPress={() => setButtonPresses((n) => n + 1)}
        />
        <Button
          labelVi="Quay lại"
          labelEn="Go back"
          variant="secondary"
          accessibilityLabel="Quay lại / Go back"
          onPress={() => setButtonPresses((n) => n + 1)}
        />
        <Button
          labelVi="Bị khoá"
          labelEn="Disabled"
          disabled
          accessibilityLabel="Nút bị khoá / Disabled button"
          onPress={() => setButtonPresses((n) => n + 1)}
        />
      </View>

      {/* 2. Cards */}
      <Text style={styles.sectionLabel}>
        2. Card — selected: {cardSelected === null ? 'none' : cardSelected + 1}
      </Text>
      <View style={styles.row}>
        <Card
          accessibilityLabel="Con lợn / Pig"
          selected={cardSelected === 0}
          onPress={() => setCardSelected((s) => (s === 0 ? null : 0))}
        >
          <Text style={styles.cardEmoji}>🐷</Text>
          <Text style={styles.cardVi}>Con Lợn</Text>
          <Text style={styles.cardEn}>Pig</Text>
        </Card>
        <Card
          accessibilityLabel="Con gà / Rooster"
          selected={cardSelected === 1}
          onPress={() => setCardSelected((s) => (s === 1 ? null : 1))}
        >
          <Text style={styles.cardEmoji}>🐓</Text>
          <Text style={styles.cardVi}>Con Gà</Text>
          <Text style={styles.cardEn}>Rooster</Text>
        </Card>
        <Card
          accessibilityLabel="Tự vẽ, sắp ra mắt / Custom, coming soon"
          disabled
          overlayLabel="Sắp ra mắt / Coming soon"
          onPress={() => undefined}
        >
          <Text style={styles.cardEmoji}>➕</Text>
          <Text style={styles.cardVi}>Tự Vẽ</Text>
          <Text style={styles.cardEn}>Custom</Text>
        </Card>
      </View>

      {/* 3. Color swatches */}
      <Text style={styles.sectionLabel}>
        3. ColorSwatch — selected: {SWATCH_COLORS[swatchIndex].vi} / {SWATCH_COLORS[swatchIndex].en}
      </Text>
      <View style={styles.row}>
        {SWATCH_COLORS.map((c, i) => (
          <ColorSwatch
            key={c.en}
            color={c.color}
            selected={swatchIndex === i}
            accessibilityLabel={`${c.vi} / ${c.en}`}
            onPress={() => setSwatchIndex(i)}
          />
        ))}
      </View>

      {/* 4. Progress dots */}
      <Text style={styles.sectionLabel}>4. ProgressDots — step {step} / {TOTAL_STEPS}</Text>
      <View style={styles.dotsBlock}>
        <ProgressDots current={step} />
        <View style={styles.stepControls}>
          <Button
            labelVi="−"
            variant="secondary"
            accessibilityLabel="Giảm bước / Decrease step"
            onPress={() => setStep((s) => Math.max(1, s - 1))}
          />
          <Button
            labelVi="+"
            variant="secondary"
            accessibilityLabel="Tăng bước / Increase step"
            onPress={() => setStep((s) => Math.min(TOTAL_STEPS, s + 1))}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.paperRed,
  },
  content: {
    gap: Spacing.md,
  },
  heading: {
    fontFamily: Fonts.display,
    fontSize: FontSize.display,
    color: Colors.colorWhite,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  sectionLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.colorWhite,
    marginTop: Spacing.lg,
  },
  stack: {
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  cardEmoji: {
    fontSize: 48,
  },
  cardVi: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.heading,
    color: Colors.colorWhite,
  },
  cardEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.colorWhite,
    opacity: 0.85,
  },
  dotsBlock: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  stepControls: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
});
