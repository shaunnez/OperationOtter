import { useSyncExternalStore } from 'react'

// Procedural rain + bar room tone, generated live with Web Audio (no files).
// Must be started from a tap (browser autoplay rules).

type Scene = 'street' | 'bar'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let rainFilter: BiquadFilterNode | null = null
let rainGain: GainNode | null = null
let roomGain: GainNode | null = null

let enabled = false
let ducked = false
let scene: Scene = 'street'
const listeners = new Set<() => void>()

function noiseBuffer(c: AudioContext, seconds: number, kind: 'white' | 'brown' | 'crackle') {
  const len = Math.floor(c.sampleRate * seconds)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1
    if (kind === 'white') d[i] = w
    else if (kind === 'brown') {
      last = (last + 0.02 * w) / 1.02
      d[i] = last * 3.5
    } else {
      d[i] = Math.random() < 0.0004 ? w * 0.9 : Math.random() < 0.004 ? w * 0.08 : 0
    }
  }
  return buf
}

function build() {
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  const rain = ctx.createBufferSource()
  rain.buffer = noiseBuffer(ctx, 3, 'white')
  rain.loop = true
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 700
  rainFilter = ctx.createBiquadFilter()
  rainFilter.type = 'lowpass'
  rainFilter.frequency.value = 6500
  rainGain = ctx.createGain()
  rainGain.gain.value = 0.12
  rain.connect(hp).connect(rainFilter).connect(rainGain).connect(master)
  rain.start()

  const room = ctx.createBufferSource()
  room.buffer = noiseBuffer(ctx, 4, 'brown')
  room.loop = true
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 260
  const crackle = ctx.createBufferSource()
  crackle.buffer = noiseBuffer(ctx, 5, 'crackle')
  crackle.loop = true
  roomGain = ctx.createGain()
  roomGain.gain.value = 0
  room.connect(lp).connect(roomGain)
  crackle.connect(roomGain)
  roomGain.connect(master)
  room.start()
  crackle.start()
}

function apply() {
  if (!ctx || !master || !rainFilter || !rainGain || !roomGain) return
  const t = ctx.currentTime
  const target = enabled && !ducked ? 1 : 0
  master.gain.cancelScheduledValues(t)
  master.gain.setTargetAtTime(target, t, 0.6)
  const inBar = scene === 'bar'
  rainFilter.frequency.setTargetAtTime(inBar ? 650 : 6500, t, 0.8)
  rainGain.gain.setTargetAtTime(inBar ? 0.07 : 0.12, t, 0.8)
  roomGain.gain.setTargetAtTime(inBar ? 0.35 : 0, t, 0.8)
}

function emit() {
  listeners.forEach((l) => l())
}

export const ambience = {
  /** Call from a tap handler. */
  enable() {
    if (!ctx) build()
    void ctx?.resume()
    enabled = true
    apply()
    emit()
  },
  disable() {
    enabled = false
    apply()
    emit()
  },
  toggle() {
    if (enabled) ambience.disable()
    else ambience.enable()
  },
  setScene(s: Scene) {
    scene = s
    apply()
  },
  /** Fade out while a video is playing. */
  duck(on: boolean) {
    ducked = on
    apply()
  },
  get enabled() {
    return enabled
  },
}

export function useAmbienceEnabled(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => enabled,
    () => false,
  )
}
