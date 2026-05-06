import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import type { FilmKanbanCol } from '../../types'

const FILM_COLS: FilmKanbanCol[] = ['Ideas', 'Writing', 'Filming', 'Editing', 'Color Correction', 'Color Grading', 'Finished']

const COL_ACCENT: Partial<Record<FilmKanbanCol, string>> = {
  Filming: '#e85d4a',
  'Color Grading': '#f59e0b',
  Finished: '#48bb9a',
}

const FILM_TYPES = new Set(['Short Film', 'Music Video', 'Documentary', 'Spec Ad'])

export function FilmPipelinePage() {
  const { state } = useApp()
  const filmProjects = state.creativeProjects.filter(p => FILM_TYPES.has(p.type))

  // Build columns from each project's film kanban tasks
  const columns: Record<FilmKanbanCol, Array<{ card: any; project: any }>> = {} as any
  FILM_COLS.forEach(col => { columns[col] = [] })
  filmProjects.forEach(project => {
    FILM_COLS.forEach(col => {
      ;(project.filmKanban[col] ?? []).forEach(card => {
        columns[col].push({ card, project })
      })
    })
  })

  const total = Object.values(columns).reduce((sum, cards) => sum + cards.length, 0)

  return (
    <div className="p-6">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-white">Film Pipeline</h1>
        <p className="text-xs text-slate-500 mt-0.5">{filmProjects.length} film projects · {total} tasks</p>
      </div>

      {filmProjects.length === 0 ? (
        <div className="text-center py-20 text-slate-600">
          <p className="text-4xl mb-3">▶</p>
          <p className="text-sm">No film projects yet.</p>
          <Link to="/app/projects" className="mt-2 text-xs text-brand-400 inline-block">
            + Create a film project →
          </Link>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {FILM_COLS.map(col => {
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
                        <p className="text-[10px] text-brand-400/80 truncate">{project.title}</p>
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
