import { useMemo, type ReactNode } from 'react'
import { days, lines } from '../content/content'
import type { NzTime } from '../content/types'
import { at, dayForTime, dayStatus, isOpen } from '../lib/gating'
import { useProgress } from '../lib/progress'
import { formatDay, formatTime, remaining, shortCountdown } from '../lib/time'
import { useNav } from '../nav'
import { Countdown, OtterSays, Padlock } from '../ui/bits'
import { Sheet } from './Sheet'

export function Locked({ title, unlockAt, now }: { title: string; unlockAt: NzTime; now: Date }) {
  const when = at(unlockAt)
  const quip = useMemo(() => lines.locked[Math.floor(Math.random() * lines.locked.length)], [])
  const target = dayForTime(unlockAt)

  return (
    <Sheet label={`${title} is locked`} testId="locked">
      <div className="locked">
        <div className="locked__lock">
          <Padlock />
        </div>
        <h2 className="locked__word">Locked</h2>
        <p className="locked__what">{title}</p>
        <p className="locked__when">
          Opens {formatDay(when)} at {formatTime(when)}
        </p>
        <Countdown to={when} now={now} size="md" testId="locked-countdown" />
        <Timeline now={now} highlight={target} />
        <OtterSays compact>{quip}</OtterSays>
      </div>
    </Sheet>
  )
}

/** Five days, where she is now, and how long until the highlighted one. */
export function Timeline({ now, highlight }: { now: Date; highlight?: number }) {
  const { solved } = useProgress()
  const nowIndex = days.findIndex((d) => !isOpen(d.unlockAt, now))
  const items: ReactNode[] = []

  days.forEach((d, i) => {
    if (i === nowIndex) {
      items.push(
        <li key="now" className="timeline__now" aria-label="You are here">
          <span className="timeline__dot" />
          <span>You are here</span>
        </li>,
      )
    }
    const status = dayStatus(d, now, solved)
    const t = at(d.unlockAt)
    const isTarget = d.n === highlight
    items.push(
      <li key={d.n} className={`timeline__day is-${status} ${isTarget ? 'is-target' : ''}`} data-day={d.n}>
        <span className="timeline__dot" />
        <span className="timeline__date">{formatDay(t)}</span>
        <span className="timeline__title">{status === 'locked' ? <span className="redacted">Classified</span> : d.title}</span>
        <span className="timeline__status">
          {status === 'solved' ? 'Solved' : status === 'open' ? 'Open now' : isTarget ? shortCountdown(remaining(t, now)) : formatTime(t)}
        </span>
      </li>,
    )
  })
  if (nowIndex === -1)
    items.push(
      <li key="now" className="timeline__now">
        <span className="timeline__dot" />
        <span>Case complete</span>
      </li>,
    )

  return (
    <ol className="timeline" aria-label="Unlock timeline">
      {items}
    </ol>
  )
}

export function ClueFirst({ day, title }: { day: number; title: string }) {
  const nav = useNav()
  return (
    <Sheet label="Solve the clue first" testId="clue-first">
      <div className="locked locked--soft">
        <div className="locked__lock locked__lock--soft">
          <Padlock />
        </div>
        <h2 className="locked__word locked__word--teal">Almost</h2>
        <p className="locked__what">{title}</p>
        <OtterSays compact>{lines.clueFirst}</OtterSays>
        <button className="btn-neon" onClick={() => nav.replace({ kind: 'clue', day })}>
          Open today’s clue
        </button>
      </div>
    </Sheet>
  )
}
