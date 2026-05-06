import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Toggle } from '../../components/ui/Input'
import type { Equipment } from '../../types'

const CAT_OPTIONS = ['Camera', 'Audio', 'Lighting', 'Support', 'Computer', 'Other'].map(v => ({ value: v, label: v }))
const COND_OPTIONS = ['Good', 'Needs Repair', 'Replace Soon'].map(v => ({ value: v, label: v }))

const COND_COLOR: Record<string, string> = {
  Good: '#48bb9a', 'Needs Repair': '#f59e0b', 'Replace Soon': '#e85d4a',
}

const defaultForm = { item: '', category: 'Camera', owned: true, condition: 'Good', notes: '' }

export function EquipmentPage() {
  const { state, createEquipment, updateEquipment, deleteEquipment, setEquipmentPublic } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })
  const [catFilter, setCatFilter] = useState('All')

  const cats = ['All', ...CAT_OPTIONS.map(c => c.value)]
  const items = state.equipment.filter(e => catFilter === 'All' || e.category === catFilter)
  const grouped: Record<string, Equipment[]> = {}
  items.forEach(e => {
    if (!grouped[e.category]) grouped[e.category] = []
    grouped[e.category].push(e)
  })

  function openCreate() { setForm({ ...defaultForm }); setEditId(null); setModalOpen(true) }
  function openEdit(e: Equipment) {
    setForm({ item: e.item, category: e.category, owned: e.owned, condition: e.condition, notes: e.notes })
    setEditId(e.id); setModalOpen(true)
  }
  function handleSave() {
    if (editId) updateEquipment(editId, form as any)
    else createEquipment(form as any)
    setModalOpen(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Equipment</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.equipment.filter(e => e.owned).length} owned · {state.equipment.filter(e => !e.owned).length} wish list</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ Add Item</Button>
      </div>

      <div className="flex items-center justify-between mb-5 px-3 py-2 rounded-lg border border-white/8" style={{ background: '#141416' }}>
        <div>
          <p className="text-xs font-medium text-white">Public Gear Page</p>
          <p className="text-[10px] text-slate-600 mt-0.5">
            {state.equipmentPublic
              ? <a href="/gear" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300">{window.location.origin}/gear →</a>
              : 'Enable to share your equipment list publicly'}
          </p>
        </div>
        <Toggle label="" checked={state.equipmentPublic} onChange={v => setEquipmentPublic(v)} />
      </div>

      <div className="flex gap-1 p-1 rounded-lg mb-5 w-fit" style={{ background: '#1a1a1d' }}>
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} className={clsx('px-3 py-1 rounded-md text-xs font-medium transition-colors', catFilter === c ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white')}>{c}</button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-sm">No equipment tracked.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add item</button>
        </div>
      ) : (
        <div className="space-y-6">
          {(catFilter === 'All' ? CAT_OPTIONS.map(c => c.value) : [catFilter]).map(cat => {
            const catItems = grouped[cat]
            if (!catItems?.length) return null
            return (
              <div key={cat}>
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">{cat}</p>
                <div className="space-y-1.5">
                  {catItems.map(e => (
                    <div key={e.id} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/6 hover:border-white/15 cursor-pointer" style={{ background: '#141416' }} onClick={() => openEdit(e)}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COND_COLOR[e.condition] ?? '#888' }} />
                      <p className="flex-1 text-sm text-white">{e.item}</p>
                      <span className={clsx('text-[10px]', e.owned ? 'text-emerald-400' : 'text-slate-600')}>{e.owned ? 'Owned' : 'Wish List'}</span>
                      <span className="text-[10px] text-slate-600">{e.condition}</span>
                      <button onClick={ev => { ev.stopPropagation(); deleteEquipment(e.id) }} className="text-slate-700 hover:text-red-400 text-xs">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Item' : 'Add Equipment'} size="sm"
        footer={<><Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button size="sm" onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">
          <Input label="Item Name" placeholder="e.g. Sony A7 IV" value={form.item} onChange={e => setForm(f => ({ ...f, item: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" options={CAT_OPTIONS} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            <Select label="Condition" options={COND_OPTIONS} value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} />
          </div>
          <Toggle label="Owned" description="Uncheck if on wish list" checked={form.owned} onChange={v => setForm(f => ({ ...f, owned: v }))} />
          <Textarea label="Notes" placeholder="Serial number, settings, accessories..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
        </div>
      </Modal>
    </div>
  )
}
