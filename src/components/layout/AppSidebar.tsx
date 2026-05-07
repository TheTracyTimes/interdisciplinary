import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'

const TIER_STORAGE: Record<string, number> = { free: 5, pro: 100, studio: 1000 }
const TIER_COLOR: Record<string, string> = { free: '#52525b', pro: '#6272f3', studio: '#06b6d4' }

interface NavItem {
  label: string
  path: string
  badge?: number
}

interface NavGroup {
  title: string
  items: NavItem[]
}

export function AppSidebar() {
  const { state, createProject } = useApp()
  const navigate = useNavigate()
  const [storageTier] = useState(() => localStorage.getItem('storage_tier') || 'free')
  const [storageUsed] = useState(() => parseFloat((parseInt(localStorage.getItem('storage_used_bytes') || '0') / 1e9).toFixed(2)))

  const unreadMessages = state.messageThreads.reduce((sum, t) =>
    sum + state.directMessages.filter(m => m.threadId === t.id && !m.read).length, 0)

  const openProjects = state.creativeProjects.filter(p => p.status !== 'Complete' && p.status !== 'On Hold').length
  const activeClients = state.clients.length
  const pendingInvoices = state.invoices?.filter((inv: any) => inv.status === 'Sent' || inv.status === 'Overdue').length ?? 0

  const NAV: NavGroup[] = [
    {
      title: '',
      items: [
        { label: 'Overview', path: '/app' },
      ],
    },
    {
      title: 'Projects',
      items: [
        { label: 'Projects', path: '/app/projects', badge: openProjects || undefined },
        { label: 'Schedule', path: '/app/schedule' },
        { label: 'Assets', path: '/app/assets' },
      ],
    },
    {
      title: 'Clients',
      items: [
        { label: 'Clients', path: '/app/clients', badge: activeClients || undefined },
        { label: 'Client Projects', path: '/app/client-projects' },
        { label: 'Invoices', path: '/app/invoices', badge: pendingInvoices || undefined },
        { label: 'Contracts', path: '/app/contracts' },
        { label: 'Equipment', path: '/app/equipment' },
      ],
    },
    {
      title: 'Brand',
      items: [
        { label: 'Brand Studio', path: '/app/brand' },
        { label: 'Public Profile', path: '/app/profile' },
        { label: 'Portfolio', path: '/app/portfolio' },
        { label: 'Packages', path: '/app/packages' },
        { label: 'Messages', path: '/app/messages', badge: unreadMessages || undefined },
        { label: 'Forum', path: '/app/forum' },
        { label: 'Resell Market', path: '/resell' },
      ],
    },
    {
      title: 'Library',
      items: [
        { label: 'References', path: '/app/references' },
        { label: 'Storage', path: '/app/storage' },
      ],
    },
    {
      title: 'Logs',
      items: [
        { label: 'Inventory Log', path: '/app/logs/inventory' },
        { label: 'Practice Log', path: '/app/logs/practice' },
        { label: 'Archive Log', path: '/app/logs/archive' },
        { label: 'Reference Log', path: '/app/logs/reference' },
      ],
    },
  ]

  function handleNewProject() {
    const id = createProject()
    navigate(`/app/projects/${id}`)
  }

  return (
    <aside className="flex flex-col h-full w-48 shrink-0 select-none bg-[#0a0a0b] border-r border-[#1a1a1d]">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#1a1a1d]">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded bg-[#6272f3] flex items-center justify-center text-white text-[10px] font-black tracking-tight">
            IX
          </div>
          <span className="text-xs font-semibold text-white">Interdisciplinary</span>
        </NavLink>
      </div>

      {/* New Project */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={handleNewProject}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#6272f3] hover:bg-[#7280f5] text-white text-xs font-medium transition-colors"
        >
          <span className="text-sm leading-none font-light">+</span>
          New Project
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {NAV.map(group => (
          <div key={group.title || 'root'}>
            {group.title && (
              <p className="px-2 mb-1 text-[9px] font-semibold text-zinc-600 uppercase tracking-[0.12em]">
                {group.title}
              </p>
            )}
            <div className="space-y-px">
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/app'}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center justify-between px-2 py-1.5 rounded-md text-xs transition-colors',
                      isActive
                        ? 'bg-[#6272f3]/10 text-white'
                        : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]',
                    )
                  }
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span className="text-[9px] font-semibold bg-[#6272f3]/20 text-[#6272f3] rounded px-1.5 py-0.5 shrink-0 ml-2">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Creative Tools */}
        <div>
          <p className="px-2 mb-1.5 text-[9px] font-semibold text-zinc-600 uppercase tracking-[0.12em]">
            Creative Tools
          </p>
          <div className="rounded-md overflow-hidden border border-[#1e1e21] bg-[#0e0e10]">
            <div className="grid grid-cols-3 divide-x divide-[#1e1e21]">
              {[
                { label: 'Script writer', path: '/app/script' },
                { label: 'Storyboarding', path: '/app/storyboard' },
                { label: '6-stage pipeline', path: '/app/film' },
              ].map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => clsx(
                    'flex items-center justify-center px-1 py-2.5 text-center text-[8px] font-medium leading-tight transition-colors',
                    isActive ? 'text-white bg-white/5' : 'text-zinc-600 hover:text-zinc-300',
                  )}
                  style={({ isActive }) => isActive ? { borderTop: '1px solid #6272f3' } : { borderTop: '1px solid transparent' }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="h-px bg-[#1e1e21]" />
            <div className="grid grid-cols-3 divide-x divide-[#1e1e21]">
              {[
                { label: 'Score writer', path: '/app/score' },
                { label: 'Arrangement mapping', path: '/app/arrangement' },
                { label: 'Cross-discipline', path: '/app/projects' },
              ].map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => clsx(
                    'flex items-center justify-center px-1 py-2.5 text-center text-[8px] font-medium leading-tight transition-colors',
                    isActive ? 'text-white bg-white/5' : 'text-zinc-600 hover:text-zinc-300',
                  )}
                  style={({ isActive }) => isActive ? { borderBottom: '1px solid #6272f3' } : { borderBottom: '1px solid transparent' }}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#1a1a1d]">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-zinc-600">Projects</span>
          <span className="text-[10px] font-mono text-zinc-500">{openProjects}</span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-zinc-600">Clients</span>
          <span className="text-[10px] font-mono text-zinc-500">{activeClients}</span>
        </div>

        {/* Storage bar */}
        <NavLink to="/app/storage" className="block mb-3 group">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Storage</span>
            <span className="text-[9px] font-mono" style={{ color: TIER_COLOR[storageTier] }}>
              {storageTier.charAt(0).toUpperCase() + storageTier.slice(1)}
            </span>
          </div>
          <div className="h-0.5 rounded-full bg-[#1e1e21] overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.min((storageUsed / TIER_STORAGE[storageTier]) * 100, 100)}%`,
                background: TIER_COLOR[storageTier],
              }}
            />
          </div>
          <p className="text-[9px] font-mono text-zinc-700 mt-0.5">
            {storageUsed} / {TIER_STORAGE[storageTier]} GB
          </p>
        </NavLink>

        <div className="flex items-center gap-3">
          <NavLink to="/discover" className="text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors">
            Discover
          </NavLink>
          <NavLink to="/community" className="text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors">
            Community
          </NavLink>
          <NavLink to="/shop" className="text-[10px] text-zinc-600 hover:text-zinc-300 transition-colors ml-auto">
            Shop
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
