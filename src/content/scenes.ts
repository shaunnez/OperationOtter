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
  keepVisible: { x0: 6, x1: 98 },
  focusX: 52,
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
  image: { src: asset('/assets/bar.webp'), w: 1586, h: 2048 } as SceneImage,
  /** Optional ambient loop over the still, e.g. asset('/assets/bar-loop.mp4') */
  loopVideo: '',
  /** Where the pan starts (% of image width at screen centre) */
  focusX: 42,
  /** Blank chalkboard on the right wall: corners TL, TR, BR, BL */
  chalkboard: [
    [77.7, 26.6],
    [96.2, 25.1],
    [96.5, 45.0],
    [77.7, 45.2],
  ] as [number, number][],
  hotspots: [
    { id: 'photos', x: 28, y: 31, label: 'Photo wall', side: 'right' },
    { id: 'tv', x: 61.5, y: 25.5, label: 'Old TV', side: 'right' },
    { id: 'jukebox', x: 8, y: 47, label: 'Jukebox', side: 'right' },
    { id: 'backroom', x: 63, y: 48, label: 'Back room', side: 'left' },
    { id: 'menu', x: 80, y: 48.5, label: 'Menu', side: 'right' },
    { id: 'booth', x: 82, y: 57, label: 'Back booth', side: 'left' },
    { id: 'casefile', x: 19, y: 62.5, label: 'Case file', side: 'right' },
    { id: 'fish', x: 29.5, y: 54.5 },
    { id: 'goose', x: 44.5, y: 52 },
  ] as HotspotDef[],
  glows: [
    { x: 7.5, y: 63, r: 5, color: '255,170,70', kind: 'candle', strength: 0.9 },
    { x: 40, y: 60, r: 4, color: '255,170,70', kind: 'candle', strength: 0.6 },
    { x: 14.5, y: 13, r: 9, color: '255,175,90', kind: 'lamp', strength: 0.5 },
    { x: 22, y: 20, r: 7, color: '255,175,90', kind: 'lamp', strength: 0.45 },
    { x: 88.5, y: 13, r: 7, color: '255,175,90', kind: 'lamp', strength: 0.45 },
    { x: 96.5, y: 54, r: 6, color: '255,170,80', kind: 'lamp', strength: 0.6 },
    { x: 83, y: 48, r: 4, color: '255,170,80', kind: 'lamp', strength: 0.5 },
    { x: 13.5, y: 33, r: 6, color: '255,60,80', kind: 'lamp', strength: 0.5 },
    { x: 7, y: 48, r: 13, color: '255,50,160', kind: 'neon', strength: 0.55 },
    { x: 61.5, y: 25, r: 8, color: '150,190,255', kind: 'screen', strength: 0.5 },
    { x: 63, y: 41.5, r: 4, color: '255,40,60', kind: 'neon', strength: 0.6 },
  ] as Glow[],
  discoBall: { x: 45.5, y: 16, r: 6.5 },
}
