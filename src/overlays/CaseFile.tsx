import { asset } from '../lib/asset'
import { useEffect, useMemo, useRef, useState } from 'react'
import { config, days, eggs, lines } from '../content/content'
import type { Day, Evidence } from '../content/types'
import { at, dayByN, dayStatus } from '../lib/gating'
import { markSeen, markSolved, useProgress } from '../lib/progress'
import { formatDay } from '../lib/time'
import { useNav, type Overlay } from '../nav'
import { Draft, OtterSays } from '../ui/bits'
import { Sheet } from './Sheet'

const LETTERS = 'ABCDEFGH'

export function CaseFileList({ now }: { now: Date }) {
  const nav = useNav()
  const { solved } = useProgress()
  return (
    <Sheet label="Case file" testId="casefile">
      <div className="paper casefile">
        <div className="paper__tabs" aria-hidden>
          <span>Case file</span>
          <span>Exhibits</span>
        </div>
        <p className="casefile__kicker">Re:</p>
        <h2 className="casefile__title">{config.caseTitle}</h2>
        <p className="casefile__sub">Five exhibits. One fish. No sleep till Friday.</p>
        <ul className="exhibits">
          {days.map((d) => {
            const status = dayStatus(d, now, solved)
            const action: Overlay =
              status === 'locked'
                ? { kind: 'locked', title: `Exhibit ${LETTERS[d.n - 1]}`, unlockAt: d.unlockAt }
                : status === 'open'
                  ? { kind: 'clue', day: d.n }
                  : { kind: 'evidence', day: d.n }
            return (
              <li key={d.n}>
                <button className={`exhibit is-${status}`} onClick={() => nav.open(action)} data-testid={`exhibit-${d.n}`} data-status={status}>
                  <span className="exhibit__letter">{LETTERS[d.n - 1]}</span>
                  <span className="exhibit__body">
                    <span className="exhibit__date">{formatDay(at(d.unlockAt))}</span>
                    <span className="exhibit__title">{status === 'locked' ? <span className="redacted">Classified</span> : d.title}</span>
                  </span>
                  <span className={`exhibit__stamp exhibit__stamp--${status}`}>{status === 'solved' ? 'Solved' : status === 'open' ? 'Open' : 'Locked'}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </Sheet>
  )
}

export function ClueView({ dayN }: { dayN: number }) {
  const nav = useNav()
  const day = dayByN(dayN)
  const [wrong, setWrong] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const giveAway = wrong.length >= 2
  const wrongLine = useMemo(() => lines.wrong[(wrong.length - 1 + lines.wrong.length) % lines.wrong.length], [wrong.length])

  useEffect(() => {
    if (!done) return
    const t = window.setTimeout(() => nav.replace({ kind: 'evidence', day: dayN, fresh: true }), 1500)
    return () => window.clearTimeout(t)
  }, [done, dayN, nav])

  const pick = (i: number) => {
    if (done || wrong.includes(i)) return
    if (i === day.clue.answer) {
      markSolved(day.n)
      setDone(true)
    } else setWrong((w) => [...w, i])
  }

  return (
    <Sheet label={`Clue for exhibit ${LETTERS[day.n - 1]}`} testId="clue">
      <div className={`paper clue ${done ? 'is-done' : ''}`}>
        <div className="paper__tabs" aria-hidden>
          <span>Case file</span>
          <span>Clue</span>
        </div>
        <span className="stamp stamp--num" aria-hidden>
          #{String(day.n).padStart(2, '0')}
        </span>
        <p className="clue__kicker">
          Exhibit {LETTERS[day.n - 1]} · {formatDay(at(day.unlockAt))}
        </p>
        <h2 className="clue__q">
          {day.clue.question} <Draft when={day.clue.draft} />
        </h2>
        <ul className="clue__options">
          {day.clue.options.map((o, i) => {
            const isWrong = wrong.includes(i)
            const isRight = done && i === day.clue.answer
            const hint = giveAway && !done && i === day.clue.answer
            return (
              <li key={i}>
                <button
                  className={`option ${isWrong ? 'is-wrong' : ''} ${isRight ? 'is-right' : ''} ${hint ? 'is-hint' : ''}`}
                  onClick={() => pick(i)}
                  disabled={isWrong || done}
                  data-testid={`option-${i}`}
                >
                  <span className="option__box" aria-hidden>
                    {isRight ? '✓' : isWrong ? '✕' : ''}
                  </span>
                  {o}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="clue__feedback" aria-live="polite">
          {done ? (
            <OtterSays compact>{lines.solved}</OtterSays>
          ) : giveAway ? (
            <OtterSays compact>{lines.giveAway}</OtterSays>
          ) : wrong.length ? (
            <OtterSays compact>{wrongLine}</OtterSays>
          ) : null}
        </div>
        {done && (
          <span className="stamp stamp--solved" aria-hidden>
            Solved
          </span>
        )}
      </div>
    </Sheet>
  )
}

function rewardAction(day: Day): Overlay {
  const r = day.reward
  switch (r.kind) {
    case 'song':
      return { kind: 'jukebox', songId: r.id }
    case 'video':
      return { kind: 'tv', videoId: r.id }
    case 'album':
      return { kind: 'photos', albumId: r.id }
    case 'reveal':
      return { kind: 'reveal', id: r.id }
  }
}

export function EvidenceView({ dayN, fresh }: { dayN: number; fresh?: boolean }) {
  const nav = useNav()
  const day = dayByN(dayN)
  const rewardRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!fresh) return
    const t = window.setTimeout(() => rewardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 2600)
    return () => window.clearTimeout(t)
  }, [fresh])
  return (
    <Sheet label={`Evidence: ${day.evidence.title}`} testId="evidence">
      <Dossier n={day.n} kicker="Clue found" evidence={day.evidence} fresh={fresh} />
      <div ref={rewardRef} className={`reward ${fresh ? 'is-fresh' : ''}`}>
        <FedoraIcon />
        <div className="reward__body">
          <p className="reward__kicker">Reward unlocked</p>
          <p className="reward__label">{day.reward.label}</p>
          <button className="btn-neon btn-neon--pink" onClick={() => nav.replace(rewardAction(day))} data-testid="reward-cta">
            {day.reward.cta}
          </button>
        </div>
      </div>
    </Sheet>
  )
}

export function EggView({ id }: { id: 'fish' | 'goose' }) {
  const egg = eggs[id]
  useEffect(() => markSeen(`egg:${id}`), [id])
  return (
    <Sheet label={egg.title} testId={`egg-${id}`}>
      <Dossier kicker="Found on the bar" evidence={{ ...egg, image: id === 'fish' ? '/assets/egg-fish.webp' : '/assets/egg-goose.webp', cutout: true }} sketch={id} />
    </Sheet>
  )
}

export function Dossier({ n, kicker, evidence, fresh, sketch = 'fish' }: { n?: number; kicker: string; evidence: Evidence; fresh?: boolean; sketch?: 'fish' | 'goose' }) {
  const [imgOk, setImgOk] = useState(!!evidence.image)
  return (
    <article className={`paper dossier ${fresh ? 'is-fresh' : ''}`}>
      <div className="paper__tabs" aria-hidden>
        <span>Case file</span>
        <span>Evidence</span>
      </div>
      {n && (
        <span className="stamp stamp--num" aria-hidden>
          #{String(n).padStart(2, '0')}
        </span>
      )}
      <p className="dossier__kicker">{kicker}</p>
      <h2 className="dossier__title">
        {evidence.title} <Draft when={evidence.draft} />
      </h2>
      <figure className={`polaroid ${evidence.cutout ? 'polaroid--cutout' : ''}`}>
        <span className="polaroid__tape" aria-hidden />
        {imgOk && evidence.image ? (
          <img src={asset(evidence.image)} alt="" onError={() => setImgOk(false)} />
        ) : (
          <div className="polaroid__placeholder" aria-hidden>
            <Sketch kind={sketch} />
          </div>
        )}
        {evidence.tag && <figcaption className="polaroid__tag">{evidence.tag}</figcaption>}
      </figure>
      <p className="dossier__label">Case notes</p>
      <p className="dossier__notes">{evidence.notes}</p>
      {evidence.quote && (
        <blockquote className="dossier__quote">
          “{evidence.quote}”{evidence.quoteBy && <cite>{evidence.quoteBy}</cite>}
        </blockquote>
      )}
      <span className="stamp stamp--evidence" aria-hidden>
        Evidence
      </span>
      <span className="dossier__sketch" aria-hidden>
        <Sketch kind={sketch} />
      </span>
    </article>
  )
}

function Sketch({ kind }: { kind: 'fish' | 'goose' }) {
  return kind === 'fish' ? (
    <svg viewBox="0 0 120 50" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 25c14-16 46-20 70-8 6 3 10 6 12 8-2 2-6 5-12 8-24 12-56 8-70-8z" />
      <path d="M92 25l18-14-4 14 4 14z" />
      <circle cx="26" cy="22" r="2" />
      <path d="M38 14c4 7 4 15 0 22M50 13c3 8 3 16 0 24M62 14c3 7 3 15 0 22" opacity=".6" />
      <path d="M18 31c4 2 8 2 11 0" />
    </svg>
  ) : (
    <svg viewBox="0 0 80 90" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M30 12c0-6 9-8 12-2 2 4 0 10-2 16-3 10-4 20 4 26 10 0 22 4 26 14 2 6-2 12-10 14-14 3-30 2-38-6-6-6-6-16 0-22 4-4 6-8 6-14V18" />
      <path d="M30 14l-10 3 10 3" />
      <circle cx="36" cy="12" r="1.4" />
      <path d="M40 82v6M48 82v6M36 88h8M44 88h8" />
    </svg>
  )
}

function FedoraIcon() {
  return (
    <span className="reward__icon" aria-hidden>
      <svg viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 28c8 6 48 6 56 0" />
        <path d="M14 27c0-10 4-20 10-20 3 0 5 3 8 3s5-3 8-3c6 0 10 10 10 20" />
        <path d="M15 22c10 3 24 3 34 0" />
        <path d="M27 9c2 2 8 2 10 0" />
      </svg>
    </span>
  )
}
