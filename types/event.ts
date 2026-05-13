// types/event.ts
export interface CalendarEvent {
  id: string
  title: string
  start?: string
  end?: string
  allDay?: boolean
  color?: string
  description?: string
  rrule?: {
    freq: string
    byweekday?: string[]
    dtstart?: string
    until?: string
  }
  duration?: string
}
