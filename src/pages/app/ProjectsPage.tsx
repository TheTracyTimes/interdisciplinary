import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import type { CreativeProjectType, CreativeProjectStatus, CreativeProjectPriority } from '../../types'

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'Short Film', label: 'Short Film' },
  { value: 'Music Video', label: 'Music Video' },
  { value: 'Documentary', label: 'Documentary' },
  { value: 'Song', label: 'Song' },
  { value: 'Beat', label: 'Beat' },
  { value: 'Sample Pack', label: 'Sample Pack' },
  { value: 'Spec Ad', label: 'Spec Ad' },
  { value: 'Personal', label: 'Personal' },
]

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'Idea', label: 'Idea' },
  { value: 'Pre-Production', label: 'Pre-Production' },
  { value: 'Production', label: 'Production' },
  { value: 'Post-Production', label: 'Post-Production' },
  { value: 'Mixing', label: 'Mixing' },
  { value: 'Mastering', label: 'Mastering' },
  { value: 'Complete', label: 'Complete' },
  { value: 'On Hold', label: 'On Hold' },
]

const GENRE_OPTIONS = [
  { value: '', label: 'No genre' },
  { value: 'Cinematic', label: 'Cinematic' },
  { value: 'Corporate', label: 'Corporate' },
  { value: 'Worship', label: 'Worship' },
  { value: 'Lo-Fi', label: 'Lo-Fi' },
  { value: 'Hip-Hop', label: 'Hip-Hop' },
  { value: 'Ambient', label: 'Ambient' },
]


const STATUS_BADGE: Record<string, any> = {
  'Idea': 'neutral', 'Pre-Production': 'film', 'Production': 'creator',
  'Post-Production': 'creator', 'Mixing': 'music', 'Mastering': 'music',
  'Complete': 'free', 'On Hold': 'neutral',
}

const TYPE_ICON: Record<string, string> = {
  'Short Film': '🎬', 'Music Video': '🎥', 'Documentary': '📽', 'Song': '🎵',
  'Beat': '🎛', 'Sample Pack': '🥁', 'Spec Ad': '📢', 'Personal': '✦',
}

export function ProjectsPage() {
  const { state, createProject } = useApp()
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)
  const [filter, setFilter] = useState<'All' | 'Active' | 'Backburner' | 'Someday'>('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [search, setSearch] = useState('')

  // New project form state
  const [form, setForm] = useState({
    title: '', type: 'Personal' as CreativeProjectType,
    status: 'Idea' as CreativeProjectStatus, priority: 'Active' as CreativeProjectPriority,
    genre: '', mood: '', startDate: new Date().toISOString().split('T')[0],
    targetDate: '', concept: '', goals: '', ideas: '',
  })

  const projects = state.creativeProjects.filter(p => {
    if (filter !== 'All' && p.priority !== filter) return false
    if (statusFilter !== 'All' && p.status !== statusFilter) return false
    if (typeFilter !== 'All' && p.type !== typeFilter) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function handleCreate() {
    const id = createProject({
      title: form.title || 'Untitled Project',
      type: form.type, status: form.status, priority: form.priority,
      genre: form.genre, mood: form.mood,
      startDate: form.startDate, targetDate: form.targetDate,
      notes: { concept: form.concept, goals: form.goals, ideas: form.ideas },
    })
    setModalOpen(false)
    navigate(`/app/projects/${id}`)
  }

  const priorities: ('All' | 'Active' | 'Backburner' | 'Someday')[] = ['All', 'Active', 'Backburner', 'Someday']
  const statuses = ['All', ...STATUS_OPTIONS.map(s => s.value)]
  const types = ['All', ...TYPE_OPTIONS.map(t => t.value)]

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Creative Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.creativeProjects.length} total</p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)}>+ New Project</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {/* Priority tabs */}
        <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#1a1a1d' }}>
          {priorities.map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-medium transition-colors',
                filter === p ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white',
              )}
            >
              {p}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500/60"
          style={{ background: '#1a1a1d' }}
        >
          {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-xs text-slate-400 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-brand-500/60"
          style={{ background: '#1a1a1d' }}
        >
          {types.map(t => <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>)}
        </select>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="text-xs text-slate-300 placeholder-slate-600 bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500/60 w-44"
        />
      </div>

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-4xl mb-3">◈</p>
          <p className="text-sm">No projects match your filters.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-3 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            + Create a new project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map(p => (
            <Link key={p.id} to={`/app/projects/${p.id}`}>
              <Card className="p-4 hover:border-white/20 transition-all cursor-pointer group h-full flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xl">{TYPE_ICON[p.type] ?? '◈'}</span>
                  <div className="flex gap-1.5">
                    <Badge variant={STATUS_BADGE[p.status] ?? 'neutral'} size="xs">{p.status}</Badge>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-brand-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-600 mb-3">{p.type}{p.genre ? ` · ${p.genre}` : ''}</p>
                {p.notes.concept && (
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3 flex-1">
                    {p.notes.concept}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between">
                  <Badge variant={p.priority === 'Active' ? 'creator' : 'neutral'} size="xs">
                    {p.priority}
                  </Badge>
                  {p.targetDate && (
                    <p className="text-[10px] font-mono text-slate-600">
                      Due {new Date(p.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
                {(p.bpm || p.key) && (
                  <div className="mt-2 pt-2 border-t border-white/6 flex gap-3">
                    {p.bpm && <span className="text-[10px] font-mono text-slate-600">{p.bpm} BPM</span>}
                    {p.key && <span className="text-[10px] font-mono text-slate-600">{p.key}</span>}
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Project"
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreate}>Create Project</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="Untitled Project"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Type"
              options={TYPE_OPTIONS}
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as CreativeProjectType }))}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as CreativeProjectStatus }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Priority"
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Backburner', label: 'Backburner' },
                { value: 'Someday', label: 'Someday' },
              ]}
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value as CreativeProjectPriority }))}
            />
            <Select
              label="Genre / Style"
              options={GENRE_OPTIONS}
              value={form.genre}
              onChange={e => setForm(f => ({ ...f, genre: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={form.startDate}
              onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
            />
            <Input
              label="Target Completion"
              type="date"
              value={form.targetDate}
              onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))}
            />
          </div>
          <Textarea
            label="Concept"
            placeholder="What's the core idea?"
            value={form.concept}
            onChange={e => setForm(f => ({ ...f, concept: e.target.value }))}
          />
          <Textarea
            label="Goals"
            placeholder="What does success look like?"
            value={form.goals}
            onChange={e => setForm(f => ({ ...f, goals: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  )
}
