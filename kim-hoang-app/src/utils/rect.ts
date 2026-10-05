/**
 * The scanned Kim Hoàng artwork is the source of truth for proportions:
 * `1472 × 2016` → a portrait rectangle. The woodblock, the paper, and the
 * finished painting all use this ratio. Never square.
 */
export const MOTIF_WIDTH = 1472;
export const MOTIF_HEIGHT = 2016;
export const MOTIF_ASPECT = MOTIF_WIDTH / MOTIF_HEIGHT; // ≈ 0.7302 (w / h)

/**
 * How large the woodblock is on the paper (width / paper width).
 * Same fraction applies to height because both share MOTIF_ASPECT.
 * Pig is larger (no poem). Rooster leaves room for calligraphy.
 */
export const ROOSTER_PRINT_SCALE = 0.804;
export const PIG_PRINT_SCALE = 0.94;
export const PRINT_SCALE = ROOSTER_PRINT_SCALE;

/** How much of the rooster stamp may hang off each edge (left / right / top / bottom). */
export const ROOSTER_STAMP_OVERFLOW = { left: 0.4, right: 0.08, top: 0.08, bottom: 0.4 };

export function printScaleFor(motif: 'pig' | 'rooster' | 'custom' | null): number {
  return motif === 'pig' ? PIG_PRINT_SCALE : ROOSTER_PRINT_SCALE;
}

export interface StampPos {
  nx: number;
  ny: number;
}

export const DEFAULT_PRINT_POS: StampPos = { nx: 0.5, ny: 0.5 };
/** Poem width as a fraction of paper width. Smaller than the sheet so it can be dragged. */
export const POEM_SCALE = 0.7;
/** How much of the poem plate may hang off each edge (lets it sit high or to the side). */
export const POEM_OVERFLOW = 0.45;
/** Centre, sitting near the top of the sheet. */
export const DEFAULT_POEM_POS: StampPos = { nx: 0.5, ny: 0.34 };

/** Poem height / paper height for a given poem aspect (w/h). */
export function poemHeightScale(poemAspect: number): number {
  return (POEM_SCALE * MOTIF_ASPECT) / poemAspect;
}

export function clampPoemPos(nx: number, ny: number, poemAspect: number): StampPos {
  const mx = POEM_SCALE / 2;
  const my = poemHeightScale(poemAspect) / 2;
  const ox = POEM_SCALE * POEM_OVERFLOW;
  const oy = poemHeightScale(poemAspect) * POEM_OVERFLOW;
  return {
    nx: Math.min(1 - mx + ox, Math.max(mx - ox, nx)),
    ny: Math.min(1 - my + oy, Math.max(my - oy, ny)),
  };
}

/** Keep a stamp of `scale` on the paper. Rooster may hang off left and bottom. */
export function clampStampPos(
  nx: number,
  ny: number,
  scale: number = PRINT_SCALE,
  motif: 'pig' | 'rooster' | 'custom' | null = null,
): StampPos {
  const m = scale / 2;
  if (motif === 'rooster') {
    const { left, right, top, bottom } = ROOSTER_STAMP_OVERFLOW;
    return {
      nx: Math.min(1 - m + scale * right, Math.max(m - scale * left, nx)),
      ny: Math.min(1 - m + scale * bottom, Math.max(m - scale * top, ny)),
    };
  }
  return {
    nx: Math.min(1 - m, Math.max(m, nx)),
    ny: Math.min(1 - m, Math.max(m, ny)),
  };
}

export function clampNorm(nx: number, ny: number, margin = 0.08): StampPos {
  return {
    nx: Math.min(1 - margin, Math.max(margin, nx)),
    ny: Math.min(1 - margin, Math.max(margin, ny)),
  };
}

/** Pixel frame of a stamp centred at `pos` on a paper of `paperW`×`paperH`. */
export function stampRect(
  paperW: number,
  paperH: number,
  pos: StampPos,
  scale: number = PRINT_SCALE,
): { left: number; top: number; width: number; height: number } {
  const width = paperW * scale;
  const height = paperH * scale;
  return {
    left: pos.nx * paperW - width / 2,
    top: pos.ny * paperH - height / 2,
    width,
    height,
  };
}

/**
 * Fit the largest rectangle of `aspect` (w/h) inside a `maxW × maxH` box.
 * Returns rounded integer dimensions.
 */
export function fitRect(
  maxW: number,
  maxH: number,
  aspect: number = MOTIF_ASPECT,
): { width: number; height: number } {
  let width = maxW;
  let height = width / aspect;
  if (height > maxH) {
    height = maxH;
    width = height * aspect;
  }
  return { width: Math.round(width), height: Math.round(height) };
}
