import { useState } from 'react'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Input, Textarea } from '../ui/Input'
import type { KanbanCard } from '../../types'

interface KanbanBoardProps {
  title: string
  columns: string[]
  kanban: Record<string, KanbanCard[]>
  onUpdate: (col: string, cards: KanbanCard[]) => void
  colColor?: Record<string, string>
}

const PRIORITY_COLOR: Record<string, string> = {
  High: '#e85d4a',
  Medium: '#f59e0b',
  Low: '#48bb9a',
}

export function KanbanBoard({ title, columns, kanban, onUpdate, colColor = {} }: KanbanBoardProps) {
  const [addTarget, setAddTarget] = useState<string | null>(null)
  const [editCard, setEditCard] = useState<{ col: string; card: KanbanCard } | null>(null)
  const [form, setForm] = useState({ title: '', notes: '', dueDate: '', priority: 'Medium' as KanbanCard['priority'] })

  function openAdd(col: string) {
    setForm({ title: '', notes: '', dueDate: '', priority: 'Medium' })
    setAddTarget(col)
  }

  function handleAdd() {
    if (!addTarget || !form.title.trim()) return
    const card: KanbanCard = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      notes: form.notes,
      dueDate: form.dueDate || undefined,
      priority: form.priority,
    }
    onUpdate(addTarget, [...(kanban[addTarget] ?? []), card])
    setAddTarget(null)
  }

  function handleDelete(col: string, cardId: string) {
    onUpdate(col, (kanban[col] ?? []).filter(c => c.id !== cardId))
  }

  function handleMove(fromCol: string, cardId: string, direction: 'left' | 'right') {
    const fromIdx = columns.indexOf(fromCol)
    const toIdx = direction === 'right' ? fromIdx + 1 : fromIdx - 1
    if (toIdx < 0 || toIdx >= columns.length) return
    const toCol = columns[toIdx]
    const card = (kanban[fromCol] ?? []).find(c => c.id === cardId)
    if (!card) return
    onUpdate(fromCol, (kanban[fromCol] ?? []).filter(c => c.id !== cardId))
    onUpdate(toCol, [...(kanban[toCol] ?? []), card])
  }

  function openEdit(col: string, card: KanbanCard) {
    setForm({ title: card.title, notes: card.notes, dueDate: card.dueDate ?? '', priority: card.priority ?? 'Medium' })
    setEditCard({ col, card })
  }

  function handleSaveEdit() {
    if (!editCard) return
    const updated = (kanban[editCard.col] ?? []).map(c =>
      c.id === editCard.card.id
        ? { ...c, title: form.title, notes: form.notes, dueDate: form.dueDate || undefined, priority: form.priority }
        : c
    )
    onUpdate(editCard.col, updated)
    setEditCard(null)
  }

  const totalCards = columns.reduce((sum, col) => sum + (kanban[col]?.length ?? 0), 0)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <p className="text-xs text-slate-600 mt-0.5">{totalCards} tasks</p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {columns.map(col => {
          const cards = kanban[col] ?? []
          const accent = colColor[col]
          return (
            <div
              key={col}
              className="shrink-0 w-56 flex flex-col rounded-xl border border-white/8"
              style={{ background: '#141416' }}
            >
              {/* Column header */}
              <div className="px-3 py-2.5 flex items-center justify-between border-b border-white/6">
                <div className="flex items-center gap-2">
                  {accent && (
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                  )}
                  <span className="text-xs font-medium text-slate-300">{col}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-600">{cards.length}</span>
              </div>

              {/* Cards */}
              <div className="flex-1 p-2 space-y-2 min-h-0">
                {cards.map((card, idx) => (
                  <div
                    key={card.id}
                    className="rounded-lg border border-white/8 p-2.5 cursor-pointer hover:border-white/20 transition-colors group"
                    style={{ background: '#1a1a1d' }}
                    onClick={() => openEdit(col, card)}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-xs text-white leading-snug">{card.title}</p>
                      {card.priority && (
                        <div
                          className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
                          style={{ background: PRIORITY_COLOR[card.priority] ?? '#888' }}
                        />
                      )}
                    </div>
                    {card.notes && (
                      <p className="text-[10px] text-slate-600 line-clamp-2 leading-relaxed">{card.notes}</p>
                    )}
                    {card.dueDate && (
                      <p className="text-[10px] font-mono text-slate-600 mt-1">
                        {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                    {/* Move buttons */}
                    <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      {idx === 0 && columns.indexOf(col) > 0 && (
                        <button
                          onClick={() => handleMove(col, card.id, 'left')}
                          className="text-[10px] text-slate-600 hover:text-slate-300 px-1"
                        >
                          ← move
                        </button>
                      )}
                      {columns.indexOf(col) < columns.length - 1 && (
                        <button
                          onClick={() => handleMove(col, card.id, 'right')}
                          className="text-[10px] text-brand-400 hover:text-brand-300 px-1 ml-auto"
                        >
                          move →
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(col, card.id)}
                        className="text-[10px] text-red-500/60 hover:text-red-400 px-1"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add button */}
              <button
                onClick={() => openAdd(col)}
                className="m-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-colors border border-dashed border-white/8 hover:border-white/15"
              >
                <span>+</span> Add task
              </button>
            </div>
          )
        })}
      </div>

      {/* Add Modal */}
      <Modal
        open={!!addTarget}
        onClose={() => setAddTarget(null)}
        title={`Add to ${addTarget}`}
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setAddTarget(null)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd} disabled={!form.title.trim()}>Add Task</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Task" placeholder="What needs to be done?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea label="Notes" placeholder="Details..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}
                className="rounded-lg border border-white/10 bg-white/4 px-3 py-2 text-sm text-white focus:outline-none"
                style={{ background: '#1a1a1d' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={!!editCard}
        onClose={() => setEditCard(null)}
        title="Edit Task"
        size="sm"
        footer={
          <>
            <Button variant="danger" size="sm" onClick={() => { handleDelete(editCard!.col, editCard!.card.id); setEditCard(null) }}>Delete</Button>
            <Button variant="outline" size="sm" onClick={() => setEditCard(null)}>Cancel</Button>
            <Button size="sm" onClick={handleSaveEdit}>Save</Button>
          </>
        }
      >
        <div className="space-y-3">
          <Input label="Task" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-400">Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as any }))}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white focus:outline-none"
                style={{ background: '#1a1a1d' }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
