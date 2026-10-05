import { useFocusEffect } from '@react-navigation/native';
import { type ReactNode, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TOTAL_STEPS, type GuideId } from '../data/stepGuides';
import { useLayout } from '../hooks/useLayout';
import { useAppStore } from '../store/useAppStore';
import { Colors, FontSize, Fonts, LineHeight, Radius, Spacing } from '../theme/tokens';
import { PaperTexture } from './texture/PaperTexture';
import { InstructionPopup } from './InstructionPopup';

interface ScreenShellProps {
  step: number;
  titleVi: string;
  titleEn: string;
  children?: ReactNode;
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  showBack?: boolean;
  /** When false, content cannot scroll — needed on Carve so drag-gouge doesn't pan the page. */
  scroll?: boolean;
  /** Vietnamese how-to card shown whenever this step appears. */
  guideId?: GuideId;
  /**
   * `paper` = cream working surface (tools / tutorial).
   * `red` = art surface (welcome, finished print).
   */
  surface?: 'paper' | 'red';
}

export function ScreenShell({
  step,
  titleVi,
  titleEn,
  children,
  onBack,
  onNext,
  nextLabel = 'Tiếp theo / Next',
  showBack = true,
  scroll = true,
  guideId,
  surface = 'paper',
}: ScreenShellProps) {
  const insets = useSafeAreaInsets();
  const layout = useLayout();
  const markGuideSeen = useAppStore((s) => s.markGuideSeen);
  const [guideOpen, setGuideOpen] = useState(() => Boolean(guideId));

  useFocusEffect(
    useCallback(() => {
      if (guideId) setGuideOpen(true);
    }, [guideId]),
  );

  const pad = {
    top: insets.top + Spacing.sm,
    bottom: insets.bottom + Spacing.sm,
    left: insets.left + Spacing.md,
    right: insets.right + Spacing.md,
  };

  const isRed = surface === 'red';
  const inkOnSurface = isRed ? Colors.pigmentWhite : Colors.inkBlack;

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: pad.top,
          paddingBottom: pad.bottom,
          paddingLeft: pad.left,
          paddingRight: pad.right,
          backgroundColor: isRed ? Colors.surfaceRed : Colors.surfacePaper,
        },
      ]}
    >
      {isRed ? <PaperTexture variant="red" intensity={0.65} seed={3} /> : null}

      <View style={[styles.header, layout.isLandscape && styles.headerLandscape]}>
        {showBack && onBack ? (
          <Pressable
            accessibilityLabel="Quay lại / Go back"
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: inkOnSurface }]}>←</Text>
          </Pressable>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
        <View style={styles.titles}>
          <Text
            style={[
              styles.titleVi,
              { color: inkOnSurface },
              layout.isLandscape && styles.titleViLandscape,
            ]}
          >
            {titleVi}
          </Text>
          <Text style={[styles.titleEn, { color: inkOnSurface }]}>{titleEn}</Text>
        </View>
        <View style={styles.meta}>
          <Text style={[styles.step, { color: inkOnSurface }]}>{step}/{TOTAL_STEPS}</Text>
          {guideId ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Xem lại hướng dẫn"
              onPress={() => setGuideOpen(true)}
              style={[
                styles.help,
                isRed
                  ? { backgroundColor: Colors.inkBlack, borderColor: Colors.pigmentWhite }
                  : { backgroundColor: Colors.surfacePaper, borderColor: Colors.inkBlack },
              ]}
            >
              <Text style={[styles.helpMark, { color: isRed ? Colors.pigmentWhite : Colors.inkBlack }]}>
                ?
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          style={styles.scroll}
          bounces
          alwaysBounceVertical={false}
          overScrollMode="never"
        >
          <View style={[styles.body, { maxWidth: layout.contentMaxWidth }]}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.scroll, styles.scrollOpen]}>
          <View
            style={[
              styles.scrollContent,
              styles.bodyOpen,
              { maxWidth: layout.contentMaxWidth, width: '100%', flex: 1, alignSelf: 'center' },
            ]}
          >
            {children}
          </View>
        </View>
      )}

      {onNext ? (
        <Pressable
          accessibilityLabel={nextLabel}
          onPress={onNext}
          style={[
            styles.nextButton,
            { maxWidth: layout.contentMaxWidth, alignSelf: 'center', width: '100%' },
            isRed ? styles.nextOnRed : styles.nextOnPaper,
          ]}
        >
          <Text
            style={[
              styles.nextText,
              { color: isRed ? Colors.inkBlack : Colors.pigmentWhite },
            ]}
          >
            {nextLabel}
          </Text>
        </Pressable>
      ) : null}

      {guideId ? (
        <InstructionPopup
          guideId={guideId}
          visible={guideOpen}
          coverInset={pad}
          onDismiss={() => {
            setGuideOpen(false);
            markGuideSeen(guideId);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'space-between',
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    zIndex: 1,
  },
  headerLandscape: {
    marginBottom: Spacing.xs,
  },
  backButton: {
    minWidth: 80,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backPlaceholder: {
    width: 80,
  },
  backText: {
    fontSize: 28,
  },
  titles: {
    flex: 1,
  },
  meta: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  titleVi: {
    fontFamily: Fonts.display,
    fontSize: FontSize.heading,
    lineHeight: FontSize.heading * LineHeight.viet,
  },
  titleViLandscape: {
    fontSize: FontSize.body + 4,
    lineHeight: (FontSize.body + 4) * 1.4,
  },
  titleEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    opacity: 0.75,
  },
  step: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    opacity: 0.55,
  },
  help: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpMark: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
  },
  scroll: {
    flex: 1,
    zIndex: 1,
  },
  scrollOpen: {
    overflow: 'visible',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    overflow: 'visible',
  },
  body: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyOpen: {
    overflow: 'visible',
  },
  nextButton: {
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.md,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    zIndex: 1,
  },
  nextOnPaper: {
    backgroundColor: Colors.inkBlack,
  },
  nextOnRed: {
    backgroundColor: Colors.pigmentWhite,
  },
  nextText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    textAlign: 'center',
  },
});
