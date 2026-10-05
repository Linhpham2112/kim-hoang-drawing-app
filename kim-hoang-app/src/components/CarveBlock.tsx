import MaskedView from '@react-native-masked-view/masked-view';
import * as Haptics from 'expo-haptics';
import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

import { PIG_BLACK } from '../assets/motifs/pigBlack';
import { PIG_GRID_ROWS, PIG_RAISED } from '../assets/motifs/pigCarveGrid';
import { PIG_LINES } from '../assets/motifs/pigLineArt';
import { ROOSTER_LINE_ART, ROOSTER_RELIEF } from '../assets/motifs/roosterAssets';
import { ROOSTER_GRID_ROWS, ROOSTER_RAISED } from '../assets/motifs/roosterCarveGrid';
import { CarveGouge } from './CarveGouge';
import { FadeInImage } from './FadeInImage';
import { WoodChips } from './WoodChips';
import { WoodSurface } from './WoodSurface';
import { Colors } from '../theme/tokens';

/**
 * CarveBlock — coverage-based relief carving on a portrait-rectangle block
 * (matches the scan ratio; see `MOTIF_ASPECT`). No frame/box around it.
 *
 * Relief truth: only the BLACK-ink region prints, so only that stays RAISED
 * (`PIG_BLACK` solid body, or `ROOSTER_BLACK` outline from rooster_bw.svg).
 * Rooster art is centered at ~50% of the block face — wood shows around it.
 * Groove overlays (`PIG_LINES` / `ROOSTER_LINES`) guide the chisel.
 *
 * One action = one chisel cut (real carving). A tap is a single short bite
 * along the grain; a drag is overlapping bites along the finger path. Tip size
 * is the *width* of that one groove, not how many marks spawn. Strokes may
 * overlap. An invisible 16×22 grid tracks coverage so finishing requires
 * clearing ~92% of carveable cells.
 *
 * pinch-zoom, and a brief dent on each chisel hit.
 */
interface CarveBlockProps {
  width: number;
  height: number;
  motif: 'pig' | 'rooster';
  tip: number; // carve radius in cells (0 = fine, 1 = medium, 2 = wide)
  active: boolean;
  ink: SharedValue<number>;
  onProgress: (p: number) => void;
  onComplete: () => void;
}

const COLS = 16;
/** Fraction of carveable grid cells that must be cleared before the block is done. */
const COMPLETE_AT = 0.92;
const RELIEF_SHADOW = { x: 2.5, y: 3 };
const RELIEF_HIGHLIGHT = { x: -1.2, y: -1.2 };
/** Groove width as a fraction of cell size — Fine / Medium / Wide, strongly stepped. */
const TIP_WIDTH = [0.16, 0.7, 2.15];
/** One mallet-tap bite length, in cells, by tip (wide tool also takes a longer bite). */
const TAP_LENGTH = [1.15, 1.7, 2.6];
/** Grain direction of the plank (degrees). Taps cut with the grain. */
const GRAIN_DEG = 8;

interface Stroke {
  id: number;
  cx: number;
  cy: number;
  length: number;
  width: number;
  angle: number;
}

export interface CarveHandle {
  pointerDown: (x: number, y: number) => void;
  pointerMove: (x: number, y: number) => void;
  pointerUp: () => void;
}

