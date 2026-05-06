import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const RECENT_KEY = 'ix_recent_portals'

function getRecent(): { token: string; name: string; ts: string }[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') } catch { return [] }
}

function saveRecent(token: string, name: string) {
  const existing = getRecent().filter(r => r.token !== token)
  const updated = [{ token, name, ts: new Date().toISOString() }, ...existing].slice(0, 5)
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated))
}

export function ClientEntry() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const recent = getRecent()

  function handleAccess(inputToken: string) {
    const t = inputToken.trim()
    if (!t) return
    const proj = state.clientProjects.find(p => p.shareToken === t && p.portalEnabled)
    if (!proj) {
      setError('No active portal found for that link. Check with your producer.')
      return
    }
    saveRecent(t, proj.projectName)
    navigate(`/portal/${t}`)
  }

  function extractToken(input: string): string {
    const match = input.match(/\/portal\/([a-zA-Z0-9]+)/)
    return match ? match[1] : input
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f8f9fb' }}>
      {/* Nav */}
      <nav className="border-b border-slate-200 px-6 py-3 flex items-center justify-between bg-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">IX</div>
          <span className="text-xs font-semibold text-slate-800">Interdisciplinary</span>
        </Link>
        <Link to="/app" className="text-xs text-slate-500 hover:text-slate-800 transition-colors">Producer Studio →</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-3xl text-white mx-auto mb-5 shadow-lg shadow-emerald-500/20">
              ◉
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Your Project</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Your producer shared a portal link with you. Paste it below to view your project, approve deliverables, and message your producer.
            </p>
          </div>

          {/* Input */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-4">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Portal Link or Access Token
            </label>
            <input
              value={token}
              onChange={e => { setToken(e.target.value); setError('') }}
              onKeyDown={e => { if (e.key === 'Enter') handleAccess(extractToken(token)) }}
              placeholder="Paste your portal link here..."
              className="w-full text-sm text-slate-900 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            <button
              onClick={() => handleAccess(extractToken(token))}
              className="w-full mt-4 py-3 rounded-xl text-sm font-bold text-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #48bb9a, #059669)' }}
            >
              Access My Project →
            </button>
          </div>

          {/* Recent portals */}
          {recent.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recently Accessed</p>
              <div className="space-y-2">
                {recent.map(r => (
                  <button
                    key={r.token}
                    onClick={() => navigate(`/portal/${r.token}`)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all text-left"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800">{r.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{r.token}</p>
                    </div>
                    <span className="text-xs text-emerald-600">Open →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-center text-[10px] text-slate-400 mt-6">
            Don't have a link? Contact your producer to share one with you.
          </p>
        </div>
      </div>
    </div>
  )
}
