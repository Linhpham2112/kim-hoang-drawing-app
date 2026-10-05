#!/usr/bin/env python3
"""Retrace the pig plates from assets/references/IMG_2442.JPG.

Black ink + reserved white only. Red is the paper, never a plate.
Drops the scan-edge halo and loose strokes outside the animal.

Needs: potrace (brew), numpy, pillow, scipy.

    python3 scripts/build.py
"""

from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ROOT = Path(__file__).resolve().parents[1]
SCAN = ROOT / "assets/references/IMG_2442.JPG"
REF = ROOT / "assets/references"
MOTIFS = ROOT / "src/assets/motifs"

# Low red = ink (paper and reserved white both have high R).
BLACK_R = 0.35
# Reserved white: high green and blue (paper is almost G=B=0).
WHITE_GB = 0.45
# Dust holes in the ink, in pixels. Larger holes are spiral / folds / eye.
DUST_HOLE = 90
# Rim around the silhouette — JPEG halo, not ornament.
RIM_PX = 6
# Head-notch box for the ear/snout cloud (scan is 1472×2016).
CLOUD = (450, 380, 720, 560)


def main() -> None:
    rgb = np.asarray(Image.open(SCAN).convert("RGB"))
    h, w = rgb.shape[:2]
    r_ch, g_ch, b_ch = [rgb[:, :, i].astype(np.int16) for i in range(3)]

    black = r_ch < int(BLACK_R * 255)
    white = np.minimum(g_ch, b_ch) > int(WHITE_GB * 255)

    labels, n = ndi.label(black)
    sizes = ndi.sum(black, labels, index=np.arange(1, n + 1))
    body = labels == int(np.argmax(sizes) + 1)

    filled = ndi.binary_fill_holes(body)
    holes = filled & ~body
    h_labels, hn = ndi.label(holes)
    for i in range(1, hn + 1):
        if int((h_labels == i).sum()) < DUST_HOLE:
            body[h_labels == i] = True

    filled = ndi.binary_fill_holes(body)
    dist_in = ndi.distance_transform_edt(filled)
    dist_out = ndi.distance_transform_edt(~filled)
    outer_rim = (filled & (dist_in <= RIM_PX)) | ((~filled) & (dist_out <= RIM_PX))

    w_labels, wn = ndi.label(white)
    w_sizes = ndi.sum(white, w_labels, index=np.arange(1, wn + 1))
    giant_id = int(np.argmax(w_sizes) + 1)

    interior = np.zeros_like(white)
    for i in range(1, wn + 1):
        if i == giant_id:
            continue
        comp = w_labels == i
        if int(comp.sum()) < 60:
            continue
        ys, xs = np.where(comp)
        if xs.min() <= 2 or ys.min() <= 2 or xs.max() >= w - 3 or ys.max() >= h - 3:
            continue
        if not np.any(comp & filled):
            continue
        interior[comp] = True

    yy = np.arange(h)[:, None]
    xx = np.arange(w)[None, :]
    x0, y0, x1, y1 = CLOUD
    cloud = (
        white
        & ~filled
        & (yy >= y0)
        & (yy <= y1)
        & (xx >= x0)
        & (xx <= x1)
        & (dist_out > 3)
    )
    ornaments = (interior | cloud) & ~outer_rim

    eroded = ndi.binary_erosion(body, iterations=2)
    lines = (body & ~eroded) | ornaments

    preview = np.broadcast_to(np.array([0xD3, 0x01, 0x01], dtype=np.uint8), rgb.shape).copy()
    preview[body] = (0x1A, 0x10, 0x08)
    preview[ornaments] = (0xED, 0xE8, 0xD8)
    Image.fromarray(preview).save(REF / "trace/pig_preview.png")

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        body_svg = trace(body, work / "body")
        orn_svg = trace(ornaments, work / "ornaments")
        line_svg = trace(lines, work / "lines")

    write_ts(
        MOTIFS / "pigBlack.ts",
        "PIG_BLACK",
        "// Black ink from IMG_2442. Red is the paper behind — never painted.\n"
        "// Interior reserves (eye, spiral, folds) stay as holes. Scan-edge junk dropped.",
        body_svg,
    )
    write_ts(
        MOTIFS / "pigOrnaments.ts",
        "PIG_ORNAMENTS",
        "// Reserved white from IMG_2442: ear/snout cloud, eye, spiral, belly folds.\n"
        "// Outer scan halo and paper-edge strokes removed.",
        orn_svg,
    )
    write_ts(
        MOTIFS / "pigLineArt.ts",
        "PIG_LINES",
        "// Carve grooves: pig outline + reserved-white lines. No paper-edge specks.",
        line_svg,
    )

    cols, rows = 16, 22
    cell_w, cell_h = w / cols, h / rows
    bits = []
    for row in range(rows):
        for col in range(cols):
            xa, ya = int(col * cell_w), int(row * cell_h)
            xb, yb = int((col + 1) * cell_w), int((row + 1) * cell_h)
            bits.append("1" if body[ya:yb, xa:xb].mean() >= 0.40 else "0")
    grid = "".join(bits)
    (MOTIFS / "pigCarveGrid.ts").write_text(
        "// Auto-generated from IMG_2442 black-ink mask (16x22).\n"
        "// 1 = RAISED (black ink); 0 = carveable (paper + interior reserves).\n"
        f"export const PIG_GRID_COLS = {cols};\n"
        f"export const PIG_GRID_ROWS = {rows};\n"
        f'export const PIG_RAISED: boolean[] = "{grid}".split("").map((c) => c === "1");\n'
    )

    (REF / "pig_bw.svg").write_text(body_svg + "\n")
    (REF / "trace/blk.min.svg").write_text(body_svg + "\n")
    (REF / "trace/pig_ornaments.min.svg").write_text(orn_svg + "\n")
    (REF / "trace/lines.min.svg").write_text(line_svg + "\n")

    print("body", int(body.sum()), "ornaments", int(ornaments.sum()), "lines", int(lines.sum()))
    print("raised", grid.count("1"), "/", len(grid))
    print("preview", REF / "trace/pig_preview.png")


def trace(mask: np.ndarray, stem: Path) -> str:
    pbm = stem.with_suffix(".pbm")
    svg_path = stem.with_suffix(".svg")
    Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).save(pbm)
    subprocess.run(["potrace", "-s", "-o", str(svg_path), str(pbm)], check=True)
    raw = svg_path.read_text()
    match = re.search(r"<svg\b[^>]*>.*</svg>", raw, flags=re.S)
    if not match:
        raise SystemExit(f"no svg in {svg_path}")
    svg = match.group(0)
    svg = re.sub(r"<metadata>.*?</metadata>", "", svg, flags=re.S)
    svg = re.sub(r'\sversion="1.0"', "", svg, count=1)
    svg = svg.replace('width="1472.000000pt" height="2016.000000pt" ', "")
    svg = svg.replace('viewBox="0 0 1472.000000 2016.000000"', 'viewBox="0 0 1472 2016"')
    svg = re.sub(r"\s+", " ", svg).replace("> <", "><")
    return svg


def write_ts(path: Path, name: str, header: str, svg: str) -> None:
    path.write_text(f"{header}\nexport const {name} = `{svg}`;\n")
    print("wrote", path.relative_to(ROOT), path.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
