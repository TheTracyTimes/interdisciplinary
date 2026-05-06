import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Toggle } from '../../components/ui/Input'
import type { ScheduleEvent } from '../../types'

const TYPE_OPTIONS = ['Shoot', 'Editing Block', 'Meeting', 'Deadline', 'Personal'].map(v => ({ value: v, label: v }))
const DURATION_OPTIONS = ['1 Hour', '2 Hours', 'Half-Day', 'Full-Day'].map(v => ({ value: v, label: v }))

const TYPE_COLOR: Record<string, string> = {
  Shoot: '#e85d4a', Deadline: '#f59e0b', Meeting: '#6272f3',
  'Editing Block': '#48bb9a', Personal: '#8888a0',
}

const defaultForm = {
  event: '', date: new Date().toISOString().split('T')[0], time: '',
  duration: '2 Hours', type: 'Shoot', projectId: '', location: '',
  confirmed: false, notes: '',
}

export function SchedulePage() {
  const { state, createEvent, updateEvent, deleteEvent } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })
  const [view, setView] = useState<'upcoming' | 'all'>('upcoming')

  const now = new Date()
  const events = [...state.scheduleEvents].sort((a, b) => a.date.localeCompare(b.date))
  const filtered = view === 'upcoming' ? events.filter(e => new Date(e.date) >= now) : events

  function openCreate() {
    setForm({ ...defaultForm })
    setEditId(null)
    setModalOpen(true)
  }

  function openEdit(ev: ScheduleEvent) {
    setForm({
      event: ev.event, date: ev.date, time: ev.time, duration: ev.duration,
      type: ev.type, projectId: ev.projectId ?? '', location: ev.location,
      confirmed: ev.confirmed, notes: ev.notes,
    })
    setEditId(ev.id)
    setModalOpen(true)
  }

  function handleSave() {
    const data: any = {
      event: form.event || 'Untitled Event', date: form.date, time: form.time,
      duration: form.duration as any, type: form.type as any,
      projectId: form.projectId || undefined, location: form.location,
      confirmed: form.confirmed, notes: form.notes,
    }
    if (editId) updateEvent(editId, data)
    else createEvent(data)
    setModalOpen(false)
  }

  const projectOptions = [
    { value: '', label: 'No project' },
    ...state.clientProjects.map(p => ({ value: p.id, label: p.projectName })),
    ...state.creativeProjects.map(p => ({ value: p.id, label: p.title })),
  ]

  // Group by date
  const grouped: Record<string, ScheduleEvent[]> = {}
  filtered.forEach(ev => {
    if (!grouped[ev.date]) grouped[ev.date] = []
    grouped[ev.date].push(ev)
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Schedule</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.scheduleEvents.length} events</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#1a1a1d' }}>
            {(['upcoming', 'all'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={clsx(
                  'px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize',
                  view === v ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white',
                )}
              >
                {v}
              </button>
            ))}
          </div>
          <Button size="sm" onClick={openCreate}>+ Add Event</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-4xl mb-3">◷</p>
          <p className="text-sm">No events scheduled.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add event</button>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {Object.entries(grouped).map(([date, events]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <div className="space-y-2">
                {events.map(ev => {
                  const accent = TYPE_COLOR[ev.type] ?? '#888'
                  return (
                    <div
                      key={ev.id}
                      className="flex items-start gap-3 px-4 py-3 rounded-lg border border-white/6 hover:border-white/15 transition-colors cursor-pointer"
                      style={{ background: '#141416' }}
                      onClick={() => openEdit(ev)}
                    >
                      <div
                        className="w-0.5 rounded-full self-stretch shrink-0"
                        style={{ background: accent, minHeight: '40px' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-medium text-white">{ev.event}</p>
                          {ev.confirmed && (
                            <span className="text-[10px] text-emerald-400">✓ Confirmed</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-500" style={{ color: accent }}>{ev.type}</span>
                          {ev.time && <span className="text-xs font-mono text-slate-600">{ev.time}</span>}
                          <span className="text-xs text-slate-600">{ev.duration}</span>
                          {ev.location && <span className="text-xs text-slate-600 truncate">{ev.location}</span>}
                        </div>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); deleteEvent(ev.id) }}
                        className="text-slate-700 hover:text-red-400 text-xs transition-colors shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Event' : 'Add Event'}
        size="md"
        footer={
          <>
            {editId && <Button variant="danger" size="sm" onClick={() => { deleteEvent(editId); setModalOpen(false) }}>Delete</Button>}
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Event" placeholder="e.g. Wedding Shoot" value={form.event} onChange={e => setForm(f => ({ ...f, event: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            <Input label="Time" type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
            <Select label="Duration" options={DURATION_OPTIONS} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
          </div>
          <Input label="Location" placeholder="Address or venue" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          <Select label="Project" options={projectOptions} value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))} />
          <Toggle label="Confirmed" checked={form.confirmed} onChange={v => setForm(f => ({ ...f, confirmed: v }))} />
          <Textarea label="Notes" placeholder="Prep needed, details..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
