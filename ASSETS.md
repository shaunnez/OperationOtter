# Operation Otter: assets

Drop everything into `assets-raw/` using the file names below. I'll process the files (cropping, compressing, setting hotspot positions) and wire them in.

**Tools**
- **Stills:** ChatGPT images. Attach `mockup.png` (your first mockup) to every prompt as the style reference.
- **Motion:** any image-to-video tool that takes a start frame and lets you lock the camera (Kling, Veo, Runway). Generate 3–4 takes of each clip and keep the best one.

**Sizes**
- ChatGPT outputs 1024×1536 (2:3), which is fine. On a phone, the sides get cropped to roughly the middle 65% of the width, so every prompt below asks for the important things to sit in the middle. The top 10% sits under the logo and the bottom 18% sits under the case clock, so keep those areas as atmosphere: sky, pavement, the bar top.
- Video: 9:16 portrait at 1080p if offered (720p is OK). 24 fps, 5–8 seconds.
- Sign text: let ChatGPT paint the neon text into the scene. I make it flicker using the real pixels, which blends in better than code-drawn text. If it misspells **DANNY DOOLANS**, regenerate. If it keeps failing, ask for a blank sign board and I'll draw the text in code.

---

## Style anchor (paste at the top of every still prompt)

> Cinematic photoreal digital painting, adult neon-noir, New York at night after rain. Hot-pink and teal neon, warm amber tungsten lamps, deep shadows, wet reflective surfaces, fine film grain. Match the look, lighting and otter character of the attached reference exactly. Full-bleed portrait image: no phone frame, no UI, no buttons, no icons, no countdowns, no handwritten annotations, no plus signs, no glowing circles.

## Otter anchor (paste wherever the otter appears)

> The hero is the same realistic river otter detective from the reference, standing upright on his hind legs: brown tweed fedora with a red band, brown tweed coat, white shirt, navy tie, brass magnifying glass. Realistic wet fur and whiskers, not cartoonish.

---

## Must have

### 1. `street.png`: home screen still
> [style anchor] [otter anchor]
> Recreate the street scene from the left phone in the reference. The otter leans against a red brick wall on the left third of the frame, magnifying glass in one paw, looking slightly off-camera with a deadpan expression. On the right is the bar entrance: a dark wooden door with a small glass panel, **closed**, set slightly back from the street. Above it is a pink neon sign reading "DANNY DOOLANS" with a teal neon "BAR" and a small cocktail-glass icon. Wet cobblestones reflect the neon. Leave a clear stretch of pavement between the otter and the door so he can walk to it. Rain is falling. The otter, sign and door all sit within the middle 65% of the image width. The top of the frame is city towers and fire escapes in mist; the bottom is wet pavement.

**Then crop it to 9:16** for the video tool: keep the full height and trim 80px off each side, giving 864×1536. Save that as `street-916.png` and use it as the start frame for clips 2 and 3. If you'd rather skip the cropping, drop `street.png` into `assets-raw/` and I'll make `street-916.png` for you.

### 2. `street-idle.mp4`: the home screen loop
Start frame **and** end frame: `street-916.png`.
> Static locked-off camera, absolutely no camera movement, no zoom, no pan. Gentle rain falls and puddles ripple. The neon sign hums with a slight flicker. The otter stays leaning against the wall: he breathes, blinks slowly once, his whiskers twitch, and he glances toward the camera then back. Subtle, calm, seamless loop.

### 3. `street-walk.mp4`: the walk into the bar
Start frame: `street-916.png`.
> Static locked-off camera, absolutely no camera movement, no zoom, no pan. The otter tucks the magnifying glass into his coat, pushes himself off the brick wall, straightens his fedora, and walks upright across the wet pavement to the bar door with a confident detective swagger. He pushes the door open and warm golden light spills out across the wet street. He steps inside and disappears into the glow, leaving the door ajar with light pouring out. Rain continues; the neon sign stays steady.

The ending matters most: the clip should finish on the open, glowing doorway. I zoom into that light to cut to the bar.

### 4. `bar.png`: bar interior still
> [style anchor]
> Recreate the bar interior from the middle phone in the reference, with no otter in this shot. Warm amber pendant lamps, dark wood, a smoky atmosphere. Include, each one clearly separated with space around it so it can be tapped:
> - top centre: pink neon sign "DANNY DOOLANS" with a teal shamrock above and the smaller teal neon line "GOOD DRINKS • QUESTIONABLE PEOPLE"
> - upper left: a wall crowded with old framed black-and-white photos
> - left: a vintage jukebox glowing pink and purple
> - upper right: an old CRT television mounted on the wall, its screen showing a grainy black-and-white image
> - centre right: a chalkboard menu reading exactly: "DANNY DOOLANS / Beer $6 / Whiskey $8 / It's Okay Fish $9 / Silly Goose $9 / Bad Decisions Free"
> - right: a dark wooden door with a small sign "BACK ROOM" and a heavy brass padlock on it
> - mid right: a red leather back booth with a small brass table lamp and a matchbook on the table
> - foreground bar top: a manila "CASE FILE" folder; a whole silver fish on a plate with a handwritten paper tag "It's okay fish." and a smiley face; a white ceramic goose figurine standing on a small wooden block labelled "SILLY GOOSE" with a red heart; candles in glass votives; two shot glasses; a round "DANNY DOOLANS" coaster
> All of these sit within the middle 65% of the image width.

If ChatGPT gets a few things wrong, edit in place ("make the chalkboard text exactly: …", "move the goose further right") rather than regenerating from scratch.

---

## Nice to have (in this order)

### 5. `bar-loop.mp4`: living bar
Start and end frame: `bar.png` cropped to 9:16 the same way as the street.
> Static locked-off camera, absolutely no camera movement. Candle flames flicker, the TV screen flickers with static, the jukebox lights slowly cycle, faint smoke drifts through the lamp light. Nothing else moves. Seamless loop.

### 6. `otter-bust.png`: narration portrait
> [style anchor] [otter anchor]
> Head-and-shoulders portrait of the otter, three-quarter view, one eyebrow slightly raised, wry and deadpan. Plain transparent background (or flat pure black if transparency isn't offered). Square.

### 7. `paper.png`: case-file paper texture
> Top-down photograph of a single aged manila case-file page filling the frame: soft creases, a faint coffee ring, slight fingerprint smudges, worn edges. No text, no writing, no stamps. Even, flat lighting. Portrait.

### 8. Evidence photos, one per day: `evidence-1.png` … `evidence-5.png`
These go in the Polaroid on each day's case-file card. Use the style anchor, square format, shot as a moody close-up on the bar top:
1. Mon: a neatly folded pair of soft grey track pants with a tiny paper evidence tag tied on with string
2. Tue: a Lush-style bath bomb in a whisky tumbler, fizzing faintly
3. Wed: an open Danny Doolans matchbook with two tiny paper tickets tucked inside
4. Thu: two cocktail glasses, a shaker and fresh citrus on the bar
5. Fri: a single tennis ball in a pool of neon light beside an old ticket stub

### 9. Cutouts: `goose.png`, `fish.png`
> The white ceramic goose figurine / the fish on its plate from the bar image, isolated on a transparent background, same lighting.

These are only needed if you want them to lift off the bar when tapped.
