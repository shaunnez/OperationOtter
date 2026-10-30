import { useSyncExternalStore } from 'react'

// Whether the jukebox should be playing the bar song right now.
// Starts when she walks in (with sound on); stops when she mutes,
// closes it, leaves the bar, or plays something else.

let on = false
let player: (() => void) | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export const barMusic = {
  start() {
    if (on) return
    on = true
    emit()
  },
  stop() {
    if (!on) return
    on = false
    emit()
  },
  get on() {
    return on
  },
  /** The preloaded jukebox registers itself so a tap can start it. */
  registerPlayer(play: () => void) {
    player = play
    return () => {
      if (player === play) player = null
    }
  },
  /** Call straight from a tap handler: phones only let video start from a tap. */
  kick(): boolean {
    if (!player) return false
    player()
    return true
  },
}

export function useBarMusicOn(): boolean {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => on,
    () => false,
  )
}
