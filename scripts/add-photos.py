#!/usr/bin/env python3
"""
Turn a folder of photos into one album for the photo wall.

    python3 scripts/add-photos.py ~/Desktop/monday a1

- Sorts by the date the photo was taken (falls back to file name).
- Fixes rotation, resizes to max 1600px, saves as WebP (quality 80).
- Writes no metadata, so GPS and camera details never reach the public repo.
- Writes public/assets/albums/<album>/01.webp, 02.webp, … (replacing what was there)
- Prints the lines to paste into `albums` in src/content/content.ts.

Needs Pillow; HEIC (iPhone) files also need: pip install pillow-heif --break-system-packages
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:
    import pillow_heif  # type: ignore

    pillow_heif.register_heif_opener()
except ImportError:
    pass

EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'}
MAX = 1600


def taken(p: Path):
    try:
        with Image.open(p) as im:
            exif = im.getexif()
            dt = exif.get_ifd(0x8769).get(36867) or exif.get(306)
            if dt:
                return str(dt)
    except Exception:
        pass
    return '9999'


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src, album = Path(sys.argv[1]).expanduser(), sys.argv[2]
    files = [p for p in src.iterdir() if p.suffix.lower() in EXTS]
    if not files:
        sys.exit(f'No photos in {src}')
    files.sort(key=lambda p: (taken(p), p.name.lower()))

    out = Path(__file__).resolve().parent.parent / 'public' / 'assets' / 'albums' / album
    out.mkdir(parents=True, exist_ok=True)
    for old in out.glob('*.webp'):
        old.unlink()

    lines = []
    for i, p in enumerate(files, 1):
        with Image.open(p) as im:
            im = ImageOps.exif_transpose(im).convert('RGB')
            im.thumbnail((MAX, MAX), Image.LANCZOS)
            name = f'{i:02d}.webp'
            im.save(out / name, 'WEBP', quality=80, method=6)  # no exif= → no metadata
        lines.append(f"    {{ image: '/assets/albums/{album}/{name}', caption: secret('') }}, // {p.name}")

    total = sum(f.stat().st_size for f in out.glob('*.webp')) / 1e6
    print(f'{len(files)} photos → {out} ({total:.1f} MB)\n')
    print('photos: [')
    print('\n'.join(lines))
    print('],')


if __name__ == '__main__':
    main()
