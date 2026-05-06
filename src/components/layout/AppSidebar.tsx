import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'

interface NavItem {
  label: string
  path: string
  icon: string
  accent?: string
  badge?: number
}

interface NavGroup {
  title: string
  accent?: string
  items: NavItem[]
}

const linkBase = 'flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-all group relative'

export function AppSidebar() {
  const { state, createProject } = useApp()
  const navigate = useNavigate()

  const unreadMessages = state.messageThreads.reduce((sum, t) =>
    sum + state.directMessages.filter(m => m.threadId === t.id && !m.read).length, 0)

  const openProjects = state.creativeProjects.filter(p => p.status !== 'Complete' && p.status !== 'On Hold').length
  const activeClients = state.clients.length
  const pendingInvoices = state.invoices?.filter((inv: any) => inv.status === 'Sent' || inv.status === 'Overdue').length ?? 0

  const NAV: NavGroup[] = [
    {
      title: '',
      items: [
        { label: 'Overview', path: '/app', icon: '⬡' },
      ],
    },
    // Film + Music tool grid rendered separately below

    {
      title: 'Project Management',
      accent: '#48bb9a',
      items: [
        { label: 'Projects', path: '/app/projects', icon: '◈', accent: '#48bb9a', badge: openProjects || undefined },
        { label: 'Schedule', path: '/app/schedule', icon: '◷' },
        { label: 'Assets', path: '/app/assets', icon: '◑' },
      ],
    },
    {
      title: 'Client Management',
      accent: '#f59e0b',
      items: [
        { label: 'Clients', path: '/app/clients', icon: '◎', accent: '#f59e0b', badge: activeClients || undefined },
        { label: 'Client Projects', path: '/app/client-projects', icon: '◇' },
        { label: 'Invoices', path: '/app/invoices', icon: '$', badge: pendingInvoices || undefined },
        { label: 'Contracts', path: '/app/contracts', icon: '⊘' },
        { label: 'Equipment', path: '/app/equipment', icon: '⚙' },
      ],
    },
    {
      title: 'Brand',
      accent: '#a855f7',
      items: [
        { label: 'Brand Studio', path: '/app/brand', icon: '◈', accent: '#a855f7' },
        { label: 'Public Profile', path: '/app/profile', icon: '◉' },
        { label: 'Portfolio', path: '/app/portfolio', icon: '⊡' },
        { label: 'Packages', path: '/app/packages', icon: '$' },
        { label: 'Messages', path: '/app/messages', icon: '✉', badge: unreadMessages || undefined },
        { label: 'Forum', path: '/app/forum', icon: '⊞' },
      ],
    },
    {
      title: 'Library',
      items: [
        { label: 'References', path: '/app/references', icon: '◉' },
      ],
    },
    {
      title: 'Logs',
      items: [
        { label: 'Inventory Log', path: '/app/logs/inventory', icon: '◐' },
        { label: 'Practice Log', path: '/app/logs/practice', icon: '◐' },
        { label: 'Archive Log', path: '/app/logs/archive', icon: '◐' },
        { label: 'Reference Log', path: '/app/logs/reference', icon: '◐' },
      ],
    },
  ]

  function handleNewProject() {
    const id = createProject()
    navigate(`/app/projects/${id}`)
  }

  return (
    <aside
      className="flex flex-col h-full w-52 shrink-0 select-none"
      style={{ background: '#111113', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/6">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">
            IX
          </div>
          <span className="text-xs font-semibold text-white tracking-wide">Interdisciplinary</span>
        </NavLink>
      </div>

      {/* New Project */}
      <div className="px-3 py-3">
        <button
          onClick={handleNewProject}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-600/90 hover:bg-brand-500 text-white text-xs font-medium transition-colors"
        >
          <span className="text-base leading-none">+</span>
          New Project
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-4">
        {NAV.map(group => (
          <div key={group.title || 'root'}>
            {group.title && (
              <div className="flex items-center gap-2 px-2.5 mb-1">
                {group.accent && (
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: group.accent }} />
                )}
                <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
                  {group.title}
                </p>
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/app'}
                  className={({ isActive }) =>
                    clsx(linkBase, isActive ? 'text-white border border-white/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent')
                  }
                  style={({ isActive }) => {
                    const accent = item.accent ?? group.accent
                    if (!isActive) return {}
                    return accent
                      ? { background: accent + '18', borderColor: accent + '35', borderLeftColor: accent, borderLeftWidth: 2 }
                      : { background: 'rgba(98,114,243,0.12)', borderColor: 'rgba(98,114,243,0.25)', borderLeftColor: '#6272f3', borderLeftWidth: 2 }
                  }}
                >
                  <span className="w-4 text-center font-mono text-[11px] shrink-0 opacity-60 group-hover:opacity-100">
                    {item.icon}
                  </span>
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge != null && item.badge > 0 && (
                    <span
                      className="text-[9px] font-bold text-white rounded-full px-1.5 py-0.5 shrink-0 ml-auto"
                      style={{ background: item.accent ?? group.accent ?? '#6272f3' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        {/* Creative Tool Grid — 2×3 matrix */}
        <div>
          <div className="flex items-center gap-2 px-2.5 mb-1.5">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">Creative Tools</p>
          </div>
          <div
            className="rounded-md overflow-hidden border border-white/6"
            style={{ background: '#0e0e10' }}
          >
            {/* Film row — NLE teal */}
            <div className="grid grid-cols-3">
              {[
                { label: 'Script writer', path: '/app/script' },
                { label: 'Storyboarding', path: '/app/storyboard' },
                { label: '6-stage pipeline', path: '/app/film' },
              ].map((item, i) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => clsx(
                    'flex flex-col items-center justify-center px-1 py-2.5 text-center transition-colors relative group',
                    i < 2 && 'border-r border-white/6',
                    isActive ? 'text-white' : 'text-slate-600 hover:text-slate-300',
                  )}
                  style={({ isActive }) => isActive
                    ? { background: 'rgba(6,182,212,0.12)', borderTop: '2px solid #06b6d4' }
                    : { borderTop: '2px solid transparent' }
                  }
                >
                  <span className="text-[8px] font-mono leading-tight text-center break-words w-full">{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

            {/* Music row — DAW purple */}
            <div className="grid grid-cols-3">
              {[
                { label: 'Score writer', path: '/app/score' },
                { label: 'Arrangement mapping', path: '/app/arrangement' },
                { label: 'Cross-discipline', path: '/app/projects' },
              ].map((item, i) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => clsx(
                    'flex flex-col items-center justify-center px-1 py-2.5 text-center transition-colors relative group',
                    i < 2 && 'border-r border-white/6',
                    isActive ? 'text-white' : 'text-slate-600 hover:text-slate-300',
                  )}
                  style={({ isActive }) => isActive
                    ? { background: 'rgba(98,114,243,0.12)', borderBottom: '2px solid #6272f3' }
                    : { borderBottom: '2px solid transparent' }
                  }
                >
                  <span className="text-[8px] font-mono leading-tight text-center break-words w-full">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>

          {/* Row labels */}
          <div className="flex justify-between px-1 mt-1">
            <span className="text-[7px] font-mono uppercase tracking-widest" style={{ color: '#06b6d490' }}>Film / NLE</span>
            <span className="text-[7px] font-mono uppercase tracking-widest" style={{ color: '#6272f390' }}>Music / DAW</span>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-slate-600">Open projects</span>
          <span className="text-[10px] font-mono text-slate-500">{openProjects}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-600">Clients</span>
          <span className="text-[10px] font-mono text-slate-500">{activeClients}</span>
        </div>
        <div className="flex items-center gap-3">
          <NavLink to="/discover" className="text-[10px] text-slate-600 hover:text-brand-400 transition-colors">
            Discover
          </NavLink>
          <NavLink to="/community" className="text-[10px] text-slate-600 hover:text-brand-400 transition-colors">
            Community
          </NavLink>
          <NavLink to="/shop" className="text-[10px] text-slate-600 hover:text-slate-300 transition-colors ml-auto">
            Shop
          </NavLink>
        </div>
      </div>
    </aside>
  )
}
