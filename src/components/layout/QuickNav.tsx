import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'

interface QuickNavItem {
  label: string
  shortLabel: string
  path: string
  icon: string
  badge?: number
}

export function QuickNav() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)

  const unread = state.messageThreads.reduce(
    (sum, t) => sum + state.directMessages.filter(m => m.threadId === t.id && !m.read).length,
    0,
  )

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const NAV_ITEMS: QuickNavItem[] = [
    { label: 'Community Feed', shortLabel: 'Feed', path: '/community', icon: '⊞' },
    { label: 'Hire', shortLabel: 'Hire', path: '/discover', icon: '◎' },
    { label: 'Clients', shortLabel: 'Clients', path: '/app/clients', icon: '◇' },
    { label: 'Projects', shortLabel: 'Projects', path: '/app/projects', icon: '◈', badge: unread > 0 ? unread : undefined },
    { label: 'Shop', shortLabel: 'Shop', path: '/shop', icon: '$' },
  ]

  const linkActive = 'text-white'
  const linkInactive = 'text-slate-500 hover:text-slate-300'

  return (
    <>
      {/* Desktop: top-right bar inside main content area */}
      <div
        className="hidden md:flex items-stretch justify-end border-b border-white/6 shrink-0"
        style={{ background: '#0e0e10', height: 36 }}
      >
        <div className="flex items-stretch">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-1.5 px-3 border-l border-white/6 text-[10px] font-mono uppercase tracking-widest transition-colors relative',
                  isActive ? linkActive : linkInactive,
                )
              }
              style={({ isActive }) =>
                isActive ? { borderBottom: '2px solid #6272f3', marginBottom: -1 } : {}
              }
            >
              <span className="text-[11px] opacity-70">{item.icon}</span>
              {item.label}
              {item.badge != null && (
                <span className="text-[8px] font-bold text-white rounded-full px-1 py-px ml-0.5" style={{ background: '#6272f3' }}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}

          {/* Account dropdown */}
          <div ref={accountRef} className="relative">
            <button
              onClick={() => setAccountOpen(v => !v)}
              className={clsx(
                'flex items-center gap-1.5 px-3 h-full border-l border-white/6 text-[10px] font-mono uppercase tracking-widest transition-colors',
                accountOpen ? 'text-white' : 'text-slate-500 hover:text-slate-300',
              )}
            >
              <span className="text-[11px] opacity-70">◉</span>
              Account
              <span className="text-[8px] opacity-40 ml-0.5">{accountOpen ? '▲' : '▼'}</span>
            </button>
            {accountOpen && (
              <div
                className="absolute right-0 top-full mt-px border border-white/10 z-50 min-w-[140px]"
                style={{ background: '#111113', borderRadius: 4 }}
              >
                {[
                  { label: 'Profile', path: '/app/profile', icon: '◉' },
                  { label: 'Brand Studio', path: '/app/brand', icon: '◈' },
                  { label: 'Messages', path: '/app/messages', icon: '✉' },
                  { label: 'Logs', path: '/app/learning', icon: '◐' },
                ].map(item => (
                  <button
                    key={item.path}
                    onClick={() => { navigate(item.path); setAccountOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-[10px] font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-b border-white/6 last:border-0 text-left uppercase tracking-widest"
                  >
                    <span className="opacity-60">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: fixed bottom bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-white/10"
        style={{ background: '#0e0e10', height: 56 }}
      >
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative',
                isActive ? 'text-white' : 'text-slate-600 hover:text-slate-400',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-b" style={{ background: '#6272f3' }} />
                )}
                <span className="text-base font-mono">{item.icon}</span>
                <span className="text-[8px] uppercase tracking-widest font-medium">{item.shortLabel}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="absolute top-2 right-1/4 text-[7px] font-bold text-white rounded-full px-1" style={{ background: '#6272f3' }}>
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Account */}
        <div ref={accountRef} className="flex-1 relative">
          <button
            onClick={() => setAccountOpen(v => !v)}
            className={clsx(
              'w-full h-full flex flex-col items-center justify-center gap-0.5 transition-colors',
              accountOpen ? 'text-white' : 'text-slate-600 hover:text-slate-400',
            )}
          >
            {accountOpen && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-b" style={{ background: '#6272f3' }} />
            )}
            <span className="text-base font-mono">◉</span>
            <span className="text-[8px] uppercase tracking-widest font-medium">Account</span>
          </button>
          {accountOpen && (
            <div
              className="absolute bottom-full right-0 mb-1 border border-white/10 z-50 min-w-[140px]"
              style={{ background: '#111113', borderRadius: 4 }}
            >
              {[
                { label: 'Profile', path: '/app/profile', icon: '◉' },
                { label: 'Brand Studio', path: '/app/brand', icon: '◈' },
                { label: 'Messages', path: '/app/messages', icon: '✉' },
                { label: 'Logs', path: '/app/learning', icon: '◐' },
              ].map(item => (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setAccountOpen(false) }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[10px] font-mono text-slate-400 hover:text-white hover:bg-white/5 transition-colors border-b border-white/6 last:border-0 text-left uppercase tracking-widest"
                >
                  <span className="opacity-60">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
