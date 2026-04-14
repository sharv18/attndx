import { Html5Qrcode } from 'html5-qrcode'
import { motion } from 'framer-motion'
import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import { useToast } from '../components/ToastProvider'
import { mockEvents } from '../data/mock'

interface EventInfo {
  title: string
  date: string
  location: string
}

export default function ScanPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null)
  const [rollNumber, setRollNumber] = useState('')
  const [name, setName] = useState('')
  const [success, setSuccess] = useState(false)
  const { pushToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return
    const load = async () => {
      try {
        const response = await api.get(`/api/events/by-token/${token}`)
        setEventInfo(response.data)
      } catch (error) {
        const fallback = mockEvents.find((event) => event.qrToken === token)
        if (fallback) {
          setEventInfo({
            title: fallback.title,
            date: fallback.date,
            location: fallback.location,
          })
        }
      }
    }
    load()
  }, [token])

  useEffect(() => {
    if (token) return
    const qr = new Html5Qrcode('qr-reader')
    qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 220 },
      (decodedText) => {
        qr.stop().finally(() => {
          let scannedToken: string | null = null
          try {
            const url = new URL(decodedText)
            scannedToken = url.searchParams.get('token')
          } catch {
            const match = decodedText.match(/token=([^&]+)/)
            scannedToken = match ? match[1] : null
          }
          if (scannedToken) {
            navigate(`/scan?token=${scannedToken}`)
          }
        })
      },
      () => {},
    )

    return () => {
      qr.stop().catch(() => {})
      qr.clear().catch(() => {})
    }
  }, [token, navigate])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!token) return
    try {
      await api.post('/api/attendance/mark', {
        token,
        rollNumber,
        name,
      })
      setSuccess(true)
    } catch (error) {
      const status = error?.response?.status
      if (status === 409) {
        pushToast('Already marked for this event.', 'error')
      } else {
        pushToast('Unable to mark attendance. Try again.', 'error')
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-text">
      <div className="glow-orb green" />
      <div className="glow-orb blue" />
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {!token && (
            <div className="space-y-4">
              <div className="text-sm uppercase tracking-[0.3em] text-muted">
                Scan QR to begin
              </div>
              <div id="qr-reader" className="overflow-hidden rounded-xl" />
            </div>
          )}

          {token && (
            <>
              <div className="text-xs uppercase tracking-[0.3em] text-muted">
                Event Attendance
              </div>
              <div className="mt-2 text-2xl font-extrabold text-text font-heading">
                {eventInfo?.title ?? 'Loading event'}
              </div>
              <div className="mt-1 text-sm text-muted">
                {eventInfo?.date ?? '...'} · {eventInfo?.location ?? ''}
              </div>

              {!success ? (
                <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted">
                      Roll Number
                    </label>
                    <input
                      value={rollNumber}
                      onChange={(event) =>
                        setRollNumber(event.target.value.toUpperCase())
                      }
                      className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted">
                      Name
                    </label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] gradient-button"
                  >
                    Mark My Attendance
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 18, stiffness: 220 }}
                  className="mt-8 flex flex-col items-center gap-3 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 text-3xl">
                    ✓
                  </div>
                  <div className="text-lg font-semibold text-text">
                    Attendance marked!
                  </div>
                  <div className="text-sm text-muted">
                    You are checked in for this event.
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
