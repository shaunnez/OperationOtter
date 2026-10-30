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
import type { Album, Day, Reveals, Someday, Song, Video } from './types'

export const config = {
  /** What the otter calls her */
  name: 'Fish',
  caseTitle: 'The Missing Specimen',
  /** The case clock on the street counts down to this */
  countdownTo: '2026-11-06T06:00',
  /** Plays on the jukebox when she walks into the bar (once that song is unlocked) */
  barSong: 'pink-pony-club',
}

export const days: Day[] = [
  {
    n: 1,
    unlockAt: '2026-11-02T06:00',
    title: secret('Where it all started'),
    otterLine: secret("The city never sleeps, Fish. Neither do I. Pull up a stool, we've got a case."),
    clue: {
      question: secret('Every case starts somewhere. Where did this one start?'),
      options: [secret('A dark alley'), secret('Danny Doolans'), secret('The fish market'), secret('Night court')],
      answer: 1,
    },
    evidence: {
      title: secret('Something soft'),
      tag: secret('Wear with zero ambition'),
      notes: secret(
        'Grey. Soft. Elastic waist. Recovered in excellent condition. The suspect is advised to put them on immediately and achieve nothing for the rest of the evening.',
      ),
      quote: secret('Comfort is not a crime, fish-i-mous.'),
      quoteBy: 'Goose',
      image: secret('/assets/evidence-1.webp'),
    },
    reward: { kind: 'album', id: 'a1', label: secret('Someone pinned a roll of film to the wall'), cta: secret('Have a look') },
  },
  {
    n: 2,
    unlockAt: '2026-11-03T06:00',
    title: secret('Something fizzy'),
    otterLine: secret("Long day, Fish? I know a fix. It fizzes. And somebody left a tape behind the bar."),
    clue: {
      question: secret('Tonight’s evidence fizzes, smells suspiciously good, and dissolves without a trace. Where does it belong?'),
      options: [secret('In a cocktail'), secret('In the bath'), secret('In the goose’s water dish'), secret('In evidence lockup')],
      answer: 1,
    },
    evidence: {
      title: secret('The fizz'),
      tag: secret('Dissolves on contact'),
      notes: secret(
        'Small, round, and smells like a crime against boredom. Forensics recommend hot water, a locked door and at least forty minutes.',
      ),
      quote: secret('Every good detective needs a long soak.'),
      quoteBy: 'The Otter',
      image: secret('/assets/evidence-2.webp'),
    },
    reward: { kind: 'video', id: 'v1', label: secret('Someone left a tape at the bar'), cta: secret('Watch it') },
  },
  {
    n: 3,
    unlockAt: '2026-11-04T06:00',
    title: secret('Hot work'),
    otterLine: secret('Big day, Fish. Wear something nice. Bring an appetite and steady hands.'),
    clue: {
      question: secret('Tonight you get your hands on something hot. What is it?'),
      options: [secret('A hot tip'), secret('Molten glass'), secret('A stolen pie'), secret('The goose')],
      answer: 1,
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
    },
    reward: { kind: 'reveal', id: 'wednesday', label: secret('The back booth is open'), cta: secret('Open the booth') },
  },
  {
    n: 4,
    unlockAt: '2026-11-05T06:00',
    title: secret('Last call'),
    otterLine: secret('Tonight the bar’s yours, Fish. I bought the ingredients. You bring the bad decisions.'),
    clue: {
      question: secret('Ingredients bought. Glasses chilled. Shaker polished. What’s happening tonight?'),
      options: [secret('Cocktail night'), secret('A stakeout'), secret('Karaoke'), secret('An early night')],
      answer: 0,
    },
    evidence: {
      title: secret('Two glasses'),
      tag: secret('Shaken, obviously'),
      notes: secret(
        'Small, tasty, dangerous, and smells like a crime against boredom. Forensics recommend having several, for loose inhibitions, questionable decisions and fun bedroom antics. The bartender works for tips. Mostly kisses.',
      ),
      quote: secret('Every detective needs a little liquid support every now and then. Enjoy your danger juice.'),
      quoteBy: 'Goose',
      image: secret('/assets/evidence-4.webp'),
    },
    reward: { kind: 'reveal', id: 'thursday', label: secret('Menu unlocked. Tonight’s specials are on the board.'), cta: secret('Open the menu') },
  },
  {
    n: 5,
    unlockAt: '2026-11-06T06:00',
    title: secret('The back room'),
    otterLine: secret('Last day of the case, Fish. Some things get handed over in person. One thing I kept in the back room.'),
    clue: {
      question: secret('Final question. Rackets, sunshine, and somebody yelling “out”. Where are we going?'),
      options: [secret('The cricket'), secret('A random person’s house'), secret('The fish market'), secret('The ASB Classic')],
      answer: 3,
    },
    evidence: {
      title: secret('A ticket stub'),
      tag: secret('Admit two'),
      notes: secret('Recovered from the back room safe. Fuzzy, yellow, and headed somewhere sunny. The case is closed, but this one stays open.'),
      quote: secret('Can’t wait to find another epic photo opportunity with you. You know what I’m talking about.'),
      quoteBy: 'Goose',
      image: secret('/assets/evidence-5.webp'),
    },
    reward: { kind: 'reveal', id: 'friday', label: secret('The back room is unlocked'), cta: secret('Go in') },
  },
]

