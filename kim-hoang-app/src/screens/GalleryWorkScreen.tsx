import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { GalleryShell } from '../components/GalleryShell';
import { ZoomableImage } from '../components/ZoomableImage';
import { findGalleryWork } from '../data/gallery';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'GalleryWork'>;

export function GalleryWorkScreen({ navigation, route }: Props) {
  const work = findGalleryWork(route.params.workId);
  const layout = useLayout();
  const imageW = Math.min(layout.contentMaxWidth, layout.width - Spacing.md * 2);
  const imageH = Math.min(layout.height * 0.62, imageW * 1.4);

  if (!work) {
    return (
      <GalleryShell titleVi="Tranh" titleEn="Artwork" onBack={() => navigation.goBack()}>
        <Text style={styles.missing}>Không tìm thấy tranh / Artwork not found</Text>
      </GalleryShell>
    );
  }

  return (
    <GalleryShell titleVi={work.titleVi} titleEn={work.titleEn} onBack={() => navigation.goBack()}>
      <View style={styles.body}>
        <Text style={styles.hint}>Chụm chỗ muốn xem, rồi kéo / Pinch that spot, then drag</Text>
        <ZoomableImage key={String(work.id)} source={work.source} width={imageW} height={imageH} />
        <Text style={styles.artist}>{work.artist}</Text>
      </View>
    </GalleryShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  hint: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.65,
    textAlign: 'center',
  },
  artist: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.7,
  },
  missing: {
    fontFamily: Fonts.body,
    fontSize: FontSize.body,
    color: Colors.inkBlack,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});
