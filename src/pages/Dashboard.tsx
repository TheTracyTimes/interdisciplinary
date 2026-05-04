import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { STAGES } from '../data/stages'
import type { ProjectType, Project } from '../types'

const TYPE_OPTIONS: { value: ProjectType; label: string; emoji: string; desc: string }[] = [
  { value: 'film', label: 'Film', emoji: '🎬', desc: 'Screenplay, storyboard, direction' },
  { value: 'music', label: 'Music', emoji: '🎵', desc: 'Arrangement, score, production' },
  { value: 'both', label: 'Both', emoji: '✨', desc: 'Score for picture, soundtrack film' },
]

export function Dashboard() {
  const { state, dispatch, createProject } = useProject()
  const navigate = useNavigate()
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'both' as ProjectType, genre: '', logline: '' })

  const handleCreate = () => {
    if (!form.name.trim()) return
    createProject(form)
    setShowNew(false)
    setForm({ name: '', type: 'both', genre: '', logline: '' })
    navigate('/project')
  }

  const handleOpen = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_PROJECT', id })
    navigate('/project')
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Delete this project? This cannot be undone.')) {
      dispatch({ type: 'DELETE_PROJECT', id })
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Projects</h1>
          <p className="text-slate-500 text-sm mt-1">All your music and film work in one place.</p>
        </div>
        <Button variant="primary" onClick={() => setShowNew(true)}>+ New Project</Button>
      </div>

      {/* New project form */}
      {showNew && (
        <Card className="p-6 mb-8 border-brand-500/30 bg-brand-500/5">
          <h2 className="text-lg font-semibold text-white mb-5">New Project</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1.5">Project name *</label>
              <input
                autoFocus
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="My Feature Film / EP Title / Short..."
                className="w-full bg-slate-800 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-brand-400"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-2">Project type</label>
              <div className="grid grid-cols-3 gap-3">
                {TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setForm({ ...form, type: opt.value })}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      form.type === opt.value
                        ? 'border-brand-400 bg-brand-500/15'
                        : 'border-white/10 hover:border-white/25'
                    }`}
                  >
                    <div className="text-xl mb-1">{opt.emoji}</div>
                    <div className="text-sm font-medium text-white">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Genre (optional)</label>
                <input
                  type="text"
                  value={form.genre}
                  onChange={(e) => setForm({ ...form, genre: e.target.value })}
                  placeholder="Drama, Hip-hop, Thriller..."
                  className="w-full bg-slate-800 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-brand-400"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 block mb-1.5">Logline / concept (optional)</label>
                <input
                  type="text"
                  value={form.logline}
                  onChange={(e) => setForm({ ...form, logline: e.target.value })}
                  placeholder="One sentence summary..."
                  className="w-full bg-slate-800 border border-white/15 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-brand-400"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="primary" onClick={handleCreate} disabled={!form.name.trim()}>
                Create Project
              </Button>
              <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Project grid */}
      {state.projects.length === 0 && !showNew && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects yet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            Create your first project to begin the 6-stage pipeline.
          </p>
          <Button variant="primary" onClick={() => setShowNew(true)}>Create your first project</Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onOpen={() => handleOpen(project.id)}
            onDelete={(e) => handleDelete(e, project.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  onOpen,
  onDelete,
}: {
  project: Project
  onOpen: () => void
  onDelete: (e: React.MouseEvent) => void
}) {
  const stage = STAGES.find((s) => s.id === project.currentStage)
  const progress = project.completedStages.length
  const total = STAGES.length

  return (
    <Card
      className="p-5 cursor-pointer hover:border-white/20 transition-all group"
      onClick={onOpen}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">
              {project.type === 'film' ? '🎬' : project.type === 'music' ? '🎵' : '✨'}
            </span>
            <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors">
              {project.name}
            </h3>
          </div>
          {project.genre && (
            <span className="text-xs text-slate-500">{project.genre}</span>
          )}
        </div>
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-rose-400 text-lg leading-none transition-all"
        >
          ×
        </button>
      </div>

      {project.logline && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2 leading-relaxed">{project.logline}</p>
      )}

      {/* Stage progress */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500">
            {stage?.icon} {stage?.label ?? 'Conception'}
          </span>
          <span className="text-xs text-slate-600">{progress}/{total}</span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-1.5">
          <div
            className="bg-brand-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(progress / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
        <span className="text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
          Open →
        </span>
      </div>
    </Card>
  )
}
