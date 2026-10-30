import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { config } from '../content/content'
import { street } from '../content/scenes'
import { Glows, Grain } from '../fx/Atmosphere'
import { NeonSign } from '../fx/Neon'
import { Rain } from '../fx/Rain'
import { ambience } from '../lib/ambience'
import { barMusic } from '../lib/barMusic'
import { at } from '../lib/gating'
import { usePrefersReducedMotion } from '../lib/useNow'
import { Countdown, Logo } from '../ui/bits'
import { At, OnSurface, Stage, type Pt } from './Stage'

import walkTrack from '../content/walk-track.json'

// idle → walking (the clip plays, overlays follow its camera) → entering (warm flash) → bar
// With no clip, or reduced motion: idle → zooming (CSS push into the door) → bar
type Phase = 'idle' | 'walking' | 'entering' | 'zooming'

type Key = [t: number, s: number, rDeg: number, tx: number, ty: number]
const TRACK = walkTrack as Key[]

/** Camera move of the walk clip at time t, relative to its first frame. */
function cameraAt(t: number): string {
  let i = 0
  while (i < TRACK.length - 2 && TRACK[i + 1][0] <= t) i++
  const a = TRACK[i]
  const b = TRACK[i + 1] ?? a
  const f = b[0] > a[0] ? Math.min(1, Math.max(0, (t - a[0]) / (b[0] - a[0]))) : 0
  const lerp = (j: number) => a[j] + (b[j] - a[j]) * f
  return `translate(${lerp(3) * 100}%, ${lerp(4) * 100}%) rotate(${lerp(2)}deg) scale(${lerp(1)})`
}

export function Street({ now, onEnter }: { now: Date; onEnter: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [idleReady, setIdleReady] = useState(false)
  const walkRef = useRef<HTMLVideoElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()
  const target = at(config.countdownTo)
  const caseClosed = now >= target

  useEffect(() => {
    if (phase !== 'zooming' && phase !== 'entering') return
    const t = window.setTimeout(onEnter, reduced ? 150 : phase === 'entering' ? 850 : 1250)
    return () => window.clearTimeout(t)
  }, [phase, onEnter, reduced])

  // While the clip plays, move the neon/glow layer with the clip's camera.
  useEffect(() => {
    if (phase !== 'walking') return
    let raf = 0
    const tick = () => {
      const v = walkRef.current
      if (v && trackRef.current) trackRef.current.style.transform = cameraAt(v.currentTime)
      if (v && v.currentTime >= street.walkEndAt) {
        setPhase('entering')
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    // Never strand her on the street if the clip stalls
    const stall = window.setTimeout(() => {
      if ((walkRef.current?.currentTime ?? 0) < 0.2) setPhase((p) => (p === 'walking' ? 'zooming' : p))
    }, 3000)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(stall)
    }
  }, [phase])

  const enter = () => {
    if (phase !== 'idle') return
    ambience.enable()
    // Start the jukebox from inside this tap (iPhones only allow it from a tap)
    if (barMusic.kick()) barMusic.start()
    const v = walkRef.current
    if (street.walkVideo && v && !reduced) {
      setPhase('walking')
      v.currentTime = 0
      v.play().catch(() => setPhase('zooming'))
    } else {
      setPhase('zooming')
    }
  }

  const door = street.door
  const origin = `${door.x}% ${door.y}%`

  const media = (
    <>
      <img className="stage__img" src={street.image.src} alt="" draggable={false} />
      {street.idleVideo && (
        <video
          className={`stage__img stage__video ${idleReady && phase === 'idle' ? 'is-ready' : ''}`}
          src={street.idleVideo}
          poster={street.image.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setIdleReady(true)}
        />
      )}
      {street.walkVideo && (
        <video
          ref={walkRef}
          className={`stage__img stage__video stage__video--walk ${phase === 'walking' || phase === 'entering' ? 'is-ready' : ''}`}
          src={street.walkVideo}
          muted
          playsInline
          preload="auto"
          onEnded={() => setPhase((p) => (p === 'walking' ? 'entering' : p))}
        />
      )}
    </>
  )

  return (
    <section className={`scene street phase-${phase}`} aria-label="A rainy street outside Danny Doolans">
      <div className="street__camera" style={{ '--origin': origin } as CSSProperties}>
        <Stage image={street.image} keepVisible={street.keepVisible} focusX={street.focusX} anchorY={0.62} media={media} testId="street-stage">
          <div className="street__tracked" ref={trackRef}>
            <Glows glows={street.glows} />
            <OnSurface corners={street.sign as [Pt, Pt, Pt, Pt]} w={640} h={300} className="sign-surface">
              <NeonSign
                lines={[
                  { text: 'DANNY DOOLANS', tone: 'pink', size: 74 },
                  { text: 'BAR', tone: 'teal', size: 60 },
                ]}
                brokenIndex={9}
              />
            </OnSurface>
            <At x={door.x - door.w / 2} y={door.y - door.h / 2} w={door.w} h={door.h} className="door-light" />
          </div>
          {phase === 'idle' && (
            <>
              <button className="door-target" style={{ left: `${door.x}%`, top: `${door.y}%` }} onClick={enter} aria-label="Go inside Danny Doolans" data-testid="door">
                <span className="door-target__ring" />
                <span className="door-target__ring door-target__ring--echo" />
              </button>
              <span className="door-hint" style={{ left: `${door.x}%`, top: `${door.y + 6}%` }} aria-hidden>
                <svg viewBox="0 0 40 60" width="22" height="34">
                  <path d="M20 56 C 18 40, 22 22, 20 6 M12 14 L20 5 L28 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
                tap to
                <br />
                enter
              </span>
            </>
          )}
        </Stage>
      </div>

      <Rain />
      <Grain />
      <div className="street__flash" aria-hidden />
      {phase === 'walking' && (
        <button className="skip-walk" onClick={() => setPhase('entering')} aria-label="Skip to inside the bar">
          <span>tap to skip</span>
        </button>
      )}

      <header className="topbar">
        <Logo />
      </header>

      <footer className="street__footer">
        <div className="case-clock" data-testid="case-clock">
          <div className="case-clock__head">
            <svg className="case-clock__icon" viewBox="0 0 24 28" aria-hidden>
              <path d="M3 2h12l6 6v18H3z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M15 2v6h6M7 13h10M7 17h10M7 21h7" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <div>
              <p className="case-clock__label">{caseClosed ? 'Case closed' : 'Current case'}</p>
              <p className="case-clock__title">{config.caseTitle}</p>
            </div>
          </div>
          {!caseClosed && <Countdown to={target} now={now} testId="countdown" />}
        </div>
      </footer>
    </section>
  )
}
