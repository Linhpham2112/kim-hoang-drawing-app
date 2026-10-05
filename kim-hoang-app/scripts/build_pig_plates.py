"""Rebuild pig.svg derivatives: reserved-white plate + picker art.

Same pixel grid as the raster (no rescale). A small inset clears leftover
scan marks. Black ink and paper red stay on the stamp / the sheet.
"""

from __future__ import annotations

import colorsys
import re
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets/references/pig.svg"
OUT = ROOT / "assets/motifs"
ART = ROOT / "src/assets/motifs/pigArt.ts"
SIZE = (736, 1008)
# Keep the frame; just hide a rim so corner drips never become “paint”.
INSET = 0.02
PAPER = (0xD3, 0x01, 0x01)
# Reserved white (điệp), not the pink the scanner saw on red paper.
WHITE = (0xED, 0xE8, 0xD8, 255)


def is_paper(r: int, g: int, b: int) -> bool:
    if abs(r - PAPER[0]) < 22 and abs(g - PAPER[1]) < 22 and abs(b - PAPER[2]) < 22:
        return True
    _h, _s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    # Saturated red the sheet already owns — not a line.
    return (r - max(g, b)) > 70 and v < 0.86


def is_black(r: int, g: int, b: int) -> bool:
    _h, _s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
    return v < 0.20


def render_source() -> Image.Image:
    tmp = Path(tempfile.gettempdir()) / "pig-src.png"
    subprocess.check_call(
        [
            "magick",
            "-background",
            "none",
            str(SRC),
            "-resize",
            f"{SIZE[0]}x{SIZE[1]}",
            f"PNG32:{tmp}",
        ]
    )
    return Image.open(tmp).convert("RGBA")


def write_white_plate(src: Image.Image) -> None:
    w, h = src.size
    pixels = src.load()
    assert pixels is not None

    pad_x = max(1, round(w * INSET))
    pad_y = max(1, round(h * INSET))
    white = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    white_px = white.load()
    assert white_px is not None

    kept = 0
    for y in range(pad_y, h - pad_y):
        for x in range(pad_x, w - pad_x):
            r, g, b, a = pixels[x, y]
            if a < 20 or is_black(r, g, b) or is_paper(r, g, b):
                continue
            white_px[x, y] = WHITE
            kept += 1

    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / "pig-ink-white.png"
    white.save(dest, "PNG")
    print(f"inset {pad_x}×{pad_y}px  white lines {kept}  {dest}")


def drop_paper_plate(svg: str) -> str:
    """Remove the full-sheet chu-sa rectangle so the pig sits on app paper."""

    def keep(match: re.Match[str]) -> str:
        chunk = match.group(0)
        fill = re.search(r"fill:\s*(#[0-9A-Fa-f]{3,8})", chunk)
        if not fill:
            return chunk
        if fill.group(1).upper() != "#D30101":
            return chunk
        if "1472" in chunk and "2016" in chunk:
            return ""
        return chunk

    return re.sub(r"<path\b[^>]*/>", keep, svg)


def write_pig_art() -> None:
    raw = SRC.read_text()
    raw = re.sub(r"<\?xml[^>]*\?>", "", raw).strip()
    raw = drop_paper_plate(raw)
    tmp = Path(tempfile.gettempdir()) / "pig-art.svg"
    tmp.write_text(raw)
    try:
        subprocess.check_call(
            ["npx", "--yes", "svgo", str(tmp), "-o", str(tmp)],
            cwd=str(ROOT),
        )
        raw = tmp.read_text().strip()
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass
    ART.write_text(
        "// Auto-generated from assets/references/pig.svg (paper plate dropped).\n"
        f"export const PIG_ART = `{raw}`;\n"
    )
    print(f"picker art  {ART.stat().st_size} bytes")


def main() -> None:
    write_white_plate(render_source())
    write_pig_art()


if __name__ == "__main__":
    main()
