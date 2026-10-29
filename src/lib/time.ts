export const TZ = 'Pacific/Auckland'

/** Offset of `TZ` from UTC at the given instant, in ms. */
function tzOffsetMs(instant: number): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const p = Object.fromEntries(dtf.formatToParts(new Date(instant)).map((x) => [x.type, x.value]))
  const asUtc = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second)
  return asUtc - Math.floor(instant / 1000) * 1000
}

/**
 * Parse a wall-clock time in New Zealand ("2026-11-04T08:00" or "2026-11-04")
 * into a real instant, handling NZST/NZDT correctly.
 */
export function nz(local: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?$/.exec(local.trim())
  if (!m) throw new Error(`Bad NZ time: ${local}`)
  const [, y, mo, d, h = '0', mi = '0', s = '0'] = m
  const guess = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s)
  let instant = guess - tzOffsetMs(guess)
  instant = guess - tzOffsetMs(instant) // second pass settles DST edges
  return new Date(instant)
}

export function timeTravelAllowed(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_TIME_TRAVEL === 'true'
}

let override: { base: number; startedAt: number } | null | undefined

function readOverride(): typeof override {
  if (override !== undefined) return override
  override = null
  if (typeof window === 'undefined' || !timeTravelAllowed()) return override
  const param = new URLSearchParams(window.location.search).get('now')
  if (param) {
    try {
      override = { base: nz(param).getTime(), startedAt: Date.now() }
    } catch {
      override = null
    }
  }
  return override
}

/** The one clock the app uses. Honours ?now= in dev/preview builds; time keeps ticking from there. */
export function getNow(): Date {
  const o = readOverride()
  if (!o) return new Date()
  return new Date(o.base + (Date.now() - o.startedAt))
}

/** Test hook. */
export function _resetClock() {
  override = undefined
}

export function isTimeTravelling(): boolean {
  return !!readOverride()
}

const dayFmt = new Intl.DateTimeFormat('en-NZ', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' })
const timeFmt = new Intl.DateTimeFormat('en-NZ', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true })

/** "Wed 4 Nov" */
export function formatDay(d: Date): string {
  const p = Object.fromEntries(dayFmt.formatToParts(d).map((x) => [x.type, x.value]))
  return `${p.weekday} ${p.day} ${p.month}`
}

/** "6:00 am" */
export function formatTime(d: Date): string {
  return timeFmt.format(d).replace(/\s?([ap])\.?m\.?/i, ' $1m').toLowerCase()
}

export type Remaining = { total: number; days: number; hours: number; minutes: number; seconds: number }

export function remaining(to: Date, from: Date): Remaining {
  const total = Math.max(0, to.getTime() - from.getTime())
  const s = Math.floor(total / 1000)
  return {
    total,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** "2d 14h 27m" style, dropping leading zero units. */
export function shortCountdown(r: Remaining): string {
  if (r.days > 0) return `${r.days}d ${r.hours}h ${pad2(r.minutes)}m`
  if (r.hours > 0) return `${r.hours}h ${pad2(r.minutes)}m ${pad2(r.seconds)}s`
  return `${r.minutes}m ${pad2(r.seconds)}s`
}
