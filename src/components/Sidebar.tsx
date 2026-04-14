import { NavLink, useNavigate } from 'react-router-dom'
import type { EventItem } from '../types'

interface SidebarProps {
  events: EventItem[]
}

export default function Sidebar({ events }: SidebarProps) {
  const navigate = useNavigate()
  const eventsCount = events.length
  const attendancePath = events[0]
    ? `/events/${events[0].id}/attendance`
    : '/events'
  const navItems = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Events', to: '/events' },
    { label: 'Attendance', to: attendancePath },
    { label: 'QR Generator', to: '/qr-generator' },
  ]

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-white/5 bg-surface px-4 py-6 lg:flex">
      <div className="px-3">
        <div className="text-lg font-extrabold text-text font-heading">
          AttendX
        </div>
        <div className="text-xs text-muted">
          for Pimprichichwad College of Engineering
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-300'
                  : 'text-muted hover:bg-white/5 hover:text-text'
              }`
            }
          >
            <span>{item.label}</span>
            {item.label === 'Events' && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-text">
                {eventsCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-surface2 p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500" />
          <div>
            <div className="text-sm font-semibold text-text">Admin</div>
            <div className="text-xs text-muted">admin@attendx.com</div>
          </div>
        </div>
        <button
          className="mt-4 w-full rounded-lg border border-white/10 px-3 py-2 text-xs uppercase tracking-widest text-muted transition hover:text-text"
          onClick={() => {
            localStorage.removeItem('attendx_token')
            window.dispatchEvent(new Event('attendx-auth'))
            navigate('/login')
          }}
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
