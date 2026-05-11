'use client'
import { useRef, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import trLocale from '@fullcalendar/core/locales/tr'
import { useEvents } from '@/hooks/useEvents'
import { CalendarEvent } from '@/types/event'
import EventModal from './EventModal'

export default function Calendar() {
  const calendarRef = useRef<FullCalendar>(null)
  const { events, addEvent, updateEvent, deleteEvent } = useEvents()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [defaultStart, setDefaultStart] = useState<string>('')

  // Güne tıklayınca yeni event
  const handleDateSelect = (info: any) => {
    setSelectedEvent(null)
    setDefaultStart(info.startStr)
    setModalOpen(true)
  }

  // Evente tıklayınca düzenle
  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
      setModalOpen(true)
    }
  }

  // Drag & drop
  const handleEventChange = (info: any) => {
    updateEvent({
      ...events.find(e => e.id === info.event.id)!,
      start: info.event.startStr,
      end: info.event.endStr || undefined,
    })
  }

  return (
    <div className="h-screen p-4">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        locale={trLocale}
        initialView={
          typeof window !== 'undefined' && window.innerWidth < 768
            ? 'listWeek'
            : 'timeGridDay'
        }
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek,listWeek,dayGridMonth',
        }}
        height="100%"
        handleWindowResize={true}
        events={events}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        nowIndicator={true}           // kırmızı "şu an" çizgisi
        scrollTime="08:00:00"         // sabah 8'den başla
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventChange={handleEventChange}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
      />

      {modalOpen && (
        <EventModal
          event={selectedEvent}
          defaultStart={defaultStart}
          onSave={selectedEvent ? updateEvent : addEvent}
          onDelete={deleteEvent}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}