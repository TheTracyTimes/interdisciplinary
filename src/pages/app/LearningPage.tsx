import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import type { LearningEntry } from '../../types'

const CAT_OPTIONS = ['Final Cut', 'Logic Pro', 'Color Grading', 'Audio Mixing', 'Cinematography', 'Business', 'Other'].map(v => ({ value: v, label: v }))
const STATUS_OPTIONS = ['To Watch', 'In Progress', 'Completed'].map(v => ({ value: v, label: v }))

const STATUS_BADGE: Record<string, any> = { 'To Watch': 'neutral', 'In Progress': 'creator', Completed: 'free' }

const defaultForm = { topic: '', category: 'Cinematography', sourceUrl: '', status: 'To Watch', keyTakeaways: '', date: new Date().toISOString().split('T')[0], applyTo: '', rating: 0 }

function Stars({ rating, onChange }: { rating: number; onChange?: (n: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} onClick={() => onChange?.(n)} className={clsx('text-lg transition-colors', n <= rating ? 'text-amber-400' : 'text-slate-700 hover:text-amber-300')}>★</button>
      ))}
    </div>
  )
}

export function LearningPage() {
  const { state, createLearning, updateLearning, deleteLearning } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })
  const [statusFilter, setStatusFilter] = useState('All')
  const [catFilter, setCatFilter] = useState('All')

  const entries = state.learningEntries.filter(e => {
    if (statusFilter !== 'All' && e.status !== statusFilter) return false
    if (catFilter !== 'All' && e.category !== catFilter) return false
    return true
  })

  const projectOptions = [{ value: '', label: 'No project' }, ...state.creativeProjects.map(p => ({ value: p.id, label: p.title }))]

  function openCreate() { setForm({ ...defaultForm }); setEditId(null); setModalOpen(true) }
  function openEdit(e: LearningEntry) {
    setForm({ topic: e.topic, category: e.category, sourceUrl: e.sourceUrl, status: e.status, keyTakeaways: e.keyTakeaways, date: e.date, applyTo: e.applyTo ?? '', rating: e.rating })
    setEditId(e.id); setModalOpen(true)
  }
  function handleSave() {
    if (editId) updateLearning(editId, form as any)
    else createLearning(form as any)
    setModalOpen(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Learning Log</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.learningEntries.length} entries · {state.learningEntries.filter(e => e.status === 'Completed').length} completed</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ Add Entry</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#1a1a1d' }}>
          {['All', 'To Watch', 'In Progress', 'Completed'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={clsx('px-3 py-1 rounded-md text-xs font-medium transition-colors', statusFilter === s ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white')}>{s}</button>
          ))}
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none" style={{ background: '#1a1a1d' }}>
          {['All', ...CAT_OPTIONS.map(c => c.value)].map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
        </select>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-sm">No learning entries.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add first entry</button>
        </div>
      ) : (
        <div className="space-y-2 max-w-4xl">
          {entries.map(e => (
            <div key={e.id} className="flex items-start gap-4 px-4 py-3.5 rounded-lg border border-white/6 hover:border-white/15 transition-colors cursor-pointer" style={{ background: '#141416' }} onClick={() => openEdit(e)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{e.topic}</p>
                  <Badge variant={STATUS_BADGE[e.status] ?? 'neutral'} size="xs">{e.status}</Badge>
                </div>
                <p className="text-[10px] text-slate-600 mb-1">{e.category} · {new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                {e.keyTakeaways && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{e.keyTakeaways}</p>}
              </div>
              <div className="shrink-0 text-right">
                <Stars rating={e.rating} />
                {e.sourceUrl && (
                  <a href={e.sourceUrl} target="_blank" rel="noopener noreferrer" onClick={ev => ev.stopPropagation()} className="text-[10px] text-brand-400 hover:text-brand-300 mt-1 block">Source →</a>
                )}
              </div>
              <button onClick={ev => { ev.stopPropagation(); deleteLearning(e.id) }} className="text-slate-700 hover:text-red-400 text-xs shrink-0">×</button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Entry' : 'Add Learning Entry'} size="md"
        footer={<>{editId && <Button variant="danger" size="sm" onClick={() => { deleteLearning(editId); setModalOpen(false) }}>Delete</Button>}<Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button size="sm" onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">
          <Input label="Topic" placeholder="e.g. Color grading log footage" value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" options={CAT_OPTIONS} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          </div>
          <Input label="Source URL" placeholder="https://youtube.com/..." value={form.sourceUrl} onChange={e => setForm(f => ({ ...f, sourceUrl: e.target.value }))} />
          <Textarea label="Key Takeaways" placeholder="What did you learn? What will you apply?" value={form.keyTakeaways} onChange={e => setForm(f => ({ ...f, keyTakeaways: e.target.value }))} rows={4} />
          <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          <Select label="Apply To Project" options={projectOptions} value={form.applyTo ?? ''} onChange={e => setForm(f => ({ ...f, applyTo: e.target.value }))} />
          <div>
            <label className="text-xs font-medium text-slate-400 tracking-wide block mb-2">Rating</label>
            <Stars rating={form.rating} onChange={n => setForm(f => ({ ...f, rating: n }))} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
