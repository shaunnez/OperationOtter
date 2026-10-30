import { useEffect, useRef, useState } from 'react'
import type { Song } from '../content/types'
import { ambience } from '../lib/ambience'
import { barMusic } from '../lib/barMusic'
import { timeTravelAllowed } from '../lib/time'

const YT_ORIGIN = 'https://www.youtube-nocookie.com'

/**
 * Small "now playing" card with a real YouTube player in it. It asks to
 * autoplay; Android Chrome allows that after her tap on the street. If the
 * phone refuses (iPhones usually do), YouTube's own play button shows in the
 * card and one tap starts it.
 */
export function BarMusic({ song }: { song: Song }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(false)
  const [waited, setWaited] = useState(false)
  const [error, setError] = useState<number | null>(null)

  useEffect(() => {
    const t = window.setTimeout(() => setWaited(true), 2500)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== YT_ORIGIN || e.source !== frame.current?.contentWindow) return
      let data: { event?: string; info?: unknown }
      try {
        data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
      } catch {
        return
      }
      if (data.event === 'onError') {
        const code = typeof data.info === 'number' ? data.info : 0
        // Real build: quietly put the jukebox away. Test build: say why.
        if (timeTravelAllowed()) setError(code)
        else barMusic.stop()
        return
      }
      let state: number | undefined
      if (data.event === 'onStateChange' && typeof data.info === 'number') state = data.info
      if (data.event === 'infoDelivery' && data.info && typeof (data.info as { playerState?: number }).playerState === 'number')
        state = (data.info as { playerState: number }).playerState
      if (state !== undefined) setPlaying(state === 1 || state === 3)
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  useEffect(() => {
    ambience.duck(playing, 'bar-song')
    return () => ambience.duck(false, 'bar-song')
  }, [playing])

  const listen = () => {
    const w = frame.current?.contentWindow
    if (!w) return
    // Ask the player to post its state back to us
    w.postMessage(JSON.stringify({ event: 'listening', id: 'bar-song', channel: 'widget' }), YT_ORIGIN)
    w.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id: 'bar-song', channel: 'widget' }), YT_ORIGIN)
  }

  const params = new URLSearchParams({
    autoplay: '1',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    controls: '0',
    enablejsapi: '1',
    origin: window.location.origin,
  })
  if (song.start) params.set('start', String(song.start))

  return (
    <div className={`barmusic ${playing ? 'is-playing' : ''}`} data-testid="bar-music">
      <div className="barmusic__screen">
        <iframe
          ref={frame}
          src={`${YT_ORIGIN}/embed/${song.youtubeId}?${params}`}
          title={`${song.title} on the jukebox`}
          allow="autoplay; encrypted-media"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={listen}
        />
      </div>
      <div className="barmusic__meta">
        <span className="barmusic__kicker">
          {error !== null ? `YouTube error ${error}: try another upload` : playing ? 'On the jukebox' : waited ? 'Tap to play' : 'Cueing it up'}
        </span>
        <span className="barmusic__title">{song.title}</span>
        <span className="barmusic__artist">{song.artist}</span>
      </div>
      <button className="barmusic__stop" onClick={() => barMusic.stop()} aria-label="Stop the music">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
