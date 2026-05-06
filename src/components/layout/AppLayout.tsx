import { Outlet } from 'react-router-dom'
import { AppSidebar } from './AppSidebar'
import { QuickNav } from './QuickNav'

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0c0c0e' }}>
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <QuickNav />
        <main className="flex-1 overflow-y-auto pb-14 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
