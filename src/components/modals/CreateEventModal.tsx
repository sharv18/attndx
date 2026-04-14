import { ChangeEvent, FormEvent, useState } from 'react'
import Modal from '../Modal'
import type { EventItem } from '../../types'
import api from '../../utils/api'

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (event: EventItem) => void
}

const emptyForm = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
}

export default function CreateEventModal({
  isOpen,
  onClose,
  onCreate,
}: CreateEventModalProps) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)

  const onChange = (field: keyof typeof form) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/events', {
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time,
        location: form.location,
      })
      const payload = response.data?.event ?? response.data ?? {}
      const newEvent: EventItem = {
        id: payload._id ?? payload.id ?? `evt_${Date.now()}`,
        title: payload.title ?? form.title,
        description: payload.description ?? form.description,
        date: payload.date ?? form.date,
        time: payload.time ?? form.time,
        location: payload.location ?? form.location,
        attendees: payload.attendees ?? 0,
        status: payload.status ?? 'Upcoming',
        qrToken:
          payload.qrToken ?? `token_${Math.random().toString(36).slice(2, 10)}`,
      }
      onCreate(newEvent)
      setForm(emptyForm)
    } catch {
      const fallbackEvent: EventItem = {
        id: `evt_${Date.now()}`,
        title: form.title,
        description: form.description,
        date: form.date,
        time: form.time,
        location: form.location,
        attendees: 0,
        status: 'Upcoming',
        qrToken: `token_${Math.random().toString(36).slice(2, 10)}`,
      }
      onCreate(fallbackEvent)
      setForm(emptyForm)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Event">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-muted">
            Event Title*
          </label>
          <input
            value={form.title}
            onChange={onChange('title')}
            required
            className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
          />
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={onChange('description')}
            rows={3}
            className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-widest text-muted">
              Date*
            </label>
            <input
              value={form.date}
              onChange={onChange('date')}
              required
              type="date"
              className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-muted">
              Time
            </label>
            <input
              value={form.time}
              onChange={onChange('time')}
              type="time"
              className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
            />
          </div>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-muted">
            Location*
          </label>
          <input
            value={form.location}
            onChange={onChange('location')}
            required
            className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-muted"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-widest gradient-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
