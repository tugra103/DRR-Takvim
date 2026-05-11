'use client'
import { useState, useEffect } from 'react'
import { CalendarEvent } from '@/types/event'

const STORAGE_KEY = 'ajanda_events'

export function useEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  // Yükle
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setEvents(JSON.parse(stored))
  }, [])

  // Kaydet
  const save = (updated: CalendarEvent[]) => {
    setEvents(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const addEvent = (event: CalendarEvent) => {
    save([...events, event])
  }

  const updateEvent = (updated: CalendarEvent) => {
    save(events.map(e => e.id === updated.id ? updated : e))
  }

  const deleteEvent = (id: string) => {
    save(events.filter(e => e.id !== id))
  }

  return { events, addEvent, updateEvent, deleteEvent }
}

