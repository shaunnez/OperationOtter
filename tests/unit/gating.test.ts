import { describe, expect, it } from 'vitest'
import { days, memories, reveals, songs, videos } from '../../src/content/content'
import { currentDay, dayForTime, dayStatus, isOpen, nextDay } from '../../src/lib/gating'
import { nz } from '../../src/lib/time'
import { decode, encode } from '../../src/lib/cipher'

const none = new Set<number>()

describe('unlock schedule', () => {
  it('runs Mon 2 to Fri 6 Nov at 6am NZ', () => {
    expect(days.map((d) => d.unlockAt)).toEqual([
      '2026-11-02T06:00',
      '2026-11-03T06:00',
      '2026-11-04T06:00',
      '2026-11-05T06:00',
      '2026-11-06T06:00',
    ])
  })

  it('keeps everything locked before Monday 6am', () => {
    const now = nz('2026-11-02T05:59')
    expect(days.every((d) => dayStatus(d, now, none) === 'locked')).toBe(true)
    for (const item of [...songs, ...memories, ...videos]) expect(isOpen(item.unlockAt, now)).toBe(false)
    expect(currentDay(now)).toBeNull()
    expect(nextDay(now)?.n).toBe(1)
  })

  it('opens exactly one more day each morning', () => {
    for (const d of days) {
      const before = nz(d.unlockAt.replace('06:00', '05:59'))
      const after = nz(d.unlockAt)
      expect(dayStatus(d, before, none)).toBe('locked')
      expect(dayStatus(d, after, none)).toBe('open')
      expect(currentDay(after)?.n).toBe(d.n)
    }
  })

  it('marks solved days', () => {
    expect(dayStatus(days[0], nz('2026-11-03T09:00'), new Set([1]))).toBe('solved')
  })

  it('keeps Wednesday and Friday reveals behind their days', () => {
    expect(days.find((d) => d.n === reveals.wednesday.day)?.unlockAt).toBe('2026-11-04T06:00')
    expect(days.find((d) => d.n === reveals.friday.day)?.unlockAt).toBe('2026-11-06T06:00')
  })

  it('maps unlock times to days for the timeline', () => {
    expect(dayForTime('2026-11-04T06:00')).toBe(3)
    expect(dayForTime('2026-11-01T06:00')).toBe(1)
  })

  it('every reward points at something that exists', () => {
    for (const d of days) {
      const r = d.reward
      if (r.kind === 'song') expect(songs.some((s) => s.id === r.id)).toBe(true)
      if (r.kind === 'video') expect(videos.some((s) => s.id === r.id)).toBe(true)
      if (r.kind === 'memory') expect(memories.some((s) => s.id === r.id)).toBe(true)
      expect(d.clue.answer).toBeLessThan(d.clue.options.length)
    }
  })
})

describe('cipher', () => {
  it('round-trips unicode', () => {
    const s = 'It’s okay fish 🐟 — Wednesday at 6'
    expect(encode(s)).not.toContain('fish')
    expect(decode(encode(s))).toBe(s)
  })
})
