import { useCallback, useSyncExternalStore } from 'react'

// Remembers solved clues and which items she has opened. Storage can be
// unavailable (private mode, cleared data), so everything falls back to memory.

const KEY = 'operation-otter:v1'

type State = { solved: number[]; seen: string[] }

function load(): State {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) {
      const s = JSON.parse(raw) as Partial<State>
      return { solved: s.solved ?? [], seen: s.seen ?? [] }
    }
  } catch {
    /* ignore */
  }
  return { solved: [], seen: [] }
}

let state: State = typeof window === 'undefined' ? { solved: [], seen: [] } : load()
let snapshot = { solved: new Set(state.solved), seen: new Set(state.seen) }
const listeners = new Set<() => void>()

function commit(next: State) {
  state = next
  snapshot = { solved: new Set(next.solved), seen: new Set(next.seen) }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function markSolved(n: number) {
  if (!state.solved.includes(n)) commit({ ...state, solved: [...state.solved, n] })
}

export function markSeen(id: string) {
  if (!state.seen.includes(id)) commit({ ...state, seen: [...state.seen, id] })
}

export function resetProgress() {
  commit({ solved: [], seen: [] })
}

export function useProgress() {
  const snap = useSyncExternalStore(
    useCallback((l: () => void) => {
      listeners.add(l)
      return () => listeners.delete(l)
    }, []),
    () => snapshot,
    () => snapshot,
  )
  return snap
}
