import { useEffect, useState } from 'react';
import { Image, InteractionManager, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import type { GalleryAlbum, GalleryWork } from '../data/gallery';
import { Colors, FontSize, Fonts, LineHeight, Radius, Spacing } from '../theme/tokens';
import { SPRING_BOUNCY } from '../utils/animations';
import { HardStackShadow } from './texture/HardStackShadow';

/**
 * A wrapped packet of plates — not a single gallery tile.
 * Three real sheets fan behind a title slip so "mini album" is visible at a glance.
 */
export function GalleryAlbumPacket({
  album,
  width,
  onPress,
}: {
  album: GalleryAlbum;
  width: number;
  onPress: () => void;
}) {
  const pressed = useSharedValue(0);
  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1 - pressed.value * 0.03, SPRING_BOUNCY) }],
  }));

  const coverW = Math.min(width * 0.38, 150);
  const coverH = coverW * (4 / 3);
  const fanW = coverW + 80;
  const fanH = coverH + 48;
  const originX = (fanW - coverW) / 2;
  const originY = (fanH - coverH) / 2;
  const count = album.works.length;
  const sheets = fanSheets(album);
  const [fanReady, setFanReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => setFanReady(true));
    return () => task.cancel();
  }, []);

  const visibleSheets = fanReady ? sheets : sheets.slice(-1);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${album.titleVi}, mini album, ${count} tranh / ${album.titleEn}`}
      onPress={onPress}
      onPressIn={() => {
        pressed.value = 1;
      }}
      onPressOut={() => {
        pressed.value = 0;
      }}
      style={{ width }}
    >
      <Animated.View style={[styles.packet, pressStyle]}>
        <View style={[styles.fan, { width: fanW, height: fanH }]}>
          {visibleSheets.map((sheet, i) => (
            <View
              key={`${sheet.work.id}-${i}`}
              pointerEvents="none"
              style={[
                styles.sheetWrap,
                {
                  width: coverW,
                  height: coverH,
                  left: originX,
                  top: originY,
                  zIndex: sheet.z,
                  transform: [
                    { translateX: sheet.x },
                    { translateY: sheet.y },
                    { rotate: `${sheet.rotate}deg` },
                  ],
                },
              ]}
            >
              <HardStackShadow offset={4} />
              <View style={styles.sheet}>
                <Image source={sheet.work.source} style={styles.sheetImage} resizeMode="cover" />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.slip}>
          <View style={styles.slipText}>
            <Text style={styles.kicker}>Mini album · {count} tranh</Text>
            <Text style={styles.titleVi}>{album.titleVi}</Text>
            <Text style={styles.titleEn}>{album.titleEn}</Text>
          </View>
          <View style={styles.seal} accessibilityElementsHidden>
            <Text style={styles.sealCount}>{count}</Text>
            <Text style={styles.sealWord}>tấm</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

function fanSheets(album: GalleryAlbum): {
  work: GalleryWork;
  rotate: number;
  x: number;
  y: number;
  z: number;
}[] {
  const works = album.works;
  const left = works[6] ?? works[1] ?? works[0];
  const right = works[7] ?? works[2] ?? works[0];
  const front = works[0];
  return [
    { work: left, rotate: -12, x: -22, y: 14, z: 1 },
    { work: right, rotate: 10, x: 26, y: 10, z: 2 },
    { work: front, rotate: -2, x: 2, y: 0, z: 3 },
  ];
}

const styles = StyleSheet.create({
  packet: {
    backgroundColor: Colors.surfacePaper,
    borderWidth: 3,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    overflow: 'visible',
  },
  fan: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    overflow: 'visible',
  },
  sheetWrap: {
    position: 'absolute',
    overflow: 'visible',
  },
  sheet: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderWidth: 2.5,
    borderColor: Colors.inkBlack,
    backgroundColor: Colors.surfaceCardRed,
    overflow: 'hidden',
  },
  sheetImage: {
    width: '100%',
    height: '100%',
  },
  slip: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.pigmentWhite,
    borderWidth: 2,
    borderColor: Colors.inkBlack,
    borderRadius: Radius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  slipText: {
    flex: 1,
  },
  kicker: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: FontSize.small,
    color: Colors.accentMadder,
    letterSpacing: 0.4,
  },
  titleVi: {
    fontFamily: Fonts.display,
    fontSize: FontSize.heading,
    lineHeight: FontSize.heading * LineHeight.viet,
    color: Colors.inkBlack,
  },
  titleEn: {
    fontFamily: Fonts.body,
    fontSize: FontSize.small,
    color: Colors.inkBlack,
    opacity: 0.7,
  },
  seal: {
    width: 56,
    height: 56,
    borderRadius: 4,
    borderWidth: 2.5,
    borderColor: Colors.inkBlack,
    backgroundColor: Colors.surfaceRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sealCount: {
    fontFamily: Fonts.display,
    fontSize: FontSize.heading,
    color: Colors.pigmentWhite,
    lineHeight: FontSize.heading,
  },
  sealWord: {
    fontFamily: Fonts.body,
    fontSize: 9,
    color: Colors.pigmentWhite,
    marginTop: -2,
  },
});
