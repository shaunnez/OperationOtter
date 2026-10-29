/**
 * Keeps the app phone-sized when a phone renders the page as a desktop site.
 *
 * In Safari's "Request Desktop Website" or Samsung Internet's "Desktop site"
 * mode, the browser ignores the viewport meta tag and lays the page out about
 * 980px wide, then shrinks it to fit the screen, so every bit of text ends up
 * tiny. The screen itself still reports its real size in CSS px, so we can
 * spot the mismatch and scale the whole app back up to fill the screen.
 */
const MIN_SCALE = 1.15

function isTouchFirst() {
  return window.matchMedia('(pointer: coarse)').matches || (navigator.maxTouchPoints > 0 && window.matchMedia('(hover: none)').matches)
}

export function uiScale(): number {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const sw = window.screen?.width
  const sh = window.screen?.height
  if (!vw || !vh || !sw || !sh || !isTouchFirst()) return 1
  // screen.width/height don't swap with rotation on every browser, so pick the side that matches
  const screenW = vw > vh ? Math.max(sw, sh) : Math.min(sw, sh)
  const k = vw / screenW
  return k >= MIN_SCALE ? k : 1
}

export function fitScreen() {
  const root = document.documentElement
  const apply = () => {
    const k = uiScale()
    if (k === 1) {
      root.classList.remove('ui-scaled')
      root.style.removeProperty('--ui-scale')
      root.style.removeProperty('--ui-w')
      root.style.removeProperty('--ui-h')
      return
    }
    root.classList.add('ui-scaled')
    root.style.setProperty('--ui-scale', String(k))
    root.style.setProperty('--ui-w', `${window.innerWidth / k}px`)
    root.style.setProperty('--ui-h', `${window.innerHeight / k}px`)
  }
  apply()
  window.addEventListener('resize', apply)
  window.addEventListener('orientationchange', apply)
}