export const CarveBlock = forwardRef<CarveHandle, CarveBlockProps>(function CarveBlock(
  { width, height, motif, tip, active, ink, onProgress, onComplete },
  ref,
) {
  const isPig = motif === 'pig';
  const cell = width / COLS;
  const rows = isPig ? PIG_GRID_ROWS : ROOSTER_GRID_ROWS;
  const raisedCells = isPig ? PIG_RAISED : ROOSTER_RAISED;

  const carvedRef = useRef<Set<number>>(new Set());
  const strokesRef = useRef<Stroke[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const [, force] = useState(0);
  const lastRender = useRef(0);
  const lastHaptic = useRef(0);
  const doneRef = useRef(false);
  const burstCount = useRef(0);
  const strokeId = useRef(0);
  const [burst, setBurst] = useState<{ x: number; y: number; n: number } | null>(null);
  const [floorFilled, setFloorFilled] = useState(false);
  const dent = useSharedValue(1);

  // Which cells are RAISED = the design (protected, can't be carved). Pig =
  // solid black body; rooster = outline + feather hatch ribs only.
  const raised = useCallback(
    (r: number, c: number) => raisedCells[r * COLS + c] ?? false,
    [raisedCells],
  );

  // Total carveable (negative) cells — the completion target.
  const negativeTotal = useMemo(() => {
    let n = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < COLS; c += 1) if (!raised(r, c)) n += 1;
    }
    return n;
  }, [rows, raised]);

  const inkStyle = useAnimatedStyle(() => ({
    opacity: ink.value,
  }));
  const guideStyle = useAnimatedStyle(() => ({
    opacity: (isPig ? 0.95 : 1) * (1 - ink.value),
  }));
  const dentStyle = useAnimatedStyle(() => ({ transform: [{ scale: dent.value }] }));

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const s = carvedRef.current;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < COLS; c += 1) if (!raised(r, c)) s.add(r * COLS + c);
    }
    setFloorFilled(true);
    force((v) => v + 1);
    onProgress(1);
    onComplete();
  }, [rows, raised, onProgress, onComplete]);

  const stampStroke = useCallback(
    (cx: number, cy: number, length: number, grooveW: number, angleDeg: number) => {
      const s = carvedRef.current;
      const rad = (angleDeg * Math.PI) / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);
      const steps = Math.max(4, Math.ceil(length / (cell * 0.4)));
      const half = length / 2;
      const radius = grooveW / 2;
      const pad = Math.ceil(radius / cell) + 1;
      for (let i = 0; i <= steps; i += 1) {
        const t = i / steps;
        const px = cx + dx * (t * length - half);
        const py = cy + dy * (t * length - half);
        const col = Math.floor(px / cell);
        const row = Math.floor(py / cell);
        for (let r = row - pad; r <= row + pad; r += 1) {
          for (let c = col - pad; c <= col + pad; c += 1) {
            if (c < 0 || r < 0 || c >= COLS || r >= rows) continue;
            if (raised(r, c)) continue;
            const ccx = (c + 0.5) * cell;
            const ccy = (r + 0.5) * cell;
            const ddx = px - ccx;
            const ddy = py - ccy;
            if (ddx * ddx + ddy * ddy <= (radius + cell * 0.15) ** 2) {
              s.add(r * COLS + c);
            }
          }
        }
      }
    },
    [cell, rows, raised],
  );

  const addStroke = useCallback(
    (cx: number, cy: number, length: number, grooveW: number, angle: number, x: number, y: number) => {
      const stroke: Stroke = {
        id: (strokeId.current += 1),
        cx,
        cy,
        length,
        width: grooveW,
        angle,
      };
      strokesRef.current = [...strokesRef.current, stroke];
      stampStroke(cx, cy, length, grooveW, angle);

      const now = Date.now();
      if (now - lastHaptic.current > 90) {
        lastHaptic.current = now;
        void Haptics.impactAsync(
          stroke.id === 1 || now - lastRender.current > 200
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light,
        );
      }
      burstCount.current += 1;
      setBurst({ x, y, n: burstCount.current });
      dent.value = withSequence(withTiming(0.97, { duration: 45 }), withTiming(1, { duration: 140 }));

      const p = negativeTotal ? Math.min(1, carvedRef.current.size / negativeTotal) : 0;
      if (now - lastRender.current > 24) {
        lastRender.current = now;
        setStrokes(strokesRef.current);
        onProgress(p);
      } else {
        setStrokes(strokesRef.current);
        onProgress(p);
      }
      if (p >= COMPLETE_AT) finish();
    },
    [stampStroke, negativeTotal, onProgress, finish, dent],
  );

  const carveAt = useCallback(
    (x: number, y: number, isStart: boolean) => {
      if (!active || doneRef.current) return;
      if (x < 0 || y < 0 || x > width || y > height) return;

      const col = Math.floor(x / cell);
      const row = Math.floor(y / cell);
      const onRaised =
        col >= 0 && row >= 0 && col < COLS && row < rows && raised(row, col);

      const grooveW = cell * (TIP_WIDTH[tip] ?? TIP_WIDTH[1]);
      const tapLen = cell * (TAP_LENGTH[tip] ?? TAP_LENGTH[1]);

      if (isStart) {
        lastPos.current = { x, y };
        if (onRaised) return;
        const jitter = ((strokeId.current * 17) % 11) - 5;
        addStroke(x, y, tapLen, grooveW, GRAIN_DEG + jitter, x, y);
        return;
      }

      const prev = lastPos.current;
      if (!prev) {
        lastPos.current = { x, y };
        return;
      }
      const dx = x - prev.x;
      const dy = y - prev.y;
      const dist = Math.hypot(dx, dy);
      // One new bite only after the chisel has travelled ~a bite length.
      if (dist < tapLen * 0.55) return;
      lastPos.current = { x, y };
      if (onRaised) return;
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      addStroke((prev.x + x) / 2, (prev.y + y) / 2, dist, grooveW, angle, x, y);
    },
    [active, width, height, cell, rows, raised, tip, addStroke],
  );

  useImperativeHandle(
    ref,
    () => ({
      pointerDown: (x, y) => carveAt(x, y, true),
      pointerMove: (x, y) => carveAt(x, y, false),
      pointerUp: () => {
        lastPos.current = null;
      },
    }),
    [carveAt],
  );

  // Rooster line work is huge (400+ paths); a pre-rendered PNG mask avoids
  // re-parsing ~1 MB of XML three times on mount. Pig stays vector.
  const pigReliefMask = <SvgXml xml={PIG_BLACK} width={width} height={height} />;

  return (
    <View style={[styles.block, { width, height }]}>
      <Animated.View style={[StyleSheet.absoluteFill, dentStyle]} pointerEvents="none">
        {/* smooth uncarved surface */}
        <View style={StyleSheet.absoluteFill}>
          <WoodSurface width={width} height={height} tone="raised" />
        </View>

        {/* when the block is done, remaining gaps become recessed wood */}
        {floorFilled && (
          <View style={StyleSheet.absoluteFill}>
            <WoodSurface width={width} height={height} tone="carved" />
          </View>
        )}

        {/* one View per chisel cut — taps and drag-bites overlap freely */}
        <View style={StyleSheet.absoluteFill}>
          {strokes.map((g) => (
            <CarveGouge
              key={g.id}
              seed={g.id}
              cx={g.cx}
              cy={g.cy}
              length={g.length}
              width={g.width}
              angle={g.angle}
            />
          ))}
        </View>

        {/* shadow the raised relief casts onto the carved floor (top-left light) */}
        {isPig ? (
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <View
              style={{
                width,
                height,
                transform: [
                  { translateX: RELIEF_SHADOW.x },
                  { translateY: RELIEF_SHADOW.y },
                ],
              }}
            >
              {pigReliefMask}
            </View>
          }
        >
          <View style={[StyleSheet.absoluteFill, styles.reliefShadow]} />
        </MaskedView>
        ) : null}

        {/* raised relief — pig body stands proud; rooster stays flat pencil-on-wood */}
        {isPig ? (
        <MaskedView style={StyleSheet.absoluteFill} maskElement={pigReliefMask}>
          <WoodSurface width={width} height={height} tone="raised" />
        </MaskedView>
        ) : null}

        {/* highlight lip on the top-left edge of the standing relief */}
        {isPig ? (
        <MaskedView
          style={StyleSheet.absoluteFill}
          maskElement={
            <View
              style={{
                width,
                height,
                transform: [
                  { translateX: RELIEF_HIGHLIGHT.x },
                  { translateY: RELIEF_HIGHLIGHT.y },
                ],
              }}
            >
              {pigReliefMask}
            </View>
          }
        >
          <View style={[StyleSheet.absoluteFill, styles.reliefHighlight]} />
        </MaskedView>
        ) : null}

        {/* transfer drawing / groove lines — guide on the block; fades as ink rolls on */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.center, guideStyle]}>
          {isPig ? (
            <SvgXml xml={PIG_LINES} width={width} height={height} />
          ) : (
            <FadeInImage source={ROOSTER_RELIEF} style={{ width, height }} resizeMode="stretch" />
          )}
        </Animated.View>

        {/* black ink on the relief as the brayer rolls */}
        {isPig ? (
          <Animated.View style={[StyleSheet.absoluteFill, inkStyle]}>
            <SvgXml xml={PIG_BLACK} width={width} height={height} />
          </Animated.View>
        ) : (
          <Animated.Image
            source={ROOSTER_LINE_ART}
            resizeMode="stretch"
            style={[{ width, height, position: 'absolute' }, inkStyle]}
          />
        )}

        {/* wood chips burst at the carve point */}
        {burst && (
          <View style={[styles.burst, { left: burst.x, top: burst.y }]}>
            <WoodChips trigger={burst.n} />
          </View>
        )}
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: Colors.surfaceWoodLight,
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reliefShadow: {
    backgroundColor: 'rgba(90, 60, 30, 0.22)',
  },
  reliefHighlight: {
    backgroundColor: 'rgba(255, 250, 240, 0.35)',
  },
  burst: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
});
