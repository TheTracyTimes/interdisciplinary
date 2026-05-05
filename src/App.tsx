import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProjectProvider } from './context/ProjectContext'
import { Header } from './components/layout/Header'
import { Landing } from './pages/Landing'
import { Dashboard } from './pages/Dashboard'
import { Project } from './pages/Project'
import { Pricing } from './pages/Pricing'
import { Shop } from './pages/Shop'

export default function App() {
  return (
    <ProjectProvider>
      <BrowserRouter>
        <div className="h-screen flex flex-col bg-slate-950 text-white overflow-hidden">
          <Header />
          <div className="flex-1 overflow-auto flex flex-col">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project" element={<Project />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ProjectProvider>
  )
}
