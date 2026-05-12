'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
import Navbar from "@/comporents/navbar";

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface Entry {
  id: string
  title: string
  content: string
  createdAt: string
}

const STORAGE_KEY = 'diary_entries'

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote'],
    ['clean'],
  ],
}

export default function DiaryPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [selected, setSelected] = useState<Entry | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed: Entry[] = JSON.parse(stored)
      setEntries(parsed)
      if (parsed.length > 0) openEntry(parsed[0])
    }
  }, [])

  const openEntry = (entry: Entry) => {
    setSelected(entry)
    setTitle(entry.title)
    setContent(entry.content)
    setSaved(true)
  }

  const newEntry = () => {
    const entry: Entry = {
      id: Date.now().toString(),
      title: '',
      content: '',
      createdAt: new Date().toISOString(),
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    openEntry(entry)
  }

  const saveEntry = () => {
    if (!selected) return
    const updated = entries.map(e =>
      e.id === selected.id ? { ...e, title, content } : e
    )
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setSelected({ ...selected, title, content })
    setSaved(true)
  }

  const deleteEntry = (id: string) => {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    if (selected?.id === id) {
      if (updated.length > 0) openEntry(updated[0])
      else { setSelected(null); setTitle(''); setContent('') }
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

  return (
    <> <Navbar/>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e8e0d0 !important;
          padding: 8px 32px !important;
          background: #fdfcfa;
        }
        .ql-container.ql-snow {
          border: none !important;
          font-family: 'Lora', serif !important;
          font-size: 16px !important;
          color: #2c2416;
          line-height: 1.85 !important;
          flex: 1;
        }
        .ql-editor {
          padding: 24px 32px !important;
          min-height: 300px;
        }
        .ql-editor.ql-blank::before {
          color: #c4b89a !important;
          font-style: italic !important;
          font-family: 'Lora', serif !important;
          left: 32px !important;
        }
        .ql-snow .ql-stroke { stroke: #8b7355 !important; }
        .ql-snow .ql-fill  { fill:   #8b7355 !important; }
        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow.ql-toolbar button.ql-active .ql-stroke { stroke: #c17f3d !important; }
        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow.ql-toolbar button.ql-active .ql-fill   { fill:   #c17f3d !important; }
        .diary-entry-row:hover { background: #ede9e0 !important; }
        .diary-entry-row:hover .delete-btn { opacity: 1 !important; }
        .diary-save-btn:hover { opacity: 0.85; }
      `}</style>

      <div style={{
        display: 'flex',
        height: '100vh',
        background: '#faf8f4',
        fontFamily: "'DM Sans', sans-serif",
        overflow: 'hidden',
      }}>

        {/* ── Sidebar ── */}
        <aside style={{
          width: 272,
          minWidth: 272,
          background: '#f3efe8',
          borderRight: '1px solid #e8e0d0',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{ padding: '28px 20px 16px', borderBottom: '1px solid #e8e0d0' }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a08c6e' }}>
              Günlüğüm
            </p>
            <button
              onClick={newEntry}
              className="diary-save-btn"
              style={{
                marginTop: 14,
                width: '100%',
                padding: '9px 0',
                background: '#c17f3d',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'opacity 0.12s',
              }}
            >
              + Yeni Yazı
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {entries.length === 0 && (
              <p style={{ padding: '32px 20px', color: '#b8a98a', fontSize: 13, textAlign: 'center', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
                Henüz yazı yok
              </p>
            )}
            {entries.map(entry => (
              <div
                key={entry.id}
                className="diary-entry-row"
                onClick={() => openEntry(entry)}
                style={{
                  padding: '13px 20px',
                  borderBottom: '1px solid #e8e0d0',
                  cursor: 'pointer',
                  background: selected?.id === entry.id ? '#ede7db' : 'transparent',
                  transition: 'background 0.1s',
                  position: 'relative',
                }}
              >
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: '#2c2416', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 20 }}>
                  {entry.title || 'Başlıksız'}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 11, color: '#a08c6e' }}>
                  {formatDate(entry.createdAt)}
                </p>
                <button
                  className="delete-btn"
                  onClick={(e) => { e.stopPropagation(); deleteEntry(entry.id) }}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#b8a98a', cursor: 'pointer',
                    fontSize: 18, lineHeight: 1, padding: '2px 4px',
                    opacity: selected?.id === entry.id ? 1 : 0,
                    transition: 'opacity 0.1s',
                  }}
                >×</button>
              </div>
            ))}
          </div>
        </aside>

        {/* ── Editor ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#fdfcfa' }}>
          {selected ? (
            <>
              {/* Topbar */}
              <div style={{
                padding: '14px 32px',
                borderBottom: '1px solid #e8e0d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 12, color: '#b8a98a', fontStyle: 'italic', fontFamily: "'Lora', serif" }}>
                  {formatDate(selected.createdAt)}
                </span>
                <button
                  onClick={saveEntry}
                  className="diary-save-btn"
                  style={{
                    padding: '6px 20px',
                    background: saved ? 'transparent' : '#c17f3d',
                    color: saved ? '#b8a98a' : '#ffffff',
                    border: `1px solid ${saved ? '#e0d8cc' : '#c17f3d'}`,
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    transition: 'all 0.15s',
                  }}
                >
                  {saved ? '✓ Kaydedildi' : 'Kaydet'}
                </button>
              </div>

              {/* Title */}
              <input
                value={title}
                onChange={(e) => { setTitle(e.target.value); setSaved(false) }}
                placeholder="Başlık..."
                style={{
                  padding: '28px 32px 8px',
                  fontSize: 28,
                  fontWeight: 600,
                  fontFamily: "'Lora', serif",
                  color: '#2c2416',
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  boxSizing: 'border-box',
                  caretColor: '#c17f3d',
                }}
              />

              {/* Quill */}
              <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
                <ReactQuill
                  value={content}
                  onChange={(val) => { setContent(val); setSaved(false) }}
                  modules={modules}
                  placeholder="Bugün neler yaşandı..."
                />
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <p style={{ fontFamily: "'Lora', serif", fontSize: 22, color: '#c4b89a', fontStyle: 'italic', margin: 0 }}>
                Bugün ne yazmak istersin?
              </p>
              <button
                onClick={newEntry}
                className="diary-save-btn"
                style={{
                  padding: '10px 28px',
                  background: '#c17f3d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'opacity 0.12s',
                }}
              >
                Yazmaya Başla
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
