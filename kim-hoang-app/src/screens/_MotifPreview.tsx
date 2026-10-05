import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PigMotif } from '../assets/motifs/PigMotif';
import { RoosterMotif } from '../assets/motifs/RoosterMotif';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

/**
 * TEMPORARY preview screen (Agent 2 — Motifs). NOT part of the real flow.
 * Wired as the first screen by AppNavigator.tsx while verifying the motifs.
 * Delete this file and revert AppNavigator.tsx when done.
 */
export function MotifPreviewScreen() {
  const insets = useSafeAreaInsets();
  const [note] = useState('Traced SVGs from stakeholder references');

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      <Text style={styles.title}>Motif Preview (Agent 2)</Text>
      <Text style={styles.note}>{note}</Text>

      <Text style={styles.section}>1 · Lợn / Pig</Text>
      <View style={styles.row}>
        <View style={styles.cell}>
          <View style={styles.paper}>
            <PigMotif width={150} height={150} />
          </View>
          <Text style={styles.caption}>black ink + reserved white; red is paper</Text>
        </View>
      </View>

      <Text style={styles.section}>2 · Gà / Rooster — B&W vs coloured trace</Text>
      <View style={styles.row}>
        <View style={styles.cell}>
          <View style={styles.paper}>
            <RoosterMotif width={150} height={150} mode="outline" />
          </View>
          <Text style={styles.caption}>roosterBlack.ts</Text>
        </View>
        <View style={styles.cell}>
          <View style={styles.paper}>
            <RoosterMotif width={150} height={150} mode="solid" />
          </View>
          <Text style={styles.caption}>roosterArt.ts</Text>
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
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.heading,
    color: Colors.colorWhite,
    marginBottom: Spacing.sm,
  },
  note: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.colorWhite,
    opacity: 0.85,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  section: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.colorWhite,
    marginTop: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cell: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  caption: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.colorWhite,
    opacity: 0.85,
  },
  paper: {
    backgroundColor: Colors.paperChuSa,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: 4,
  },
});
