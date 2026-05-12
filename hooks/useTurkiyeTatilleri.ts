// hooks/useTurkiyeTatilleri.ts
'use client'
import { useEffect } from 'react'
import ICAL from 'ical.js'
import { CalendarEvent } from '@/types/event'

const ICS_URL = 'https://ics.calendarlabs.com/73/de24d931/Turkey_Holidays.ics'
const PROXY = 'https://corsproxy.io/?'
const STORAGE_KEY = 'tatiller_loaded'

export function useTurkiyeTatilleri(addEvent: (event: CalendarEvent) => void) {
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return // Zaten yüklendi

    fetch(ICS_URL)
      .then(res => res.text())
      .then(icsData => {
        const jcal = ICAL.parse(icsData)
        const comp = new ICAL.Component(jcal)
        const vevents = comp.getAllSubcomponents('vevent')

        vevents.forEach(vevent => {
          const event = new ICAL.Event(vevent)
          addEvent({
            id: `tatil_${event.uid}`,
            title: `🇹🇷 ${event.summary}`,
            start: event.startDate.toString(),
            end: event.endDate?.toString(),
            allDay: true,
            color: '#E30A17', // Türk bayrağı kırmızısı
            description: 'Resmi Tatil',
          })
        })

        localStorage.setItem(STORAGE_KEY, '1')
      })
      .catch(err => console.error('Tatil takvimi yüklenemedi:', err))
  }, [])
}
