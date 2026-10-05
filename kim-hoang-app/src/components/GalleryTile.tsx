import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { GalleryWork } from '../data/gallery';
import { Colors, FontSize, Fonts, Radius, Spacing } from '../theme/tokens';

export function GalleryTile({
  work,
  width,
  meta,
  onPress,
}: {
  work: GalleryWork;
  width: number;
  meta: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${work.titleVi} / ${work.titleEn}`}
      onPress={onPress}
      style={[styles.tile, { width }]}
    >
      <View style={styles.frame}>
        <Image source={work.source} style={styles.thumb} resizeMode="cover" />
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {work.titleVi}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {meta}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    marginBottom: Spacing.sm,
  },
  frame: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.inkBlack,
    backgroundColor: Colors.pigmentWhite,
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    marginTop: Spacing.xs,
  },
  meta: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.7,
  },
});
