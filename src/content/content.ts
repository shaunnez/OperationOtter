/**
 * ─────────────────────────────────────────────────────────────────────────
 *  OPERATION OTTER: all the words, dates and media live here.
 *
 *  • Times are New Zealand wall-clock ("2026-11-04T06:00").
 *  • Wrap anything that would spoil a future day in secret("…"). The build
 *    scrambles those strings so they can't be read in view-source.
 *    It must be a plain string literal: secret("ok"), not secret(x + y).
 *  • draft: true marks text Claude wrote as a stand-in. Dev and preview
 *    builds show a small DRAFT tag on it so you can find it.
 *  • Images go in /public/assets/… and are referenced as "/assets/…".
 * ─────────────────────────────────────────────────────────────────────────
 */
import { secret } from '../lib/secret'
import type { Day, Memory, Reveals, Someday, Song, Video } from './types'

export const config = {
  /** What the otter calls her */
  name: 'Goose',
  caseTitle: 'The Missing Specimen',
  /** The case clock on the street counts down to this */
  countdownTo: '2026-11-06T06:00',
}

export const days: Day[] = [
  {
    n: 1,
    unlockAt: '2026-11-02T06:00',
    title: secret('Where it all started'),
    otterLine: secret("The city never sleeps, Goose. Neither do I. Pull up a stool, we've got a case."),
    clue: {
      question: secret('Every case starts somewhere. Where did this one start?'),
      options: [secret('A dark alley'), secret('Danny Doolans'), secret('The fish market'), secret('Night court')],
      answer: 1,
      draft: true,
    },
    evidence: {
      title: secret('Something soft'),
      tag: secret('Wear with zero ambition'),
      notes: secret(
        'Grey. Soft. Elastic waist. Recovered in excellent condition. The suspect is advised to put them on immediately and achieve nothing for the rest of the evening.',
      ),
      quote: secret('Comfort is not a crime, Goose.'),
      quoteBy: 'The Otter',
      image: secret('/assets/evidence-1.webp'),
      draft: true,
    },
    reward: { kind: 'song', id: 'pink-pony-club', label: secret('Pink Pony Club is on the jukebox'), cta: secret('Play it') },
  },
  {
    n: 2,
    unlockAt: '2026-11-03T06:00',
    title: secret('Something fizzy'),
    otterLine: secret("Long day, Goose? I know a fix. It fizzes. And somebody left a tape behind the bar."),
    clue: {
      question: secret('Tonight’s evidence fizzes, smells suspiciously good, and dissolves without a trace. Where does it belong?'),
      options: [secret('In a cocktail'), secret('In the bath'), secret('In the goose’s water dish'), secret('In evidence lockup')],
      answer: 1,
      draft: true,
    },
    evidence: {
      title: secret('The fizz'),
      tag: secret('Dissolves on contact'),
      notes: secret(
        'Small, round, and smells like a crime against boredom. Forensics recommend hot water, a locked door and at least forty minutes. Do not operate heavy machinery.',
      ),
      quote: secret('Every good detective needs a long soak.'),
      quoteBy: 'The Otter',
      image: secret('/assets/evidence-2.webp'),
      draft: true,
    },
    reward: { kind: 'video', id: 'v1', label: secret('Someone left a tape at the bar'), cta: secret('Watch it') },
  },
  {
    n: 3,
    unlockAt: '2026-11-04T06:00',
    title: secret('Hot work'),
    otterLine: secret('Big day, Goose. Wear something nice. Bring an appetite and steady hands.'),
    clue: {
      question: secret('Tonight you get your hands on something hot. What is it?'),
      options: [secret('A hot tip'), secret('Molten glass'), secret('A stolen pie'), secret('The goose')],
      answer: 1,
      draft: true,
    },
    evidence: {
      title: secret('A matchbook'),
      tag: secret('Read the inside'),
      notes: secret(
        'Found in the back booth. One table booked, two names inside, and a furnace running hot afterwards. Whatever you make tonight, you get to keep.',
      ),
      quote: secret('Some things are worth getting burned for.'),
      quoteBy: 'The Otter',
      image: secret('/assets/evidence-3.webp'),
      draft: true,
    },
    reward: { kind: 'reveal', id: 'wednesday', label: secret('The back booth is open'), cta: secret('Open the booth') },
  },
  {
    n: 4,
    unlockAt: '2026-11-05T06:00',
    title: secret('Last call'),
    otterLine: secret('Tonight the bar’s yours, Goose. I bought the ingredients. You bring the bad decisions.'),
    clue: {
      question: secret('Ingredients bought. Glasses chilled. Shaker polished. What’s happening tonight?'),
      options: [secret('Cocktail night'), secret('A stakeout'), secret('Karaoke'), secret('An early night')],
      answer: 0,
      draft: true,
    },
    evidence: {
      title: secret('Two glasses'),
      tag: secret('Shaken, obviously'),
      notes: secret(
        'Two glasses, one shaker, and a suspicious amount of citrus. The recipes are on the chalkboard. The bartender works for tips. Mostly kisses.',
      ),
      quote: secret('Bad decisions are free. Says so on the menu.'),
      quoteBy: 'Danny Doolans',
      image: secret('/assets/evidence-4.webp'),
      draft: true,
    },
    reward: { kind: 'reveal', id: 'thursday', label: secret('The chalkboard has tonight’s menu'), cta: secret('Read the menu') },
  },
  {
    n: 5,
    unlockAt: '2026-11-06T06:00',
    title: secret('The back room'),
    otterLine: secret('Last day of the case, Goose. Some things get handed over in person. One thing I kept in the back room.'),
    clue: {
      question: secret('Final question. Rackets, sunshine, and somebody yelling “out”. Where are we going?'),
      options: [secret('The ASB Classic'), secret('Night court'), secret('The fish market'), secret('Wimbledon')],
      answer: 0,
      draft: true,
    },
    evidence: {
      title: secret('A ticket stub'),
      tag: secret('Admit two'),
      notes: secret('Recovered from the back room safe. Fuzzy, yellow, and headed somewhere sunny. The case is closed, but this one stays open.'),
      quote: secret('Best case I ever worked, Goose.'),
      quoteBy: 'The Otter',
      image: secret('/assets/evidence-5.webp'),
      draft: true,
    },
    reward: { kind: 'reveal', id: 'friday', label: secret('The back room is unlocked'), cta: secret('Go in') },
  },
]

