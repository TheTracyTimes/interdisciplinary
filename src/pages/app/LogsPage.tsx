import { useState } from 'react'

type LogType = 'inventory' | 'practice' | 'archive' | 'reference'

const CONFIG: Record<LogType, { title: string; accent: string; placeholder: string }> = {
  inventory: { title: 'Inventory Log', accent: '#48bb9a', placeholder: '' },
  practice:  { title: 'Practice Log',  accent: '#6272f3', placeholder: 'Log sessions, techniques practiced, goals met, or notes from a session...' },
  archive:   { title: 'Archive Log',   accent: '#f59e0b', placeholder: 'Archive completed projects, versions, decisions, or anything worth preserving...' },
  reference: { title: 'Reference Log', accent: '#06b6d4', placeholder: 'Log reference tracks, films, books, tutorials, or creative inspiration...' },
}

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor']
const CATEGORIES = ['Camera', 'Lens', 'Audio', 'Lighting', 'Computer', 'Plugin', 'Instrument', 'Controller', 'Storage', 'Accessory', 'Other']

export interface InventoryEntry {
  id: string
  name: string
  manufacturer: string
  condition: string
  purchasedAt: string
  quantity: string
  price: string
  acquired: string
  category: string
  serialKey: string
  type: 'Software' | 'Hardware' | ''
  addedAt: string
  forSale?: boolean
  askingPrice?: string
  listingNote?: string
}

interface LogEntry {
  id: string
  text: string
  date: string
  tag?: string
}

const BLANK_ITEM: Omit<InventoryEntry, 'id' | 'addedAt'> = {
  name: '', manufacturer: '', condition: 'New', purchasedAt: '',
  quantity: '1', price: '', acquired: '', category: '', serialKey: '', type: '',
}

