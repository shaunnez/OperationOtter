import type { CSSProperties } from 'react'

/**
 * Neon sign drawn in type. Each letter flickers independently now and then,
 * and one letter is a little "broken" so it stutters more often.
 */
export function NeonSign({
  lines,
  brokenIndex = 3,
  className,
  style,
}: {
  /** size in px of the sign's own (unwarped) box */
  lines: { text: string; tone: 'pink' | 'teal'; size: number }[]
  brokenIndex?: number
  className?: string
  style?: CSSProperties
}) {
  let k = 0
  return (
    <div className={`neon ${className ?? ''}`} style={style} role="img" aria-label={lines.map((l) => l.text).join(' ')}>
      {lines.map((l, li) => (
        <div key={li} className={`neon__line neon--${l.tone}`} style={{ fontSize: `${l.size}px` }}>
          {[...l.text].map((ch, i) => {
            const idx = k++
            const broken = idx === brokenIndex
            return (
              <span
                key={i}
                className={broken ? 'neon__ch neon__ch--broken' : 'neon__ch'}
                style={{ animationDelay: `${((idx * 1.37) % 7).toFixed(2)}s` }}
              >
                {ch === ' ' ? ' ' : ch}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
