import { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input, Select, Textarea } from '../ui/Input'
import { Badge } from '../ui/Badge'
import type { ShotItem } from '../../types'

const SHOT_TYPES = ['Wide', 'Medium', 'Close-Up', 'Insert', 'B-Roll', 'Drone', 'POV'].map(v => ({ value: v, label: v }))
const MOVEMENTS = ['Static', 'Pan', 'Tilt', 'Dolly', 'Handheld', 'Gimbal'].map(v => ({ value: v, label: v }))
const TIME_OF_DAY = ['Morning', 'Midday', 'Golden Hour', 'Night', 'Interior'].map(v => ({ value: v, label: v }))
const LENSES = ['Wide', 'Standard', 'Telephoto'].map(v => ({ value: v, label: v }))
const AUDIOS = ['Sync Sound', 'Voiceover', 'Music Only', 'Ambient'].map(v => ({ value: v, label: v }))
const STATUSES = ['Planned', 'Shot', 'Unusable', 'Edited'].map(v => ({ value: v, label: v }))

const STATUS_COLOR: Record<string, string> = {
  Planned: 'neutral', Shot: 'free', Unusable: 'film', Edited: 'creator',
}

const defaultForm = {
  sceneNumber: 1, shotType: 'Wide', movement: 'Static', location: '',
  timeOfDay: 'Morning', equipment: '', lens: 'Standard', audio: 'Sync Sound',
  status: 'Planned', notes: '',
}

interface Props {
  projectId: string
  shots: ShotItem[]
  onUpdate: (shots: ShotItem[]) => void
}

export function ShotListPanel({ projectId, shots, onUpdate }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState<typeof defaultForm>({ ...defaultForm })
  const [statusFilter, setStatusFilter] = useState('All')

  function openCreate() {
    setForm({ ...defaultForm, sceneNumber: shots.length + 1 })
    setEditId(null)
    setModalOpen(true)
  }

  function openEdit(shot: ShotItem) {
    setForm({
      sceneNumber: shot.sceneNumber, shotType: shot.shotType, movement: shot.movement,
      location: shot.location, timeOfDay: shot.timeOfDay, equipment: shot.equipment.join(', '),
      lens: shot.lens, audio: shot.audio, status: shot.status, notes: shot.notes,
    })
    setEditId(shot.id)
    setModalOpen(true)
  }

  function handleSave() {
    const shot: ShotItem = {
      id: editId ?? crypto.randomUUID(),
      projectId,
      sceneNumber: Number(form.sceneNumber),
      shotType: form.shotType as any,
      movement: form.movement as any,
      location: form.location,
      timeOfDay: form.timeOfDay as any,
      equipment: form.equipment ? form.equipment.split(',').map(s => s.trim()).filter(Boolean) : [],
      lens: form.lens as any,
      audio: form.audio as any,
      status: form.status as any,
      notes: form.notes,
    }
    if (editId) {
      onUpdate(shots.map(s => s.id === editId ? shot : s))
    } else {
      onUpdate([...shots, shot])
    }
    setModalOpen(false)
  }

  function handleDelete(id: string) {
    onUpdate(shots.filter(s => s.id !== id))
  }

  const filtered = statusFilter === 'All' ? shots : shots.filter(s => s.status === statusFilter)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Shot List</h2>
          <p className="text-xs text-slate-600 mt-0.5">{shots.length} shots</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none"
            style={{ background: '#1a1a1d' }}
          >
            {['All', 'Planned', 'Shot', 'Unusable', 'Edited'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button size="xs" onClick={openCreate}>+ Add Shot</Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-3xl mb-2">▶</p>
          <p className="text-sm">No shots yet.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add first shot</button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_1fr_6rem_3rem] gap-2 px-3 pb-1">
            {['#', 'Type · Movement', 'Location', 'Time', 'Lens · Audio', 'Equipment', 'Status', ''].map(h => (
              <span key={h} className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{h}</span>
            ))}
          </div>
          {filtered.map(shot => (
            <div
              key={shot.id}
              className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_1fr_6rem_3rem] gap-2 items-center px-3 py-2.5 rounded-lg border border-white/6 hover:border-white/15 transition-colors cursor-pointer"
              style={{ background: '#141416' }}
              onClick={() => openEdit(shot)}
            >
              <span className="text-xs font-mono text-slate-600">{shot.sceneNumber}</span>
              <div>
                <p className="text-xs text-white">{shot.shotType}</p>
                <p className="text-[10px] text-slate-600">{shot.movement}</p>
              </div>
              <p className="text-xs text-slate-400 truncate">{shot.location || '—'}</p>
              <p className="text-xs text-slate-500">{shot.timeOfDay}</p>
              <div>
                <p className="text-xs text-slate-400">{shot.lens}</p>
                <p className="text-[10px] text-slate-600">{shot.audio}</p>
              </div>
              <p className="text-[10px] text-slate-600 truncate">{shot.equipment.join(', ') || '—'}</p>
              <Badge variant={STATUS_COLOR[shot.status] as any ?? 'neutral'} size="xs">{shot.status}</Badge>
              <button
                onClick={e => { e.stopPropagation(); handleDelete(shot.id) }}
                className="text-slate-700 hover:text-red-400 text-xs transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Shot' : 'Add Shot'}
        size="lg"
        footer={
          <>
            {editId && (
              <Button variant="danger" size="sm" onClick={() => { handleDelete(editId); setModalOpen(false) }}>Delete</Button>
            )}
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Scene #" type="number" value={form.sceneNumber} onChange={e => setForm(f => ({ ...f, sceneNumber: Number(e.target.value) }))} />
            <Select label="Status" options={STATUSES} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Shot Type" options={SHOT_TYPES} value={form.shotType} onChange={e => setForm(f => ({ ...f, shotType: e.target.value }))} />
            <Select label="Movement" options={MOVEMENTS} value={form.movement} onChange={e => setForm(f => ({ ...f, movement: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Location" placeholder="e.g. Rooftop, Studio A" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            <Select label="Time of Day" options={TIME_OF_DAY} value={form.timeOfDay} onChange={e => setForm(f => ({ ...f, timeOfDay: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Lens" options={LENSES} value={form.lens} onChange={e => setForm(f => ({ ...f, lens: e.target.value }))} />
            <Select label="Audio" options={AUDIOS} value={form.audio} onChange={e => setForm(f => ({ ...f, audio: e.target.value }))} />
          </div>
          <Input label="Equipment (comma-separated)" placeholder="Tripod, Gimbal, Drone" value={form.equipment} onChange={e => setForm(f => ({ ...f, equipment: e.target.value }))} />
          <Textarea label="Notes" placeholder="Framing notes, specific details..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
