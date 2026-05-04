import clsx from 'clsx'
import { useProject } from '../../context/ProjectContext'
import { STAGES } from '../../data/stages'
import type { Stage } from '../../types'
import { Badge } from '../ui/Badge'

export function Sidebar() {
  const { state, dispatch, activeProject } = useProject()

  if (!activeProject) return null

  const handleStage = (id: Stage) => {
    dispatch({ type: 'SET_STAGE', stage: id })
  }

  return (
    <aside className="w-56 shrink-0 bg-slate-900/70 border-r border-white/8 flex flex-col py-3 overflow-y-auto">
      <div className="px-3 mb-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stages</p>
      </div>
      <nav className="flex flex-col gap-0.5 px-2">
        {STAGES.map((stage, i) => {
          const isActive = state.activeStage === stage.id
          const isCompleted = activeProject.completedStages.includes(stage.id)

          return (
            <button
              key={stage.id}
              onClick={() => handleStage(stage.id)}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left w-full group',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/5',
              )}
            >
              <span className="text-base leading-none">{stage.icon}</span>
              <span className="flex-1 font-medium truncate">{stage.shortLabel}</span>
              {isCompleted && (
                <span className="text-emerald-400 text-xs">✓</span>
              )}
              {!isCompleted && (
                <span className="text-slate-600 text-xs font-mono">{String(i + 1).padStart(2, '0')}</span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="mt-auto px-3 pt-4 border-t border-white/8 mt-4">
        <div className="text-xs text-slate-500 mb-1.5">Plan</div>
        <Badge variant="free">Free</Badge>
        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
          Stages 3–6 require Creator+
        </p>
      </div>
    </aside>
  )
}