export const songs: Song[] = [
  { id: 'pink-pony-club', title: 'Pink Pony Club', artist: 'Chappell Roan', youtubeId: 'GR3Liudev18', unlockAt: '2026-11-02T06:00' },
  { id: 'song-2', title: secret('Song two'), artist: secret('Artist to come'), youtubeId: '', unlockAt: '2026-11-03T06:00' },
  { id: 'song-3', title: secret('Song three'), artist: secret('Artist to come'), youtubeId: '', unlockAt: '2026-11-04T06:00' },
  { id: 'song-4', title: secret('Song four'), artist: secret('Artist to come'), youtubeId: '', unlockAt: '2026-11-05T06:00' },
]

export const memories: Memory[] = [
  { id: 'm1', caption: secret('Memory one: caption to come'), image: '', unlockAt: '2026-11-03T06:00' },
  { id: 'm2', caption: secret('Memory two: caption to come'), image: '', unlockAt: '2026-11-04T06:00' },
  { id: 'm3', caption: secret('Memory three: caption to come'), image: '', unlockAt: '2026-11-05T06:00' },
  { id: 'm4', caption: secret('Memory four: caption to come'), image: '', unlockAt: '2026-11-06T06:00' },
]

export const videos: Video[] = [
  { id: 'v1', from: secret('Friend one'), youtubeId: '', unlockAt: '2026-11-03T06:00' },
  { id: 'v2', from: secret('Friend two'), youtubeId: '', unlockAt: '2026-11-04T06:00' },
  { id: 'v3', from: secret('Friend three'), youtubeId: '', unlockAt: '2026-11-05T06:00' },
]

