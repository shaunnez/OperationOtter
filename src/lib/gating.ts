import { days, memories, reveals, songs, videos } from '../content/content'
import type { Day, NzTime, RevealId } from '../content/types'
import { nz } from './time'

const cache = new Map<string, number>()
export function at(t: NzTime): Date {
  let v = cache.get(t)
  if (v === undefined) {
    v = nz(t).getTime()
    cache.set(t, v)
  }
  return new Date(v)
}

export function isOpen(t: NzTime, now: Date): boolean {
  return now.getTime() >= at(t).getTime()
}

export type DayStatus = 'locked' | 'open' | 'solved'

export function dayStatus(day: Day, now: Date, solved: ReadonlySet<number>): DayStatus {
  if (!isOpen(day.unlockAt, now)) return 'locked'
  return solved.has(day.n) ? 'solved' : 'open'
}

export function dayByN(n: number): Day {
  const d = days.find((x) => x.n === n)
  if (!d) throw new Error(`No day ${n}`)
  return d
}

/** The day whose unlock is next, or null once everything is open. */
export function nextDay(now: Date): Day | null {
  return days.find((d) => !isOpen(d.unlockAt, now)) ?? null
}

/** Most recently unlocked day, or null before the first. */
export function currentDay(now: Date): Day | null {
  const open = days.filter((d) => isOpen(d.unlockAt, now))
  return open[open.length - 1] ?? null
}

export function firstUnlock(items: { unlockAt: NzTime }[]): NzTime {
  return items.map((i) => i.unlockAt).sort((a, b) => at(a).getTime() - at(b).getTime())[0]
}

/** Which day number an arbitrary unlock time belongs to (for the timeline). */
export function dayForTime(t: NzTime): number {
  const target = at(t).getTime()
  let n = days[0].n
  for (const d of days) if (at(d.unlockAt).getTime() <= target) n = d.n
  return n
}

export const counts = (now: Date) => ({
  songs: songs.filter((s) => isOpen(s.unlockAt, now)).length,
  memories: memories.filter((s) => isOpen(s.unlockAt, now)).length,
  videos: videos.filter((s) => isOpen(s.unlockAt, now)).length,
})

export function revealDay(id: RevealId): Day {
  return dayByN(reveals[id].day)
}
