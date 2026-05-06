import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { Toggle } from '../../components/ui/Input'
import type { ClientProject, Deliverable } from '../../types'

const SERVICE_OPTIONS = ['Photography', 'Videography', 'Livestream', 'Music Production', 'Live Performance'].map(v => ({ value: v, label: v }))
const PACKAGE_OPTIONS = ['Portrait Session', 'Event Half-Day', 'Event Full-Day', 'Promo Video', 'Custom'].map(v => ({ value: v, label: v }))
const STATUS_OPTIONS = ['Inquiry', 'Booked', 'In Progress', 'Editing', 'Delivered', 'Completed'].map(v => ({ value: v, label: v }))
const DELIVERABLE_STATUS_OPTIONS = ['Pending', 'Ready for Review', 'Approved', 'Revision Requested'].map(v => ({ value: v, label: v }))

const STATUS_BADGE: Record<string, any> = {
  Inquiry: 'neutral', Booked: 'creator', 'In Progress': 'film',
  Editing: 'creator', Delivered: 'music', Completed: 'free',
}

const DELIVERABLE_COLOR: Record<string, string> = {
  Pending: '#6272f3', 'Ready for Review': '#f59e0b', Approved: '#48bb9a', 'Revision Requested': '#e85d4a',
}

const defaultForm = {
  projectName: '', clientId: '', serviceType: 'Videography', package: 'Custom',
  status: 'Inquiry', shootDate: '', deliveryDeadline: '', location: '',
  price: '', depositPaid: false, finalPaid: false, contractSigned: false,
  deliverables: '', notes: '', filesLink: '',
}

type ActivePanel = 'details' | 'portal' | 'deliverables' | 'messages'

