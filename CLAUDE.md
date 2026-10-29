# Operation Otter: notes for Claude

A gift from Shaun to his partner, a mobile-first interactive story. A noir detective otter walks into Danny Doolans (the bar where they first kissed). From **Mon 2 to Fri 6 Nov 2026**, a new clue unlocks every morning at **06:00 Pacific/Auckland**. She calls herself "Goose"; "silly goose" and "it's okay fish" are real in-jokes. It is static: Vite + React 19 + TypeScript 7, with no backend and no analytics.

**The repo is public.** Shaun chose that knowingly. Everything here (including commit messages) is readable, so keep commit messages free of spoilers (say "Update Wednesday reveal", not what it is).

## Commands

```bash
npm install
npm run dev              # localhost:5173; ?now=2026-11-04T09:00 time-travels (dev/preview only)
npm test                 # vitest unit tests (time + gating)
npx tsc -b               # typecheck (TS 7, native; there's no JS compiler API)
npm run test:e2e         # Playwright on a preview build, iPhone + Pixel. Needs Chromium matching @playwright/test 1.63
```

Run `npm test`, `npx tsc -b` and `npm run test:e2e` before pushing anything non-trivial. Pushing to `main` deploys.

## Deploy

`.github/workflows/pages.yml` builds on every push to `main` and publishes to the `gh-pages` branch:
- **Real site:** https://shaunnez.github.io/OperationOtter/ (ignores `?now=`)
- **Test-mode copy:** https://shaunnez.github.io/OperationOtter/test/ (time travel and test-mode pill). It's controlled by `TEST_BUILD` in the workflow, which should be `'false'` before she gets the link.

The site lives under a sub-path, so **never hard-code `/assets/...` into the DOM**. Content keeps `/assets/x.webp` and the render site wraps it in `asset()` from `src/lib/asset.ts`. CSS `url('/assets/…')` and `index.html` are rewritten by Vite automatically. `BASE_PATH` env sets Vite's `base`.

## Where things live

- `src/content/content.ts`: **all words and media**: days (clue, evidence, reward), songs, memories, videos, the Wed/Thu/Fri reveals, eggs, the otter's lines, "40 before 40" cards. Most edits happen here.
  - `secret("…")` wraps anything that would spoil a future day. A build plugin (`vite-plugin-secret.ts`) scrambles those strings, so its argument must be a plain string literal.
  - `draft: true` marks stand-in text Claude wrote. Dev and preview builds show a yellow DRAFT tag on it. Remove the flag when Shaun confirms the real thing.
  - YouTube: just the ID in `youtubeId`. Friends' videos should be unlisted.
  - Images go in `public/assets/` as compressed `.webp` (max ~1600px long side). Originals go in `assets-raw/`.
- `src/content/scenes.ts`: positions on the artwork (hotspots, sign and chalkboard corners, glows) as % of the image. If an image changes, re-map these and screenshot to check.
- `src/content/walk-track.json`: camera track (optical flow) for the walk clip so the neon sign follows its push-in. Regenerate it if `street-walk.mp4` is replaced (OpenCV LK flow → similarity transform per 2 frames: `[t, scale, rotDeg, txFrac, tyFrac]`).
- `src/lib/time.ts` and `src/lib/gating.ts`: NZ time and the unlock schedule. Progress is kept in localStorage (`src/lib/progress.ts`).
- `src/scenes/`: Street (idle loop → walk clip → flash) and Bar (pannable, hotspots, chalk menu). `src/overlays/` holds the sheets. `src/ui/TimeMachine.tsx` is the test-mode panel.
- `ASSETS.md`: generation prompts for the art and clips.

## Design rules (from Shaun)

- Mobile first. No hover states; things pulse with neon and atmosphere, and pulse rings are fine.
- Locked items show a masked "CLASSIFIED" title, an unlock timeline and a countdown.
- YouTube shows a poster until tapped, then the embed (youtube-nocookie).
- Don't invent personal details; mark guesses `draft: true` and ask. Don't bundle copyrighted audio.
- Encode clips as H.264 MP4 with no audio, under ~4 MB, `-preset veryfast`.

## Still to come from Shaun (as of 29 Oct)

- Bar loop clip (Higgsfield, start frame `assets-raw/bar_still_2x.png`, locked camera)
- Real clues and answers
- Wednesday:
  - Nomiya booking time (484 New North Road, Kingsland)
  - the glass-blowing studio's name and time
- Memory photos and captions
- Songs 2–4
- Friends' video IDs
- ASB Classic voucher details
- Confirm the Friday sign-off and cocktails
