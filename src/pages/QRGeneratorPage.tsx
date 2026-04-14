import { QRCodeCanvas } from 'qrcode.react'
import { motion } from 'framer-motion'
import { useMemo, useRef, useState } from 'react'
import type { EventItem } from '../types'

interface QRGeneratorPageProps {
  events: EventItem[]
}

export default function QRGeneratorPage({ events }: QRGeneratorPageProps) {
  const [selected, setSelected] = useState<EventItem | null>(events[0] ?? null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const qrUrl = useMemo(() => {
    if (!selected) return ''
    const baseUrl = window.location.origin
    return `${baseUrl}/scan?token=${selected.qrToken}`
  }, [selected])

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas || !selected) return
    const link = document.createElement('a')
    link.download = `AttendX_${selected.title}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCopy = async () => {
    if (!qrUrl) return
    await navigator.clipboard.writeText(qrUrl)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid gap-6 lg:grid-cols-[1fr_1.2fr]"
    >
      <div className="rounded-2xl border border-white/10 bg-surface p-4">
        <div className="text-xs uppercase tracking-[0.3em] text-muted">
          Events
        </div>
        <div className="mt-2 text-xl font-semibold text-text font-heading">
          Select an event
        </div>
        <div className="mt-4 grid gap-3">
          {events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 px-4 py-6 text-sm text-muted">
              No events yet.
            </div>
          ) : (
            events.map((event) => (
              <button
                key={event.id}
                onClick={() => setSelected(event)}
                className={`rounded-2xl border px-4 py-3 text-left transition ${
                  selected?.id === event.id
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : 'border-white/10 bg-surface2 text-text hover:bg-white/5'
                }`}
              >
                <div className="text-sm font-semibold">{event.title}</div>
                <div className="text-xs text-muted">{event.date}</div>
              </button>
            ))
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-6">
        <div className="text-xs uppercase tracking-[0.3em] text-muted">
          QR Preview
        </div>
        <div className="mt-2 text-xl font-semibold text-text font-heading">
          {selected?.title ?? 'Select an event'}
        </div>
        <div className="mt-6 flex flex-col items-center gap-4">
          <div ref={canvasRef} className="rounded-2xl bg-white p-4">
            <QRCodeCanvas value={qrUrl} size={220} />
          </div>
          <div className="text-center text-sm text-muted">
            {selected?.location}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              className="rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-widest gradient-button"
              onClick={handleDownload}
            >
              Download PNG
            </button>
            <button
              className="rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-muted"
              onClick={handleCopy}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
