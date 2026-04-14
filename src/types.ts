export type EventStatus = 'Upcoming' | 'Past'

export interface EventItem {
  id: string
  title: string
  description?: string
  date: string
  time?: string
  location: string
  attendees: number
  status: EventStatus
  qrToken: string
}

export interface AttendanceRecord {
  id: string
  rollNumber: string
  name: string
  markedAt: string
  status: 'Present'
}
