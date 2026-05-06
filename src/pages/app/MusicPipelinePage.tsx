import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import type { MusicKanbanCol } from '../../types'

const MUSIC_COLS: MusicKanbanCol[] = ['Ideas', 'Scoring', 'Recording', 'Mixing', 'Revisions', 'Mastering', 'Finished']

const COL_ACCENT: Partial<Record<MusicKanbanCol, string>> = {
  Recording: '#e85d4a',
  Mastering: '#f59e0b',
  Finished: '#48bb9a',
}

const MUSIC_TYPES = new Set(['Song', 'Beat', 'Sample Pack', 'Music Video', 'Personal'])

export function MusicPipelinePage() {
  const { state } = useApp()
  const musicProjects = state.creativeProjects.filter(p => MUSIC_TYPES.has(p.type))

  const columns: Record<MusicKanbanCol, Array<{ card: any; project: any }>> = {} as any
  MUSIC_COLS.forEach(col => { columns[col] = [] })
  musicProjects.forEach(project => {
    MUSIC_COLS.forEach(col => {
      ;(project.musicKanban[col] ?? []).forEach(card => {
        columns[col].push({ card, project })
      })
    })
  })

  const total = Object.values(columns).reduce((sum, cards) => sum + cards.length, 0)

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Music Pipeline</h1>
        <p className="text-xs text-slate-500 mt-0.5">{musicProjects.length} music projects · {total} tasks</p>
      </div>

      {musicProjects.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-4xl mb-3">♪</p>
          <p className="text-sm">No music projects yet.</p>
          <Link to="/app/projects" className="mt-2 text-xs text-brand-400 inline-block">
            + Create a music project →
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {MUSIC_COLS.map(col => {
            const items = columns[col]
            const accent = COL_ACCENT[col]
            return (
              <div
                key={col}
                className="shrink-0 w-56 flex flex-col rounded-xl border border-white/8"
                style={{ background: '#141416' }}
              >
                <div className="px-3 py-2.5 border-b border-white/6 flex items-center gap-2">
                  {accent && <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />}
                  <span className="text-xs font-medium text-slate-300">{col}</span>
                  <span className="text-[10px] font-mono text-slate-600 ml-auto">{items.length}</span>
                </div>
                <div className="flex-1 p-2 space-y-2">
                  {items.map(({ card, project }) => (
                    <Link key={card.id} to={`/app/projects/${project.id}`}>
                      <div
                        className="rounded-lg border border-white/8 p-2.5 hover:border-white/20 transition-colors"
                        style={{ background: '#1a1a1d' }}
                      >
                        <p className="text-xs text-white mb-1 leading-snug">{card.title}</p>
                        <p className="text-[10px] text-music-400/80 truncate" style={{ color: '#48bb9a99' }}>{project.title}</p>
                        {card.dueDate && (
                          <p className="text-[10px] font-mono text-slate-600 mt-1">
                            {new Date(card.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                  {items.length === 0 && (
                    <p className="text-[10px] text-slate-700 px-1 py-2">—</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
