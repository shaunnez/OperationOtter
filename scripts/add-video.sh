#!/usr/bin/env bash
# Compress a phone video for the old TV and drop it in public/assets/videos.
#
#   scripts/add-video.sh ~/Desktop/from-sam.mov v1
#
# 720p H.264 + AAC MP4 (plays on every phone), metadata stripped, aims for
# roughly 5–8 MB per minute. Then set  src: '/assets/videos/v1.mp4'  in content.ts.
set -euo pipefail
in="$1"; id="$2"
root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$root/public/assets/videos"
out="$root/public/assets/videos/$id.mp4"
ffmpeg -y -i "$in" -map_metadata -1 -map 0:v:0 -map 0:a:0? \
  -vf "scale='if(gt(iw,ih),-2,720)':'if(gt(iw,ih),720,-2)',fps=30" \
  -c:v libx264 -preset veryfast -crf 26 -profile:v high -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ac 2 -movflags +faststart "$out"
ls -lh "$out"
