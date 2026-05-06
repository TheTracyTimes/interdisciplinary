import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import type { Client } from '../../types'

const TYPE_OPTIONS = ['Individual', 'Church', 'Corporate', 'Artist', 'Organization'].map(v => ({ value: v, label: v }))
const SOURCE_OPTIONS = ['Referral', 'Instagram', 'Website', 'Word of Mouth', 'Repeat'].map(v => ({ value: v, label: v }))
const STATUS_OPTIONS = ['Lead', 'Active', 'Complete', 'Inactive'].map(v => ({ value: v, label: v }))

const STATUS_BADGE: Record<string, any> = {
  Lead: 'neutral', Active: 'creator', Complete: 'free', Inactive: 'neutral',
}

const defaultForm = {
  name: '', email: '', phone: '', type: 'Individual', source: 'Referral',
  status: 'Lead', notes: '', lastContactDate: new Date().toISOString().split('T')[0],
}

export function ClientsPage() {
  const { state, createClient, updateClient, deleteClient } = useApp()
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })

  const clients = state.clients.filter(c => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function getRevenue(client: Client) {
    return state.invoices
      .filter(i => i.clientId === client.id && i.status === 'Paid')
      .reduce((sum, i) => sum + i.amount, 0)
  }

  function getProjectCount(client: Client) {
    return state.clientProjects.filter(p => p.clientId === client.id).length
  }

  function openCreate() {
    setForm({ ...defaultForm })
    setEditId(null)
    setModalOpen(true)
  }

  function openEdit(client: Client) {
    setForm({
      name: client.name, email: client.email, phone: client.phone,
      type: client.type, source: client.source, status: client.status,
      notes: client.notes, lastContactDate: client.lastContactDate,
    })
    setEditId(client.id)
    setModalOpen(true)
  }

  function handleSave() {
    if (editId) {
      updateClient(editId, { ...form } as any)
    } else {
      createClient({ ...form, projectIds: [] } as any)
    }
    setModalOpen(false)
  }

  const statuses = ['All', 'Lead', 'Active', 'Complete', 'Inactive']

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Clients</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.clients.length} total</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ Add Client</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#1a1a1d' }}>
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                statusFilter === s ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white',
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search clients..."
          className="text-xs text-slate-300 placeholder-slate-600 bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500/60 w-44"
        />
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-4xl mb-3">◎</p>
          <p className="text-sm">No clients yet.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add your first client</button>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_6rem_6rem_3rem] gap-3 px-4 pb-1">
            {['Name', 'Type · Source', 'Email', 'Last Contact', 'Projects', 'Revenue', ''].map(h => (
              <span key={h} className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{h}</span>
            ))}
          </div>
          {clients.map(client => (
            <div
              key={client.id}
              className="grid grid-cols-[1fr_1fr_1fr_1fr_6rem_6rem_3rem] gap-3 items-center px-4 py-3 rounded-lg border border-white/6 hover:border-white/15 transition-colors cursor-pointer"
              style={{ background: '#141416' }}
              onClick={() => openEdit(client)}
            >
              <div>
                <p className="text-sm font-medium text-white">{client.name}</p>
                <Badge variant={STATUS_BADGE[client.status] ?? 'neutral'} size="xs" className="mt-0.5">{client.status}</Badge>
              </div>
              <div>
                <p className="text-xs text-slate-400">{client.type}</p>
                <p className="text-[10px] text-slate-600">{client.source}</p>
              </div>
              <p className="text-xs text-slate-400 truncate">{client.email || '—'}</p>
              <p className="text-xs font-mono text-slate-500">
                {client.lastContactDate
                  ? new Date(client.lastContactDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : '—'
                }
              </p>
              <p className="text-xs font-mono text-slate-400">{getProjectCount(client)}</p>
              <p className="text-xs font-mono text-emerald-400">
                {getRevenue(client) > 0 ? `$${getRevenue(client).toLocaleString()}` : '—'}
              </p>
              <button
                onClick={e => { e.stopPropagation(); deleteClient(client.id) }}
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
        title={editId ? 'Edit Client' : 'Add Client'}
        size="md"
        footer={
          <>
            {editId && <Button variant="danger" size="sm" onClick={() => { deleteClient(editId); setModalOpen(false) }}>Delete</Button>}
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="Full name or organization" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            <Input label="Phone" type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
            <Select label="Source" options={SOURCE_OPTIONS} value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
            <Input label="Last Contact" type="date" value={form.lastContactDate} onChange={e => setForm(f => ({ ...f, lastContactDate: e.target.value }))} />
          </div>
          <Textarea label="Notes" placeholder="Special requests, preferences, details..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
