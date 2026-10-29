import { createContext, useContext } from 'react'
import type { NzTime, RevealId } from './content/types'

export type Overlay =
  | { kind: 'locked'; title: string; unlockAt: NzTime }
  | { kind: 'clueFirst'; day: number; title: string }
  | { kind: 'casefile' }
  | { kind: 'clue'; day: number }
  | { kind: 'evidence'; day: number; fresh?: boolean }
  | { kind: 'egg'; id: 'fish' | 'goose' }
  | { kind: 'jukebox'; songId?: string }
  | { kind: 'photos' }
  | { kind: 'tv'; videoId?: string }
  | { kind: 'reveal'; id: RevealId }

export type Nav = {
  open: (o: Overlay) => void
  /** Swap the top overlay without adding a history entry */
  replace: (o: Overlay) => void
  close: () => void
}

export const NavCtx = createContext<Nav | null>(null)

export function useNav(): Nav {
  const n = useContext(NavCtx)
  if (!n) throw new Error('NavCtx missing')
  return n
}
