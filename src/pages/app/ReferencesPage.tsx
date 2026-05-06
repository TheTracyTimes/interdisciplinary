import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import type { Reference } from '../../types'

const TYPE_OPTIONS = ['Video', 'Song', 'Photo', 'Article', 'Tutorial', 'Color Palette', 'Other'].map(v => ({ value: v, label: v }))
const TAG_OPTIONS = ['Cinematography', 'Color Grading', 'Editing', 'Sound Design', 'Composition', 'Lighting', 'Storytelling', 'Gear']

const TYPE_ICON: Record<string, string> = {
  Video: '▶', Song: '♪', Photo: '◉', Article: '≡', Tutorial: '◐', 'Color Palette': '◑', Other: '◈',
}

const defaultForm = { title: '', type: 'Video', sourceLink: '', whySaved: '', tags: [] as string[], projectId: '' }

export function ReferencesPage() {
  const { state, createReference, updateReference, deleteReference } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })
  const [typeFilter, setTypeFilter] = useState('All')

  const refs = state.references.filter(r => typeFilter === 'All' || r.type === typeFilter)

  const projectOptions = [{ value: '', label: 'No project' }, ...state.creativeProjects.map(p => ({ value: p.id, label: p.title }))]

  function openCreate() { setForm({ ...defaultForm, tags: [] }); setEditId(null); setModalOpen(true) }
  function openEdit(r: Reference) {
    setForm({ title: r.title, type: r.type, sourceLink: r.sourceLink, whySaved: r.whySaved, tags: [...r.tags], projectId: r.projectId ?? '' })
    setEditId(r.id); setModalOpen(true)
  }
  function handleSave() {
    const data = { ...form, dateFound: editId ? (state.references.find(r => r.id === editId)?.dateFound ?? new Date().toISOString()) : new Date().toISOString() }
    if (editId) updateReference(editId, data as any)
    else createReference(data as any)
    setModalOpen(false)
  }
  function toggleTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }))
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">References & Inspiration</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.references.length} saved</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ Add Reference</Button>
      </div>

      <div className="flex gap-1 p-1 rounded-lg mb-5 w-fit" style={{ background: '#1a1a1d' }}>
        {['All', ...TYPE_OPTIONS.map(t => t.value)].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${typeFilter === t ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {refs.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-sm">No references saved.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add reference</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {refs.map(r => (
            <div key={r.id} className="rounded-xl border border-white/8 p-4 hover:border-white/20 transition-all cursor-pointer group" style={{ background: '#141416' }} onClick={() => openEdit(r)}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-slate-600">{TYPE_ICON[r.type]}</span>
                <span className="text-[10px] text-slate-600">{r.type}</span>
              </div>
              <p className="text-sm font-medium text-white mb-2 group-hover:text-brand-300 transition-colors">{r.title}</p>
              {r.whySaved && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-2">{r.whySaved}</p>}
              <div className="flex flex-wrap gap-1 mb-2">
                {r.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-slate-500">{tag}</span>)}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono text-slate-700">{new Date(r.dateFound).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                {r.sourceLink && (
                  <a href={r.sourceLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-[10px] text-brand-400 hover:text-brand-300">Source →</a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Reference' : 'Add Reference'} size="md"
        footer={<>{editId && <Button variant="danger" size="sm" onClick={() => { deleteReference(editId); setModalOpen(false) }}>Delete</Button>}<Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button size="sm" onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
          <Input label="Source Link" placeholder="https://..." value={form.sourceLink} onChange={e => setForm(f => ({ ...f, sourceLink: e.target.value }))} />
          <Textarea label="Why I Saved It" placeholder="What stands out, what to learn from it..." value={form.whySaved} onChange={e => setForm(f => ({ ...f, whySaved: e.target.value }))} rows={2} />
          <div>
            <label className="text-xs font-medium text-slate-400 tracking-wide block mb-2">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {TAG_OPTIONS.map(tag => (
                <button key={tag} onClick={() => toggleTag(tag)} className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${form.tags.includes(tag) ? 'bg-brand-600/20 border-brand-500/30 text-brand-300' : 'bg-white/4 border-white/10 text-slate-500 hover:text-white'}`}>{tag}</button>
              ))}
            </div>
          </div>
          <Select label="For Project" options={projectOptions} value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