export function ClientProjectsPage() {
  const {
    state, createClientProject, updateClientProject, deleteClientProject,
    createDeliverable, updateDeliverable, deleteDeliverable,
    createPortalMessage,
    generatePortalToken, revokePortalToken, defaultPortalSettings,
  } = useApp()

  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })
  const [statusFilter, setStatusFilter] = useState('All')

  // Project detail drawer
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<ActivePanel>('details')

  // Deliverable form
  const [deliverableForm, setDeliverableForm] = useState({
    title: '', description: '', fileLink: '', previewLink: '', status: 'Pending', dueDate: '',
  })
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false)
  const [editDeliverableId, setEditDeliverableId] = useState<string | null>(null)

  // Portal message form
  const [msgText, setMsgText] = useState('')

  // Token copy feedback
  const [copied, setCopied] = useState(false)

  const clientOptions = [{ value: '', label: 'No client' }, ...state.clients.map(c => ({ value: c.id, label: c.name }))]
  const projects = state.clientProjects.filter(p => statusFilter === 'All' || p.status === statusFilter)
  const selectedProject = selectedId ? state.clientProjects.find(p => p.id === selectedId) : null

  function openCreate() { setForm({ ...defaultForm }); setEditId(null); setModalOpen(true) }
  function openEdit(p: ClientProject) {
    setForm({
      projectName: p.projectName, clientId: p.clientId, serviceType: p.serviceType,
      package: p.package, status: p.status, shootDate: p.shootDate,
      deliveryDeadline: p.deliveryDeadline, location: p.location,
      price: String(p.price), depositPaid: p.depositPaid, finalPaid: p.finalPaid,
      contractSigned: p.contractSigned, deliverables: p.deliverables, notes: p.notes, filesLink: p.filesLink,
    })
    setEditId(p.id); setModalOpen(true)
  }
  function handleSave() {
    const data: any = { ...form, price: Number(form.price) || 0 }
    if (editId) updateClientProject(editId, data)
    else {
      const id = createClientProject(data)
      setSelectedId(id)
    }
    setModalOpen(false)
  }

  function handleGenerateToken() {
    if (!selectedId) return
    generatePortalToken(selectedId)
  }

  function handleCopyLink() {
    if (!selectedProject?.shareToken) return
    navigator.clipboard.writeText(`${window.location.origin}/portal/${selectedProject.shareToken}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function updatePortalSetting(key: string, value: any) {
    if (!selectedId || !selectedProject) return
    const current = selectedProject.portalSettings ?? { ...defaultPortalSettings }
    updateClientProject(selectedId, {
      portalSettings: { ...current, [key]: value } as any,
    })
  }

  function openDeliverableCreate() {
    setDeliverableForm({ title: '', description: '', fileLink: '', previewLink: '', status: 'Pending', dueDate: '' })
    setEditDeliverableId(null)
    setDeliverableModalOpen(true)
  }

  function openDeliverableEdit(d: Deliverable) {
    setDeliverableForm({
      title: d.title, description: d.description, fileLink: d.fileLink ?? '',
      previewLink: d.previewLink ?? '', status: d.status, dueDate: d.dueDate ?? '',
    })
    setEditDeliverableId(d.id)
    setDeliverableModalOpen(true)
  }

  function handleSaveDeliverable() {
    if (!selectedId) return
    const data: any = {
      clientProjectId: selectedId,
      ...deliverableForm,
      fileLink: deliverableForm.fileLink || undefined,
      previewLink: deliverableForm.previewLink || undefined,
      dueDate: deliverableForm.dueDate || undefined,
    }
    if (editDeliverableId) updateDeliverable(editDeliverableId, data)
    else createDeliverable(data)
    setDeliverableModalOpen(false)
  }

  function handleSendMessage() {
    if (!selectedId || !msgText.trim()) return
    createPortalMessage({
      clientProjectId: selectedId,
      sender: 'producer',
      senderName: 'Producer',
      content: msgText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    })
    setMsgText('')
  }

  const projectDeliverables = selectedId ? state.deliverables.filter(d => d.clientProjectId === selectedId) : []
  const projectMessages = selectedId ? state.portalMessages.filter(m => m.clientProjectId === selectedId) : []
  const unreadCount = selectedId ? state.portalMessages.filter(m => m.clientProjectId === selectedId && !m.read).length : 0

  return (
    <div className="flex h-full">
      {/* Left: Project list */}
      <div className="flex flex-col w-full max-w-[520px] border-r border-white/6" style={{ background: '#0c0c0e' }}>
        <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between shrink-0" style={{ background: '#111113' }}>
          <h1 className="text-lg font-bold text-white">Client Projects</h1>
          <Button size="sm" onClick={openCreate}>+ New</Button>
        </div>

        <div className="px-4 py-3 border-b border-white/6 flex gap-1 flex-wrap" style={{ background: '#111113' }}>
          {['All', ...STATUS_OPTIONS.map(s => s.value)].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={clsx('px-2.5 py-1 rounded-md text-xs font-medium transition-colors', statusFilter === s ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white')}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="text-center py-16 text-slate-600">
              <p className="text-sm">No client projects.</p>
              <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Add project</button>
            </div>
          ) : projects.map(p => {
            const client = state.clients.find(c => c.id === p.clientId)
            const unread = state.portalMessages.filter(m => m.clientProjectId === p.id && !m.read).length
            return (
              <div
                key={p.id}
                onClick={() => { setSelectedId(p.id); setActivePanel('details') }}
                className={clsx(
                  'flex items-center gap-3 px-4 py-3 border-b border-white/4 cursor-pointer transition-colors',
                  selectedId === p.id ? 'bg-brand-600/10 border-l-2 border-l-brand-500' : 'hover:bg-white/4',
                )}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{p.projectName}</p>
                    {p.portalEnabled && <span className="text-[10px] text-brand-400">● Portal</span>}
                    {unread > 0 && <span className="text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5">{unread}</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{client?.name ?? '—'} · {p.serviceType}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono text-white">${p.price.toLocaleString()}</span>
                  <Badge variant={STATUS_BADGE[p.status] ?? 'neutral'} size="xs">{p.status}</Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Project detail */}
      {selectedProject ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Detail header */}
          <div className="px-6 py-4 border-b border-white/6 flex items-center justify-between shrink-0" style={{ background: '#111113' }}>
            <div>
              <h2 className="text-sm font-semibold text-white">{selectedProject.projectName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {state.clients.find(c => c.id === selectedProject.clientId)?.name ?? '—'} · {selectedProject.serviceType}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="xs" onClick={() => openEdit(selectedProject)}>Edit</Button>
              <Button variant="danger" size="xs" onClick={() => { deleteClientProject(selectedProject.id); setSelectedId(null) }}>Delete</Button>
            </div>
          </div>

          {/* Panel tabs */}
          <div className="flex border-b border-white/6 px-6 shrink-0" style={{ background: '#111113' }}>
            {([
              { id: 'details', label: 'Details' },
              { id: 'deliverables', label: `Deliverables${projectDeliverables.length ? ` (${projectDeliverables.length})` : ''}` },
              { id: 'portal', label: 'Client Portal' },
              { id: 'messages', label: `Messages${unreadCount > 0 ? ` · ${unreadCount}` : ''}` },
            ] as { id: ActivePanel; label: string }[]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={clsx(
                  'px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors',
                  activePanel === tab.id ? 'text-brand-300 border-brand-500' : 'text-slate-600 border-transparent hover:text-slate-400',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">

            {/* ── Details panel ────────────────────────────────────── */}
            {activePanel === 'details' && (
              <div className="max-w-xl space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Status', value: selectedProject.status },
                    { label: 'Package', value: selectedProject.package },
                    { label: 'Shoot Date', value: selectedProject.shootDate ? new Date(selectedProject.shootDate).toLocaleDateString() : '—' },
                    { label: 'Delivery', value: selectedProject.deliveryDeadline ? new Date(selectedProject.deliveryDeadline).toLocaleDateString() : '—' },
                    { label: 'Location', value: selectedProject.location || '—' },
                    { label: 'Price', value: `$${selectedProject.price.toLocaleString()}` },
                  ].map(row => (
                    <div key={row.label}>
                      <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-0.5">{row.label}</p>
                      <p className="text-sm text-white font-mono">{row.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {selectedProject.contractSigned && <span className="text-xs text-emerald-400">✓ Contract</span>}
                  {selectedProject.depositPaid && <span className="text-xs text-emerald-400">✓ Deposit</span>}
                  {selectedProject.finalPaid && <span className="text-xs text-emerald-400">✓ Final</span>}
                </div>

                {selectedProject.deliverables && (
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Deliverables Summary</p>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap">{selectedProject.deliverables}</p>
                  </div>
                )}

                {selectedProject.notes && (
                  <div>
                    <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Notes</p>
                    <p className="text-xs text-slate-300 whitespace-pre-wrap">{selectedProject.notes}</p>
                  </div>
                )}

                {selectedProject.filesLink && (
                  <a href={selectedProject.filesLink} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-400 hover:text-brand-300">
                    Open Files →
                  </a>
                )}
              </div>
            )}

            {/* ── Deliverables panel ───────────────────────────────── */}
            {activePanel === 'deliverables' && (
              <div className="max-w-xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-white">Deliverables</p>
                  <Button size="xs" onClick={openDeliverableCreate}>+ Add</Button>
                </div>

                {projectDeliverables.length === 0 ? (
                  <div className="text-center py-10 text-slate-600">
                    <p className="text-sm">No deliverables yet.</p>
                    <button onClick={openDeliverableCreate} className="mt-2 text-xs text-brand-400">+ Add deliverable</button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projectDeliverables.map(d => (
                      <div
                        key={d.id}
                        className="rounded-xl border border-white/8 p-4 cursor-pointer hover:border-white/20 transition-colors"
                        style={{ background: '#141416' }}
                        onClick={() => openDeliverableEdit(d)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white mb-0.5">{d.title}</p>
                            {d.description && <p className="text-xs text-slate-500 mb-2">{d.description}</p>}
                            <div className="flex items-center gap-2">
                              <span
                                className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                                style={{
                                  color: DELIVERABLE_COLOR[d.status],
                                  borderColor: DELIVERABLE_COLOR[d.status] + '40',
                                  background: DELIVERABLE_COLOR[d.status] + '15',
                                }}
                              >
                                {d.status}
                              </span>
                              {d.dueDate && (
                                <span className="text-[10px] font-mono text-slate-600">
                                  Due {new Date(d.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                            {d.clientFeedback && (
                              <p className="mt-2 text-xs text-amber-400 bg-amber-500/10 rounded-lg px-3 py-1.5 border border-amber-500/20">
                                Client: "{d.clientFeedback}"
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            {d.fileLink && (
                              <a href={d.fileLink} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-brand-400 hover:text-brand-300"
                                onClick={e => e.stopPropagation()}
                              >
                                File →
                              </a>
                            )}
                            <button
                              onClick={e => { e.stopPropagation(); deleteDeliverable(d.id) }}
                              className="text-slate-700 hover:text-red-400 text-xs"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Portal panel ─────────────────────────────────────── */}
            {activePanel === 'portal' && (
              <div className="max-w-xl space-y-6">
                {/* Token section */}
                <div className="rounded-xl border border-white/8 p-4" style={{ background: '#141416' }}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Share Link</p>

                  {selectedProject.shareToken ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-white/4 rounded-lg px-3 py-2 border border-white/8">
                        <code className="text-xs text-brand-300 flex-1 truncate font-mono">
                          {window.location.origin}/portal/{selectedProject.shareToken}
                        </code>
                        <button
                          onClick={handleCopyLink}
                          className="text-xs text-slate-400 hover:text-white transition-colors shrink-0"
                        >
                          {copied ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="xs" variant="outline" onClick={handleGenerateToken}>Regenerate</Button>
                        <Button size="xs" variant="danger" onClick={() => revokePortalToken(selectedId!)}>Revoke</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs text-slate-500 mb-3">Generate a private link to share this project's portal with your client.</p>
                      <Button size="sm" onClick={handleGenerateToken}>Generate Portal Link</Button>
                    </div>
                  )}
                </div>

                {/* Visibility settings */}
                <div className="rounded-xl border border-white/8 p-4 space-y-3" style={{ background: '#141416' }}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">What client can see</p>

                  {([
                    { key: 'showDeliverables', label: 'Deliverables', description: 'Files ready for review and approval' },
                    { key: 'showFilmKanban', label: 'Film Pipeline', description: 'Kanban board showing film production stages' },
                    { key: 'showMusicKanban', label: 'Music Pipeline', description: 'Kanban board showing music production stages' },
                    { key: 'showTimeline', label: 'Timeline', description: 'Shoot date and delivery deadline' },
                    { key: 'showEquipmentList', label: 'Equipment List', description: 'Your gear that will be used on the project' },
                    { key: 'allowMessages', label: 'Messaging', description: 'Allow client to send messages via portal' },
                  ] as { key: keyof typeof defaultPortalSettings; label: string; description: string }[]).map(setting => (
                    <Toggle
                      key={setting.key}
                      label={setting.label}
                      description={setting.description}
                      checked={!!(selectedProject.portalSettings?.[setting.key])}
                      onChange={v => updatePortalSetting(setting.key, v)}
                    />
                  ))}
                </div>

                {/* Branding */}
                <div className="rounded-xl border border-white/8 p-4 space-y-3" style={{ background: '#141416' }}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Branding</p>
                  <Input
                    label="Brand / Studio Name"
                    placeholder="Your name or studio name"
                    value={selectedProject.portalSettings?.brandName ?? ''}
                    onChange={e => updatePortalSetting('brandName', e.target.value)}
                  />
                  <Textarea
                    label="Welcome Message"
                    placeholder="e.g. Thanks for trusting me with your project. Here you can track progress and review deliverables."
                    value={selectedProject.portalSettings?.welcomeMessage ?? ''}
                    onChange={e => updatePortalSetting('welcomeMessage', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* ── Messages panel ───────────────────────────────────── */}
            {activePanel === 'messages' && (
              <div className="max-w-xl flex flex-col" style={{ height: 'calc(100vh - 220px)' }}>
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {projectMessages.length === 0 ? (
                    <p className="text-sm text-slate-600 text-center py-8">No messages yet.</p>
                  ) : projectMessages.map(m => (
                    <div key={m.id} className={clsx('flex', m.sender === 'producer' ? 'justify-end' : 'justify-start')}>
                      <div
                        className={clsx(
                          'max-w-sm rounded-2xl px-3 py-2 text-xs',
                          m.sender === 'producer'
                            ? 'bg-brand-600/30 text-brand-100 border border-brand-500/20'
                            : 'text-slate-300 border border-white/8',
                        )}
                        style={m.sender !== 'producer' ? { background: '#1a1a1d' } : {}}
                      >
                        <p className="font-medium text-[10px] mb-0.5 opacity-60">{m.senderName}</p>
                        <p>{m.content}</p>
                        <p className="text-[9px] opacity-40 mt-1">
                          {new Date(m.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 shrink-0">
                  <input
                    value={msgText}
                    onChange={e => setMsgText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
                    placeholder="Message client..."
                    className="flex-1 text-xs text-white placeholder-slate-600 bg-white/4 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/60"
                    style={{ background: '#1a1a1d' }}
                  />
                  <Button size="sm" onClick={handleSendMessage}>Send</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-700">
          <div className="text-center">
            <p className="text-4xl mb-3">◇</p>
            <p className="text-sm">Select a project to view details</p>
          </div>
        </div>
      )}

      {/* Create/Edit project modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? 'Edit Project' : 'New Client Project'} size="lg"
        footer={<><Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button size="sm" onClick={handleSave}>Save</Button></>}
      >
        <div className="space-y-4">
          <Input label="Project Name" value={form.projectName} onChange={e => setForm(f => ({ ...f, projectName: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Client" options={clientOptions} value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))} />
            <Select label="Service Type" options={SERVICE_OPTIONS} value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Package" options={PACKAGE_OPTIONS} value={form.package} onChange={e => setForm(f => ({ ...f, package: e.target.value }))} />
            <Select label="Status" options={STATUS_OPTIONS} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Shoot Date" type="date" value={form.shootDate} onChange={e => setForm(f => ({ ...f, shootDate: e.target.value }))} />
            <Input label="Delivery Deadline" type="date" value={form.deliveryDeadline} onChange={e => setForm(f => ({ ...f, deliveryDeadline: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price ($)" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            <Input label="Location" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Toggle label="Deposit Paid" checked={form.depositPaid} onChange={v => setForm(f => ({ ...f, depositPaid: v }))} />
            <Toggle label="Final Paid" checked={form.finalPaid} onChange={v => setForm(f => ({ ...f, finalPaid: v }))} />
            <Toggle label="Contract Signed" checked={form.contractSigned} onChange={v => setForm(f => ({ ...f, contractSigned: v }))} />
          </div>
          <Textarea label="Deliverables Summary" placeholder="What's being delivered..." value={form.deliverables} onChange={e => setForm(f => ({ ...f, deliverables: e.target.value }))} />
          <Input label="Files Link" placeholder="https://..." value={form.filesLink} onChange={e => setForm(f => ({ ...f, filesLink: e.target.value }))} />
          <Textarea label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>
      </Modal>

      {/* Deliverable modal */}
      <Modal open={deliverableModalOpen} onClose={() => setDeliverableModalOpen(false)}
        title={editDeliverableId ? 'Edit Deliverable' : 'Add Deliverable'} size="md"
        footer={
          <>
            {editDeliverableId && <Button variant="danger" size="sm" onClick={() => { deleteDeliverable(editDeliverableId); setDeliverableModalOpen(false) }}>Delete</Button>}
            <Button variant="outline" size="sm" onClick={() => setDeliverableModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveDeliverable}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" placeholder="e.g. Highlights Reel" value={deliverableForm.title} onChange={e => setDeliverableForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea label="Description" placeholder="Brief description of this deliverable..." value={deliverableForm.description} onChange={e => setDeliverableForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          <Select label="Status" options={DELIVERABLE_STATUS_OPTIONS} value={deliverableForm.status} onChange={e => setDeliverableForm(f => ({ ...f, status: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="File Link" placeholder="https://..." value={deliverableForm.fileLink} onChange={e => setDeliverableForm(f => ({ ...f, fileLink: e.target.value }))} />
            <Input label="Due Date" type="date" value={deliverableForm.dueDate} onChange={e => setDeliverableForm(f => ({ ...f, dueDate: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
