import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatDay, formatTime, nz, remaining, shortCountdown } from '../../src/lib/time'

describe('nz()', () => {
  it('parses NZ daylight time (UTC+13 in November)', () => {
    expect(nz('2026-11-02T06:00').toISOString()).toBe('2026-11-01T17:00:00.000Z')
  })
  it('parses NZ standard time (UTC+12 in July)', () => {
    expect(nz('2026-07-01T06:00').toISOString()).toBe('2026-06-30T18:00:00.000Z')
  })
  it('accepts a bare date as midnight', () => {
    expect(nz('2026-11-04').toISOString()).toBe('2026-11-03T11:00:00.000Z')
  })
  it('rejects junk', () => {
    expect(() => nz('next tuesday')).toThrow()
  })
})

describe('formatting', () => {
  it('formats days and times in NZ', () => {
    const d = nz('2026-11-04T06:00')
    expect(formatDay(d)).toBe('Wed 4 Nov')
    expect(formatTime(d)).toBe('6:00 am')
  })
  it('counts down', () => {
    const r = remaining(nz('2026-11-06T06:00'), nz('2026-11-04T03:30'))
    expect(r).toMatchObject({ days: 2, hours: 2, minutes: 30, seconds: 0 })
    expect(shortCountdown(r)).toBe('2d 2h 30m')
    expect(remaining(nz('2026-11-01T00:00'), nz('2026-11-02T00:00')).total).toBe(0)
  })
})

describe('getNow()', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('honours ?now= when time travel is allowed', async () => {
    vi.stubEnv('VITE_TIME_TRAVEL', 'true')
    vi.stubGlobal('window', { location: { search: '?now=2026-11-04T08:00' } })
    const { getNow } = await import('../../src/lib/time')
    expect(Math.abs(getNow().getTime() - nz('2026-11-04T08:00').getTime())).toBeLessThan(1000)
  })

  it('ignores ?now= in a production build', async () => {
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_TIME_TRAVEL', '')
    vi.stubGlobal('window', { location: { search: '?now=2026-11-04T08:00' } })
    const { getNow } = await import('../../src/lib/time')
    expect(Math.abs(getNow().getTime() - Date.now())).toBeLessThan(1000)
  })
})
