import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import type { Deliverable } from '../../types'

const FILM_COLS = ['Ideas', 'Writing', 'Filming', 'Editing', 'Color Correction', 'Color Grading', 'Finished']
const MUSIC_COLS = ['Ideas', 'Scoring', 'Recording', 'Mixing', 'Revisions', 'Mastering', 'Finished']

const STATUS_COLOR: Record<string, string> = {
  Pending: '#6272f3',
  'Ready for Review': '#f59e0b',
  Approved: '#48bb9a',
  'Revision Requested': '#e85d4a',
}

const COND_COLOR: Record<string, string> = {
  Good: '#48bb9a', 'Needs Repair': '#f59e0b', 'Replace Soon': '#e85d4a',
}

export function PortalPage() {
  const { token } = useParams<{ token: string }>()
  const { state, updateDeliverable, createPortalMessage, markMessagesRead } = useApp()
  const [messageText, setMessageText] = useState('')
  const [clientName, setClientName] = useState('')
  const [nameSet, setNameSet] = useState(false)

  const clientProject = state.clientProjects.find(p => p.shareToken === token && p.portalEnabled)

  if (!clientProject) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0c0c0e' }}>
        <div className="text-center">
          <p className="text-4xl mb-4 text-slate-600">◈</p>
          <p className="text-white font-semibold mb-1">Portal not found</p>
          <p className="text-sm text-slate-500">This link may be invalid or has been revoked.</p>
          <Link to="/" className="mt-4 inline-block text-xs text-brand-400 hover:text-brand-300">← Go home</Link>
        </div>
      </div>
    )
  }

  const portalSettings = clientProject.portalSettings ?? {
    showFilmKanban: false, showMusicKanban: false, showTimeline: true,
    showDeliverables: true, showEquipmentList: false, allowMessages: true,
    welcomeMessage: '', brandName: '',
  }
  const client = state.clients.find(c => c.id === clientProject.clientId)
  const deliverables = state.deliverables.filter(d => d.clientProjectId === clientProject.id)
  const messages = state.portalMessages.filter(m => m.clientProjectId === clientProject.id)
  const creativeProject = state.creativeProjects.find(p => p.id === clientProject.id)

  markMessagesRead(clientProject.id)

  function handleDeliverableAction(d: Deliverable, action: 'Approved' | 'Revision Requested') {
    updateDeliverable(d.id, { status: action })
  }

  function handleSendMessage() {
    if (!messageText.trim()) return
    createPortalMessage({
      clientProjectId: clientProject!.id,
      sender: 'client',
      senderName: clientName || 'Client',
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    })
    setMessageText('')
  }

  const brandName = portalSettings.brandName || 'Your Producer'

  return (
    <div className="min-h-screen" style={{ background: '#0c0c0e' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 border-b border-white/6 px-6 py-3 flex items-center justify-between"
        style={{ background: '#111113' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">
            IX
          </div>
          <span className="text-xs font-semibold text-white">{brandName}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-slate-400">{clientProject.status}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {/* Project header */}
        <div>
          {portalSettings.welcomeMessage && (
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">{portalSettings.welcomeMessage}</p>
          )}
          <h1 className="text-2xl font-bold text-white mb-1">{clientProject.projectName}</h1>
          {client && <p className="text-sm text-slate-500">For {client.name}</p>}
          <div className="flex flex-wrap gap-3 mt-3">
            <span className="text-xs font-mono text-slate-600">{clientProject.serviceType}</span>
            {clientProject.shootDate && (
              <span className="text-xs font-mono text-slate-600">
                Shoot · {new Date(clientProject.shootDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {clientProject.deliveryDeadline && (
              <span className="text-xs font-mono text-slate-600">
                Delivery · {new Date(clientProject.deliveryDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>
        </div>

        {/* Payment status */}
        <div className="flex gap-3">
          <div className={clsx('px-3 py-1.5 rounded-lg text-xs border', clientProject.contractSigned ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/8 text-slate-600')}>
            {clientProject.contractSigned ? '✓ Contract Signed' : '○ Contract Pending'}
          </div>
          <div className={clsx('px-3 py-1.5 rounded-lg text-xs border', clientProject.depositPaid ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/8 text-slate-600')}>
            {clientProject.depositPaid ? '✓ Deposit Received' : '○ Deposit Pending'}
          </div>
          <div className={clsx('px-3 py-1.5 rounded-lg text-xs border', clientProject.finalPaid ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/8 text-slate-600')}>
            {clientProject.finalPaid ? '✓ Final Payment Received' : '○ Final Payment Pending'}
          </div>
        </div>

        {/* Deliverables */}
        {portalSettings.showDeliverables && (
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Deliverables</h2>
            {deliverables.length === 0 ? (
              <p className="text-sm text-slate-600 py-4">No deliverables posted yet.</p>
            ) : (
              <div className="space-y-2">
                {deliverables.map(d => (
                  <div
                    key={d.id}
                    className="rounded-xl border border-white/8 p-4"
                    style={{ background: '#141416' }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white mb-0.5">{d.title}</p>
                        {d.description && <p className="text-xs text-slate-500 mb-2">{d.description}</p>}
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full border"
                            style={{
                              color: STATUS_COLOR[d.status],
                              borderColor: STATUS_COLOR[d.status] + '40',
                              background: STATUS_COLOR[d.status] + '15',
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
                          <p className="mt-2 text-xs text-slate-400 bg-white/4 rounded-lg px-3 py-2 border border-white/6">
                            "{d.clientFeedback}"
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        {d.fileLink && (
                          <a
                            href={d.fileLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-brand-400 hover:text-brand-300 transition-colors"
                          >
                            View File →
                          </a>
                        )}
                        {d.status === 'Ready for Review' && (
                          <div className="flex gap-1.5 mt-1">
                            <button
                              onClick={() => handleDeliverableAction(d, 'Approved')}
                              className="text-[10px] px-2 py-1 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const feedback = window.prompt('What needs revision?')
                                if (feedback) {
                                  updateDeliverable(d.id, { status: 'Revision Requested', clientFeedback: feedback })
                                }
                              }}
                              className="text-[10px] px-2 py-1 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-colors"
                            >
                              Revision
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Film Kanban */}
        {portalSettings.showFilmKanban && (
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Film Progress</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {FILM_COLS.map(col => {
                const cards = creativeProject?.filmKanban[col as keyof typeof creativeProject.filmKanban] ?? []
                return (
                  <div key={col} className="shrink-0 w-40">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5 px-1">{col}</p>
                    <div className="space-y-1.5">
                      {cards.length === 0 ? (
                        <p className="text-[10px] text-slate-700 px-1">—</p>
                      ) : cards.map((card: any) => (
                        <div key={card.id} className="rounded-lg border border-white/8 px-2.5 py-2" style={{ background: '#1a1a1d' }}>
                          <p className="text-xs text-white leading-snug">{card.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Music Kanban */}
        {portalSettings.showMusicKanban && (
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Music Progress</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {MUSIC_COLS.map(col => {
                const cards = creativeProject?.musicKanban[col as keyof typeof creativeProject.musicKanban] ?? []
                return (
                  <div key={col} className="shrink-0 w-40">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1.5 px-1">{col}</p>
                    <div className="space-y-1.5">
                      {cards.length === 0 ? (
                        <p className="text-[10px] text-slate-700 px-1">—</p>
                      ) : cards.map((card: any) => (
                        <div key={card.id} className="rounded-lg border border-white/8 px-2.5 py-2" style={{ background: '#1a1a1d' }}>
                          <p className="text-xs text-white leading-snug">{card.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Equipment */}
        {portalSettings.showEquipmentList && state.equipment.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Equipment Used</h2>
            <div className="space-y-1.5">
              {state.equipment.filter(e => e.owned).map(e => (
                <div key={e.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-white/6" style={{ background: '#141416' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COND_COLOR[e.condition] ?? '#888' }} />
                  <span className="text-xs text-white">{e.item}</span>
                  <span className="ml-auto text-[10px] text-slate-600">{e.category}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Messages */}
        {portalSettings.allowMessages && (
          <section>
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Messages</h2>
            <div className="rounded-xl border border-white/8 overflow-hidden" style={{ background: '#141416' }}>
              <div className="max-h-64 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <p className="text-sm text-slate-600 text-center py-4">No messages yet. Start the conversation.</p>
                ) : messages.map(m => (
                  <div key={m.id} className={clsx('flex', m.sender === 'client' ? 'justify-end' : 'justify-start')}>
                    <div
                      className={clsx(
                        'max-w-xs rounded-2xl px-3 py-2 text-xs',
                        m.sender === 'client'
                          ? 'bg-brand-600/30 text-brand-100 border border-brand-500/20'
                          : 'text-slate-300 border border-white/8',
                      )}
                      style={m.sender !== 'client' ? { background: '#1a1a1d' } : {}}
                    >
                      <p className="font-medium text-[10px] mb-0.5 opacity-70">{m.senderName}</p>
                      <p>{m.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!nameSet && (
                <div className="border-t border-white/6 p-3">
                  <p className="text-xs text-slate-500 mb-2">Your name (shown in messages)</p>
                  <div className="flex gap-2">
                    <input
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="Enter your name..."
                      className="flex-1 text-xs text-white placeholder-slate-600 bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500/60"
                    />
                    <button
                      onClick={() => { if (clientName.trim()) setNameSet(true) }}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-500 transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}

              {nameSet && (
                <div className="border-t border-white/6 p-3 flex gap-2">
                  <input
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
                    placeholder="Type a message..."
                    className="flex-1 text-xs text-white placeholder-slate-600 bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500/60"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-medium hover:bg-brand-500 transition-colors"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        <p className="text-[10px] text-slate-700 text-center">
          Powered by Interdisciplinary · {brandName}
        </p>
      </div>
    </div>
  )
}
