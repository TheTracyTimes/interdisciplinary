import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import type { Invoice } from '../../types'

const STATUS_OPTIONS = ['Draft', 'Sent', 'Paid', 'Overdue'].map(v => ({ value: v, label: v }))
const TYPE_OPTIONS = ['Deposit', 'Final Payment', 'Full Payment'].map(v => ({ value: v, label: v }))
const METHOD_OPTIONS = ['Zelle', 'Venmo', 'Cash', 'Check', 'PayPal', 'CashApp', 'Other'].map(v => ({ value: v, label: v }))

const STATUS_BADGE: Record<string, any> = {
  Draft: 'neutral', Sent: 'creator', Paid: 'free', Overdue: 'film',
}

const defaultForm = {
  invoiceNumber: '', clientId: '', projectId: '', amount: '',
  type: 'Full Payment', status: 'Draft', dateSent: '',
  dateDue: '', datePaid: '', paymentMethod: 'Zelle',
  invoiceLink: '', notes: '',
}

export function InvoicesPage() {
  const { state, createInvoice, updateInvoice, deleteInvoice } = useApp()
  const [statusFilter, setStatusFilter] = useState('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })

  const invoices = [...state.invoices]
    .filter(i => statusFilter === 'All' || i.status === statusFilter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  const totalPaid = state.invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.amount, 0)
  const totalSent = state.invoices.filter(i => i.status === 'Sent').reduce((s, i) => s + i.amount, 0)
  const totalOverdue = state.invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + i.amount, 0)

  const clientOptions = [
    { value: '', label: 'No client' },
    ...state.clients.map(c => ({ value: c.id, label: c.name })),
  ]

  const projectOptions = [
    { value: '', label: 'No project' },
    ...state.clientProjects.map(p => ({ value: p.id, label: p.projectName })),
  ]

  function openCreate() {
    const nextNum = `INV-${String(state.invoices.length + 1).padStart(3, '0')}`
    setForm({ ...defaultForm, invoiceNumber: nextNum })
    setEditId(null)
    setModalOpen(true)
  }

  function openEdit(inv: Invoice) {
    setForm({
      invoiceNumber: inv.invoiceNumber, clientId: inv.clientId,
      projectId: inv.projectId, amount: String(inv.amount),
      type: inv.type, status: inv.status, dateSent: inv.dateSent,
      dateDue: inv.dateDue, datePaid: inv.datePaid,
      paymentMethod: inv.paymentMethod, invoiceLink: inv.invoiceLink, notes: inv.notes,
    })
    setEditId(inv.id)
    setModalOpen(true)
  }

  function handleSave() {
    const data: any = {
      ...form, amount: Number(form.amount) || 0,
    }
    if (editId) updateInvoice(editId, data)
    else createInvoice(data)
    setModalOpen(false)
  }

  function getClientName(id: string) {
    return state.clients.find(c => c.id === id)?.name ?? '—'
  }

  function getProjectName(id: string) {
    return state.clientProjects.find(p => p.id === id)?.projectName ?? '—'
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Invoices</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.invoices.length} total</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ New Invoice</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Paid', value: `$${totalPaid.toLocaleString()}`, color: 'text-emerald-400' },
          { label: 'Outstanding', value: `$${totalSent.toLocaleString()}`, color: 'text-brand-400' },
          { label: 'Overdue', value: `$${totalOverdue.toLocaleString()}`, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-white/8 p-4" style={{ background: '#141416' }}>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest mb-1">{s.label}</p>
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-1 p-1 rounded-lg mb-5 w-fit" style={{ background: '#1a1a1d' }}>
        {['All', 'Draft', 'Sent', 'Paid', 'Overdue'].map(s => (
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

      {invoices.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-sm">No invoices.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Create invoice</button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-[6rem_1fr_1fr_1fr_6rem_6rem_5rem_3rem] gap-3 px-4 pb-1">
            {['Invoice #', 'Client', 'Project', 'Type', 'Amount', 'Due Date', 'Status', ''].map(h => (
              <span key={h} className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">{h}</span>
            ))}
          </div>
          {invoices.map(inv => (
            <div
              key={inv.id}
              className="grid grid-cols-[6rem_1fr_1fr_1fr_6rem_6rem_5rem_3rem] gap-3 items-center px-4 py-3 rounded-lg border border-white/6 hover:border-white/15 transition-colors cursor-pointer"
              style={{ background: '#141416' }}
              onClick={() => openEdit(inv)}
            >
              <span className="text-xs font-mono text-slate-400">{inv.invoiceNumber}</span>
              <span className="text-xs text-white truncate">{getClientName(inv.clientId)}</span>
              <span className="text-xs text-slate-500 truncate">{getProjectName(inv.projectId)}</span>
              <span className="text-xs text-slate-500">{inv.type}</span>
              <span className={clsx('text-xs font-mono font-semibold', inv.status === 'Paid' ? 'text-emerald-400' : 'text-white')}>
                ${inv.amount.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-500">
                {inv.dateDue ? new Date(inv.dateDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
              </span>
              <Badge variant={STATUS_BADGE[inv.status] ?? 'neutral'} size="xs">{inv.status}</Badge>
              <button
                onClick={e => { e.stopPropagation(); deleteInvoice(inv.id) }}
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
        title={editId ? 'Edit Invoice' : 'New Invoice'}
        size="md"
        footer={
          <>
            {editId && <Button variant="danger" size="sm" onClick={() => { deleteInvoice(editId); setModalOpen(false) }}>Delete</Button>}
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Invoice #" value={form.invoiceNumber} onChange={e => setForm(f => ({ ...f, invoiceNumber: e.target.value }))} />
            <Input label="Amount ($)" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Client" options={clientOptions} value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} />
            <Select label="Project" options={projectOptions} value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={TYPE_OPTIONS} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
            <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date Sent" type="date" value={form.dateSent} onChange={e => setForm(f => ({ ...f, dateSent: e.target.value }))} />
            <Input label="Date Due" type="date" value={form.dateDue} onChange={e => setForm(f => ({ ...f, dateDue: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Date Paid" type="date" value={form.datePaid} onChange={e => setForm(f => ({ ...f, datePaid: e.target.value }))} />
            <Select label="Payment Method" options={METHOD_OPTIONS} value={form.paymentMethod} onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))} />
          </div>
          <Input label="Invoice Link" placeholder="https://..." value={form.invoiceLink} onChange={e => setForm(f => ({ ...f, invoiceLink: e.target.value }))} />
          <Textarea label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
