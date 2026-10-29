import { createContext, useContext, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { SceneImage } from '../content/scenes'

type Geometry = { sw: number; sh: number; left: number; top: number; vw: number; vh: number }

const StageCtx = createContext<Geometry | null>(null)
export const useStage = () => useContext(StageCtx)

type Props = {
  image: SceneImage
  /** % of image width to centre on */
  focusX?: number
  /** 0 = top, 0.5 = centre, 1 = bottom (used when the image is taller or shorter than the screen) */
  anchorY?: number
  /** Horizontal slice (in %) that must always be visible; shrinks the image if needed */
  keepVisible?: { x0: number; x1: number }
  /** Let her swipe left/right when the art is wider than the screen */
  pannable?: boolean
  className?: string
  media?: ReactNode
  children?: ReactNode
  onPan?: (fraction: number) => void
  testId?: string
}

/**
 * Lays the scene art out like `object-fit: cover` and gives children a box
 * that matches the art exactly, so hotspots in % stay glued to the picture.
 */
export function Stage({ image, focusX = 50, anchorY = 0.5, keepVisible, pannable, className, media, children, onPan, testId }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [g, setG] = useState<Geometry | null>(null)
  const didInitialScroll = useRef(false)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const vw = el.clientWidth
      const vh = el.clientHeight
      if (!vw || !vh) return
      let s = Math.max(vw / image.w, vh / image.h)
      if (keepVisible) s = Math.min(s, vw / (((keepVisible.x1 - keepVisible.x0) / 100) * image.w))
      const sw = image.w * s
      const sh = image.h * s
      const top = (vh - sh) * anchorY
      let left: number
      if (sw <= vw) left = (vw - sw) / 2
      else if (pannable) left = 0
      else left = Math.min(0, Math.max(vw - sw, vw / 2 - (focusX / 100) * sw))
      setG({ sw, sh, left, top, vw, vh })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [image.w, image.h, focusX, anchorY, keepVisible, pannable])

  useLayoutEffect(() => {
    const el = ref.current
    if (!g || !el || !pannable || didInitialScroll.current) return
    didInitialScroll.current = true
    el.scrollLeft = Math.max(0, (focusX / 100) * g.sw - g.vw / 2)
  }, [g, pannable, focusX])

  const boxStyle: CSSProperties | undefined = g
    ? ({
        width: g.sw,
        height: g.sh,
        left: g.left,
        top: g.top,
        '--sw': `${g.sw}px`,
        '--sh': `${g.sh}px`,
      } as CSSProperties)
    : undefined

  const letterboxed = g && (g.sh < g.vh - 1 || g.sw < g.vw - 1)

  return (
    <div
      ref={ref}
      className={`stage ${pannable ? 'stage--pan' : ''} ${className ?? ''}`}
      data-testid={testId}
      onScroll={
        onPan
          ? (e) => {
              const el = e.currentTarget
              const max = el.scrollWidth - el.clientWidth
              onPan(max > 0 ? el.scrollLeft / max : 0.5)
            }
          : undefined
      }
    >
      {letterboxed && <div className="stage__backdrop" style={{ backgroundImage: `url(${image.src})` }} aria-hidden />}
      {pannable && g && <div className="stage__track" style={{ width: g.sw, height: '100%' }} aria-hidden />}
      {g && (
        <div className={`stage__box ${letterboxed ? 'stage__box--feather' : ''}`} style={boxStyle}>
          {media ?? <img className="stage__img" src={image.src} alt="" draggable={false} />}
          <StageCtx.Provider value={g}>{children}</StageCtx.Provider>
        </div>
      )}
    </div>
  )
}

/** Absolutely positions children at a % point (or box) on the art. */
export function At({
  x,
  y,
  w,
  h,
  className,
  style,
  children,
}: {
  x: number
  y: number
  w?: number
  h?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}) {
  return (
    <div
      className={`at ${className ?? ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: w !== undefined ? `${w}%` : undefined,
        height: h !== undefined ? `${h}%` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export type Pt = [number, number]

/**
 * CSS matrix3d that maps a w×h box onto four corner points (px), so flat
 * content can be "painted" onto a surface in perspective. Corners are
 * top-left, top-right, bottom-right, bottom-left.
 */
export function quadMatrix(w: number, h: number, [p0, p1, p2, p3]: [Pt, Pt, Pt, Pt]): string {
  const [x0, y0] = p0
  const [x1, y1] = p1
  const [x2, y2] = p2
  const [x3, y3] = p3
  const dx1 = x1 - x2
  const dx2 = x3 - x2
  const dx3 = x0 - x1 + x2 - x3
  const dy1 = y1 - y2
  const dy2 = y3 - y2
  const dy3 = y0 - y1 + y2 - y3
  const den = dx1 * dy2 - dx2 * dy1
  const g = (dx3 * dy2 - dx2 * dy3) / den
  const hh = (dx1 * dy3 - dx3 * dy1) / den
  const a = x1 - x0 + g * x1
  const b = x3 - x0 + hh * x3
  const d = y1 - y0 + g * y1
  const e = y3 - y0 + hh * y3
  const m = [a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1]
  return `matrix3d(${m.map((v) => +v.toFixed(8)).join(',')})`
}

/** Renders children in a w×h box warped onto a quad given in % of the art. */
export function OnSurface({
  corners,
  w,
  h,
  className,
  children,
}: {
  corners: [Pt, Pt, Pt, Pt]
  w: number
  h: number
  className?: string
  children?: ReactNode
}) {
  const g = useStage()
  if (!g) return null
  const px = corners.map(([x, y]) => [(x / 100) * g.sw, (y / 100) * g.sh]) as [Pt, Pt, Pt, Pt]
  return (
    <div
      className={`surface ${className ?? ''}`}
      style={{ width: w, height: h, transform: quadMatrix(w, h, px) }}
    >
      {children}
    </div>
  )
}
