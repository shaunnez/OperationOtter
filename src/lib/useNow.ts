import { useEffect, useState } from 'react'
import { getNow } from './time'

/** Re-renders every `ms` with the app clock. */
export function useNow(ms = 1000): Date {
  const [now, setNow] = useState(getNow)
  useEffect(() => {
    const id = window.setInterval(() => setNow(getNow()), ms)
    const onVis = () => setNow(getNow())
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [ms])
  return now
}

export function usePrefersReducedMotion(): boolean {
  const [r, setR] = useState(() => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const on = () => setR(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return !!r
}
