import { QRCodeCanvas } from 'qrcode.react'
import { useMemo, useRef } from 'react'
import Modal from '../Modal'
import type { EventItem } from '../../types'

interface QRModalProps {
  isOpen: boolean
  event: EventItem | null
  onClose: () => void
}

export default function QRModal({ isOpen, event, onClose }: QRModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const qrUrl = useMemo(() => {
    if (!event) return ''
    const baseUrl = window.location.origin
    return `${baseUrl}/scan?token=${event.qrToken}`
  }, [event])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `AttendX_${event?.title ?? 'event'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleCopy = async () => {
    if (!qrUrl) return
    await navigator.clipboard.writeText(qrUrl)
  }

  if (!event) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event QR Code">
      <div className="flex flex-col items-center gap-4">
        <div
          ref={canvasRef}
          className="relative flex items-center justify-center rounded-2xl bg-white p-4"
        >
          <QRCodeCanvas value={qrUrl} size={200} bgColor="#ffffff" />
          <div className="absolute h-10 w-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500" />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-text font-heading">
            {event.title}
          </div>
          <div className="text-sm text-muted">{event.location}</div>
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
        <div className="text-xs text-muted">{qrUrl}</div>
      </div>
    </Modal>
  )
}
