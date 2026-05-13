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

const WEEKDAYS = [
  { label: 'Pt', value: 'mo' },
  { label: 'Sa', value: 'tu' },
  { label: 'Ça', value: 'we' },
  { label: 'Pe', value: 'th' },
  { label: 'Cu', value: 'fr' },
  { label: 'Ct', value: 'sa' },
  { label: 'Pz', value: 'su' },
]

export default function EventModal({ event, defaultStart, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [color, setColor] = useState('#3b82f6')
  const [description, setDescription] = useState('')
  const [allDay, setAllDay] = useState(false)
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none')
  const [repeatDays, setRepeatDays] = useState<string[]>([])
  const [repeatUntil, setRepeatUntil] = useState('')

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setStart(event.start ?? '')
      setEnd(event.end || '')
      setColor(event.color || '#3b82f6')
      setDescription(event.description || '')
      setAllDay(event.allDay || false)
      if ((event as any).rrule) {
        setRepeat((event as any).rrule.freq)
        setRepeatDays((event as any).rrule.byweekday || [])
        setRepeatUntil((event as any).rrule.until || '')
      }
    } else if (defaultStart) {
      setStart(defaultStart)
    }
  }, [event, defaultStart])

  const toggleDay = (day: string) => {
    setRepeatDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  const handleSave = () => {
    if (!title.trim()) return

    const base: any = {
      id: event?.id || crypto.randomUUID(),
      title,
      color,
      description,
      allDay,
    }

    if (repeat === 'none') {
      base.start = start
      base.end = end || undefined
    } else {
      const s = new Date(start)
      const e = new Date(end || start)
      const diffMin = Math.max((e.getTime() - s.getTime()) / 60000, 30)
      const durH = String(Math.floor(diffMin / 60)).padStart(2, '0')
      const durM = String(diffMin % 60).padStart(2, '0')

      base.rrule = {
        freq: repeat,
        dtstart: start,
        ...(repeat === 'weekly' && repeatDays.length > 0 ? { byweekday: repeatDays } : {}),
        ...(repeatUntil ? { until: repeatUntil } : {}),
      }
      base.duration = `${durH}:${durM}`
    }

    onSave(base)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex">
          <div className="w-1 rounded-l-2xl flex-shrink-0" style={{ backgroundColor: color }} />

          <div className="flex-1 p-6 space-y-4">

            {/* Başlık satırı */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-800">
                {event ? 'Etkinliği Düzenle' : 'Yeni Etkinlik'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            {/* Başlık */}
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 placeholder-gray-400"
              placeholder="Başlık *"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            {/* Tüm gün */}
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
              <input type="checkbox" checked={allDay} onChange={e => setAllDay(e.target.checked)} className="accent-blue-500" />
              Tüm gün
            </label>

            {/* Tarih / Saat */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Başlangıç</p>
                <input
                  type={allDay ? 'date' : 'datetime-local'}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                  value={allDay ? start.split('T')[0] : start}
                  onChange={e => setStart(e.target.value)}
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Bitiş</p>
                <input
                  type={allDay ? 'date' : 'datetime-local'}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                  value={allDay ? end.split('T')[0] : end}
                  onChange={e => setEnd(e.target.value)}
                />
              </div>
            </div>

            {/* Tekrar */}
            <div>
              <p className="text-xs text-gray-400 mb-1">Tekrar</p>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 text-gray-700"
                value={repeat}
                onChange={e => setRepeat(e.target.value as any)}
              >
                <option value="none">Tekrar yok</option>
                <option value="daily">Her gün</option>
                <option value="weekly">Her hafta</option>
                <option value="monthly">Her ay</option>
              </select>
            </div>

            {/* Haftalık gün seçimi */}
            {repeat === 'weekly' && (
              <div>
                <p className="text-xs text-gray-400 mb-2">Günler</p>
                <div className="flex gap-1.5">
                  {WEEKDAYS.map(d => (
                    <button
                      key={d.value}
                      onClick={() => toggleDay(d.value)}
                      className="w-9 h-9 rounded-full text-xs font-medium transition-all"
                      style={{
                        backgroundColor: repeatDays.includes(d.value) ? color : '#f3f4f6',
                        color: repeatDays.includes(d.value) ? 'white' : '#6b7280',
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tekrar bitiş tarihi */}
            {repeat !== 'none' && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Bitiş tarihi</p>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-gray-50"
                  value={repeatUntil}
                  onChange={e => setRepeatUntil(e.target.value)}
                />
              </div>
            )}

            {/* Açıklama */}
            <textarea
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-gray-50 resize-none placeholder-gray-400"
              placeholder="Açıklama (opsiyonel)"
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            {/* Renk seçici */}
            <div className="flex gap-2 pt-1">
              {COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full transition-all"
                  style={{
                    backgroundColor: c,
                    outline: color === c ? `2px solid ${c}` : 'none',
                    outlineOffset: '2px',
                    transform: color === c ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            {/* Alt butonlar */}
            <div className="flex items-center justify-between pt-1">
              {event && onDelete ? (
                <button onClick={() => { onDelete(event.id); onClose() }} className="text-sm text-red-400 hover:text-red-600">
                  Sil
                </button>
              ) : <div />}
              <div className="flex gap-2">
                <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm rounded-xl text-white font-medium"
                  style={{ backgroundColor: color }}
                >
                  Kaydet
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
