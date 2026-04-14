import { ReactNode } from 'react'
import Sidebar from '../components/Sidebar'
import type { EventItem } from '../types'

export default function AdminLayout({
  children,
  events,
}: {
  children: ReactNode
  events: EventItem[]
}) {
  return (
    <div className="relative min-h-screen bg-background text-text">
      <div className="glow-orb green" />
      <div className="glow-orb blue" />
      <div className="dot-grid absolute inset-0 opacity-60" />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar events={events} />
        <main className="flex-1 px-6 py-8 lg:px-10">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
