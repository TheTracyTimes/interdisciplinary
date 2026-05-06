import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Card } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'

const STATUS_COLOR: Record<string, string> = {
  Idea: 'neutral', 'Pre-Production': 'film', Production: 'creator',
  'Post-Production': 'creator', Mixing: 'music', Mastering: 'music',
  Complete: 'free', 'On Hold': 'neutral',
}

export function Dashboard() {
  const { state } = useApp()
  const { creativeProjects, clients, scheduleEvents, invoices } = state

  const activeProjects = creativeProjects.filter(p => p.priority === 'Active')
  const activeClients = clients.filter(c => c.status === 'Active')
  const upcoming = scheduleEvents
    .filter(e => new Date(e.date) >= new Date())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5)
  const outstanding = invoices
    .filter(i => i.status === 'Sent' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.amount, 0)
  const totalRevenue = invoices
    .filter(i => i.status === 'Paid')
    .reduce((sum, i) => sum + i.amount, 0)
  const recentProjects = [...creativeProjects]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 6)

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-slate-600 font-mono mb-1">{today}</p>
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Your creative workspace at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Active Projects', value: activeProjects.length, sub: `${creativeProjects.length} total`, path: '/app/projects', color: 'text-brand-400' },
          { label: 'Active Clients', value: activeClients.length, sub: `${clients.length} total`, path: '/app/clients', color: 'text-violet-400' },
          { label: 'Upcoming Events', value: upcoming.length, sub: 'next 30 days', path: '/app/schedule', color: 'text-amber-400' },
          { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: `$${outstanding.toLocaleString()} outstanding`, path: '/app/invoices', color: 'text-emerald-400' },
        ].map(stat => (
          <Link key={stat.label} to={stat.path}>
            <Card className="p-4 hover:border-white/20 transition-colors cursor-pointer">
              <p className="text-xs text-slate-500 mb-2">{stat.label}</p>
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-600 mt-1">{stat.sub}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Recent Projects</h2>
            <Link to="/app/projects" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-2">
            {recentProjects.length === 0 && (
              <Card className="p-6 text-center">
                <p className="text-sm text-slate-600">No projects yet.</p>
                <Link to="/app/projects" className="text-xs text-brand-400 hover:text-brand-300 mt-2 inline-block">
                  Create your first project →
                </Link>
              </Card>
            )}
            {recentProjects.map(p => (
              <Link key={p.id} to={`/app/projects/${p.id}`}>
                <Card className="p-3.5 hover:border-white/20 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-white truncate">{p.title}</p>
                        <Badge variant={STATUS_COLOR[p.status] as any ?? 'neutral'} size="xs">{p.status}</Badge>
                      </div>
                      <p className="text-xs text-slate-600">{p.type} · {p.genre || 'No genre'}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="text-[10px] font-mono text-slate-600">
                        {new Date(p.updatedAt).toLocaleDateString()}
                      </p>
                      <Badge variant={p.priority === 'Active' ? 'creator' : 'neutral'} size="xs" className="mt-1">
                        {p.priority}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Schedule</h2>
            <Link to="/app/schedule" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-2">
            {upcoming.length === 0 && (
              <Card className="p-4 text-center">
                <p className="text-xs text-slate-600">Nothing scheduled.</p>
              </Card>
            )}
            {upcoming.map(ev => (
              <Card key={ev.id} className="p-3">
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-1 rounded-full shrink-0 mt-0.5"
                    style={{
                      height: '36px',
                      background: ev.type === 'Shoot' ? '#e85d4a'
                        : ev.type === 'Deadline' ? '#f59e0b'
                        : ev.type === 'Meeting' ? '#6272f3'
                        : '#48bb9a',
                    }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{ev.event}</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                      {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {ev.time && ` · ${ev.time}`}
                    </p>
                    <p className="text-[10px] text-slate-600">{ev.type} · {ev.duration}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Creative Tools */}
          <div className="mt-6">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Creative Tools</h2>
            <div className="rounded-xl overflow-hidden border border-white/8" style={{ background: '#0e0e10' }}>
              {/* Film row */}
              <div className="grid grid-cols-3">
                {[
                  { label: 'Script writer', path: '/app/script' },
                  { label: 'Storyboarding', path: '/app/storyboard' },
                  { label: '6-stage pipeline', path: '/app/film' },
                ].map((item, i) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-center px-2 py-3 text-center text-[10px] font-mono text-slate-500 hover:text-white hover:bg-white/5 transition-colors${i < 2 ? ' border-r border-white/6' : ''}`}
                    style={{ borderTop: '2px solid rgba(6,182,212,0.25)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              {/* Music row */}
              <div className="grid grid-cols-3">
                {[
                  { label: 'Score writer', path: '/app/score' },
                  { label: 'Arrangement mapping', path: '/app/arrangement' },
                  { label: 'Cross-discipline', path: '/app/projects' },
                ].map((item, i) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center justify-center px-2 py-3 text-center text-[10px] font-mono text-slate-500 hover:text-white hover:bg-white/5 transition-colors${i < 2 ? ' border-r border-white/6' : ''}`}
                    style={{ borderBottom: '2px solid rgba(98,114,243,0.25)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex justify-between px-1 mt-1">
              <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: '#06b6d490' }}>Film / NLE</span>
              <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: '#6272f390' }}>Music / DAW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
