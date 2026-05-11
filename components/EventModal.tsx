'use client'
import { useState, useEffect } from 'react'
import { CalendarEvent } from '@/types/event'

interface Props {
  event?: CalendarEvent | null
  defaultStart?: string
  onSave: (event: CalendarEvent) => void
  onDelete?: (id: string) => void
  onClose: () => void
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export default function EventModal({ event, defaultStart, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [description, setDescription] = useState('')
  const [allDay, setAllDay] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setStart(event.start)
      setEnd(event.end || '')
      setColor(event.color || '#3b82f6')
      setDescription(event.description || '')
      setAllDay(event.allDay || false)
    } else if (defaultStart) {
      setStart(defaultStart)
    }
  }, [event, defaultStart])

  const handleSave = () => {
    if (!title.trim()) return
    onSave({
      id: event?.id || crypto.randomUUID(),
      title,
      start,
      end: end || undefined,
      color,
      description,
      allDay,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">
          {event ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}
        </h2>

        <input
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Başlık *"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <input type="checkbox" id="allDay" checked={allDay} onChange={e => setAllDay(e.target.checked)} />
          <label htmlFor="allDay" className="text-sm">Tüm gün</label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Başlangıç</label>
            <input
              type={allDay ? 'date' : 'datetime-local'}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={allDay ? start.split('T')[0] : start}
              onChange={e => setStart(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">Bitiş</label>
            <input
              type={allDay ? 'date' : 'datetime-local'}
              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={allDay ? end.split('T')[0] : end}
              onChange={e => setEnd(e.target.value)}
            />
          </div>
        </div>

        <textarea
          className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          placeholder="Açıklama (opsiyonel)"
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        {/* Renk seçici */}
        <div className="flex gap-2">
          {COLORS.map(c => (
            <button
              key={c}
              className={`w-7 h-7 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="flex justify-between pt-2">
          {event && onDelete ? (
            <button
              className="text-sm text-red-500 hover:underline"
              onClick={() => { onDelete(event.id); onClose() }}
            >
              Sil
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-sm rounded-lg border hover:bg-gray-50"
              onClick={onClose}
            >
              İptal
            </button>
            <button
              className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
              onClick={handleSave}
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}