export const songs: Song[] = [
  { id: 'pink-pony-club', title: 'Pink Pony Club', artist: 'Chappell Roan', youtubeId: 'GR3Liudev18', unlockAt: '2026-11-02T06:00' },
  { id: 'song-2', title: secret('Rockstar'), artist: secret('Nickelback'), youtubeId: 'DmeUuoxyt_E', unlockAt: '2026-11-03T06:00' },
  { id: 'song-3', title: secret('10 Drunk Cigarettes'), artist: secret('Girly Girl Productions'), youtubeId: '42rHB72Bb1Q', unlockAt: '2026-11-04T06:00' },
  { id: 'song-4', title: secret('Hallelujah'), artist: secret('Jeff Buckley'), youtubeId: 'y8AWFf7EAc4', unlockAt: '2026-11-05T06:00' },
]

/**
 * Photo wall: one mini album per day. Each opens at 6am on its day.
 * Add photos with: python3 scripts/add-photos.py <folder-of-photos> a1
 * (resizes, strips location data, writes /assets/albums/a1/01.webp …)
 * then list them below as { image: '/assets/albums/a1/01.webp', caption: secret('…') }.
 * Captions are optional.
 */
export const albums: Album[] = [
  { id: 'a1', title: secret('Roll one'), unlockAt: '2026-11-02T06:00', photos: [], draft: true },
  { id: 'a2', title: secret('Roll two'), unlockAt: '2026-11-03T06:00', photos: [], draft: true },
  { id: 'a3', title: secret('Roll three'), unlockAt: '2026-11-04T06:00', photos: [], draft: true },
  { id: 'a4', title: secret('Roll four'), unlockAt: '2026-11-05T06:00', photos: [], draft: true },
  { id: 'a5', title: secret('Roll five'), unlockAt: '2026-11-06T06:00', photos: [], draft: true },
]

/**
 * The old TV. Either self-hosted (src: '/assets/videos/v1.mp4', made with
 * scripts/add-video.sh) or YouTube (youtubeId). Self-hosted wins if both are set.
 */
export const videos: Video[] = [
  { id: 'v1', from: secret('Caleb'), youtubeId: 'ixK3DCsV1q8', portrait: true, unlockAt: '2026-11-03T06:00' },
  { id: 'v2', from: secret('Ash'), youtubeId: 'x1kODrxdEWE', portrait: true, unlockAt: '2026-11-05T06:00' },
]

export const reveals: Reveals = {
  wednesday: {
    day: 3,
    heading: secret('Wednesday, sorted'),
    intro: secret('Two stops in Kingsland. Dress nice, eat well, then make something beautiful out of fire.'),
    stops: [
      {
        label: secret('Dinner'),
        name: secret('Nomiya'),
        note: secret('Japanese tapas & bar'),
        time: secret('5:00 pm'),
        address: secret('484 New North Road, Kingsland'),
      },
      {
        label: secret('Then'),
        name: secret('Monmouth Glass Studio'),
        note: secret('Glass blowing lesson. Whatever you make, you keep.'),
        time: secret('6:00 pm'),
        address: secret('3 Central Road, Kingsland'),
        draft: true, // time is their usual Wednesday class (6–8:30pm); confirm with the booking
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
    intro: secret('You made it to the end of the case, Fish. Here’s what was behind the door.'),
    voucher: {
      title: secret('ASB Classic Women’s'),
      detail: secret('Two day-session tickets. Stanley Street, Auckland, 4–10 January 2027. We pick the day together.'),
      image: '',
      draft: true,
    },
    signOff: [
      secret('Five days. Five clues. One very patient fish.'),
      secret('I’ve worked cases alone, and you’ve proven you’re up to the task. Welcome to the big leagues, my fellow detective.'),
      secret('Case closed. Happy anniversary. I love you.'),
    ],
    signedBy: secret('Your Goose'),
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
    notes: 'Spotted on the bar, unsupervised, again. Witnesses describe him as “honking” and “an absolute delight”. No further questions.',
    quote: 'Every bar needs a regular. This one has a goose.',
    quoteBy: 'The Otter',
  },
}

/** The otter's lines */
export const lines = {
  beforeOpening: 'Bar’s closed till Monday, Fish. Come back at six. I’ll leave the light on.',
  afterCase: 'Case closed, Fish. Best one I ever worked. Stay as long as you like.',
  lookAround: 'Have a look around, Fish. Swipe. Nothing in here bites. Except the goose.',
  locked: [
    'Not yet, Fish. Good things come to those who wait. So do bad ones.',
    'That one’s locked. I checked. Twice.',
    'Classified. Above your pay grade. Also mine.',
    'Patience, Fish. Even I can’t rush the paperwork.',
    'Some cases crack themselves. This one needs a calendar.',
  ],
  clueFirst: 'Clue first, Fish. Then the good stuff.',
  wrong: ['Cold, Fish. Ice cold.', 'Not quite. I’ve seen worse guesses. Not many.', 'Try again. The goose is judging you.'],
  giveAway: 'I’ll let that one slide. The answer was staring right at you.',
  solved: 'Nice work, Fish. Case notes coming through.',
}
