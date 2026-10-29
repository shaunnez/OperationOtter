/**
 * Light spoiler protection (not security).
 *
 * In production builds, every string literal passed to `secret("…")` inside
 * src/content is replaced with an encoded blob, so a casual view-source or a
 * search through the JS bundle doesn't reveal future days. In dev the strings
 * are left alone so editing content.ts stays easy.
 */
import type { Plugin } from 'vite'
import { encode } from './src/lib/cipher.ts'

type Node = { type: string; start: number; end: number; [k: string]: unknown }

function walk(node: unknown, visit: (n: Node) => void) {
  if (!node || typeof node !== 'object') return
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit)
    return
  }
  const n = node as Node
  if (typeof n.type === 'string') visit(n)
  for (const key of Object.keys(n)) {
    if (key === 'parent') continue
    walk(n[key], visit)
  }
}

export function secretContent(): Plugin {
  let isBuild = false
  return {
    name: 'operation-otter:secret-content',
    enforce: 'post',
    configResolved(config) {
      isBuild = config.command === 'build'
    },
    transform(code, id) {
      if (!isBuild) return null
      if (!/\/src\/content\/[^?]*\.[jt]sx?$/.test(id)) return null
      if (!code.includes('secret(')) return null

      const ast = this.parse(code) as unknown
      const edits: { start: number; end: number; text: string }[] = []

      walk(ast, (n) => {
        if (n.type !== 'CallExpression') return
        const callee = n.callee as Node & { name?: string }
        if (callee.type !== 'Identifier' || callee.name !== 'secret') return
        const [arg] = n.arguments as (Node & { value?: unknown; quasis?: { value: { cooked: string } }[]; expressions?: unknown[] })[]
        if (!arg) return
        let value: string | null = null
        if (arg.type === 'Literal' && typeof arg.value === 'string') value = arg.value
        if (arg.type === 'TemplateLiteral' && arg.expressions?.length === 0) value = arg.quasis![0].value.cooked
        if (value === null) {
          this.error(`secret() needs a plain string literal (${id})`)
        }
        edits.push({ start: n.start, end: n.end, text: `secret.decode(${JSON.stringify(encode(value))})` })
      })

      if (!edits.length) return null
      let out = code
      for (const e of edits.sort((a, b) => b.start - a.start)) {
        out = out.slice(0, e.start) + e.text + out.slice(e.end)
      }
      return { code: out, map: null }
    },
  }
}
