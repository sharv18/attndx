import { motion } from 'framer-motion'
import type { EventItem } from '../types'

interface DashboardProps {
  events: EventItem[]
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

export default function Dashboard({ events }: DashboardProps) {
  const totalAttendance = events.reduce((sum, event) => sum + event.attendees, 0)
  const activeEvents = events.filter((event) => event.status === 'Upcoming').length
  const uniqueStudents = Math.floor(totalAttendance * 0.82)

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ duration: 0.45 }}
      className="space-y-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.3em] text-muted">
            Overview
          </div>
          <div className="mt-2 text-3xl font-extrabold text-text font-heading">
            Welcome back, Admin
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-emerald-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulseDot" />
          Live
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Total Events',
            value: events.length,
            change: '+12% this month',
            accent: 'text-emerald-300',
          },
          {
            label: 'Total Attendance',
            value: totalAttendance,
            change: '+8% today',
            accent: 'text-blue-300',
          },
          {
            label: 'Active Events',
            value: activeEvents,
            change: '2 starting soon',
            accent: 'text-emerald-300',
          },
          {
            label: 'Unique Students',
            value: uniqueStudents,
            change: '+5% weekly',
            accent: 'text-blue-300',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card-hover relative rounded-2xl border border-white/10 bg-surface p-5"
          >
            <div className="text-xs uppercase tracking-[0.3em] text-muted">
              {stat.label}
            </div>
            <div className={`mt-3 text-3xl font-semibold ${stat.accent}`}>
              {stat.value}
            </div>
            <div className="mt-2 text-xs text-muted">{stat.change}</div>
            <div className="absolute right-5 top-5 h-10 w-10 rounded-full border border-white/10 bg-white/5" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/10 bg-surface p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted">
              Recent Events
            </div>
            <div className="mt-2 text-xl font-semibold text-text font-heading">
              Latest Activity
            </div>
          </div>
          <button className="rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-widest text-muted">
            View All
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-muted">
              <tr>
                <th className="pb-3">Event Name</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Attendance</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="table-divider text-sm">
              {events.map((event) => (
                <tr key={event.id} className="text-text">
                  <td className="py-3 font-semibold">{event.title}</td>
                  <td className="py-3 text-muted">{event.date}</td>
                  <td className="py-3 text-muted">{event.location}</td>
                  <td className="py-3">{event.attendees}</td>
                  <td className="py-3">
                    <span
                      className={`status-badge ${
                        event.status === 'Upcoming'
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : 'bg-amber-500/20 text-amber-200'
                      }`}
                    >
                      {event.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-xs">
                      <button className="rounded-lg border border-white/10 px-2 py-1 text-muted">
                        View
                      </button>
                      <button className="rounded-lg border border-white/10 px-2 py-1 text-muted">
                        QR
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
