import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Toggle } from '../../components/ui/Input'
import type { Asset } from '../../types'

const TYPE_OPTIONS = ['LUT', 'Preset', 'Sound Effect', 'Music Loop', 'Stock Footage', 'Graphic', 'Font', 'Texture'].map(v => ({ value: v, label: v }))
const SOURCE_OPTIONS = ['Original', 'Purchased', 'Free', 'Subscription'].map(v => ({ value: v, label: v }))
const LICENSE_OPTIONS = ['Personal', 'Commercial', 'Unlimited', 'Attribution Required'].map(v => ({ value: v, label: v }))

const TYPE_ICON: Record<string, string> = {
  LUT: '🎨', Preset: '🎛', 'Sound Effect': '🔊', 'Music Loop': '♫',
  'Stock Footage': '📽', Graphic: '◆', Font: 'A', Texture: '▨',
}

const defaultForm = { name: '', type: 'LUT', category: '', source: 'Purchased', license: 'Personal', fileLink: '', favorite: false, notes: '' }

export function AssetsPage() {
  const { state, createAsset, updateAsset, deleteAsset } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })
  const [typeFilter, setTypeFilter] = useState('All')
  const [favOnly, setFavOnly] = useState(false)
  const [search, setSearch] = useState('')

  const assets = state.assets.filter(a => {
    if (typeFilter !== 'All' && a.type !== typeFilter) return false
    if (favOnly && !a.favorite) return false
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function openCreate() { setForm({ ...defaultForm }); setEditId(null); setModalOpen(true) }
  function openEdit(a: Asset) {
    setForm({ name: a.name, type: a.type, category: a.category, source: a.source, license: a.license, fileLink: a.fileLink, favorite: a.favorite, notes: a.notes })
    setEditId(a.id); setModalOpen(true)
  }
  function handleSave() {
    const data: any = { ...form, usedIn: [] }
    if (editId) updateAsset(editId, data)
    else createAsset(data)
    setModalOpen(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Assets Library</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.assets.length} assets · {state.assets.filter(a => a.favorite).length} favorites</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ Add Asset</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#1a1a1d' }}>
          {['All', ...TYPE_OPTIONS.map(t => t.value)].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)} className={clsx('px-2.5 py-1 rounded-md text-xs font-medium transition-colors', typeFilter === t ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white')}>{t}</button>
          ))}
        </div>
        <button onClick={() => setFavOnly(!favOnly)} className={clsx('px-3 py-1.5 rounded-lg text-xs border transition-colors', favOnly ? 'bg-amber-500/20 border-amber-500/30 text-amber-300' : 'border-white/10 text-slate-500 hover:text-white')}>
          ★ Favorites
        </button>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets..." className="text-xs text-slate-300 placeholder-slate-600 bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none w-44" />
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-sm">No assets found.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add asset</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {assets.map(a => (
            <div
              key={a.id}
              className="rounded-xl border border-white/8 p-4 hover:border-white/20 transition-all cursor-pointer group flex flex-col"
              style={{ background: '#141416' }}
              onClick={() => openEdit(a)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{TYPE_ICON[a.type] ?? '◈'}</span>
                <div className="flex items-center gap-1.5">
                  {a.favorite && <span className="text-amber-400 text-xs">★</span>}
                  <span className="text-[10px] text-slate-600">{a.source}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-white mb-1 group-hover:text-brand-300 transition-colors truncate">{a.name}</p>
              <p className="text-[10px] text-slate-600 mb-2">{a.type}{a.category ? ` · ${a.category}` : ''}</p>
              <div className="mt-auto">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500">{a.license}</span>
              </div>
              {a.fileLink && (
                <a href={a.fileLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-[10px] text-brand-400 mt-2 inline-block">Open →</a>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Asset' : 'Add Asset'} size="md"
        footer={<>{editId && <Button variant="danger" size="sm" onClick={() => { deleteAsset(editId); setModalOpen(false) }}>Delete</Button>}<Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button size="sm" onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">
          <Input label="Asset Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
            <Input label="Category" placeholder="e.g. Cinematic, Corporate" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Source" options={SOURCE_OPTIONS} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} />
            <Select label="License" options={LICENSE_OPTIONS} value={form.license} onChange={e => setForm(f => ({ ...f, license: e.target.value }))} />
          </div>
          <Input label="File Link" placeholder="https://..." value={form.fileLink} onChange={e => setForm(f => ({ ...f, fileLink: e.target.value }))} />
          <Toggle label="Favorite" checked={form.favorite} onChange={v => setForm(f => ({ ...f, favorite: v }))} />
          <Textarea label="Notes" placeholder="Usage notes, what it's good for..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
        </div>
      </Modal>
    </div>
  )
}
