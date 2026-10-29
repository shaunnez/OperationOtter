import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavCtx, type Nav, type Overlay } from './nav'
import { Street } from './scenes/Street'
import { Bar } from './scenes/Bar'
import { Overlays } from './overlays/Overlays'
import { ambience } from './lib/ambience'
import { timeTravelAllowed } from './lib/time'
import { TimeMachine } from './ui/TimeMachine'
import { useNow } from './lib/useNow'
import { barMusic, useBarMusicOn } from './lib/barMusic'
import { BarMusic } from './ui/BarMusic'
import { config, songs } from './content/content'
import { isOpen } from './lib/gating'

const barSong = songs.find((s) => s.id === config.barSong)

type Scene = 'street' | 'bar'
type HistState = { scene: Scene; depth: number }

export default function App() {
  const [scene, setScene] = useState<Scene>('street')
  const [stack, setStack] = useState<Overlay[]>([])
  const now = useNow(1000)
  const musicOn = useBarMusicOn()
  const stackRef = useRef(stack)
  stackRef.current = stack
  const sceneRef = useRef(scene)
  sceneRef.current = scene

  // Browser/Android back button closes overlays, then leaves the bar.
  useEffect(() => {
    window.history.replaceState({ scene: 'street', depth: 0 } satisfies HistState, '')
    const onPop = (e: PopStateEvent) => {
      const st = (e.state as HistState | null) ?? { scene: 'street', depth: 0 }
      setScene(st.scene)
      setStack((s) => s.slice(0, st.depth))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    ambience.setScene(scene)
    if (scene !== 'bar') barMusic.stop()
  }, [scene])

  const nav: Nav = useMemo(
    () => ({
      open: (o) => {
        const depth = stackRef.current.length + 1
        window.history.pushState({ scene: sceneRef.current, depth } satisfies HistState, '')
        setStack((s) => [...s, o])
      },
      replace: (o) => setStack((s) => (s.length ? [...s.slice(0, -1), o] : [o])),
      close: () => window.history.back(),
    }),
    [],
  )

  const enterBar = useCallback(() => {
    window.history.pushState({ scene: 'bar', depth: 0 } satisfies HistState, '')
    setScene('bar')
    if (ambience.enabled) barMusic.start()
  }, [])

  const leaveBar = useCallback(() => {
    window.history.back()
  }, [])

  return (
    <NavCtx.Provider value={nav}>
      <div className="app" data-scene={scene}>
        {scene === 'street' ? <Street now={now} onEnter={enterBar} /> : <Bar now={now} onLeave={leaveBar} />}
        {scene === 'bar' && musicOn && barSong?.youtubeId && isOpen(barSong.unlockAt, now) && <BarMusic song={barSong} />}
        <Overlays stack={stack} now={now} />
        {timeTravelAllowed() && stack.length === 0 && <TimeMachine now={now} />}
      </div>
    </NavCtx.Provider>
  )
}

