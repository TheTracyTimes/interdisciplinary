import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { KanbanBoard } from '../../components/projects/KanbanBoard'
import { ShotListPanel } from '../../components/projects/ShotListPanel'
import { MusicCuesPanel } from '../../components/projects/MusicCuesPanel'
import type { FilmKanban, MusicKanban, FilmKanbanCol, MusicKanbanCol } from '../../types'

const FILM_COLS: FilmKanbanCol[] = ['Ideas', 'Writing', 'Filming', 'Editing', 'Color Correction', 'Color Grading', 'Finished']
const MUSIC_COLS: MusicKanbanCol[] = ['Ideas', 'Scoring', 'Recording', 'Mixing', 'Revisions', 'Mastering', 'Finished']

type Tab = 'overview' | 'film-pipeline' | 'music-pipeline' | 'shot-list' | 'music-cues' | 'notes'

const STATUS_BADGE: Record<string, any> = {
  Idea: 'neutral', 'Pre-Production': 'film', Production: 'creator',
  'Post-Production': 'creator', Mixing: 'music', Mastering: 'music',
  Complete: 'free', 'On Hold': 'neutral',
}

const TYPE_OPTIONS = [
  'Short Film', 'Music Video', 'Documentary', 'Song', 'Beat', 'Sample Pack', 'Spec Ad', 'Personal',
].map(v => ({ value: v, label: v }))

const STATUS_OPTIONS = [
  'Idea', 'Pre-Production', 'Production', 'Post-Production', 'Mixing', 'Mastering', 'Complete', 'On Hold',
].map(v => ({ value: v, label: v }))

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { state, updateProject } = useApp()
  const project = state.creativeProjects.find(p => p.id === id)
  const [tab, setTab] = useState<Tab>('overview')
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState<any>({})

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600">
        <p className="text-4xl mb-3">◈</p>
        <p className="text-sm">Project not found.</p>
        <Link to="/app/projects" className="mt-2 text-xs text-brand-400">← Back to projects</Link>
      </div>
    )
  }

  function openEdit() {
    setEditForm({
      title: project!.title, type: project!.type, status: project!.status,
      priority: project!.priority, genre: project!.genre, mood: project!.mood,
      bpm: project!.bpm ?? '', key: project!.key ?? '',
      targetDate: project!.targetDate ?? '', folderLink: project!.folderLink ?? '',
      collaborators: project!.collaborators.join(', '),
    })
    setEditOpen(true)
  }

  function saveEdit() {
    updateProject(project!.id, {
      title: editForm.title, type: editForm.type, status: editForm.status,
      priority: editForm.priority, genre: editForm.genre, mood: editForm.mood,
      bpm: editForm.bpm ? Number(editForm.bpm) : undefined,
      key: editForm.key || undefined, targetDate: editForm.targetDate,
      folderLink: editForm.folderLink || undefined,
      collaborators: editForm.collaborators ? editForm.collaborators.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
    })
    setEditOpen(false)
  }

  function updateFilmKanban(col: FilmKanbanCol, cards: any[]) {
    updateProject(project!.id, {
      filmKanban: { ...project!.filmKanban, [col]: cards } as FilmKanban,
    })
  }

  function updateMusicKanban(col: MusicKanbanCol, cards: any[]) {
    updateProject(project!.id, {
      musicKanban: { ...project!.musicKanban, [col]: cards } as MusicKanban,
    })
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'film-pipeline', label: 'Film Pipeline' },
    { id: 'music-pipeline', label: 'Music Pipeline' },
    { id: 'shot-list', label: 'Shot List' },
    { id: 'music-cues', label: 'Music Cues' },
    { id: 'notes', label: 'Notes' },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Project header */}
      <div
        className="px-6 py-4 border-b border-white/6 flex items-center justify-between shrink-0"
        style={{ background: '#111113' }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/app/projects" className="text-slate-600 hover:text-slate-400 text-xs shrink-0">←</Link>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-white truncate">{project.title}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-600">{project.type}</span>
              <Badge variant={STATUS_BADGE[project.status] ?? 'neutral'} size="xs">{project.status}</Badge>
              <Badge variant={project.priority === 'Active' ? 'creator' : 'neutral'} size="xs">{project.priority}</Badge>
              {project.bpm && <span className="text-[10px] font-mono text-slate-600">{project.bpm} BPM</span>}
              {project.key && <span className="text-[10px] font-mono text-slate-600">{project.key}</span>}
            </div>
          </div>
        </div>
        <Button variant="outline" size="xs" onClick={openEdit}>Edit</Button>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b border-white/6 px-6 shrink-0"
        style={{ background: '#111113' }}
      >
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={clsx(
              'px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors',
              tab === t.id
                ? 'text-brand-300 border-brand-500'
                : 'text-slate-600 border-transparent hover:text-slate-400',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'overview' && <OverviewTab project={project} onUpdate={(data) => updateProject(project.id, data)} />}
        {tab === 'film-pipeline' && (
          <KanbanBoard
            title="Film Pipeline"
            columns={FILM_COLS}
            kanban={project.filmKanban as Record<string, any[]>}
            onUpdate={(col, cards) => updateFilmKanban(col as FilmKanbanCol, cards)}
            colColor={{ Finished: '#48bb9a', Filming: '#e85d4a', 'Color Grading': '#f59e0b' }}
          />
        )}
        {tab === 'music-pipeline' && (
          <KanbanBoard
            title="Music Pipeline"
            columns={MUSIC_COLS}
            kanban={project.musicKanban as Record<string, any[]>}
            onUpdate={(col, cards) => updateMusicKanban(col as MusicKanbanCol, cards)}
            colColor={{ Finished: '#48bb9a', Recording: '#e85d4a', Mastering: '#f59e0b' }}
          />
        )}
        {tab === 'shot-list' && (
          <ShotListPanel
            projectId={project.id}
            shots={project.shotList}
            onUpdate={shots => updateProject(project.id, { shotList: shots })}
          />
        )}
        {tab === 'music-cues' && (
          <MusicCuesPanel
            projectId={project.id}
            cues={project.musicCues}
            onUpdate={cues => updateProject(project.id, { musicCues: cues })}
          />
        )}
        {tab === 'notes' && (
          <NotesTab project={project} onUpdate={(data) => updateProject(project.id, data)} />
        )}
      </div>

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Project"
        size="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={saveEdit}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" value={editForm.title ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, title: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={TYPE_OPTIONS} value={editForm.type ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, type: e.target.value }))} />
            <Select label="Status" options={STATUS_OPTIONS} value={editForm.status ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, status: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Priority" options={[{ value: 'Active', label: 'Active' }, { value: 'Backburner', label: 'Backburner' }, { value: 'Someday', label: 'Someday' }]} value={editForm.priority ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, priority: e.target.value }))} />
            <Input label="Genre" value={editForm.genre ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, genre: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="BPM" type="number" value={editForm.bpm ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, bpm: e.target.value }))} />
            <Input label="Key" placeholder="e.g. C major" value={editForm.key ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, key: e.target.value }))} />
          </div>
          <Input label="Target Completion" type="date" value={editForm.targetDate ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, targetDate: e.target.value }))} />
          <Input label="Project Folder Link" placeholder="https://..." value={editForm.folderLink ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, folderLink: e.target.value }))} />
          <Input label="Collaborators (comma-separated)" placeholder="Name1, Name2" value={editForm.collaborators ?? ''} onChange={e => setEditForm((f: any) => ({ ...f, collaborators: e.target.value }))} />
        </div>
      </Modal>
    </div>
  )
}

