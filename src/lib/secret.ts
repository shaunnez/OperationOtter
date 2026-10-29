import { decode } from './cipher'

/**
 * Wrap any spoiler text in content.ts with secret("…").
 * Dev: returns the string as-is. Production: the build plugin swaps the
 * literal for an encoded blob that is decoded here at runtime.
 */
export function secret(text: string): string {
  return text
}

secret.decode = decode
