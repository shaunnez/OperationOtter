import { useEffect, useState } from 'react'
import { days, eggs, lines, albums, reveals, songs, videos } from '../content/content'
import { bar, type HotspotDef } from '../content/scenes'
import type { NzTime, RevealId } from '../content/types'
import { DiscoBall, Glows, Grain, Haze } from '../fx/Atmosphere'
import { currentDay, dayByN, dayStatus, firstUnlock, isOpen } from '../lib/gating'
import { useProgress } from '../lib/progress'
import { formatDay } from '../lib/time'
import { at } from '../lib/gating'
import { useNav, type Overlay } from '../nav'
import { Logo, OtterSays, SoundToggle, Typed } from '../ui/bits'
import { Hotspot, type HotspotState } from '../ui/Hotspot'
import { OnSurface, Stage, type Pt } from './Stage'

type Spot = { state: HotspotState; meta?: string; action: Overlay; aria: string }

const revealFor: Partial<Record<HotspotDef['id'], RevealId>> = {
  booth: 'wednesday',
  menu: 'thursday',
  backroom: 'friday',
}

const short = (t: NzTime) => formatDay(at(t)).split(' ')[0]

export function Bar({ now, onLeave }: { now: Date; onLeave: () => void }) {
  const nav = useNav()
  const { solved, seen } = useProgress()
  const [pan, setPan] = useState(0.5)
  const [narration, setNarration] = useState<string | null>(null)

  // The otter's line for today, once per visit.
  useEffect(() => {
    const today = currentDay(now)
    let line: string
    if (!today) line = lines.beforeOpening
    else if (days.every((d) => solved.has(d.n))) line = lines.afterCase
    else if (!solved.has(today.n)) line = today.otterLine
    else line = lines.lookAround
    const show = window.setTimeout(() => setNarration(line), 900)
    const hide = window.setTimeout(() => setNarration(null), 11000)
    return () => {
      window.clearTimeout(show)
      window.clearTimeout(hide)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const collection = (
    items: { id: string; unlockAt: NzTime }[],
    seenPrefix: string,
    title: string,
    action: Overlay,
  ): Spot => {
    const open = items.filter((i) => isOpen(i.unlockAt, now))
    if (!open.length) {
      const first = firstUnlock(items)
      return { state: 'locked', meta: `Locked · ${short(first)}`, action: { kind: 'locked', title, unlockAt: first }, aria: `${title}, locked` }
    }
    const fresh = open.some((i) => !seen.has(`${seenPrefix}:${i.id}`))
    return { state: fresh ? 'fresh' : 'open', meta: `${open.length}/${items.length}`, action, aria: `${title}, ${open.length} of ${items.length} open` }
  }

  const spotFor = (h: HotspotDef): Spot => {
    switch (h.id) {
      case 'jukebox':
        return collection(songs, 'song', 'The jukebox', { kind: 'jukebox' })
      case 'photos':
        return collection(albums, 'album', 'The photo wall', { kind: 'photos' })
      case 'tv':
        return collection(videos, 'video', 'The old TV', { kind: 'tv' })
      case 'casefile': {
        const first = days[0]
        if (!isOpen(first.unlockAt, now))
          return { state: 'locked', meta: `Locked · ${short(first.unlockAt)}`, action: { kind: 'locked', title: 'The case file', unlockAt: first.unlockAt }, aria: 'Case file, locked' }
        const pending = days.some((d) => dayStatus(d, now, solved) === 'open')
        const n = days.filter((d) => solved.has(d.n)).length
        return { state: pending ? 'fresh' : 'open', meta: `${n}/${days.length} solved`, action: { kind: 'casefile' }, aria: `Case file, ${n} of ${days.length} solved` }
      }
      case 'fish':
      case 'goose': {
        const first = days[0]
        const title = eggs[h.id].title
        if (!isOpen(first.unlockAt, now)) return { state: 'locked', action: { kind: 'locked', title, unlockAt: first.unlockAt }, aria: `${title}, locked` }
        return { state: seen.has(`egg:${h.id}`) ? 'open' : 'fresh', action: { kind: 'egg', id: h.id }, aria: title }
      }
      default: {
        const id = revealFor[h.id]!
        const day = dayByN(reveals[id].day)
        const status = dayStatus(day, now, solved)
        const title = h.label ?? id
        if (status === 'locked') return { state: 'locked', meta: `Locked · ${short(day.unlockAt)}`, action: { kind: 'locked', title, unlockAt: day.unlockAt }, aria: `${title}, locked` }
        if (status === 'open') return { state: 'fresh', meta: 'Solve clue', action: { kind: 'clueFirst', day: day.n, title }, aria: `${title}, solve today's clue first` }
        return { state: seen.has(`reveal:${id}`) ? 'open' : 'fresh', meta: seen.has(`reveal:${id}`) ? undefined : 'Open', action: { kind: 'reveal', id }, aria: title }
      }
    }
  }

  return (
    <section className="scene bar" aria-label="Inside Danny Doolans">
      <Stage image={bar.image} focusX={bar.focusX} pannable onPan={setPan} testId="bar-stage"
        media={
          <>
            <img className="stage__img" src={bar.image.src} alt="" draggable={false} />
            {bar.loopVideo && <video className="stage__img stage__video is-ready" src={bar.loopVideo} poster={bar.image.src} autoPlay muted loop playsInline />}
          </>
        }
      >
        <Glows glows={bar.glows} />
        <DiscoBall {...bar.discoBall} />
        {bar.chalkboard && (
        <OnSurface corners={bar.chalkboard as [Pt, Pt, Pt, Pt]} w={300} h={385} className="chalk">
          <p className="chalk__head">Danny Doolans</p>
          <ul className="chalk__menu">
            <li><span>Beer</span><i /><span>$6</span></li>
            <li><span>Whiskey</span><i /><span>$8</span></li>
            <li><span>It’s Okay Fish</span><i /><span>$9</span></li>
            <li><span>Silly Goose</span><i /><span>$9</span></li>
            <li><span>Bad Decisions</span><i /><span>Free</span></li>
          </ul>
          <p className="chalk__foot">Good drinks · questionable people</p>
        </OnSurface>
        )}
        <Haze />
        {bar.hotspots.map((h, i) => {
          const s = spotFor(h)
          return (
            <Hotspot
              key={h.id}
              x={h.x}
              y={h.y}
              label={h.label}
              meta={s.meta}
              side={h.side}
              state={s.state}
              small={!h.label}
              ariaLabel={s.aria}
              delay={i * 0.37}
              onClick={() => nav.open(s.action)}
            />
          )
        })}
      </Stage>

      <Grain />
      <div className="bar__enter-glow" aria-hidden />

      <div className={`pan-hint pan-hint--left ${pan > 0.04 ? 'is-on' : ''}`} aria-hidden />
      <div className={`pan-hint pan-hint--right ${pan < 0.96 ? 'is-on' : ''}`} aria-hidden />

      <header className="topbar">
        <Logo onClick={onLeave} />
        <SoundToggle />
      </header>

      {narration && (
        <button className="narration" onClick={() => setNarration(null)} aria-live="polite" data-testid="narration">
          <OtterSays>
            <Typed text={narration} />
          </OtterSays>
        </button>
      )}
    </section>
  )
}
