import type { Overlay } from '../nav'
import { CaseFileList, ClueView, EggView, EvidenceView } from './CaseFile'
import { ClueFirst, Locked } from './Locked'
import { Jukebox, PhotoWall, Tv } from './Media'
import { Reveal } from './Reveals'

/** Renders the top overlay. Keys force a fresh mount (and entrance animation) per overlay. */
export function Overlays({ stack, now }: { stack: Overlay[]; now: Date }) {
  const top = stack[stack.length - 1]
  if (!top) return null
  const key = `${stack.length}:${JSON.stringify(top)}`
  return <div key={key} className="overlay-host">{render(top, now)}</div>
}

function render(o: Overlay, now: Date) {
  switch (o.kind) {
    case 'locked':
      return <Locked title={o.title} unlockAt={o.unlockAt} now={now} />
    case 'clueFirst':
      return <ClueFirst day={o.day} title={o.title} />
    case 'casefile':
      return <CaseFileList now={now} />
    case 'clue':
      return <ClueView dayN={o.day} />
    case 'evidence':
      return <EvidenceView dayN={o.day} fresh={o.fresh} />
    case 'egg':
      return <EggView id={o.id} />
    case 'jukebox':
      return <Jukebox songId={o.songId} now={now} />
    case 'photos':
      return <PhotoWall now={now} albumId={o.albumId} />
    case 'tv':
      return <Tv videoId={o.videoId} now={now} />
    case 'reveal':
      return <Reveal id={o.id} />
  }
}
