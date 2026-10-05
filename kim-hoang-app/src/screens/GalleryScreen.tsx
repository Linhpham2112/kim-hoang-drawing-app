import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { GalleryAlbumPacket } from '../components/GalleryAlbumPacket';
import { GalleryShell } from '../components/GalleryShell';
import { GalleryTile } from '../components/GalleryTile';
import { GALLERY_ALBUMS, GALLERY_WORKS } from '../data/gallery';
import { useLayout } from '../hooks/useLayout';
import type { RootStackParamList } from '../navigation/types';
import { Colors, FontSize, Fonts, Spacing } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Gallery'>;

export function GalleryScreen({ navigation }: Props) {
  const layout = useLayout();
  const columns = layout.isTablet || layout.isLandscape ? 3 : 2;
  const gap = Spacing.md;
  const contentW = Math.min(layout.contentMaxWidth, layout.width - Spacing.md * 2);
  const tileW = (contentW - gap * (columns - 1)) / columns;

  return (
    <GalleryShell
      titleVi="Tranh nghệ nhân"
      titleEn="Artists' gallery"
      onBack={() => navigation.goBack()}
    >
      <FlatList
        data={GALLERY_WORKS}
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
          <View style={{ width: contentW }}>
            {GALLERY_ALBUMS.map((album) => (
              <GalleryAlbumPacket
                key={album.id}
                album={album}
                width={contentW}
                onPress={() => navigation.navigate('GalleryAlbum', { albumId: album.id })}
              />
            ))}
            <Text style={styles.sectionVi}>Tranh lẻ</Text>
            <Text style={styles.sectionEn}>Single prints</Text>
          </View>
        }
        renderItem={({ item }) => (
          <GalleryTile
            work={item}
            width={tileW}
            meta={item.artist}
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
  sectionVi: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.body,
    color: Colors.inkBlack,
    marginBottom: 2,
  },
  sectionEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.7,
    marginBottom: Spacing.md,
  },
});
