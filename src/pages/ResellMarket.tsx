import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { InventoryEntry } from './app/LogsPage'

const CONDITION_COLOR: Record<string, { bg: string; color: string }> = {
  'New':       { bg: 'rgba(72,187,154,0.15)',  color: '#48bb9a' },
  'Like New':  { bg: 'rgba(72,187,154,0.1)',   color: '#48bb9a' },
  'Good':      { bg: 'rgba(98,114,243,0.15)',  color: '#6272f3' },
  'Fair':      { bg: 'rgba(245,158,11,0.15)',  color: '#f59e0b' },
  'Poor':      { bg: 'rgba(232,93,74,0.15)',   color: '#e85d4a' },
}

const CATEGORIES = ['All', 'Camera', 'Lens', 'Audio', 'Lighting', 'Computer', 'Plugin', 'Instrument', 'Controller', 'Storage', 'Accessory', 'Other']

export function ResellMarket() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [typeFilter, setTypeFilter] = useState<'All' | 'Software' | 'Hardware'>('All')
  const [condition, setCondition] = useState('All')

  const listings = useMemo<InventoryEntry[]>(() => {
    try {
      const all: InventoryEntry[] = JSON.parse(localStorage.getItem('log_inventory') || '[]')
      return all.filter(e => e.forSale)
    } catch { return [] }
  }, [])

  const filtered = listings.filter(item => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.manufacturer.toLowerCase().includes(search.toLowerCase())) return false
    if (category !== 'All' && item.category !== category) return false
    if (typeFilter !== 'All' && item.type !== typeFilter) return false
    if (condition !== 'All' && item.condition !== condition) return false
    return true
  })

  return (
    <div className="min-h-screen" style={{ background: '#0c0c0e' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-white/6 px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(12,12,14,0.92)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">IX</div>
          <span className="text-xs font-semibold text-white">Interdisciplinary</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/discover" className="text-xs text-slate-400 hover:text-white transition-colors">Discover</Link>
          <Link to="/community" className="text-xs text-slate-400 hover:text-white transition-colors">Community</Link>
          <Link to="/app" className="text-xs text-white px-3 py-1.5 rounded-lg" style={{ background: '#6272f3' }}>Studio</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Resell Market</span>
          <h1 className="text-3xl font-bold text-white mt-2 mb-2">Gear & Software</h1>
          <p className="text-sm text-slate-400">Pre-owned and surplus gear listed by producers on Interdisciplinary.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or manufacturer..."
              className="text-xs text-white placeholder-slate-600 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-500/60 w-full sm:w-72"
              style={{ background: '#141416' }}
            />
            <div className="flex gap-2">
              {(['All', 'Software', 'Hardware'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={clsx('px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors', typeFilter === t ? 'text-white' : 'text-slate-500 border-white/8 hover:text-white')}
                  style={typeFilter === t ? { background: 'rgba(98,114,243,0.2)', borderColor: 'rgba(98,114,243,0.4)' } : { background: '#141416' }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-1 p-1 rounded-lg overflow-x-auto" style={{ background: '#1a1a1d' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={clsx('px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors shrink-0', category === c ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white')}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Condition pills */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'New', 'Like New', 'Good', 'Fair', 'Poor'].map(c => (
              <button
                key={c}
                onClick={() => setCondition(c)}
                className="px-3 py-1 rounded-full text-[10px] font-semibold border transition-colors"
                style={condition === c && c !== 'All'
                  ? { ...CONDITION_COLOR[c], borderColor: CONDITION_COLOR[c]?.color + '50' }
                  : condition === c
                  ? { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }
                  : { background: 'transparent', borderColor: 'rgba(255,255,255,0.08)', color: '#475569' }
                }
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Listings */}
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4 text-slate-700">◈</p>
            <p className="text-slate-500 text-sm mb-2">
              {listings.length === 0 ? 'No items listed for resale yet.' : 'No listings match your filters.'}
            </p>
            {listings.length === 0 && (
              <p className="text-xs text-slate-600">
                Have gear to sell? <Link to="/app/logs/inventory" className="text-brand-400">Go to your Inventory Log</Link> and toggle "List" on any item.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(item => (
              <ListingCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* How it works */}
        <div className="mt-16 rounded-2xl border border-white/8 p-8" style={{ background: '#111113' }}>
          <h2 className="text-lg font-bold text-white mb-6 text-center">How selling works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Log your gear', desc: 'Add items to your Inventory Log inside the Studio.' },
              { step: '2', title: 'List for sale', desc: 'Toggle "List" on any item, set your asking price and a note.' },
              { step: '3', title: 'Get contacted', desc: 'Buyers reach out via your public profile or messages.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center text-xs font-black text-white" style={{ background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.4)' }}>
                  {s.step}
                </div>
                <p className="text-xs font-semibold text-white mb-1">{s.title}</p>
                <p className="text-[10px] text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ListingCard({ item }: { item: InventoryEntry }) {
  const cond = CONDITION_COLOR[item.condition] ?? { bg: 'rgba(255,255,255,0.05)', color: '#64748b' }
  const price = item.askingPrice || item.price

  return (
    <div
      className="rounded-2xl border border-white/8 overflow-hidden hover:border-white/20 transition-all"
      style={{ background: '#141416' }}
    >
      {/* Color band */}
      <div
        className="h-1.5"
        style={{ background: item.type === 'Software' ? '#6272f3' : item.type === 'Hardware' ? '#06b6d4' : '#48bb9a' }}
      />

      <div className="p-4">
        {/* Type + Condition */}
        <div className="flex items-center gap-2 mb-3">
          {item.type && (
            <span
              className="text-[9px] font-semibold px-2 py-0.5 rounded"
              style={item.type === 'Software'
                ? { background: 'rgba(98,114,243,0.15)', color: '#6272f3' }
                : { background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }
              }
            >
              {item.type}
            </span>
          )}
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded" style={{ background: cond.bg, color: cond.color }}>
            {item.condition}
          </span>
          {item.category && (
            <span className="text-[9px] text-slate-600 font-mono ml-auto">{item.category}</span>
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-bold text-white mb-0.5 leading-tight">{item.name}</p>
        {item.manufacturer && <p className="text-[10px] text-slate-500 mb-3">{item.manufacturer}</p>}

        {/* Listing note */}
        {item.listingNote && (
          <p className="text-[10px] text-slate-400 leading-relaxed mb-3 border-l-2 pl-2" style={{ borderColor: '#f59e0b40' }}>
            {item.listingNote}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-white/6">
          <div>
            {price ? (
              <p className="text-base font-black" style={{ color: '#f59e0b' }}>${parseFloat(price).toLocaleString()}</p>
            ) : (
              <p className="text-xs text-slate-600">Price on request</p>
            )}
            {item.quantity && parseInt(item.quantity) > 1 && (
              <p className="text-[9px] text-slate-600 font-mono">Qty: {item.quantity}</p>
            )}
          </div>
          <Link
            to="/app/messages"
            className="text-[10px] font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-80"
            style={{ background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.35)' }}
          >
            Make offer
          </Link>
        </div>
      </div>
    </div>
  )
}
