import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text } from 'react-native';

import { GalleryShell } from '../components/GalleryShell';
import { GalleryTile } from '../components/GalleryTile';
import { findGalleryAlbum } from '../data/gallery';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'GalleryAlbum'>;

export function GalleryAlbumScreen({ navigation, route }: Props) {
  const album = findGalleryAlbum(route.params.albumId);
  const layout = useLayout();
  const columns = layout.isTablet || layout.isLandscape ? 3 : 2;
  const gap = Spacing.md;
  const tileW =
    (Math.min(layout.contentMaxWidth, layout.width - Spacing.md * 2) - gap * (columns - 1)) /
    columns;

  if (!album) {
    return (
      <GalleryShell titleVi="Bộ Kiều" titleEn="Album" onBack={() => navigation.goBack()}>
        <Text style={styles.missing}>Không tìm thấy bộ tranh / Album not found</Text>
      </GalleryShell>
    );
  }

  return (
    <GalleryShell
      titleVi={album.titleVi}
      titleEn={album.titleEn}
      onBack={() => navigation.goBack()}
    >
      <FlatList
        data={album.works}
        key={columns}
        numColumns={columns}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={columns > 1 ? { gap } : undefined}
        contentContainerStyle={[styles.list, { maxWidth: layout.contentMaxWidth, gap }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        ListHeaderComponent={
          <Text style={styles.intro}>
            Mini album · {album.works.length} tranh Truyện Kiều{'\n'}
            Eight prints from The Tale of Kiều
          </Text>
        }
        renderItem={({ item, index }) => (
          <GalleryTile
            work={item}
            width={tileW}
            meta={`${index + 1} / ${album.works.length}`}
            onPress={() => navigation.navigate('GalleryWork', { workId: item.id })}
          />
        )}
      />
    </GalleryShell>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: 'center',
    width: '100%',
    flexGrow: 1,
    paddingVertical: Spacing.md,
  },
  missing: {
    fontFamily: Fonts.body,
    fontSize: FontSize.body,
    color: Colors.inkBlack,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  intro: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.75,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: FontSize.small * 1.5,
  },
});
