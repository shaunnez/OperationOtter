import { asset } from '../lib/asset'
import { useEffect, useRef, useState } from 'react'
import { albums, someday, songs, videos } from '../content/content'
import type { Album, NzTime, Photo } from '../content/types'
import { barMusic } from '../lib/barMusic'
import { ambience } from '../lib/ambience'
import { at, isOpen } from '../lib/gating'
import { markSeen } from '../lib/progress'
import { formatDay, timeTravelAllowed } from '../lib/time'
import { useNav } from '../nav'
import { Draft, Padlock } from '../ui/bits'
import { Sheet } from './Sheet'

const dayShort = (t: NzTime) => formatDay(at(t))

/** Styled poster until tapped, then the real YouTube player. */
export function VideoPoster({
  youtubeId,
  src,
  poster,
  portrait,
  start,
  title,
  subtitle,
  look,
}: {
  youtubeId?: string
  /** Self-hosted MP4; used instead of YouTube when set */
  src?: string
  poster?: string
  portrait?: boolean
  start?: number
  title: string
  subtitle: string
  look: 'record' | 'crt'
}) {
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(false)
  }, [youtubeId, src, title])

  useEffect(() => {
    ambience.duck(playing)
    if (playing) barMusic.stop()
    return () => ambience.duck(false)
  }, [playing])

  if (playing && src) {
    return (
      <div className={`player player--${look} is-playing ${portrait ? 'player--tall' : ''}`}>
        <video src={`${asset(src)}#t=${start ?? 0.1}`} poster={asset(poster)} controls autoPlay playsInline preload="auto" data-testid="mp4" />
      </div>
    )
  }

  if (playing && youtubeId) {
    const params = new URLSearchParams({ autoplay: '1', playsinline: '1', rel: '0', modestbranding: '1' })
    if (start) params.set('start', String(start))
    return (
      <div className={`player player--${look} is-playing ${portrait ? 'player--tall' : ''}`}>
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
      {playing && !youtubeId && !src && (
        <p className="player__missing" role="status">
          {timeTravelAllowed() ? 'No video yet: add src or youtubeId in content.ts' : 'This tape hasn’t arrived yet. Check back soon.'}
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
      {selected && <VideoPoster look="crt" src={selected.src || undefined} poster={selected.poster} portrait={selected.portrait} youtubeId={selected.youtubeId} title={`From ${selected.from}`} subtitle="A message for Fish" />}
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

export function PhotoWall({ now, albumId }: { now: Date; albumId?: string }) {
  const nav = useNav()
  const [viewing, setViewing] = useState<Album | null>(() => {
    const a = albums.find((x) => x.id === albumId)
    return a && isOpen(a.unlockAt, now) ? a : null
  })
  const openCount = albums.filter((a) => isOpen(a.unlockAt, now)).length
  useEffect(() => albums.filter((a) => isOpen(a.unlockAt, now)).forEach((a) => markSeen(`album:${a.id}`)), [openCount]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Sheet label="Photo wall" variant="cork" testId="photos">
      <h2 className="cork-title">The wall</h2>
      <div className="pins">
        {albums.map((a, i) => {
          const unlocked = isOpen(a.unlockAt, now)
          const tilt = [-4, 3, -2, 5, -3, 2][i % 6]
          return unlocked ? (
            <button key={a.id} className="pinned-photo album" style={{ rotate: `${tilt}deg` }} onClick={() => setViewing(a)} data-testid={`album-${a.id}`}>
              <span className="pin" aria-hidden />
              <span className="album__stack" aria-hidden>
                <PhotoImage photo={a.photos[1]} className="album__under" />
                <PhotoImage photo={a.photos[0]} />
              </span>
              <span className="pinned-photo__cap">
                {a.title} <Draft when={a.draft} />
              </span>
              <span className="album__count">{a.photos.length ? `${a.photos.length} photo${a.photos.length === 1 ? '' : 's'}` : 'Developing'}</span>
            </button>
          ) : (
            <button key={a.id} className="pinned-photo is-back" style={{ rotate: `${tilt}deg` }} onClick={() => nav.open({ kind: 'locked', title: 'A roll of film', unlockAt: a.unlockAt })}>
              <span className="pin" aria-hidden />
              <span className="pinned-photo__back">
                <span>Do not open until</span>
                <strong>{dayShort(a.unlockAt)}</strong>
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

      {viewing && <AlbumViewer album={viewing} onClose={() => setViewing(null)} />}
    </Sheet>
  )
}

/** Full-screen swipe-through of one album (native scroll-snap). */
function AlbumViewer({ album, onClose }: { album: Album; onClose: () => void }) {
  const strip = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const total = album.photos.length

  const go = (d: number) => {
    const el = strip.current
    if (!el) return
    el.scrollTo({ left: (index + d) * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="album-view" role="dialog" aria-label={album.title} data-testid="album-view">
      <div className="album-view__top">
        <span className="album-view__title">{album.title}</span>
        {total > 0 && (
          <span className="album-view__count" data-testid="album-count">
            {index + 1} / {total}
          </span>
        )}
        <button className="album-view__close" onClick={onClose} aria-label="Close album">
          ✕
        </button>
      </div>
      {total === 0 ? (
        <p className="album-view__empty">Still developing. Check back soon.</p>
      ) : (
        <div
          ref={strip}
          className="album-view__strip"
          onScroll={(e) => {
            const el = e.currentTarget
            setIndex(Math.min(total - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth))))
          }}
        >
          {album.photos.map((p, i) => (
            <figure key={i} className="album-view__slide">
              <span className="album-view__photo" style={{ rotate: `${[-1.5, 1, -0.5, 1.5][i % 4]}deg` }}>
                <PhotoImage photo={p} eager={Math.abs(i - index) <= 1} />
                {(p.caption || p.when) && (
                  <figcaption className="album-view__cap">
                    {p.caption}
                    {p.when && <span className="album-view__when">{p.when}</span>}
                  </figcaption>
                )}
              </span>
            </figure>
          ))}
        </div>
      )}
      {total > 1 && (
        <div className="album-view__nav">
          <button onClick={() => go(-1)} disabled={index === 0} aria-label="Previous photo">
            ‹
          </button>
          <span className="album-view__dots" aria-hidden>
            {album.photos.map((_, i) => (
              <i key={i} className={i === index ? 'is-on' : ''} />
            ))}
          </span>
          <button onClick={() => go(1)} disabled={index >= total - 1} aria-label="Next photo">
            ›
          </button>
        </div>
      )}
    </div>
  )
}

function PhotoImage({ photo, className, eager }: { photo?: Photo; className?: string; eager?: boolean }) {
  const [ok, setOk] = useState(!!photo?.image)
  return ok && photo?.image ? (
    <img className={`pinned-photo__img ${className ?? ''}`} src={asset(photo.image)} alt="" onError={() => setOk(false)} loading={eager ? 'eager' : 'lazy'} decoding="async" />
  ) : (
    <span className={`pinned-photo__img pinned-photo__img--empty ${className ?? ''}`} aria-hidden>
      photo
    </span>
  )
}
