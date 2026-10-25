"""Remove key-color contamination only at existing transparent sprite boundaries.

Build-time cleanup of already generated/extracted frames; never draws or synthesizes
poses. The character palette contains reds/yellows/cream/burgundy, not blue/purple.
"""
import argparse
import json
from pathlib import Path
from PIL import Image, ImageFilter


STATES = {"running-right", "running-left", "failed", "waiting", "running"}


def clean(image):
    image = image.convert("RGBA")
    alpha = image.getchannel("A")
    solid = alpha.point(lambda value: 255 if value > 16 else 0)
    interior = solid.filter(ImageFilter.MinFilter(5))
    colors = list(image.get_flattened_data()) if hasattr(image, "get_flattened_data") else list(image.getdata())
    interior_values = interior.tobytes()
    removed = 0
    for index, (red, green, blue, opacity) in enumerate(colors):
        # Preserve interior pixels, normal burgundy outlines, pale skin and blush.
        # Only remove blue/purple contamination within two pixels of transparency.
        if opacity and not interior_values[index] and blue > red * .55 + 8 and blue > green * 1.35 + 8:
            colors[index] = (0, 0, 0, 0)
            removed += 1
        elif opacity == 0:
            colors[index] = (0, 0, 0, 0)
    image.putdata(colors)
    return image, removed


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("frames_root", type=Path)
    parser.add_argument("--report", type=Path, required=True)
    args = parser.parse_args()
    counts = {}
    for state in sorted(STATES):
        paths = sorted((args.frames_root / state).glob("*.png"))
        if not paths:
            raise SystemExit(f"Missing already-extracted frames: {state}")
        counts[state] = []
        for path in paths:
            with Image.open(path) as source:
                output, removed = clean(source)
            output.save(path)
            counts[state].append(removed)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps({"method": "boundary-only-key-contamination-removal",
        "boundaryRadius": 2, "removedPixelsByFrame": counts}, indent=2), encoding="utf-8")
    print(json.dumps(counts))
