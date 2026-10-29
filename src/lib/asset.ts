/**
 * Turns a content path like "/assets/bar.webp" into a URL that works wherever
 * the site is hosted (e.g. GitHub Pages serves it under /OperationOtter/).
 * Keep writing "/assets/…" in content; call asset() where it hits the DOM.
 */
export function asset(path: string): string
export function asset(path: string | undefined): string | undefined
export function asset(path: string | undefined): string | undefined {
  if (!path) return path
  if (/^(https?:|data:|blob:)/.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
