import { motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EventCard from '../components/EventCard'
import CreateEventModal from '../components/modals/CreateEventModal'
import QRModal from '../components/modals/QRModal'
import type { EventItem } from '../types'
import { useToast } from '../components/ToastProvider'

interface EventsPageProps {
  events: EventItem[]
  onCreateEvent: (event: EventItem) => void
  onDeleteEvent: (event: EventItem) => void
}

export default function EventsPage({
  events,
  onCreateEvent,
  onDeleteEvent,
}: EventsPageProps) {
  const navigate = useNavigate()
  const { pushToast } = useToast()
  const [createOpen, setCreateOpen] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)
  const [selected, setSelected] = useState<EventItem | null>(null)

  const handleOpenEvent = (event: EventItem) => {
    navigate(`/events/${event.id}/attendance`)
  }

  const handleCreate = (event: EventItem) => {
    onCreateEvent(event)
    setCreateOpen(false)
    setSelected(event)
    setQrOpen(true)
    pushToast('Event created successfully.', 'success')
  }

  const handleQR = (event: EventItem) => {
    setSelected(event)
    setQrOpen(true)
  }

  const handleDelete = (event: EventItem) => {
    onDeleteEvent(event)
    pushToast('Event deleted.', 'info')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-muted">
            Events
          </div>
          <div className="mt-2 text-2xl font-extrabold text-text font-heading">
            Upcoming & Past
          </div>
        </div>
        <button
          className="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] gradient-button"
          onClick={() => setCreateOpen(true)}
        >
          + Create Event
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onOpen={handleOpenEvent}
            onQR={handleQR}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CreateEventModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
      <QRModal isOpen={qrOpen} event={selected} onClose={() => setQrOpen(false)} />
    </motion.div>
  )
}
