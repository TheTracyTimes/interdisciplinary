import { Link, useNavigate } from 'react-router-dom'
import { useProject } from '../../context/ProjectContext'
import { Button } from '../ui/Button'

export function Header() {
  const { activeProject, dispatch } = useProject()
  const navigate = useNavigate()

  return (
    <header className="h-14 bg-slate-900/90 backdrop-blur border-b border-white/8 flex items-center px-4 gap-4 shrink-0 z-10">
      <Link to="/" className="flex items-center gap-2 mr-4">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
          Ix
        </div>
        <span className="font-semibold text-white hidden sm:block tracking-tight">Interdisciplinary</span>
      </Link>

      {activeProject && (
        <>
          <div className="h-5 w-px bg-white/10" />
          <span className="text-slate-300 text-sm truncate max-w-[180px]">{activeProject.name}</span>
          <div className="flex items-center gap-1 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                dispatch({ type: 'SET_ACTIVE_PROJECT', id: null })
                navigate('/dashboard')
              }}
            >
              ← Projects
            </Button>
          </div>
        </>
      )}

      {!activeProject && (
        <div className="ml-auto flex items-center gap-2">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm">Dashboard</Button>
          </Link>
          <Link to="/shop">
            <Button variant="ghost" size="sm">Shop</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="secondary" size="sm">Pricing</Button>
          </Link>
        </div>
      )}
    </header>
  )
}
