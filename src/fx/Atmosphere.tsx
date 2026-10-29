import type { CSSProperties } from 'react'
import type { Glow } from '../content/scenes'

/** Soft light blooms layered over the art, each breathing on its own rhythm. */
export function Glows({ glows }: { glows: Glow[] }) {
  return (
    <div className="glows" aria-hidden>
      {glows.map((g, i) => (
        <span
          key={i}
          className={`glow glow--${g.kind}`}
          style={
            {
              left: `${g.x}%`,
              top: `${g.y}%`,
              width: `${g.r * 2}%`,
              '--c': g.color,
              '--s': g.strength ?? 0.6,
              animationDelay: `${(i * 0.73) % 3}s`,
              animationDuration: g.kind === 'candle' ? `${1.4 + (i % 3) * 0.35}s` : g.kind === 'neon' ? `${5 + (i % 4)}s` : `${4 + (i % 3)}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/** Moving film grain + vignette, shared by every scene. */
export function Grain() {
  return (
    <>
      <div className="grain" aria-hidden />
      <div className="vignette" aria-hidden />
    </>
  )
}

/** Light specks thrown by the mirror ball, drifting across the room. */
export function DiscoBall({ x, y, r }: { x: number; y: number; r: number }) {
  const specks = Array.from({ length: 16 }, (_, i) => i)
  return (
    <div className="disco" style={{ left: `${x}%`, top: `${y}%`, width: `${r * 2}%` }} aria-hidden>
      <span className="disco__shine" />
      <div className="disco__specks">
        {specks.map((i) => (
          <span
            key={i}
            className="speck"
            style={
              {
                '--a': `${(i * 360) / specks.length + (i % 3) * 7}deg`,
                '--d': 160 + ((i * 53) % 280),
                '--hue': i % 3 === 0 ? '330' : i % 3 === 1 ? '190' : '40',
                animationDelay: `${-(i * 0.9)}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  )
}

/** Slow drifting smoke for interiors. */
export function Haze() {
  return (
    <div className="haze" aria-hidden>
      <span />
      <span />
    </div>
  )
}
