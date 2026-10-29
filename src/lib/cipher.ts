// Tiny reversible scramble used to keep future content out of plain sight in
// the built bundle. It is deliberately simple: this is a surprise, not a vault.

const KEY = 'goose-and-fish-at-danny-doolans'

function toBase64(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

function fromBase64(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function xor(bytes: Uint8Array): Uint8Array {
  const out = new Uint8Array(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ KEY.charCodeAt(i % KEY.length) ^ (i * 31) % 251
  }
  return out
}

export function encode(text: string): string {
  return toBase64(xor(new TextEncoder().encode(text))).split('').reverse().join('')
}

export function decode(blob: string): string {
  return new TextDecoder().decode(xor(fromBase64(blob.split('').reverse().join(''))))
}
