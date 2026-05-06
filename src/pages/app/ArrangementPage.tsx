import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { ArrangementMapper } from '../../components/tools/ArrangementMapper'

export function ArrangementPage() {
  const { activeProject, state } = useApp()

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-600 p-6">
        <p className="text-3xl mb-3">▬</p>
        <p className="text-sm mb-1">No active project.</p>
        <p className="text-xs text-slate-700 mb-4">Select a project to use the Arrangement Mapper.</p>
        <div className="w-full max-w-sm space-y-1.5">
          {state.creativeProjects.slice(0, 5).map(p => (
            <Link key={p.id} to={`/app/projects/${p.id}`} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-white/8 hover:border-white/20 transition-colors">
              <span className="text-sm text-white">{p.title}</span>
              <span className="text-xs text-slate-600">{p.type}</span>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return <ArrangementMapper />
}