function InventoryLog() {
  const storageKey = 'log_inventory'
  const [entries, setEntries] = useState<InventoryEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  })
  const [form, setForm] = useState({ ...BLANK_ITEM })
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  function save(updated: InventoryEntry[]) {
    setEntries(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  function addEntry() {
    if (!form.name.trim()) return
    save([{ ...form, id: Date.now().toString(), addedAt: new Date().toISOString() }, ...entries])
    setForm({ ...BLANK_ITEM })
    setOpen(false)
  }

  function deleteEntry(id: string) {
    save(entries.filter(e => e.id !== id))
  }

  const filtered = entries.filter(e =>
    !search ||
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  )

  const field = 'text-xs text-white placeholder-slate-600 bg-transparent border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-white/20 w-full'
  const label = 'text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1 block'

  return (
    <div className="min-h-full p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#48bb9a' }} />
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Logs</span>
          </div>
          <h1 className="text-xl font-bold text-white">Inventory Log</h1>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
          style={{ background: '#48bb9acc' }}
        >
          {open ? 'Cancel' : '+ Add item'}
        </button>
      </div>

      {/* Form */}
      {open && (
        <div className="rounded-xl border border-white/8 p-5 mb-6" style={{ background: '#111113' }}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className={label}>Name</label>
              <input className={field} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Sony A7 IV" />
            </div>
            <div>
              <label className={label}>Manufacturer</label>
              <input className={field} value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} placeholder="e.g. Sony" />
            </div>
            <div>
              <label className={label}>Condition</label>
              <select className={field} value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value }))} style={{ background: '#111113' }}>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Purchased At</label>
              <input className={field} value={form.purchasedAt} onChange={e => setForm(f => ({ ...f, purchasedAt: e.target.value }))} placeholder="e.g. B&H Photo" />
            </div>
            <div>
              <label className={label}>Quantity</label>
              <input className={field} type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
            </div>
            <div>
              <label className={label}>Price</label>
              <input className={field} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 2499.00" />
            </div>
            <div>
              <label className={label}>Acquired</label>
              <input className={field} type="date" value={form.acquired} onChange={e => setForm(f => ({ ...f, acquired: e.target.value }))} style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label className={label}>Category</label>
              <select className={field} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ background: '#111113' }}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={label}>Serial Key</label>
              <input className={field} value={form.serialKey} onChange={e => setForm(f => ({ ...f, serialKey: e.target.value }))} placeholder="Serial / license key" />
            </div>
          </div>

          {/* Software / Hardware toggle */}
          <div className="mb-5">
            <label className={label}>Type</label>
            <div className="flex gap-2">
              {(['Software', 'Hardware'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold border transition-colors"
                  style={form.type === t
                    ? { background: '#48bb9a22', borderColor: '#48bb9a66', color: '#48bb9a' }
                    : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#64748b' }
                  }
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={addEntry}
              disabled={!form.name.trim()}
              className="px-5 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-30 transition-opacity"
              style={{ background: '#48bb9acc' }}
            >
              Save item
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      {entries.length > 0 && (
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, manufacturer, or category..."
          className="w-full text-xs text-white placeholder-slate-600 border border-white/8 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20 mb-4"
          style={{ background: '#111113' }}
        />
      )}

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-600 text-sm">{search ? 'No items match your search.' : 'No items logged yet.'}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/8 overflow-hidden">
          {/* Table header */}
          <div
            className="grid text-[10px] font-mono text-slate-600 uppercase tracking-widest px-4 py-2 border-b border-white/6"
            style={{ background: '#0e0e10', gridTemplateColumns: '1fr 1fr 80px 80px 60px 80px 80px 90px 96px' }}
          >
            <span>Name</span>
            <span>Manufacturer</span>
            <span>Category</span>
            <span>Type</span>
            <span>Qty</span>
            <span>Price</span>
            <span>Condition</span>
            <span>Acquired</span>
            <span>For Sale</span>
          </div>
          {filtered.map((entry, idx) => (
            <div
              key={entry.id}
              className="group border-b border-white/4 last:border-0"
              style={{ background: idx % 2 === 0 ? '#111113' : '#0f0f11' }}
            >
              <div
                className="grid items-center px-4 py-3 gap-2 text-xs"
                style={{ gridTemplateColumns: '1fr 1fr 80px 80px 60px 80px 80px 90px 96px' }}
              >
                <div className="min-w-0">
                  <p className="text-white font-medium truncate">{entry.name}</p>
                  {entry.serialKey && <p className="text-[9px] font-mono text-slate-600 truncate">{entry.serialKey}</p>}
                </div>
                <span className="text-slate-400 truncate">{entry.manufacturer || '—'}</span>
                <span className="text-slate-500 truncate">{entry.category || '—'}</span>
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded w-fit"
                  style={entry.type === 'Software'
                    ? { background: 'rgba(98,114,243,0.15)', color: '#6272f3' }
                    : entry.type === 'Hardware'
                    ? { background: 'rgba(6,182,212,0.15)', color: '#06b6d4' }
                    : { color: '#475569' }
                  }
                >
                  {entry.type || '—'}
                </span>
                <span className="text-slate-400 font-mono">{entry.quantity}</span>
                <span className="text-slate-400 font-mono">{entry.price ? `$${entry.price}` : '—'}</span>
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded w-fit"
                  style={{
                    background: entry.condition === 'New' ? 'rgba(72,187,154,0.15)'
                      : entry.condition === 'Like New' ? 'rgba(72,187,154,0.1)'
                      : entry.condition === 'Good' ? 'rgba(98,114,243,0.15)'
                      : entry.condition === 'Fair' ? 'rgba(245,158,11,0.15)'
                      : 'rgba(232,93,74,0.15)',
                    color: entry.condition === 'New' || entry.condition === 'Like New' ? '#48bb9a'
                      : entry.condition === 'Good' ? '#6272f3'
                      : entry.condition === 'Fair' ? '#f59e0b'
                      : '#e85d4a',
                  }}
                >
                  {entry.condition}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 font-mono text-[10px]">
                    {entry.acquired ? new Date(entry.acquired).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}
                  </span>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-slate-700 hover:text-slate-400 transition-colors opacity-0 group-hover:opacity-100 ml-2"
                  >
                    ✕
                  </button>
                </div>
                {/* For Sale toggle */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      const updated = entries.map(e => e.id === entry.id ? { ...e, forSale: !e.forSale } : e)
                      save(updated)
                    }}
                    className="text-[9px] font-semibold px-2 py-0.5 rounded border transition-colors w-fit"
                    style={entry.forSale
                      ? { background: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)', color: '#f59e0b' }
                      : { background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#475569' }
                    }
                  >
                    {entry.forSale ? 'Listed' : 'List'}
                  </button>
                  {entry.forSale && (
                    <input
                      value={entry.askingPrice || ''}
                      onChange={e => {
                        const updated = entries.map(en => en.id === entry.id ? { ...en, askingPrice: e.target.value } : en)
                        save(updated)
                      }}
                      placeholder="Ask $"
                      className="text-[10px] font-mono text-white placeholder-slate-600 bg-transparent border border-white/10 rounded px-1.5 py-0.5 focus:outline-none w-full"
                    />
                  )}
                </div>
              </div>
              {entry.purchasedAt && (
                <p className="px-4 pb-2 text-[10px] text-slate-600 font-mono -mt-1">Purchased at: {entry.purchasedAt}</p>
              )}
              {entry.forSale && (
                <div className="px-4 pb-2 -mt-1">
                  <input
                    value={entry.listingNote || ''}
                    onChange={e => {
                      const updated = entries.map(en => en.id === entry.id ? { ...en, listingNote: e.target.value } : en)
                      save(updated)
                    }}
                    placeholder="Listing note (optional — shown on resell market)"
                    className="text-[10px] text-slate-400 placeholder-slate-600 bg-transparent border border-white/8 rounded px-2 py-1 focus:outline-none w-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GenericLog({ type }: { type: 'practice' | 'archive' | 'reference' }) {
  const config = CONFIG[type]
  const storageKey = `log_${type}`

  const [entries, setEntries] = useState<LogEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  })
  const [draft, setDraft] = useState('')
  const [tag, setTag] = useState('')
  const [search, setSearch] = useState('')

  function save(updated: LogEntry[]) {
    setEntries(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  function addEntry() {
    if (!draft.trim()) return
    save([{ id: Date.now().toString(), text: draft.trim(), date: new Date().toISOString(), tag: tag.trim() || undefined }, ...entries])
    setDraft('')
    setTag('')
  }

  const filtered = entries.filter(e =>
    !search || e.text.toLowerCase().includes(search.toLowerCase()) || (e.tag || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-full p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: config.accent }} />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Logs</span>
        </div>
        <h1 className="text-xl font-bold text-white">{config.title}</h1>
      </div>

      <div className="rounded-xl border border-white/8 p-4 mb-6" style={{ background: '#111113' }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={config.placeholder}
          rows={3}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addEntry() }}
          className="w-full bg-transparent text-sm text-white placeholder-slate-600 resize-none focus:outline-none leading-relaxed mb-3"
        />
        <div className="flex items-center gap-3">
          <input
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="Tag (optional)"
            className="text-xs text-white placeholder-slate-600 bg-transparent border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-white/20 w-36"
          />
          <span className="text-[10px] text-slate-600 flex-1">⌘ + Enter to save</span>
          <button
            onClick={addEntry}
            disabled={!draft.trim()}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-30"
            style={{ background: config.accent + 'cc' }}
          >
            Add entry
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search entries..."
          className="w-full text-xs text-white placeholder-slate-600 border border-white/8 rounded-lg px-4 py-2 focus:outline-none focus:border-white/20 mb-4"
          style={{ background: '#111113' }}
        />
      )}

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-600 text-sm">{search ? 'No entries match.' : 'No entries yet.'}</p>
          </div>
        )}
        {filtered.map(entry => (
          <div
            key={entry.id}
            className="group rounded-lg border border-white/6 px-4 py-3 flex gap-3"
            style={{ background: '#111113', borderLeft: `2px solid ${config.accent}40` }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{entry.text}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-slate-600 font-mono">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {entry.tag && (
                  <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: config.accent + '20', color: config.accent }}>
                    {entry.tag}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => save(entries.filter(e => e.id !== entry.id))} className="text-slate-700 hover:text-slate-400 opacity-0 group-hover:opacity-100 text-xs shrink-0">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LogsPage({ type }: { type: LogType }) {
  if (type === 'inventory') return <InventoryLog />
  return <GenericLog type={type} />
}
