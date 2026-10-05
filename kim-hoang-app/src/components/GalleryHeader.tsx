import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Fonts, LineHeight, Spacing } from '../theme/tokens';

export function GalleryHeader({
  titleVi,
  titleEn,
  onBack,
}: {
  titleVi: string;
  titleEn: string;
  onBack: () => void;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quay lại / Go back"
        onPress={onBack}
        style={styles.backButton}
      >
        <Text style={styles.backText}>←</Text>
      </Pressable>
      <View style={styles.titles}>
        <Text style={styles.titleVi}>{titleVi}</Text>
        <Text style={styles.titleEn}>{titleEn}</Text>
      </View>
      <View style={styles.backPlaceholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
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
    color: Colors.inkBlack,
  },
  titles: {
    flex: 1,
  },
  titleVi: {
    fontFamily: Fonts.display,
    fontSize: FontSize.heading,
    lineHeight: FontSize.heading * LineHeight.viet,
    color: Colors.inkBlack,
    textAlign: 'center',
  },
  titleEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.75,
    textAlign: 'center',
  },
});
