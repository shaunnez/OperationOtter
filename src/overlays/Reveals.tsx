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
        {r.voucher && (
          <div className="ticket ticket--wing" data-testid="wing-voucher">
            <div className="ticket__main">
              <span className="ticket__admit">Voucher · admit two</span>
              <span className="ticket__title">{r.voucher.title}</span>
              <span className="ticket__detail">{r.voucher.detail}</span>
            </div>
            <div className="ticket__stub ticket__stub--teal" aria-hidden>
              <WingFoil />
            </div>
          </div>
        )}
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

/** A little line drawing of a wing foil: the wing above, board, mast and foil below. */
function WingFoil() {
  return (
    <svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 27C16 9 48 9 56 27C46 21 18 21 8 27Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M32 12.5V22" />
      <path d="M25 22.5c2 2.2 12 2.2 14 0" />
      <path d="M17 40h30a3 3 0 0 1-3 4H20a3 3 0 0 1-3-4Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M32 44v10" />
      <path d="M21 55.5c4-2 18-2 22 0" />
      <path d="M41 50.5h6" />
      <path d="M6 59c5-2 9 2 14 0s9 2 14 0 9 2 14 0 9 2 10 0" strokeWidth="1.6" opacity="0.6" />
    </svg>
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
