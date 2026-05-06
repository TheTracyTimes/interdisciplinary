import { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input, Select, Textarea } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { Toggle } from '../ui/Input'
import type { MusicCue } from '../../types'

const TYPE_OPTIONS = ['Original Score', 'Licensed', 'Sound Design', 'Beat', 'Full Song'].map(v => ({ value: v, label: v }))
const STATUS_OPTIONS = ['Idea', 'Drafting', 'Arranged', 'Mixing', 'Mastering', 'Complete'].map(v => ({ value: v, label: v }))
const MOOD_OPTIONS = ['', 'Energetic', 'Calm', 'Dark', 'Uplifting', 'Nostalgic', 'Tense'].map(v => ({ value: v, label: v || 'No mood' }))
const INSTRUMENT_OPTIONS = ['Piano', 'Guitar', 'Synth', 'Drums', 'Bass', 'Strings', 'Vocals']

const STATUS_BADGE: Record<string, any> = {
  Idea: 'neutral', Drafting: 'film', Arranged: 'creator', Mixing: 'creator',
  Mastering: 'music', Complete: 'free',
}

const defaultForm = {
  trackName: '', type: 'Original Score', status: 'Idea', placement: '',
  duration: '', bpm: '', key: '', mood: '', instruments: [] as string[],
  stemsExported: false, filesLink: '', notes: '',
}

interface Props {
  projectId: string
  cues: MusicCue[]
  onUpdate: (cues: MusicCue[]) => void
}

export function MusicCuesPanel({ projectId, cues, onUpdate }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })

  function openCreate() {
    setForm({ ...defaultForm })
    setEditId(null)
    setModalOpen(true)
  }

  function openEdit(cue: MusicCue) {
    setForm({
      trackName: cue.trackName, type: cue.type, status: cue.status,
      placement: cue.placement, duration: cue.duration, bpm: String(cue.bpm || ''),
      key: cue.key, mood: cue.mood, instruments: [...cue.instruments],
      stemsExported: cue.stemsExported, filesLink: cue.filesLink, notes: cue.notes,
    })
    setEditId(cue.id)
    setModalOpen(true)
  }

  function handleSave() {
    const cue: MusicCue = {
      id: editId ?? crypto.randomUUID(),
      projectId, trackName: form.trackName || 'Untitled Cue',
      type: form.type as any, status: form.status as any,
      placement: form.placement, duration: form.duration,
      bpm: Number(form.bpm) || 0, key: form.key, mood: form.mood,
      instruments: form.instruments, stemsExported: form.stemsExported,
      filesLink: form.filesLink, notes: form.notes,
    }
    if (editId) {
      onUpdate(cues.map(c => c.id === editId ? cue : c))
    } else {
      onUpdate([...cues, cue])
    }
    setModalOpen(false)
  }

  function toggleInstrument(inst: string) {
    setForm(f => ({
      ...f,
      instruments: f.instruments.includes(inst)
        ? f.instruments.filter(i => i !== inst)
        : [...f.instruments, inst],
    }))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">Music Cues & Tracks</h2>
          <p className="text-xs text-slate-600 mt-0.5">{cues.length} cues</p>
        </div>
        <Button size="xs" onClick={openCreate}>+ Add Cue</Button>
      </div>

      {cues.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-3xl mb-2">♪</p>
          <p className="text-sm">No music cues yet.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add first cue</button>
        </div>
      ) : (
        <div className="space-y-2">
          {cues.map(cue => (
            <div
              key={cue.id}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-white/6 hover:border-white/15 transition-colors cursor-pointer"
              style={{ background: '#141416' }}
              onClick={() => openEdit(cue)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-medium text-white truncate">{cue.trackName}</p>
                  <Badge variant={STATUS_BADGE[cue.status] ?? 'neutral'} size="xs">{cue.status}</Badge>
                  {cue.stemsExported && <span className="text-[10px] text-emerald-400">✓ Stems</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-600">{cue.type}</span>
                  {cue.placement && <span className="text-[10px] text-slate-600">{cue.placement}</span>}
                  {cue.bpm > 0 && <span className="text-[10px] font-mono text-slate-600">{cue.bpm} BPM</span>}
                  {cue.key && <span className="text-[10px] font-mono text-slate-600">{cue.key}</span>}
                  {cue.mood && <span className="text-[10px] text-slate-600">{cue.mood}</span>}
                </div>
                {cue.instruments.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {cue.instruments.map(i => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-500">{i}</span>
                    ))}
                  </div>
                )}
              </div>
              {cue.duration && (
                <span className="text-xs font-mono text-slate-600 shrink-0">{cue.duration}</span>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Cue' : 'Add Music Cue'}
        size="lg"
        footer={
          <>
            {editId && <Button variant="danger" size="sm" onClick={() => { onUpdate(cues.filter(c => c.id !== editId)); setModalOpen(false) }}>Delete</Button>}
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Track Name" placeholder="e.g. Opening Theme" value={form.trackName} onChange={e => setForm(f => ({ ...f, trackName: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
            <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Placement" placeholder="e.g. Act 1 Opening" value={form.placement} onChange={e => setForm(f => ({ ...f, placement: e.target.value }))} />
            <Input label="Duration" placeholder="e.g. 2:34" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="BPM" type="number" value={form.bpm} onChange={e => setForm(f => ({ ...f, bpm: e.target.value }))} />
            <Input label="Key" placeholder="C major" value={form.key} onChange={e => setForm(f => ({ ...f, key: e.target.value }))} />
            <Select label="Mood" options={MOOD_OPTIONS} value={form.mood} onChange={e => setForm(f => ({ ...f, mood: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 tracking-wide block mb-2">Instruments</label>
            <div className="flex flex-wrap gap-1.5">
              {INSTRUMENT_OPTIONS.map(inst => (
                <button
                  key={inst}
                  onClick={() => toggleInstrument(inst)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                    form.instruments.includes(inst)
                      ? 'bg-brand-600/20 border-brand-500/30 text-brand-300'
                      : 'bg-white/4 border-white/10 text-slate-500 hover:text-white'
                  }`}
                >
                  {inst}
                </button>
              ))}
            </div>
          </div>
          <Input label="Files Link" placeholder="https://drive.google.com/..." value={form.filesLink} onChange={e => setForm(f => ({ ...f, filesLink: e.target.value }))} />
          <Toggle label="Stems Exported" checked={form.stemsExported} onChange={v => setForm(f => ({ ...f, stemsExported: v }))} />
          <Textarea label="Notes" placeholder="Ideas, revisions, feedback..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
