# Operation Otter

A noir detective otter, a rainy street, and a bar called Danny Doolans. Runs Mon 2 – Fri 6 Nov 2026 (NZ time). Each morning at 6:00 a new clue opens.

## Run it

```bash
npm install
npm run dev            # http://localhost:5173 (also on your LAN, so you can open it on your phone)
```

**Time travel (dev and preview builds only):** add `?now=` with an NZ wall-clock time.

```
http://localhost:5173/?now=2026-11-01T20:00   # Sunday night: everything locked
http://localhost:5173/?now=2026-11-02T07:00   # Monday morning
http://localhost:5173/?now=2026-11-04T09:00   # Wednesday
http://localhost:5173/?now=2026-11-06T10:00   # Friday finale
```

**Test mode panel:** in dev and preview builds there's a yellow pill near the top. Tap it to:
- jump to any day (Sun 1 → Sat 7)
- jump to **20 seconds before the next unlock** and watch the hotspots flip live
- solve today's clue, solve all open clues, or reset progress (stored on that phone only)
- go back to real time

To try it on your phone, run `npm run dev` and open the **Network** URL it prints, with phone and Mac on the same Wi-Fi. Yellow **DRAFT** tags mark stand-in text, and they also only show in dev and preview builds. The real build has neither.

## Edit content

Everything she reads is in **`src/content/content.ts`**: days, clues, evidence notes, songs, photos, videos, the Wed/Thu/Fri reveals, the otter's lines and the "40 before 40" cards.

- Wrap anything that would spoil a future day in `secret("…")`. Production builds scramble those strings, so they can't be read in view-source. It has to be a plain string, e.g. `secret("Dinner at 6")`.
- YouTube: paste just the ID (the bit after `v=`) into `youtubeId`. Use unlisted uploads for the friends' videos.
- Images: put them in `public/assets/` and reference them as `/assets/name.webp`.
  - Memory photos → `memories[].image`
  - Evidence Polaroids → `/assets/evidence-1.webp` … `evidence-5.webp` (paths already set; the sketch shows until the file exists)

Where things sit on the artwork (hotspots, the sign, the chalkboard, the glows) is in **`src/content/scenes.ts`**, as percentages of the image. If you swap an image, check those positions.

### Otter clips

The street uses the first frame of the idle loop as its image, so the hand-off is seamless. A new walk clip should start on that frame (`assets-raw/street_idle_firstframe.png`).

The walk clip's camera pushes in, so the neon sign and glows follow it using `src/content/walk-track.json` (zoom/pan per frame, measured from the video). **If you swap the walk clip, that file needs regenerating**, so ask Claude. `walkEndAt` in `scenes.ts` sets when the warm flash into the bar starts, and she can tap to skip at any point.

Encode as H.264 MP4 with no audio, ideally under 4 MB each, for example:
`ffmpeg -i in.mp4 -an -c:v libx264 -preset veryfast -crf 26 -movflags +faststart -vf "scale=-2:1280" out.mp4`

## Test

```bash
npm test               # unit: NZ time, unlock schedule, scrambling
npm run test:e2e       # Playwright: full flow at each simulated date, iPhone + Pixel sizes, spoiler scan of the build
```

## Deploy (GitHub Pages)

Every push to `main` runs `.github/workflows/pages.yml`, which tests, builds and publishes to the `gh-pages` branch.

- **Her link:** https://shaunnez.github.io/OperationOtter/. The real build **ignores `?now=`**.
- **Your test link:** https://shaunnez.github.io/OperationOtter/test/, with time travel and the test-mode pill. Set `TEST_BUILD: 'false'` in the workflow before you send her the link.
- The site lives under `/OperationOtter/`, so image paths in code go through `asset()` (`src/lib/asset.ts`).
- There's a `noindex` meta tag and no analytics. The repo is public, so commit messages shouldn't give anything away.
