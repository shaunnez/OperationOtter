import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../lib/useNow'

type Drop = { x: number; y: number; len: number; speed: number; alpha: number; layer: number }

/** Two-layer slanted rain streaks drawn on a canvas. */
export function Rain({ density = 1, tint = '200,220,255' }: { density?: number; tint?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf = 0
    let w = 0
    let h = 0
    let drops: Drop[] = []
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const n = Math.round(((w * h) / 2600) * density * (reduced ? 0.4 : 1))
      drops = Array.from({ length: n }, () => spawn(true))
    }

    const spawn = (anywhere: boolean): Drop => {
      const layer = Math.random() < 0.3 ? 1 : 0
      return {
        x: Math.random() * (w + 80) - 40,
        y: anywhere ? Math.random() * h : -30 - Math.random() * 60,
        len: layer ? 16 + Math.random() * 14 : 8 + Math.random() * 8,
        speed: layer ? 14 + Math.random() * 6 : 8 + Math.random() * 4,
        alpha: layer ? 0.22 + Math.random() * 0.18 : 0.1 + Math.random() * 0.12,
        layer,
      }
    }

    const slant = 0.18
    let last = performance.now()
    const tick = (t: number) => {
      const dt = Math.min(48, t - last) / 16.67
      last = t
      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = 'round'
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        d.y += d.speed * dt
        d.x -= d.speed * slant * dt
        if (d.y - d.len > h) drops[i] = spawn(false)
        ctx.strokeStyle = `rgba(${tint},${d.alpha})`
        ctx.lineWidth = d.layer ? 1.3 : 0.8
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x + d.len * slant, d.y - d.len)
        ctx.stroke()
      }
      if (!reduced) raf = requestAnimationFrame(tick)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    raf = requestAnimationFrame(tick)
    const onVis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) {
        last = performance.now()
        raf = requestAnimationFrame(tick)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [density, tint, reduced])

  return <canvas ref={ref} className="rain" aria-hidden />
}
