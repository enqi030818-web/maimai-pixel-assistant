"""Package already generated duo strips. Never draws characters or invents poses."""
import argparse
import importlib.util
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


CLIPS = [
    ("peek", "待机探头", [650, 650, 700, 1000], 3),
    ("celebrate", "完成偷吃", [450, 350, 300, 300, 250, 250, 400, 700], 6),
    ("caught", "抓包无奈", [600, 650, 1000, 1000], 2),
    ("share", "并排分享", [650, 800, 850, 1000], 3),
]
CELL = (192, 208)


def load_module(path, name):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def rgba_bytes(image):
    # Clear hidden RGB values, including those preserved in generated alpha.
    data = bytearray(image.convert("RGBA").tobytes())
    for index in range(0, len(data), 4):
        if data[index + 3] == 0:
            data[index:index + 3] = b"\0\0\0"
    return Image.frombytes("RGBA", image.size, bytes(data))


def build(run, destination, media, skill):
    extraction = load_module(skill / "scripts/extract_strip_frames.py", "hatch_extract")
    cleanup = load_module(Path(__file__).with_name("clean_pet_edges.py"), "edge_cleanup")
    destination.mkdir(parents=True, exist_ok=True)
    media.mkdir(parents=True, exist_ok=True)
    frame_root = run / "frames"
    report = {"cell": list(CELL), "extraction": "complete duo groups, fixed left anchor and shared viewport per clip, nearest-neighbor", "clips": [], "errors": []}
    slots_path = run / "source-slots.json"
    source_slots = json.loads(slots_path.read_text(encoding="utf-8")) if slots_path.exists() else {}
    atlas = Image.new("RGBA", (8 * CELL[0], len(CLIPS) * CELL[1]))
    contact = Image.new("RGB", (8 * CELL[0], len(CLIPS) * (CELL[1] + 30)), "#fff7db")
    draw = ImageDraw.Draw(contact)
    try:
        font = ImageFont.truetype("C:/Windows/Fonts/msyh.ttc", 17)
    except OSError:
        font = ImageFont.load_default()
    clips = []
    preview_frames = []
    for row, (clip_id, title, durations, poster) in enumerate(CLIPS):
        frame_count = len(durations)
        source = run / "decoded" / f"{clip_id}.png"
        with Image.open(source) as opened:
            strip = extraction.remove_chroma_background(opened, (0, 0, 255), 150)
        # Low-alpha generation noise must not determine crop geometry.
        strip.putalpha(strip.getchannel("A").point(lambda a: a if a > 16 else 0))
        strip = rgba_bytes(strip)
        bbox = strip.getbbox()
        if bbox is None:
            raise ValueError(f"Empty source: {source}")
        # Re-slot entire groups when a generated pair crosses an equal-cell line.
        # No reconstruction, synthesis, duplication or missing-body repairs.
        # A gull is intentionally separate, so never treat each component as a frame.
        top, bottom = max(0, bbox[1] - 8), min(strip.height, bbox[3] + 8)
        slot_width = strip.width / frame_count
        slots = source_slots.get(clip_id, [[round(i * slot_width), round((i + 1) * slot_width)] for i in range(frame_count)])
        if len(slots) != frame_count:
            raise ValueError(f"Wrong source slot count: {clip_id}")
        groups = []
        for left, right in slots:
            group = strip.crop((left, top, right, bottom))
            bounds = group.getbbox()
            if bounds is None:
                raise ValueError(f"Empty group in {clip_id}")
            groups.append(group.crop((bounds[0], 0, bounds[2], group.height)))
        viewport_width = max(group.width for group in groups) + 16
        scale = min((CELL[0] - 12) / viewport_width, (CELL[1] - 12) / (bottom - top))
        frame_dir = frame_root / clip_id
        frame_dir.mkdir(parents=True, exist_ok=True)
        frames, stats = [], []
        draw.text((8, row * (CELL[1] + 30) + 4), title, fill="#5c2429", font=font)
        for index in range(frame_count):
            group = groups[index]
            crop = Image.new("RGBA", (viewport_width, bottom - top))
            crop.alpha_composite(group, (8, 0))
            crop = crop.resize((round(crop.width * scale), round(crop.height * scale)), Image.Resampling.NEAREST)
            frame = Image.new("RGBA", CELL)
            frame.alpha_composite(crop, ((CELL[0] - crop.width) // 2, CELL[1] - 6 - crop.height))
            frame, removed = cleanup.clean(frame)
            frame = rgba_bytes(frame)
            frame.save(frame_dir / f"{index:02d}.png")
            bounds = frame.getbbox()
            if not bounds:
                report["errors"].append(f"{clip_id}/{index}: empty frame")
            elif bounds[0] < 3 or bounds[1] < 3 or bounds[2] > CELL[0] - 3 or bounds[3] > CELL[1] - 3:
                report["errors"].append(f"{clip_id}/{index}: sprite touches safety margin")
            stats.append({"index": index, "bbox": bounds, "edgeKeyPixelsRemoved": removed})
            atlas.alpha_composite(frame, (index * CELL[0], row * CELL[1]))
            contact.paste(frame, (index * CELL[0], row * (CELL[1] + 30) + 30), frame)
            frames.append(frame)
        # Transparent GIF frames use full-frame disposal to avoid ghost sprites.
        enlarged = [frame.resize((384, 416), Image.Resampling.NEAREST) for frame in frames]
        enlarged[0].save(media / f"{clip_id}.gif", save_all=True, append_images=enlarged[1:], duration=durations, loop=0, disposal=2)
        frames[poster].save(media / f"{clip_id}-poster.png")
        preview_frames.append(frames)
        clips.append({"id": clip_id, "title": title, "row": row, "frames": frame_count, "durations": durations, "poster": poster, "loop": False})
        report["clips"].append({"id": clip_id, "source": f"decoded/{clip_id}.png", "sourceSize": list(strip.size), "sourceSlots": slots, "frames": stats})
    atlas = rgba_bytes(atlas)
    atlas.save(destination / "atlas.webp", lossless=True, exact=True)
    contact.save(media / "contact-sheet.png")
    # Review montage uses the packaged frames only; it invents no new artwork.
    overview = []
    total_duration = max(sum(clip[2]) for clip in CLIPS) + 1200
    for tick in range(0, total_duration, 100):
        canvas = Image.new("RGB", (768, 888), "#fff7db")
        labels = ImageDraw.Draw(canvas)
        for row, (_, title, durations, _) in enumerate(CLIPS):
            index = 0
            elapsed = tick
            while index < len(durations) - 1 and elapsed >= durations[index]:
                elapsed -= durations[index]
                index += 1
            left, top = (row % 2) * 384, (row // 2) * 444
            labels.text((left + 14, top + 6), title, font=font, fill="#5c2429")
            sprite = preview_frames[row][index].resize((384, 416), Image.Resampling.NEAREST)
            canvas.paste(sprite, (left, top + 28), sprite)
        overview.append(canvas)
    overview[0].save(media / "preview.gif", save_all=True, append_images=overview[1:], duration=100, loop=0, disposal=2)
    manifest = {"version": 1, "cellWidth": CELL[0], "cellHeight": CELL[1], "columns": 8, "rows": 4, "atlas": "atlas.webp", "nativeCodexEventsConnected": False, "clips": clips}
    serialized = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    (destination / "animations.json").write_text(serialized, encoding="utf-8")
    (destination / "animations.js").write_text("window.MAIMAI_SEAGULL = " + serialized.rstrip() + ";\n", encoding="utf-8")
    reopened = Image.open(destination / "atlas.webp").convert("RGBA")
    data = reopened.tobytes()
    residue = sum(1 for i in range(0, len(data), 4) if data[i + 3] == 0 and any(data[i:i + 3]))
    report.update({"atlasSize": list(reopened.size), "transparentRgbResidue": residue, "totalFrames": sum(len(clip[2]) for clip in CLIPS)})
    if residue:
        report["errors"].append("Hidden RGB under fully transparent pixels")
    unused = 0
    for clip in clips:
        for column in range(clip["frames"], 8):
            unused += 1
            box = (column * CELL[0], clip["row"] * CELL[1], (column + 1) * CELL[0], (clip["row"] + 1) * CELL[1])
            if reopened.crop(box).getbbox():
                report["errors"].append(f"Nonempty unused slot: {clip['id']}/{column}")
    report["transparentUnusedCells"] = unused
    report["ok"] = not report["errors"]
    (run / "qa").mkdir(parents=True, exist_ok=True)
    (run / "qa" / "build.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps({"ok": report["ok"], "frames": report["totalFrames"], "errors": report["errors"]}, ensure_ascii=False))
    if not report["ok"]:
        raise SystemExit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--run", type=Path, required=True)
    parser.add_argument("--destination", type=Path, required=True)
    parser.add_argument("--media", type=Path, required=True)
    parser.add_argument("--hatch-skill", type=Path, default=Path.home() / ".codex/skills/hatch-pet")
    options = parser.parse_args()
    build(options.run, options.destination, options.media, options.hatch_skill)
