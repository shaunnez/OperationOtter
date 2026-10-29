import type { CSSProperties } from 'react'
import { Padlock } from './bits'

export type HotspotState = 'fresh' | 'open' | 'locked'

/** Pulsing neon ring with a mockup-style label. */
export function Hotspot({
  x,
  y,
  label,
  meta,
  side = 'right',
  state,
  small,
  onClick,
  ariaLabel,
  delay = 0,
}: {
  x: number
  y: number
  label?: string
  meta?: string
  side?: 'left' | 'right'
  state: HotspotState
  small?: boolean
  onClick: () => void
  ariaLabel: string
  delay?: number
}) {
  return (
    <button
      className={`hotspot hotspot--${state} hotspot--${side} ${small ? 'hotspot--small' : ''}`}
      style={{ left: `${x}%`, top: `${y}%`, '--delay': `${delay}s` } as CSSProperties}
      onClick={onClick}
      aria-label={ariaLabel}
      data-hotspot
      data-state={state}
    >
      <span className="hotspot__ring">
        <span className="hotspot__pulse" />
        <span className="hotspot__pulse hotspot__pulse--late" />
        {state === 'locked' ? (
          <Padlock className="hotspot__icon" />
        ) : (
          <svg className="hotspot__icon" viewBox="0 0 20 20" aria-hidden>
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {label && (
        <span className="hotspot__label" aria-hidden>
          <span className="hotspot__name">{label}</span>
          {meta && <span className="hotspot__meta">{meta}</span>}
        </span>
      )}
    </button>
  )
}
