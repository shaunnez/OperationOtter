import { useEffect, useRef, type ReactNode } from 'react'
import { useNav } from '../nav'
import { CloseButton, Logo } from '../ui/bits'

export function Sheet({ label, variant = 'dark', children, testId }: { label: string; variant?: 'dark' | 'paper' | 'cork' | 'chalk'; children: ReactNode; testId?: string }) {
  const nav = useNav()
  const closeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const btn = closeRef.current?.querySelector('button')
    btn?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') nav.close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nav])

  return (
    <div className={`sheet sheet--${variant}`} role="dialog" aria-modal="true" aria-label={label} data-testid={testId}>
      <div className="sheet__scrim" onClick={nav.close} aria-hidden />
      <div className="sheet__panel">
        <div className="sheet__top">
          <Logo />
          <div ref={closeRef}>
            <CloseButton onClick={nav.close} />
          </div>
        </div>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  )
}
