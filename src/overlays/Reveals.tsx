import { asset } from '../lib/asset'
import { useEffect } from 'react'
import { reveals } from '../content/content'
import type { RevealId } from '../content/types'
import { markSeen } from '../lib/progress'
import { Draft } from '../ui/bits'
import { Sheet } from './Sheet'

export function Reveal({ id }: { id: RevealId }) {
  useEffect(() => markSeen(`reveal:${id}`), [id])
  if (id === 'wednesday') return <Wednesday />
  if (id === 'thursday') return <Thursday />
  return <Friday />
}

function mapsUrl(q: string) {
  return `https://maps.apple.com/?q=${encodeURIComponent(q)}`
}

function Wednesday() {
  const r = reveals.wednesday
  return (
    <Sheet label={r.heading} testId="reveal-wednesday">
      <div className="paper plan">
        <div className="paper__tabs" aria-hidden>
          <span>Case file</span>
          <span>Itinerary</span>
        </div>
        <p className="dossier__kicker">The back booth</p>
        <h2 className="dossier__title">{r.heading}</h2>
        <p className="plan__intro">{r.intro}</p>
        <ol className="stubs">
          {r.stops.map((s, i) => (
            <li key={i} className="stub">
              <span className="stub__time">{s.time}</span>
              <span className="stub__body">
                <span className="stub__label">{s.label}</span>
                <span className="stub__name">
                  {s.name} <Draft when={s.draft} />
                </span>
                {s.note && <span className="stub__note">{s.note}</span>}
                <a className="stub__addr" href={mapsUrl(`${s.name} ${s.address}`)} target="_blank" rel="noreferrer">
                  {s.address}
                </a>
              </span>
            </li>
          ))}
        </ol>
        <span className="stamp stamp--evidence" aria-hidden>
          Booked
        </span>
      </div>
    </Sheet>
  )
}

function Thursday() {
  const r = reveals.thursday
  return (
    <Sheet label={r.heading} variant="chalk" testId="reveal-thursday">
      <div className="chalk-sheet">
        <h2 className="chalk-sheet__head">{r.heading}</h2>
        <p className="chalk-sheet__intro">{r.intro}</p>
        {r.cocktails.map((c, i) => (
          <section key={i} className="recipe">
            <h3 className="recipe__name">
              {c.name} <Draft when={c.draft} />
            </h3>
            <p className="recipe__glass">Served in a {c.glass.toLowerCase()}</p>
            <ul className="recipe__list">
              {c.ingredients.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="recipe__method">{c.method}</p>
          </section>
        ))}
      </div>
    </Sheet>
  )
}

function Friday() {
  const r = reveals.friday
  return (
    <Sheet label={r.heading} testId="reveal-friday">
      <h2 className="neon-title neon-title--pink">{r.heading}</h2>
      <p className="friday__intro">{r.intro}</p>
      <div className="ticket">
        <div className="ticket__main">
          <span className="ticket__admit">Admit two</span>
          <span className="ticket__title">
            {r.voucher.title} <Draft when={r.voucher.draft} />
          </span>
          <span className="ticket__detail">{r.voucher.detail}</span>
        </div>
        <div className="ticket__stub" aria-hidden>
          <span>No. 0611</span>
        </div>
      </div>
      {r.voucher.image && <img className="friday__voucher" src={asset(r.voucher.image)} alt={r.voucher.title} />}
      <div className="paper letter">
        {r.signOff.map((l, i) => (
          <p key={i} style={{ animationDelay: `${0.6 + i * 0.9}s` }}>
            {l}
          </p>
        ))}
        <p className="letter__sig" style={{ animationDelay: `${0.6 + r.signOff.length * 0.9}s` }}>
          {r.signedBy}
        </p>
      </div>
    </Sheet>
  )
}
