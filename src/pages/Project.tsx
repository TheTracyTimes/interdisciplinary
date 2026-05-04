import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProject } from '../context/ProjectContext'
import { Sidebar } from '../components/layout/Sidebar'
import { StageView } from '../components/stages/StageView'

export function Project() {
  const { activeProject } = useProject()
  const navigate = useNavigate()

  useEffect(() => {
    if (!activeProject) navigate('/dashboard')
  }, [activeProject, navigate])

  if (!activeProject) return null

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <StageView />
      </main>
    </div>
  )
}
