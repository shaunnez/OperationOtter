/**
 * Scene layout: where things sit on the artwork.
 * All x/y/w/h values are percentages of the image (0–100), so they survive
 * any screen size. If you swap an image, re-check these.
 */

import { asset } from '../lib/asset'

export type SceneImage = { src: string; w: number; h: number }

export type Glow = {
  x: number
  y: number
  /** radius as % of image width */
  r: number
  color: string
  kind: 'candle' | 'lamp' | 'neon' | 'screen'
  /** 0..1 */
  strength?: number
}

export type HotspotId =
  | 'jukebox'
  | 'photos'
  | 'tv'
  | 'casefile'
  | 'menu'
  | 'booth'
  | 'backroom'
  | 'fish'
  | 'goose'

export type HotspotDef = {
  id: HotspotId
  x: number
  y: number
  label?: string
  side?: 'left' | 'right'
}

export const street = {
  /** First frame of the idle loop, so the still → video hand-off is seamless */
  image: { src: asset('/assets/street.webp'), w: 1080, h: 1920 } as SceneImage,
  /** Seamless 8.8s loop: breathing, blink, steam off the bin */
  idleVideo: asset('/assets/street-idle.mp4'),
  /** He walks to the door and goes in (camera follows; see walk-track.json) */
  walkVideo: asset('/assets/street-walk.mp4'),
  /** Seconds into the walk clip when the warm flash into the bar starts */
  walkEndAt: 9.0,
  /** Horizontal slice that must always be on screen (otter → door) */
  /** Kept narrow enough (≈80%) that a normal portrait phone fills edge to edge with no blurred bands */
  keepVisible: { x0: 14, x1: 94.5 },
  focusX: 54.25,
  door: { x: 87, y: 47, w: 18, h: 38 },
  /** Blank sign board above the door: its four corners (TL, TR, BR, BL), so the neon sits in perspective */
  sign: [
    [60.8, 16.8],
    [95.4, 9.4],
    [95.4, 22.2],
    [60.8, 26.9],
  ] as [number, number][],
  glows: [
    { x: 55, y: 28, r: 8, color: '255,170,80', kind: 'lamp', strength: 0.75 },
    { x: 87, y: 44, r: 14, color: '255,160,70', kind: 'lamp', strength: 0.5 },
    { x: 80, y: 12, r: 18, color: '255,40,120', kind: 'neon', strength: 0.4 },
    { x: 47.5, y: 41.5, r: 4, color: '60,230,220', kind: 'neon', strength: 0.5 },
  ] as Glow[],
}

export const bar = {
  /** First frame of the loop, so the still → video hand-off is seamless.
   *  (The previous wider still is in assets-raw/bar_old_still.webp.) */
  image: { src: asset('/assets/bar.webp'), w: 1080, h: 1920 } as SceneImage,
  /** Seamless 9s loop: candles, mirror ball, jukebox, TV, fish, goose */
  loopVideo: asset('/assets/bar-loop.mp4'),
  /** Where the pan starts (% of image width at screen centre) */
  focusX: 45,
  /** Blank chalkboard to write the menu on: corners TL, TR, BR, BL.
   *  null = no board in frame (the loop clip only shows its edge). */
  chalkboard: null as [number, number][] | null,
  hotspots: [
    { id: 'photos', x: 29, y: 31, label: 'Photo wall', side: 'right' },
    { id: 'tv', x: 70.5, y: 25.5, label: 'Old TV', side: 'left' },
    { id: 'jukebox', x: 8, y: 47, label: 'Jukebox', side: 'right' },
    { id: 'backroom', x: 75, y: 38, label: 'Back room', side: 'left' },
    { id: 'menu', x: 95, y: 31, label: 'Menu', side: 'left' },
    { id: 'booth', x: 91, y: 60, label: 'Back booth', side: 'left' },
    { id: 'casefile', x: 24, y: 65, label: 'Case file', side: 'right' },
    { id: 'fish', x: 41, y: 55 },
    { id: 'goose', x: 63, y: 52 },
  ] as HotspotDef[],
  glows: [
    { x: 8.5, y: 67, r: 6, color: '255,170,70', kind: 'candle', strength: 0.8 },
    { x: 13, y: 11, r: 9, color: '255,175,90', kind: 'lamp', strength: 0.45 },
    { x: 23, y: 18, r: 7, color: '255,175,90', kind: 'lamp', strength: 0.4 },
    { x: 77.5, y: 17, r: 6, color: '255,175,90', kind: 'lamp', strength: 0.4 },
    { x: 96.5, y: 47, r: 5, color: '255,170,80', kind: 'lamp', strength: 0.5 },
    { x: 13, y: 32, r: 6, color: '255,60,80', kind: 'lamp', strength: 0.45 },
    { x: 7, y: 47, r: 13, color: '255,50,160', kind: 'neon', strength: 0.5 },
    { x: 71, y: 26, r: 9, color: '150,190,255', kind: 'screen', strength: 0.4 },
    { x: 71, y: 40.5, r: 4, color: '255,40,60', kind: 'neon', strength: 0.55 },
  ] as Glow[],
  discoBall: { x: 53.5, y: 15, r: 8.5 },
}
