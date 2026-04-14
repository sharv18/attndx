import type { EventItem } from '../types'

interface EventCardProps {
  event: EventItem
  onOpen: (event: EventItem) => void
  onQR: (event: EventItem) => void
  onDelete: (event: EventItem) => void
}

export default function EventCard({ event, onOpen, onQR, onDelete }: EventCardProps) {
  return (
    <div
      className="card-hover cursor-pointer rounded-2xl border border-white/10 bg-surface p-5"
      onClick={() => onOpen(event)}
    >
      <div className="text-xs uppercase tracking-[0.3em] text-muted">
        {event.date}
      </div>
      <div className="mt-3 text-xl font-extrabold text-text font-heading">
        {event.title}
      </div>
      <div className="mt-2 text-sm text-muted">\ud83d\udccd {event.location}</div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted">Attendees</div>
          <div className="text-lg font-semibold text-emerald-300">
            {event.attendees}
          </div>
        </div>
        <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
          <button
            className="rounded-lg border border-white/10 px-3 py-2 text-xs uppercase tracking-widest text-muted hover:text-text"
            onClick={() => onDelete(event)}
          >
            Delete
          </button>
          <button
            className="rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest gradient-button"
            onClick={() => onQR(event)}
          >
            QR
          </button>
        </div>
      </div>
    </div>
  )
}
