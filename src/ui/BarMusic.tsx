import { useEffect, useRef, useState } from 'react'
import type { Song } from '../content/types'
import { ambience } from '../lib/ambience'
import { barMusic } from '../lib/barMusic'
import { timeTravelAllowed } from '../lib/time'

const YT_ORIGIN = 'https://www.youtube-nocookie.com'

/**
 * "Now playing" strip with a real YouTube player in it. The player is loaded
 * quietly (hidden) while she is still on the street, and the door tap starts
 * it from inside the tap itself, which is the only way iPhones allow it. The
 * strip then shows once she is in the bar. If the phone still refuses,
 * YouTube's own play button shows in it and one tap starts it.
 */
export function BarMusic({ song, visible }: { song: Song; visible: boolean }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const startedVisible = useRef(visible)
  // A tap that came before the hidden player finished loading waits here
  const ready = useRef(false)
  const wantsPlay = useRef(false)
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
      if (data.event === 'onReady') {
        ready.current = true
        flush()
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

  const command = (func: string) => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [], id: 'bar-song', channel: 'widget' }), YT_ORIGIN)
  }

  const flush = () => {
    if (!wantsPlay.current) return
    wantsPlay.current = false
    command('playVideo')
  }

  useEffect(
    () =>
      barMusic.registerPlayer(() => {
        if (ready.current) command('playVideo')
        else wantsPlay.current = true
      }),
    [],
  )

  // Left the bar (or closed it): stop the sound but keep the player loaded for next time
  useEffect(() => {
    if (!visible) command('pauseVideo')
  }, [visible])

  useEffect(() => {
    ambience.duck(playing, 'bar-song')
    return () => ambience.duck(false, 'bar-song')
  }, [playing])

  const listen = () => {
    const w = frame.current?.contentWindow
    if (!w) return
    ready.current = true
    flush()
    // Ask the player to post its state back to us
    w.postMessage(JSON.stringify({ event: 'listening', id: 'bar-song', channel: 'widget' }), YT_ORIGIN)
    w.postMessage(JSON.stringify({ event: 'command', func: 'addEventListener', args: ['onStateChange'], id: 'bar-song', channel: 'widget' }), YT_ORIGIN)
  }

  const params = new URLSearchParams({
    autoplay: startedVisible.current ? '1' : '0',
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    controls: '0',
    enablejsapi: '1',
    origin: window.location.origin,
  })
  if (song.start) params.set('start', String(song.start))

  return (
    <div className={`barmusic ${playing ? 'is-playing' : ''} ${visible ? '' : 'barmusic--armed'}`} data-testid={visible ? 'bar-music' : 'bar-music-armed'}>
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
