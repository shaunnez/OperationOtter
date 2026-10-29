/** NZ wall-clock time, e.g. "2026-11-04T06:00". */
export type NzTime = string

export type Clue = {
  question: string
  options: string[]
  /** index into options */
  answer: number
  draft?: boolean
}

export type Evidence = {
  /** Title on the case-file card, e.g. "It's okay fish" */
  title: string
  /** Image in /public, shown in the Polaroid. Leave empty for a placeholder. */
  image?: string
  /** Transparent cut-out (shown whole on a dark backdrop instead of cropped) */
  cutout?: boolean
  /** Handwritten tag on the Polaroid */
  tag?: string
  notes: string
  quote?: string
  quoteBy?: string
  draft?: boolean
}

export type RewardRef =
  | { kind: 'song'; id: string }
  | { kind: 'memory'; id: string }
  | { kind: 'video'; id: string }
  | { kind: 'reveal'; id: RevealId }

export type Day = {
  n: number
  unlockAt: NzTime
  /** Shown in the case file once unlocked */
  title: string
  /** The otter's line for the day, shown when she walks in */
  otterLine: string
  clue: Clue
  evidence: Evidence
  reward: RewardRef & { label: string; cta: string }
  /** What gets handed over in real life that day (shown after solving) */
  gift?: string
}

export type Song = {
  id: string
  title: string
  artist: string
  youtubeId?: string
  /** Start the video at this many seconds */
  start?: number
  unlockAt: NzTime
}

export type Memory = {
  id: string
  image?: string
  caption: string
  /** When it happened, in your words */
  when?: string
  unlockAt: NzTime
}

export type Video = {
  id: string
  from: string
  youtubeId?: string
  unlockAt: NzTime
}

export type RevealId = 'wednesday' | 'thursday' | 'friday'

export type Stop = { label: string; name: string; time: string; address: string; note?: string; draft?: boolean }

export type Cocktail = { name: string; glass: string; ingredients: string[]; method: string; note?: string; draft?: boolean }

export type Reveals = {
  wednesday: { day: number; heading: string; intro: string; stops: Stop[] }
  thursday: { day: number; heading: string; intro: string; cocktails: Cocktail[] }
  friday: {
    day: number
    heading: string
    intro: string
    voucher: { title: string; detail: string; image?: string; draft?: boolean }
    signOff: string[]
  }
}

export type Someday = { title: string; note?: string }
