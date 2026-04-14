import { useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/Dashboard'
import EventsPage from './pages/EventsPage'
import AttendancePage from './pages/AttendancePage'
import LoginPage from './pages/LoginPage'
import QRGeneratorPage from './pages/QRGeneratorPage'
import ScanPage from './pages/ScanPage'
import NotFound from './pages/NotFound'
import { mockEvents } from './data/mock'
import type { EventItem } from './types'
import api from './utils/api'

function RequireAuth({
  token,
  children,
}: {
  token: string | null
  children: JSX.Element
}) {
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('attendx_token'),
  )
  const isAuthed = useMemo(() => Boolean(authToken), [authToken])

  const normalizeEvents = (items: EventItem[]) =>
    items.map((item) => ({
      ...item,
      id: (item as EventItem & { _id?: string })._id ?? item.id,
    }))

  useEffect(() => {
    const handleAuth = () => {
      setAuthToken(localStorage.getItem('attendx_token'))
    }
    window.addEventListener('attendx-auth', handleAuth)
    return () => window.removeEventListener('attendx-auth', handleAuth)
  }, [])

  useEffect(() => {
    if (!authToken) {
      setEvents([])
      return
    }
    const loadEvents = async () => {
      try {
        const response = await api.get('/api/events')
        setEvents(normalizeEvents(response.data))
      } catch {
        setEvents([])
      }
    }
    loadEvents()
  }, [authToken])

  const handleCreateEvent = (event: EventItem) => {
    setEvents((prev) => [event, ...prev])
  }

  const handleDeleteEvent = (event: EventItem) => {
    setEvents((prev) => prev.filter((item) => item.id !== event.id))
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthed ? '/dashboard' : '/login'} replace />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/scan" element={<ScanPage />} />
      <Route
        element={
          <RequireAuth token={authToken}>
            <AdminLayout events={events}>
              <Outlet />
            </AdminLayout>
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard events={events} />} />
        <Route
          path="/events"
          element={
            <EventsPage
              events={events}
              onCreateEvent={handleCreateEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          }
        />
        <Route
          path="/events/:id/attendance"
          element={<AttendancePage events={events} />}
        />
        <Route
          path="/qr-generator"
          element={<QRGeneratorPage events={events} />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
