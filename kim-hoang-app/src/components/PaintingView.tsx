import { forwardRef } from 'react';
import { type GestureResponderEvent, StyleSheet, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { ROOSTER_POEM, ROOSTER_POEM_ASPECT } from '../assets/motifs/roosterPoem';
import { type ActiveMotif, useAppStore } from '../store/useAppStore';
import {
  DEFAULT_POEM_POS,
  DEFAULT_PRINT_POS,
  MOTIF_ASPECT,
  POEM_SCALE,
  printScaleFor,
  stampRect,
} from '../utils/rect';
import { Colors } from '../theme/tokens';
import { PigStamp } from './PigStamp';
import { RoosterStamp } from './RoosterStamp';
import { PaperTexture } from './texture/PaperTexture';

/** Resolve the store's paper key to its hex. Defaults to chu sa. */
export function paperHex(paper: ReturnType<typeof useAppStore.getState>['paperColor']): string {
  return paper === 'son' ? Colors.paperSon : Colors.paperChuSa;
}

/**
 * Stamp on paper — explicit `motif` so pig and rooster never share the wrong art.
 */
export function PrintedMotif({
  motif,
  width,
  height,
  mirrored,
  uncolored,
}: {
  motif: ActiveMotif;
  width: number;
  height: number;
  mirrored?: boolean;
  /** B&W stamp only — no filled colour. */
  uncolored?: boolean;
}) {
  const pigInkLayers = useAppStore((s) => s.pigInkLayers);
  const roosterInkLayers = useAppStore((s) => s.roosterInkLayers);

  let inner;
  if (motif === 'pig') {
    inner = (
      <PigStamp
        width={width}
        height={height}
        revealedLayers={uncolored ? [] : pigInkLayers}
      />
    );
  } else {
    inner = (
      <RoosterStamp
        width={width}
        height={height}
        revealedLayers={uncolored ? [] : roosterInkLayers}
      />
    );
  }

  return (
    <View style={{ width, height, transform: mirrored ? [{ scaleX: -1 }] : [] }}>{inner}</View>
  );
}

/**
 * PaintingView — finished sheet: red paper + stamp (+ colour after rubs).
 * Rooster poem appears only after the add-poem stage.
 */
interface PaintingViewProps {
  width: number;
  onPressPosition?: (nx: number, ny: number) => void;
  /** When false, omit the ink border (e.g. nested inside PrintCard). */
  framed?: boolean;
  /** Faint poem at the current slot before the child stamps it. */
  poemGhost?: boolean;
}

export const PaintingView = forwardRef<View, PaintingViewProps>(function PaintingView(
  { width, onPressPosition, framed = true, poemGhost = false },
  ref,
) {
  const motif = useAppStore((s) => s.motif);
  const paperColor = useAppStore((s) => s.paperColor);
  const printPos = useAppStore((s) => s.printPos) ?? DEFAULT_PRINT_POS;
  const printRot = useAppStore((s) => s.printRot) ?? 0;
  const poemAdded = useAppStore((s) => s.poemAdded);
  const poemPos = useAppStore((s) => s.poemPos) ?? DEFAULT_POEM_POS;

  const height = width / MOTIF_ASPECT;
  const activeMotif: ActiveMotif = motif === 'rooster' ? 'rooster' : 'pig';
  const stamp = stampRect(width, height, printPos, printScaleFor(activeMotif));
  const poemW = width * POEM_SCALE;
  const poemH = poemW / ROOSTER_POEM_ASPECT;
  const showPoem = activeMotif === 'rooster' && (poemAdded || poemGhost);

  const handlePress = (e: GestureResponderEvent) => {
    if (!onPressPosition) return;
    onPressPosition(e.nativeEvent.locationX / width, e.nativeEvent.locationY / height);
  };

  return (
    <View
      ref={ref}
      collapsable={false}
      onStartShouldSetResponder={() => Boolean(onPressPosition)}
      onResponderRelease={handlePress}
      style={[
        styles.painting,
        !framed && styles.paintingUnframed,
        { width, height, backgroundColor: paperHex(paperColor) },
      ]}
    >
      <PaperTexture variant="red" intensity={0.7} seed={19} />
      <View
        pointerEvents="none"
        style={[
          styles.stamp,
          {
            left: stamp.left,
            top: stamp.top,
            width: stamp.width,
            height: stamp.height,
            transform: [{ rotate: `${printRot}deg` }],
          },
        ]}
      >
        <PrintedMotif motif={activeMotif} width={stamp.width} height={stamp.height} />
      </View>

      {showPoem ? (
        <View
          pointerEvents="none"
          style={[
            styles.poem,
            {
              left: poemPos.nx * width - poemW / 2,
              top: poemPos.ny * height - poemH / 2,
              width: poemW,
              height: poemH,
              opacity: poemAdded ? 1 : 0.22,
            },
          ]}
        >
          <SvgXml xml={ROOSTER_POEM} width={poemW} height={poemH} />
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  painting: {
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: Colors.inkBlack,
  },
  paintingUnframed: {
    borderWidth: 0,
  },
  stamp: {
    position: 'absolute',
    zIndex: 2,
  },
  poem: {
    position: 'absolute',
    zIndex: 3,
  },
});
