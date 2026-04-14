import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { EventItem, AttendanceRecord } from '../types'
import api from '../utils/api'

interface AttendancePageProps {
  events: EventItem[]
}

export default function AttendancePage({ events }: AttendancePageProps) {
  const { id } = useParams()
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const event = events.find((item) => item.id === id)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const response = await api.get(`/api/events/${id}/attendance`)
        setRecords(response.data)
      } catch {
        setRecords([])
      }
    }
    load()
  }, [id])

  const filtered = useMemo(() => {
    if (!query) return records
    const lower = query.toLowerCase()
    return records.filter(
      (record) =>
        record.rollNumber.toLowerCase().includes(lower) ||
        record.name.toLowerCase().includes(lower),
    )
  }, [query, records])

  const handleExport = () => {
    const header = 'Roll Number,Name,Marked At,Status\n'
    const rows = filtered
      .map((row) => `${row.rollNumber},${row.name},${row.markedAt},${row.status}`)
      .join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `attendance_${event?.title ?? 'event'}.csv`
    link.click()
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
          <Link
            to="/events"
            className="text-xs uppercase tracking-[0.3em] text-muted"
          >
            ← Back to Events
          </Link>
          <div className="mt-2 text-2xl font-extrabold text-text font-heading">
            {event?.title ?? 'Attendance'}
          </div>
        </div>
        <button
          className="rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-muted"
          onClick={handleExport}
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-surface p-4">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full flex-1 rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text md:max-w-sm"
        />
        <div className="text-xs uppercase tracking-[0.3em] text-muted">
          {filtered.length} records
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted">
            <div className="text-3xl">🧾</div>
            <div className="text-sm">No attendance records yet.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted">
                <tr>
                  <th className="pb-3">#</th>
                  <th className="pb-3">Roll Number</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Marked At</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="table-divider">
                {filtered.map((record, index) => (
                  <tr key={record.id}>
                    <td className="py-3 text-muted">{index + 1}</td>
                    <td className="py-3 font-semibold text-text">
                      {record.rollNumber}
                    </td>
                    <td className="py-3 text-muted">{record.name}</td>
                    <td className="py-3 text-muted">{record.markedAt}</td>
                    <td className="py-3">
                      <span className="status-badge bg-emerald-500/20 text-emerald-200">
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  )
}
