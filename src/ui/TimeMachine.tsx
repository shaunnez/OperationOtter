import { useState } from 'react'
import { days } from '../content/content'
import { at, currentDay, nextDay } from '../lib/gating'
import { markSolved, resetProgress } from '../lib/progress'
import { TZ, isTimeTravelling } from '../lib/time'

// Test mode: dev and preview builds only. Jump to any day, watch an unlock
// happen live, and fast-forward clues. Never rendered in the real build.

function nzLocal(d: Date): string {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-CA', {
      timeZone: TZ,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(d)
      .map((x) => [x.type, x.value]),
  )
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`
}

function go(now: string | null) {
  const url = new URL(window.location.href)
  if (now) url.searchParams.set('now', now)
  else url.searchParams.delete('now')
  window.location.assign(url.toString())
}

const JUMPS: { label: string; now: string }[] = [
  { label: 'Sun 1', now: '2026-11-01T20:00' },
  { label: 'Mon 2', now: '2026-11-02T07:30' },
  { label: 'Tue 3', now: '2026-11-03T07:30' },
  { label: 'Wed 4', now: '2026-11-04T07:30' },
  { label: 'Thu 5', now: '2026-11-05T07:30' },
  { label: 'Fri 6', now: '2026-11-06T07:30' },
  { label: 'Sat 7', now: '2026-11-07T10:00' },
]

export function TimeMachine({ now }: { now: Date }) {
  const [open, setOpen] = useState(false)
  const travelling = isTimeTravelling()
  const label = now.toLocaleString('en-NZ', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', second: travelling ? '2-digit' : undefined })
  const next = nextDay(now)
  const today = currentDay(now)
  const currentJump = travelling ? nzLocal(now).slice(0, 10) : ''

  return (
    <div className={`tm ${open ? 'is-open' : ''}`} data-testid="time-machine">
      <button className="tm__pill" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="tm__dot" />
        {travelling ? 'Test mode' : 'Live'} · {label}
      </button>
      {open && (
        <div className="tm__panel">
          <p className="tm__h">Jump to (NZ time)</p>
          <div className="tm__days">
            {JUMPS.map((j) => (
              <button key={j.label} className={currentJump === j.now.slice(0, 10) ? 'is-on' : ''} onClick={() => go(j.now)}>
                {j.label}
              </button>
            ))}
          </div>
          {next && (
            <button className="tm__wide" onClick={() => go(nzLocal(new Date(at(next.unlockAt).getTime() - 20_000)))}>
              20 seconds before {next.n === 1 ? 'Monday' : `day ${next.n}`} unlocks
            </button>
          )}
          <p className="tm__h">Progress (this phone only)</p>
          <div className="tm__row">
            <button
              disabled={!today}
              onClick={() => {
                if (today) markSolved(today.n)
              }}
            >
              Solve today
            </button>
            <button
              disabled={!today}
              onClick={() => days.filter((d) => at(d.unlockAt) <= now).forEach((d) => markSolved(d.n))}
            >
              Solve all open
            </button>
            <button onClick={() => resetProgress()}>Reset</button>
          </div>
          {travelling && (
            <button className="tm__wide tm__live" onClick={() => go(null)}>
              Back to real time
            </button>
          )}
        </div>
      )}
    </div>
  )
}