function OverviewTab({ project }: { project: any; onUpdate?: (d: any) => void }) {
  return (
    <div className="p-6 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Details</h3>
          <div className="space-y-2">
            {[
              { label: 'Type', value: project.type },
              { label: 'Genre', value: project.genre || '—' },
              { label: 'Mood', value: project.mood || '—' },
              { label: 'BPM', value: project.bpm ? `${project.bpm}` : '—' },
              { label: 'Key', value: project.key || '—' },
              { label: 'Duration', value: project.duration || '—' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{row.label}</span>
                <span className="text-xs font-mono text-slate-300">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">Timeline</h3>
          <div className="space-y-2">
            {[
              { label: 'Started', value: project.startDate ? new Date(project.startDate).toLocaleDateString() : '—' },
              { label: 'Target', value: project.targetDate ? new Date(project.targetDate).toLocaleDateString() : '—' },
              { label: 'Completed', value: project.completionDate ? new Date(project.completionDate).toLocaleDateString() : '—' },
              { label: 'Stage', value: project.currentStage },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-xs text-slate-600">{row.label}</span>
                <span className="text-xs font-mono text-slate-300 capitalize">{row.value}</span>
              </div>
            ))}
          </div>
          {project.collaborators.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/6">
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">Collaborators</p>
              <div className="flex flex-wrap gap-1">
                {project.collaborators.map((c: string) => (
                  <span key={c} className="px-2 py-0.5 rounded-full bg-white/6 text-xs text-slate-400 border border-white/8">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Script Blocks', value: project.script.length },
          { label: 'Storyboard Panels', value: project.storyboard.length },
          { label: 'Shots Planned', value: project.shotList.length },
          { label: 'Music Cues', value: project.musicCues.length },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <p className="text-xl font-bold font-mono text-brand-400">{s.value}</p>
            <p className="text-[10px] text-slate-600 mt-1">{s.label}</p>
          </Card>
        ))}
      </div>

      {project.folderLink && (
        <Card className="p-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">Project Folder</span>
          <a href={project.folderLink} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-400 hover:text-brand-300">
            Open →
          </a>
        </Card>
      )}
    </div>
  )
}

function NotesTab({ project, onUpdate }: { project: any; onUpdate: (d: any) => void }) {
  function updateNote(key: 'concept' | 'goals' | 'ideas', value: string) {
    onUpdate({ notes: { ...project.notes, [key]: value } })
  }

  return (
    <div className="p-6 max-w-3xl space-y-5">
      <Textarea
        label="Concept"
        placeholder="What's the core idea and vision?"
        value={project.notes.concept}
        onChange={e => updateNote('concept', e.target.value)}
        rows={5}
      />
      <Textarea
        label="Goals"
        placeholder="What does success look like for this project?"
        value={project.notes.goals}
        onChange={e => updateNote('goals', e.target.value)}
        rows={4}
      />
      <Textarea
        label="Ideas & Brainstorm"
        placeholder="Capture any loose thoughts, references, or ideas..."
        value={project.notes.ideas}
        onChange={e => updateNote('ideas', e.target.value)}
        rows={6}
      />
    </div>
  )
}
