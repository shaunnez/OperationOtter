import { useSyncExternalStore } from 'react'

// Whether the jukebox should be playing the bar song right now.
// Starts when she walks in (with sound on); stops when she mutes,
// closes it, leaves the bar, or plays something else.

let on = false
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
