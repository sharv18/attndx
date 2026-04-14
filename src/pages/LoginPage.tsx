import { motion } from 'framer-motion'
import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useToast } from '../components/ToastProvider'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { pushToast } = useToast()

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      })
      const token = response.data?.token ?? 'demo-token'
      localStorage.setItem('attendx_token', token)
      window.dispatchEvent(new Event('attendx-auth'))
      navigate('/dashboard')
    } catch (error) {
      pushToast('Login failed. Check email and password.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-text">
      <div className="glow-orb green" />
      <div className="glow-orb blue" />
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <motion.div
          className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-8 shadow-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <div className="text-2xl font-extrabold text-text font-heading">
              AttendX
            </div>
            <div className="text-xs text-muted">
              for Pimprichichwad College of Engineering
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest text-muted">
                Email
              </label>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
                required
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-muted">
                Password
              </label>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                className="mt-2 w-full rounded-lg border border-white/10 bg-surface2 px-3 py-2 text-sm text-text"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-4 rounded-lg px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] gradient-button"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </form>

        </motion.div>
      </div>
    </div>
  )
}
