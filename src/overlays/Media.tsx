import { asset } from '../lib/asset'
import { useEffect, useState } from 'react'
import { memories, someday, songs, videos } from '../content/content'
import type { Memory, NzTime } from '../content/types'
import { ambience } from '../lib/ambience'
import { at, isOpen } from '../lib/gating'
import { markSeen } from '../lib/progress'
import { formatDay, timeTravelAllowed } from '../lib/time'
import { useNav } from '../nav'
import { Padlock } from '../ui/bits'
import { Sheet } from './Sheet'

const dayShort = (t: NzTime) => formatDay(at(t))

/** Styled poster until tapped, then the real YouTube player. */
export function VideoPoster({
  youtubeId,
  start,
  title,
  subtitle,
  look,
}: {
  youtubeId?: string
  start?: number
  title: string
  subtitle: string
  look: 'record' | 'crt'
}) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(false)
  }, [youtubeId, title])

  useEffect(() => {
    ambience.duck(playing)
    return () => ambience.duck(false)
  }, [playing])

  if (playing && youtubeId) {
    const params = new URLSearchParams({ autoplay: '1', playsinline: '1', rel: '0', modestbranding: '1' })
    if (start) params.set('start', String(start))
    return (
      <div className={`player player--${look} is-playing`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${params}`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    )
  }

  return (
    <div className={`player player--${look}`}>
      <button className="player__poster" onClick={() => setPlaying(true)} aria-label={`Play ${title}`} data-testid="play">
        {look === 'record' ? (
          <span className="vinyl" aria-hidden>
            <span className="vinyl__label">
              <span>DD</span>
            </span>
          </span>
        ) : (
          <span className="static" aria-hidden />
        )}
        <span className="player__meta">
          <span className="player__title">{title}</span>
          <span className="player__sub">{subtitle}</span>
        </span>
        <span className="player__play" aria-hidden>
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
        </span>
      </button>
      {playing && !youtubeId && (
        <p className="player__missing" role="status">
          {timeTravelAllowed() ? 'No YouTube ID yet: add it in content.ts' : 'This tape hasn’t arrived yet. Check back soon.'}
        </p>
      )}
    </div>
  )
}

export function Jukebox({ songId, now }: { songId?: string; now: Date }) {
  const nav = useNav()
  const open = songs.filter((s) => isOpen(s.unlockAt, now))
  const [selected, setSelected] = useState(() => open.find((s) => s.id === songId) ?? open[0])
  useEffect(() => open.forEach((s) => markSeen(`song:${s.id}`)), [open.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sheet label="Jukebox" testId="jukebox">
      <h2 className="neon-title neon-title--pink">Jukebox</h2>
      {selected && <VideoPoster look="record" youtubeId={selected.youtubeId} start={selected.start} title={selected.title} subtitle={selected.artist} />}
      <ol className="selections">
        {songs.map((s, i) => {
          const unlocked = isOpen(s.unlockAt, now)
          const code = `${'ABCD'[Math.floor(i / 4)]}${(i % 4) + 1}`
          return (
            <li key={s.id}>
              {unlocked ? (
                <button className={`selection ${selected?.id === s.id ? 'is-active' : ''}`} onClick={() => setSelected(s)} data-testid={`song-${s.id}`}>
                  <span className="selection__code">{code}</span>
                  <span className="selection__text">
                    <span className="selection__title">{s.title}</span>
                    <span className="selection__artist">{s.artist}</span>
                  </span>
                </button>
              ) : (
                <button className="selection is-locked" onClick={() => nav.open({ kind: 'locked', title: `Jukebox selection ${code}`, unlockAt: s.unlockAt })}>
                  <span className="selection__code">{code}</span>
                  <span className="selection__text">
                    <span className="redacted">Classified</span>
                    <span className="selection__artist">{dayShort(s.unlockAt)}</span>
                  </span>
                  <Padlock className="selection__lock" />
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </Sheet>
  )
}

export function Tv({ videoId, now }: { videoId?: string; now: Date }) {
  const nav = useNav()
  const open = videos.filter((v) => isOpen(v.unlockAt, now))
  const [selected, setSelected] = useState(() => open.find((v) => v.id === videoId) ?? open[0])
  useEffect(() => open.forEach((v) => markSeen(`video:${v.id}`)), [open.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sheet label="The old TV" testId="tv">
      <h2 className="neon-title neon-title--teal">Late night tapes</h2>
      {selected && <VideoPoster look="crt" youtubeId={selected.youtubeId} title={`From ${selected.from}`} subtitle="A message for Goose" />}
      <ol className="tapes">
        {videos.map((v, i) => {
          const unlocked = isOpen(v.unlockAt, now)
          return (
            <li key={v.id}>
              {unlocked ? (
                <button className={`tape ${selected?.id === v.id ? 'is-active' : ''}`} onClick={() => setSelected(v)}>
                  <span className="tape__n">Tape {i + 1}</span>
                  <span className="tape__from">From {v.from}</span>
                </button>
              ) : (
                <button className="tape is-locked" onClick={() => nav.open({ kind: 'locked', title: `Tape ${i + 1}`, unlockAt: v.unlockAt })}>
                  <span className="tape__n">Tape {i + 1}</span>
                  <span className="tape__from">
                    <span className="redacted">Classified</span> {dayShort(v.unlockAt)}
                  </span>
                  <Padlock className="selection__lock" />
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </Sheet>
  )
}

export function PhotoWall({ now }: { now: Date }) {
  const nav = useNav()
  const [zoom, setZoom] = useState<Memory | null>(null)
  const openCount = memories.filter((m) => isOpen(m.unlockAt, now)).length
  useEffect(() => memories.filter((m) => isOpen(m.unlockAt, now)).forEach((m) => markSeen(`memory:${m.id}`)), [openCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sheet label="Photo wall" variant="cork" testId="photos">
      <h2 className="cork-title">The wall</h2>
      <div className="pins">
        {memories.map((m, i) => {
          const unlocked = isOpen(m.unlockAt, now)
          const tilt = [-4, 3, -2, 5, -3, 2][i % 6]
          return unlocked ? (
            <button key={m.id} className="pinned-photo" style={{ rotate: `${tilt}deg` }} onClick={() => setZoom(m)} data-testid={`memory-${m.id}`}>
              <span className="pin" aria-hidden />
              <MemoryImage m={m} />
              <span className="pinned-photo__cap">{m.caption}</span>
            </button>
          ) : (
            <button key={m.id} className="pinned-photo is-back" style={{ rotate: `${tilt}deg` }} onClick={() => nav.open({ kind: 'locked', title: 'A photo on the wall', unlockAt: m.unlockAt })}>
              <span className="pin" aria-hidden />
              <span className="pinned-photo__back">
                <span>Do not open until</span>
                <strong>{dayShort(m.unlockAt)}</strong>
              </span>
            </button>
          )
        })}
      </div>

      <h3 className="cork-title cork-title--small">40 before 40</h3>
      <p className="cork-sub">Parked for later. No dates. Yet.</p>
      <div className="index-cards">
        {someday.map((s, i) => (
          <div key={s.title} className="index-card" style={{ rotate: `${[2, -3, 1, -2][i % 4]}deg` }}>
            <span className="pin pin--teal" aria-hidden />
            <span className="index-card__title">{s.title}</span>
            <span className="index-card__note">{s.note ?? 'Coming soon'}</span>
          </div>
        ))}
      </div>

      {zoom && (
        <button className="lightbox" onClick={() => setZoom(null)} aria-label="Close photo">
          <span className="lightbox__photo">
            <MemoryImage m={zoom} />
            <span className="pinned-photo__cap">{zoom.caption}</span>
            {zoom.when && <span className="lightbox__when">{zoom.when}</span>}
          </span>
        </button>
      )}
    </Sheet>
  )
}

function MemoryImage({ m }: { m: Memory }) {
  const [ok, setOk] = useState(!!m.image)
  return ok && m.image ? (
    <img className="pinned-photo__img" src={asset(m.image)} alt="" onError={() => setOk(false)} loading="lazy" />
  ) : (
    <span className="pinned-photo__img pinned-photo__img--empty" aria-hidden>
      photo
    </span>
  )
}
