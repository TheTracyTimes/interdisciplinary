import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import type { Contract } from '../../types'

const TYPE_OPTIONS = ['Portrait', 'Event', 'Commercial', 'Livestream', 'Music Production', 'Custom'].map(v => ({ value: v, label: v }))
const STATUS_OPTIONS = ['Draft', 'Sent', 'Signed', 'Expired'].map(v => ({ value: v, label: v }))

const STATUS_BADGE: Record<string, any> = {
  Draft: 'neutral', Sent: 'creator', Signed: 'free', Expired: 'film',
}

const defaultForm = {
  contractName: '', clientId: '', projectId: '', contractType: 'Event',
  status: 'Draft', dateSent: '', dateSigned: '', expirationDate: '',
  contractLink: '', notes: '',
}

export function ContractsPage() {
  const { state, createContract, updateContract, deleteContract } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })

  const clientOptions = [{ value: '', label: 'No client' }, ...state.clients.map(c => ({ value: c.id, label: c.name }))]
  const projectOptions = [{ value: '', label: 'No project' }, ...state.clientProjects.map(p => ({ value: p.id, label: p.projectName }))]

  function openCreate() { setForm({ ...defaultForm }); setEditId(null); setModalOpen(true) }
  function openEdit(c: Contract) {
    setForm({ contractName: c.contractName, clientId: c.clientId, projectId: c.projectId, contractType: c.contractType, status: c.status, dateSent: c.dateSent, dateSigned: c.dateSigned, expirationDate: c.expirationDate, contractLink: c.contractLink, notes: c.notes })
    setEditId(c.id); setModalOpen(true)
  }
  function handleSave() {
    if (editId) updateContract(editId, form as any)
    else createContract(form as any)
    setModalOpen(false)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Contracts</h1>
        <Button size="sm" onClick={openCreate}>+ New Contract</Button>
      </div>

      {state.contracts.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-sm">No contracts yet.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add contract</button>
        </div>
      ) : (
        <div className="space-y-2">
          {state.contracts.map(c => (
            <div
              key={c.id}
              className="flex items-center gap-4 px-4 py-3 rounded-lg border border-white/6 hover:border-white/15 transition-colors cursor-pointer"
              style={{ background: '#141416' }}
              onClick={() => openEdit(c)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{c.contractName}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {state.clients.find(cl => cl.id === c.clientId)?.name ?? '—'} · {c.contractType}
                </p>
              </div>
              <Badge variant={STATUS_BADGE[c.status] ?? 'neutral'} size="xs">{c.status}</Badge>
              {c.contractLink && (
                <a href={c.contractLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-brand-400 hover:text-brand-300">Open →</a>
              )}
              <button onClick={e => { e.stopPropagation(); deleteContract(c.id) }} className="text-slate-700 hover:text-red-400 text-xs">×</button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Contract' : 'New Contract'} size="md"
        footer={<><Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button size="sm" onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">
          <Input label="Contract Name" value={form.contractName} onChange={e => setForm(f => ({ ...f, contractName: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Client" options={clientOptions} value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} />
            <Select label="Project" options={projectOptions} value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={TYPE_OPTIONS} value={form.contractType} onChange={e => setForm(f => ({ ...f, contractType: e.target.value }))} />
            <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date Sent" type="date" value={form.dateSent} onChange={e => setForm(f => ({ ...f, dateSent: e.target.value }))} />
            <Input label="Date Signed" type="date" value={form.dateSigned} onChange={e => setForm(f => ({ ...f, dateSigned: e.target.value }))} />
          </div>
          <Input label="Expiration Date" type="date" value={form.expirationDate} onChange={e => setForm(f => ({ ...f, expirationDate: e.target.value }))} />
          <Input label="Contract Link" placeholder="https://..." value={form.contractLink} onChange={e => setForm(f => ({ ...f, contractLink: e.target.value }))} />
          <Textarea label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
