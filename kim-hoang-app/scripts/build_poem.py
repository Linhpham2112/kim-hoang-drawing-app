#!/usr/bin/env python3
"""Bake rooster_poem.svg into the in-app calligraphy stamp.

The VTracer source is a 1280×2784 plate: the poem sits on top, then a leftover
black rectangle fills the rest of the canvas. That rectangle is the blob.
This drops any canvas-sized subpath, tight-crops to the remaining ink, runs
svgo, and writes src/assets/motifs/roosterPoem.ts.

    python3 scripts/build_poem.py
"""

from __future__ import annotations

import re
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets/references/rooster_poem.svg"
OUT_TS = ROOT / "src/assets/motifs/roosterPoem.ts"
PREVIEW = ROOT / "assets/references/trace/poem_preview.png"

INK = "#1A1008"
PAD = 24
# Drop a subpath if it covers most of the source canvas (the leftover plate).
BLOB_W = 0.85
BLOB_H = 0.45


def main() -> None:
    raw = SRC.read_text()
    vb = re.search(r'viewBox="([^"]+)"', raw)
    if not vb:
        raise SystemExit("no viewBox")
    vx, vy, vw, vh = (float(x) for x in vb.group(1).split())

    kept: list[tuple[str, str]] = []
    dropped = 0
    for m in re.finditer(r"<path\b([^>]*)>", raw):
        attrs = m.group(1)
        d_m = re.search(r'\bd="([^"]*)"', attrs)
        tr_m = re.search(r'transform="translate\(([^)]+)\)"', attrs)
        if not d_m:
            continue
        tx = ty = 0.0
        tr = ""
        if tr_m:
            parts = tr_m.group(1).replace(" ", ",").split(",")
            tx, ty = float(parts[0]), float(parts[1])
            tr = f"translate({_num(tx)} {_num(ty)})"
        subs = [s.strip() for s in re.split(r"(?=M)", d_m.group(1)) if s.strip()]
        kept_subs: list[str] = []
        for sub in subs:
            box = _bbox(sub, tx, ty)
            if box and box[2] >= BLOB_W * vw and box[3] >= BLOB_H * vh:
                dropped += 1
                continue
            kept_subs.append(sub)
        if kept_subs:
            kept.append(("".join(kept_subs), tr))

    if dropped == 0:
        raise SystemExit("no canvas plate found — already cleaned, or the source changed")

    body = _svg(kept, vx, vy, vw, vh)
    x0, y0, cw, ch = _ink_viewbox(body)
    cropped = _minify(_svg(kept, x0, y0, cw, ch))
    vb = re.search(r'viewBox="([^"]+)"', cropped)
    if vb:
        nums = [float(x) for x in vb.group(1).split()]
        cw, ch = nums[2], nums[3]

    OUT_TS.write_text(
        "// Auto-generated from assets/references/rooster_poem.svg.\n"
        "// VTracer leftover plate (the black blob under the poem) stripped.\n"
        "// Black ink on red paper — Kim Hoàng calligraphy is never colourised.\n"
        f"export const ROOSTER_POEM_VIEWBOX = {{ width: {int(round(cw))}, height: {int(round(ch))} }} as const;\n"
        "export const ROOSTER_POEM_ASPECT = ROOSTER_POEM_VIEWBOX.width / ROOSTER_POEM_VIEWBOX.height;\n"
        f"export const ROOSTER_POEM = `{cropped}`;\n"
    )

    PREVIEW.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as tmp:
        Path(tmp.name).write_text(cropped)
        subprocess.run(
            [
                "magick",
                "-background",
                "#D30101",
                tmp.name,
                "-alpha",
                "remove",
                "-resize",
                "640x",
                str(PREVIEW),
            ],
            check=True,
        )
        Path(tmp.name).unlink(missing_ok=True)

    print(
        f"dropped {dropped} plate subpath(s), kept {len(kept)} paths, "
        f"viewBox {int(round(cw))}×{int(round(ch))}, "
        f"wrote {OUT_TS.relative_to(ROOT)} ({OUT_TS.stat().st_size} bytes)"
    )
    print("preview", PREVIEW)


def _minify(svg: str) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        src = Path(tmp) / "in.svg"
        dst = Path(tmp) / "out.svg"
        src.write_text(svg)
        subprocess.run(["npx", "--yes", "svgo", str(src), "-o", str(dst), "--multipass"], check=True)
        out = dst.read_text()
    return re.sub(r"\s+", " ", out).replace("> <", "><").strip()


def _svg(paths: list[tuple[str, str]], x: float, y: float, w: float, h: float) -> str:
    parts = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{_num(x)} {_num(y)} {_num(w)} {_num(h)}">'
    ]
    for d, tr in paths:
        attr = f' fill="{INK}"'
        if tr:
            attr += f' transform="{tr}"'
        parts.append(f'<path d="{d}"{attr}/>')
    parts.append("</svg>")
    return "".join(parts)


def _ink_viewbox(svg: str) -> tuple[float, float, float, float]:
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)
        (work / "poem.svg").write_text(svg)
        png = work / "poem.png"
        subprocess.run(
            [
                "magick",
                "-background",
                "white",
                str(work / "poem.svg"),
                "-alpha",
                "remove",
                "-resize",
                "640x",
                str(png),
            ],
            check=True,
        )
        im = np.asarray(Image.open(png).convert("L"))
        ink = im < 128
        if not ink.any():
            raise SystemExit("no ink left after dropping the plate")
        ys, xs = np.where(ink)
        vb = re.search(r'viewBox="([^"]+)"', svg)
        assert vb
        vx, vy, vw, vh = (float(x) for x in vb.group(1).split())
        sx, sy = vw / im.shape[1], vh / im.shape[0]
        x0 = vx + xs.min() * sx - PAD
        y0 = vy + ys.min() * sy - PAD
        x1 = vx + (xs.max() + 1) * sx + PAD
        y1 = vy + (ys.max() + 1) * sy + PAD
        return x0, y0, x1 - x0, y1 - y0


def _bbox(d: str, tx: float, ty: float) -> tuple[float, float, float, float] | None:
    nums = [float(n) for n in re.findall(r"-?\d+\.?\d*", d)]
    if len(nums) < 4:
        return None
    xs = [nums[i] + tx for i in range(0, len(nums) - 1, 2)]
    ys = [nums[i] + ty for i in range(1, len(nums), 2)]
    return min(xs), min(ys), max(xs) - min(xs), max(ys) - min(ys)


def _num(v: float) -> str:
    s = f"{v:.3f}".rstrip("0").rstrip(".")
    return s or "0"


if __name__ == "__main__":
    main()
