import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'

export function MessagesPage() {
  const {
    state, createMessageThread, deleteMessageThread,
    sendDirectMessage, markThreadRead,
  } = useApp()

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [newThreadOpen, setNewThreadOpen] = useState(false)
  const [newThreadForm, setNewThreadForm] = useState({ participantName: '', participantEmail: '', subject: '' })
  const [msgText, setMsgText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  const threads = [...state.messageThreads].sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
  const selectedThread = threads.find(t => t.id === selectedThreadId) ?? null
  const messages = state.directMessages.filter(m => m.threadId === selectedThreadId)
  const unread = (threadId: string) => state.directMessages.filter(m => m.threadId === threadId && !m.read).length

  useEffect(() => {
    if (selectedThreadId) markThreadRead(selectedThreadId)
  }, [selectedThreadId, messages.length])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleCreateThread() {
    if (!newThreadForm.participantName.trim()) return
    const id = createMessageThread({
      participantName: newThreadForm.participantName,
      participantEmail: newThreadForm.participantEmail,
      subject: newThreadForm.subject || `Conversation with ${newThreadForm.participantName}`,
    })
    setSelectedThreadId(id)
    setNewThreadOpen(false)
    setNewThreadForm({ participantName: '', participantEmail: '', subject: '' })
  }

  function handleSend() {
    if (!selectedThreadId || !msgText.trim()) return
    sendDirectMessage({
      threadId: selectedThreadId,
      sender: 'producer',
      senderName: state.producerProfile.displayName || 'Producer',
      content: msgText.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    })
    setMsgText('')
  }

  function timeLabel(iso: string) {
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    if (diff < 86400000) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const totalUnread = state.messageThreads.reduce((sum, t) => sum + unread(t.id), 0)

  return (
    <div className="flex h-full">
      {/* Thread list */}
      <div className="flex flex-col w-72 shrink-0 border-r border-white/6" style={{ background: '#0c0c0e' }}>
        <div className="px-4 py-3 border-b border-white/6 flex items-center justify-between shrink-0" style={{ background: '#111113' }}>
          <div>
            <p className="text-sm font-bold text-white">Messages</p>
            {totalUnread > 0 && <p className="text-[10px] text-slate-500">{totalUnread} unread</p>}
          </div>
          <button
            onClick={() => setNewThreadOpen(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold hover:opacity-80 transition-opacity"
            style={{ background: '#6272f3' }}
          >
            +
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-slate-600 text-xs">No conversations yet.</p>
              <button onClick={() => setNewThreadOpen(true)} className="mt-2 text-[10px] text-brand-400">+ New Message</button>
            </div>
          ) : threads.map(t => {
            const count = unread(t.id)
            const threadMsgs = state.directMessages.filter(m => m.threadId === t.id)
            const lastMsg = threadMsgs[threadMsgs.length - 1]
            return (
              <div
                key={t.id}
                onClick={() => setSelectedThreadId(t.id)}
                className={clsx(
                  'px-4 py-3 border-b border-white/4 cursor-pointer transition-colors',
                  selectedThreadId === t.id ? 'bg-brand-600/10 border-l-2 border-l-brand-500' : 'hover:bg-white/4',
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <p className={clsx('text-xs font-semibold truncate', count > 0 ? 'text-white' : 'text-slate-300')}>
                    {t.participantName}
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {count > 0 && (
                      <span className="text-[9px] bg-brand-600 text-white rounded-full px-1.5 py-0.5 font-bold">{count}</span>
                    )}
                    <span className="text-[9px] text-slate-600 font-mono">{timeLabel(t.lastMessageAt)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 truncate">{t.subject}</p>
                {lastMsg && (
                  <p className="text-[10px] text-slate-700 truncate mt-0.5">
                    {lastMsg.sender === 'producer' ? 'You: ' : ''}{lastMsg.content}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Message view */}
      {selectedThread ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Thread header */}
          <div className="px-5 py-3 border-b border-white/6 flex items-center justify-between shrink-0" style={{ background: '#111113' }}>
            <div>
              <p className="text-sm font-semibold text-white">{selectedThread.participantName}</p>
              <div className="flex items-center gap-2">
                {selectedThread.participantEmail && <p className="text-[10px] text-slate-500">{selectedThread.participantEmail}</p>}
                <span className="text-[9px] text-emerald-400">🔒 Encrypted</span>
              </div>
            </div>
            <button onClick={() => { deleteMessageThread(selectedThreadId!); setSelectedThreadId(null) }} className="text-slate-700 hover:text-red-400 text-xs transition-colors">Delete Thread</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-12 text-slate-700">
                <p className="text-xs">Start the conversation</p>
              </div>
            )}
            {messages.map(m => (
              <div key={m.id} className={clsx('flex', m.sender === 'producer' ? 'justify-end' : 'justify-start')}>
                <div className="max-w-md">
                  <div
                    className="rounded-2xl px-4 py-2.5 text-xs leading-relaxed"
                    style={{
                      background: m.sender === 'producer' ? '#6272f3' : '#1a1a1d',
                      color: m.sender === 'producer' ? '#fff' : '#cbd5e1',
                      border: m.sender !== 'producer' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    }}
                  >
                    {m.content}
                  </div>
                  <p className={clsx('text-[9px] text-slate-700 mt-1', m.sender === 'producer' ? 'text-right' : 'text-left')}>
                    {new Date(m.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    {m.sender === 'client' && <span className="ml-1 text-slate-700">· {m.senderName}</span>}
                  </p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Compose */}
          <div className="px-5 py-3 border-t border-white/6 flex gap-2 items-end shrink-0" style={{ background: '#111113' }}>
            <div className="flex-1">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-[9px] text-slate-700">🔒 End-to-end encrypted</span>
              </div>
              <textarea
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                placeholder="Message..."
                rows={2}
                className="w-full text-xs text-white placeholder-slate-600 border border-white/10 rounded-xl px-3 py-2 resize-none focus:outline-none focus:border-brand-500/60"
                style={{ background: '#1a1a1d' }}
              />
            </div>
            <Button size="sm" onClick={handleSend} className="shrink-0">Send</Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-700">
          <p className="text-3xl mb-3">✉</p>
          <p className="text-sm mb-1">No conversation selected</p>
          <button onClick={() => setNewThreadOpen(true)} className="text-xs text-brand-400 hover:text-brand-300 mt-1">+ New Message</button>
        </div>
      )}

      {/* New thread modal */}
      <Modal
        open={newThreadOpen}
        onClose={() => setNewThreadOpen(false)}
        title="New Conversation"
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setNewThreadOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreateThread}>Start</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Name" placeholder="Client or contact name" value={newThreadForm.participantName} onChange={e => setNewThreadForm(f => ({ ...f, participantName: e.target.value }))} />
          <Input label="Email (optional)" type="email" placeholder="their@email.com" value={newThreadForm.participantEmail} onChange={e => setNewThreadForm(f => ({ ...f, participantEmail: e.target.value }))} />
          <Input label="Subject" placeholder="e.g. Wedding Video Project" value={newThreadForm.subject} onChange={e => setNewThreadForm(f => ({ ...f, subject: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}