export const reveals: Reveals = {
  wednesday: {
    day: 3,
    heading: secret('Wednesday, sorted'),
    intro: secret('Two stops. Dress nice, eat well, then make something beautiful out of fire.'),
    stops: [
      {
        label: secret('Dinner'),
        name: secret('Nomiya'),
        note: secret('Japanese tapas & bar'),
        time: secret('6:00 pm'),
        address: secret('484 New North Road, Kingsland'),
        draft: true, // time still to confirm
      },
      {
        label: secret('Then'),
        name: secret('Glass blowing for two'),
        time: secret('8:00 pm'),
        address: secret('Next door to Nomiya, Kingsland'),
        note: secret('Studio name to come'),
        draft: true,
      },
    ],
  },
  thursday: {
    day: 4,
    heading: secret('Tonight’s specials'),
    intro: secret('Ingredients are in the kitchen. Pick one. Or both. It’s Thursday.'),
    cocktails: [
      {
        name: secret('The Silly Goose'),
        glass: secret('Coupe'),
        ingredients: [secret('45 ml gin'), secret('20 ml elderflower liqueur'), secret('20 ml fresh lemon'), secret('Top with prosecco')],
        method: secret('Shake the first three hard with ice, strain into a chilled coupe, top with prosecco.'),
        draft: true,
      },
      {
        name: secret('It’s Okay Fish'),
        glass: secret('Highball'),
        ingredients: [secret('50 ml dark rum'), secret('15 ml fresh lime'), secret('Ginger beer'), secret('Lime wedge')],
        method: secret('Build over ice: lime, ginger beer, then float the rum on top. Bad days don’t last forever.'),
        draft: true,
      },
    ],
  },
  friday: {
    day: 5,
    heading: secret('The back room'),
    intro: secret('You made it to the end of the case, Goose. Here’s what was behind the door.'),
    voucher: {
      title: secret('ASB Classic'),
      detail: secret('Tennis for two. Auckland, January. Details to come.'),
      image: '',
      draft: true,
    },
    signOff: [
      secret('Five days. Five clues. One very patient goose.'),
      secret('I’ve worked a lot of cases in this town. Most of them end in the rain.'),
      secret('This one ends with you.'),
      secret('Case closed. Happy anniversary, Goose.'),
    ],
  },
}

/** "40 before 40" corkboard: parked ideas, no dates */
export const someday: Someday[] = [
  { title: 'Zip line' },
  { title: 'Jet ski' },
  { title: 'Private chef' },
  { title: 'New Caledonia or Rarotonga' },
]

/** Easter eggs on the bar: always available */
export const eggs = {
  fish: {
    title: 'It’s okay fish',
    notes: 'Found behind the bar. A little soggy, but the message is clear. Even in a messy world… it’s okay fish.',
    quote: 'Bad days don’t last forever. Good fish do.',
    quoteBy: 'Danny Doolans',
  },
  goose: {
    title: 'Silly goose',
    notes: 'Spotted on the bar, unsupervised, again. Witnesses describe her as “honking” and “an absolute delight”. No further questions.',
    quote: 'Every bar needs a regular. This one has a goose.',
    quoteBy: 'The Otter',
  },
}

/** The otter's lines */
export const lines = {
  beforeOpening: 'Bar’s closed till Monday, Goose. Come back at six. I’ll leave the light on.',
  afterCase: 'Case closed, Goose. Best one I ever worked. Stay as long as you like.',
  lookAround: 'Have a look around, Goose. Swipe. Nothing in here bites. Except the goose.',
  locked: [
    'Not yet, Goose. Good things come to those who wait. So do bad ones.',
    'That one’s locked. I checked. Twice.',
    'Classified. Above your pay grade. Also mine.',
    'Patience, Goose. Even I can’t rush the paperwork.',
    'Some cases crack themselves. This one needs a calendar.',
  ],
  clueFirst: 'Clue first, Goose. Then the good stuff.',
  wrong: ['Cold, Goose. Ice cold.', 'Not quite. I’ve seen worse guesses. Not many.', 'Try again. The goose is judging you.'],
  giveAway: 'I’ll let that one slide. The answer was staring right at you.',
  solved: 'Nice work, Goose. Case notes coming through.',
}
