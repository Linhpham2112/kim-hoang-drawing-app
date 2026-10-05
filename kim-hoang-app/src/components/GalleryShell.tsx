import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors, Spacing } from '../theme/tokens';
import { GalleryHeader } from './GalleryHeader';

export function GalleryShell({
  titleVi,
  titleEn,
  onBack,
  children,
}: {
  titleVi: string;
  titleEn: string;
  onBack: () => void;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.sm,
          paddingLeft: insets.left + Spacing.md,
          paddingRight: insets.right + Spacing.md,
        },
      ]}
    >
      <GalleryHeader titleVi={titleVi} titleEn={titleEn} onBack={onBack} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.surfacePaper,
  },
});
