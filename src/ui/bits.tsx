import { asset } from '../lib/asset'
import { barMusic } from '../lib/barMusic'
import { useEffect, useState, type ReactNode } from 'react'
import { ambience, useAmbienceEnabled } from '../lib/ambience'
import { pad2, remaining, timeTravelAllowed } from '../lib/time'

export function Logo({ onClick }: { onClick?: () => void }) {
  const inner = (
    <>
      <span className="logo__top">Operation</span>
      <span className="logo__main">Otter</span>
    </>
  )
  return onClick ? (
    <button className="logo" onClick={onClick} aria-label="Back to the street">
      {inner}
    </button>
  ) : (
    <div className="logo">{inner}</div>
  )
}

export function Countdown({ to, now, size = 'md', testId }: { to: Date; now: Date; size?: 'sm' | 'md'; testId?: string }) {
  const r = remaining(to, now)
  const cells: [number, string][] = [
    [r.days, 'days'],
    [r.hours, 'hrs'],
    [r.minutes, 'mins'],
    [r.seconds, 'secs'],
  ]
  return (
    <div className={`countdown countdown--${size}`} data-testid={testId} role="timer" aria-label={`${r.days} days ${r.hours} hours ${r.minutes} minutes`}>
      {cells.map(([v, l]) => (
        <div className="countdown__cell" key={l}>
          <span className="countdown__num">{pad2(v)}</span>
          <span className="countdown__unit">{l}</span>
        </div>
      ))}
    </div>
  )
}

export function SoundToggle() {
  const on = useAmbienceEnabled()
  return (
    <button className={`round-btn sound ${on ? 'is-on' : ''}`} onClick={() => {
        const wasOn = ambience.enabled
        ambience.toggle()
        if (wasOn) barMusic.stop()
        else if (ambience.scene === 'bar') barMusic.start()
      }} aria-label={on ? 'Mute sound' : 'Turn sound on'} aria-pressed={on}>
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {on ? (
          <>
            <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <path d="M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <path d="M16 9.5l5 5m0-5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="round-btn close" onClick={onClick} aria-label="Close">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  )
}

export function Padlock({ open = false, className }: { open?: boolean; className?: string }) {
  return (
    <svg className={`padlock ${open ? 'is-open' : ''} ${className ?? ''}`} viewBox="0 0 48 56" aria-hidden>
      <path className="padlock__shackle" d="M14 24v-8a10 10 0 0 1 20 0v8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <rect x="7" y="24" width="34" height="26" rx="5" fill="none" stroke="currentColor" strokeWidth="3.5" />
      <circle cx="24" cy="35" r="3.2" fill="currentColor" />
      <path d="M24 37.5v5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Dev/preview-only marker on stand-in copy. */
export function Draft({ when }: { when?: boolean }) {
  if (!when || !timeTravelAllowed()) return null
  return <span className="draft-tag">draft</span>
}

/** Typewriter reveal for the otter's lines. */
export function Typed({ text, speed = 26 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setN(text.length)
      return
    }
    const id = window.setInterval(() => {
      setN((v) => {
        if (v >= text.length) {
          window.clearInterval(id)
          return v
        }
        return v + 1
      })
    }, speed)
    return () => window.clearInterval(id)
  }, [text, speed])
  return (
    <span className="typed" aria-label={text}>
      <span aria-hidden>{text.slice(0, n)}</span>
      <span className="typed__ghost" aria-hidden>
        {text.slice(n)}
      </span>
    </span>
  )
}

export function OtterSays({ children, compact }: { children: ReactNode; compact?: boolean }) {
  return (
    <div className={`otter-says ${compact ? 'otter-says--compact' : ''}`}>
      <img className="otter-says__face" src={asset('/assets/otter-bust.webp')} alt="" />
      <p className="otter-says__line">{children}</p>
    </div>
  )
}
