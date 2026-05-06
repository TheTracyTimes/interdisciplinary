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

interface PracticeEntry {
  id: string
  date: string
  technique: string
  duration: string
  recording: string
  notes: string
  addedAt: string
}

const BLANK_PRACTICE: Omit<PracticeEntry, 'id' | 'addedAt'> = {
  date: new Date().toISOString().slice(0, 10),
  technique: '',
  duration: '',
  recording: '',
  notes: '',
}

function PracticeLog() {
  const storageKey = 'log_practice'
  const [entries, setEntries] = useState<PracticeEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  })
  const [form, setForm] = useState({ ...BLANK_PRACTICE })
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  function save(updated: PracticeEntry[]) {
    setEntries(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  function addEntry() {
    if (!form.technique.trim()) return
    save([{ ...form, id: Date.now().toString(), addedAt: new Date().toISOString() }, ...entries])
    setForm({ ...BLANK_PRACTICE })
    setOpen(false)
  }

  const filtered = entries.filter(e =>
    !search ||
    e.technique.toLowerCase().includes(search.toLowerCase()) ||
    e.notes.toLowerCase().includes(search.toLowerCase())
  )

  const field = 'text-xs text-white placeholder-zinc-600 bg-transparent border border-[#2a2a2e] rounded-md px-3 py-2 focus:border-[#6272f3]/40 w-full transition-colors'
  const lbl = 'text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-1 block'

  return (
    <div className="min-h-full p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Logs</p>
          <h1 className="text-xl font-semibold text-white">Practice Log</h1>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="px-4 py-2 rounded-md bg-[#6272f3] hover:bg-[#7280f5] text-white text-xs font-medium transition-colors"
        >
          {open ? 'Cancel' : '+ Log session'}
        </button>
      </div>

      {open && (
        <div className="rounded-lg border border-[#1e1e21] bg-[#111113] p-5 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className={lbl}>Date</label>
              <input type="date" className={field} value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{ colorScheme: 'dark' }} />
            </div>
            <div className="md:col-span-2">
              <label className={lbl}>Technique</label>
              <input className={field} value={form.technique} onChange={e => setForm(f => ({ ...f, technique: e.target.value }))} placeholder="e.g. Scales, chord progressions, camera blocking..." />
            </div>
            <div>
              <label className={lbl}>Duration</label>
              <input className={field} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 45 min" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={lbl}>Recording</label>
              <input className={field} value={form.recording} onChange={e => setForm(f => ({ ...f, recording: e.target.value }))} placeholder="File name, link, or note about recording" />
            </div>
            <div>
              <label className={lbl}>Notes</label>
              <input className={field} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="What went well, what to work on..." />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={addEntry}
              disabled={!form.technique.trim()}
              className="px-5 py-2 rounded-md bg-[#6272f3] hover:bg-[#7280f5] text-white text-xs font-medium disabled:opacity-30 transition-colors"
            >
              Save session
            </button>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search sessions..."
          className="w-full text-xs text-white placeholder-zinc-600 border border-[#1e1e21] rounded-md px-4 py-2 bg-[#111113] focus:border-[#2a2a2e] mb-4 transition-colors"
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-600 text-sm">{search ? 'No sessions match.' : 'No sessions logged yet.'}</p>
        </div>
      ) : (
        <div className="rounded-lg border border-[#1e1e21] overflow-hidden">
          <div className="grid text-[10px] font-medium text-zinc-600 uppercase tracking-widest px-4 py-2.5 border-b border-[#1e1e21] bg-[#0e0e10]"
            style={{ gridTemplateColumns: '100px 1fr 80px 1fr 1fr' }}>
            <span>Date</span>
            <span>Technique</span>
            <span>Duration</span>
            <span>Recording</span>
            <span>Notes</span>
          </div>
          {filtered.map((entry, idx) => (
            <div
              key={entry.id}
              className="group grid items-center px-4 py-3 gap-3 text-xs border-b border-[#1a1a1d] last:border-0"
              style={{ gridTemplateColumns: '100px 1fr 80px 1fr 1fr', background: idx % 2 === 0 ? '#111113' : '#0f0f11' }}
            >
              <span className="text-zinc-500 font-mono text-[10px]">
                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
              </span>
              <span className="text-zinc-200 font-medium truncate">{entry.technique}</span>
              <span className="text-zinc-400 font-mono">{entry.duration || '—'}</span>
              <span className="text-zinc-500 truncate">{entry.recording || '—'}</span>
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-600 truncate">{entry.notes || '—'}</span>
                <button onClick={() => save(entries.filter(e => e.id !== entry.id))}
                  className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 shrink-0 transition-all">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface ArchiveEntry {
  id: string
  title: string
  type: 'Film' | 'Music' | 'Both' | ''
  genre: string
  client: string
  completedDate: string
  duration: string
  tools: string
  link: string
  notes: string
  addedAt: string
  visibility: 'private' | 'public'
}

const BLANK_ARCHIVE: Omit<ArchiveEntry, 'id' | 'addedAt'> = {
  title: '', type: '', genre: '', client: '',
  completedDate: new Date().toISOString().slice(0, 10),
  duration: '', tools: '', link: '', notes: '',
  visibility: 'private',
}

function ArchiveLog() {
  const storageKey = 'log_archive'
  const [entries, setEntries] = useState<ArchiveEntry[]>(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  })
  const [form, setForm] = useState({ ...BLANK_ARCHIVE })
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [expand, setExpand] = useState<string | null>(null)

  function save(updated: ArchiveEntry[]) {
    setEntries(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  function addEntry() {
    if (!form.title.trim()) return
    save([{ ...form, id: Date.now().toString(), addedAt: new Date().toISOString() }, ...entries])
    setForm({ ...BLANK_ARCHIVE })
    setOpen(false)
  }

  const filtered = entries.filter(e =>
    !search ||
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.client.toLowerCase().includes(search.toLowerCase()) ||
    e.genre.toLowerCase().includes(search.toLowerCase())
  )

  const field = 'text-xs text-white placeholder-zinc-600 bg-transparent border border-[#2a2a2e] rounded px-3 py-2 focus:border-[#6272f3]/40 w-full transition-colors'
  const lbl = 'text-[10px] font-medium text-zinc-500 uppercase tracking-widest mb-1 block'

  const TYPE_COLOR: Record<string, { bg: string; color: string }> = {
    Film:  { bg: 'rgba(6,182,212,0.12)',  color: '#06b6d4' },
    Music: { bg: 'rgba(98,114,243,0.12)', color: '#6272f3' },
    Both:  { bg: 'rgba(72,187,154,0.12)', color: '#48bb9a' },
  }

  return (
    <div className="min-h-full p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Logs</p>
          <h1 className="text-xl font-semibold text-white">Archive Log</h1>
          <p className="text-xs text-zinc-600 mt-0.5">Completed projects</p>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="px-4 py-2 rounded bg-[#6272f3] hover:bg-[#7280f5] text-white text-xs font-medium transition-colors"
        >
          {open ? 'Cancel' : '+ Archive project'}
        </button>
      </div>

      {open && (
        <div className="rounded border border-[#1e1e21] bg-[#111113] p-5 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className={lbl}>Project Title</label>
              <input className={field} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Short film — The Wait" />
            </div>
            <div>
              <label className={lbl}>Completed</label>
              <input type="date" className={field} value={form.completedDate} onChange={e => setForm(f => ({ ...f, completedDate: e.target.value }))} style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label className={lbl}>Genre</label>
              <input className={field} value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} placeholder="e.g. Drama, Hip-Hop, Documentary" />
            </div>
            <div>
              <label className={lbl}>Client</label>
              <input className={field} value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="Client name or Self" />
            </div>
            <div>
              <label className={lbl}>Duration / Length</label>
              <input className={field} value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} placeholder="e.g. 12 min, 3:42" />
            </div>
            <div>
              <label className={lbl}>Tools Used</label>
              <input className={field} value={form.tools} onChange={e => setForm(f => ({ ...f, tools: e.target.value }))} placeholder="e.g. Premiere Pro, Ableton" />
            </div>
            <div>
              <label className={lbl}>Link</label>
              <input className={field} value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="Vimeo, SoundCloud, Drive..." />
            </div>
            <div>
              <label className={lbl}>Notes</label>
              <input className={field} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Lessons learned, key decisions..." />
            </div>
          </div>

          <div className="mb-5">
            <label className={lbl}>Discipline</label>
            <div className="flex gap-2">
              {(['Film', 'Music', 'Both'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setForm(f => ({ ...f, type: t }))}
                  className="px-4 py-1.5 rounded text-xs font-medium border transition-colors"
                  style={form.type === t
                    ? { ...TYPE_COLOR[t], borderColor: TYPE_COLOR[t].color + '40' }
                    : { background: 'transparent', borderColor: '#2a2a2e', color: '#52525b' }
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
              disabled={!form.title.trim()}
              className="px-5 py-2 rounded bg-[#6272f3] hover:bg-[#7280f5] text-white text-xs font-medium disabled:opacity-30 transition-colors"
            >
              Save to archive
            </button>
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, client, or genre..."
          className="w-full text-xs text-white placeholder-zinc-600 border border-[#1e1e21] rounded px-4 py-2 bg-[#111113] focus:border-[#2a2a2e] mb-4 transition-colors"
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-600 text-sm">{search ? 'No projects match.' : 'No completed projects archived yet.'}</p>
        </div>
      ) : (
        <div className="rounded border border-[#1e1e21] overflow-hidden">
          <div
            className="grid text-[10px] font-medium text-zinc-600 uppercase tracking-widest px-4 py-2.5 border-b border-[#1e1e21] bg-[#0e0e10]"
            style={{ gridTemplateColumns: '1fr 60px 100px 90px 70px 70px 90px 80px' }}
          >
            <span>Title</span>
            <span>Type</span>
            <span>Genre</span>
            <span>Client</span>
            <span>Length</span>
            <span>Done</span>
            <span>Visibility</span>
            <span>Tools</span>
          </div>
          {filtered.map((entry, idx) => (
            <div key={entry.id} className="border-b border-[#1a1a1d] last:border-0" style={{ background: idx % 2 === 0 ? '#111113' : '#0f0f11' }}>
              <div
                className="group grid items-center px-4 py-3 gap-3 text-xs cursor-pointer"
                style={{ gridTemplateColumns: '1fr 60px 100px 90px 70px 70px 90px 80px' }}
                onClick={() => setExpand(expand === entry.id ? null : entry.id)}
              >
                <span className="text-zinc-200 font-medium truncate">{entry.title}</span>
                {entry.type ? (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded w-fit" style={{ ...TYPE_COLOR[entry.type] }}>
                    {entry.type}
                  </span>
                ) : <span className="text-zinc-600">—</span>}
                <span className="text-zinc-500 truncate">{entry.genre || '—'}</span>
                <span className="text-zinc-500 truncate">{entry.client || '—'}</span>
                <span className="text-zinc-400 font-mono">{entry.duration || '—'}</span>
                <span className="text-zinc-600 font-mono text-[10px]">
                  {entry.completedDate ? new Date(entry.completedDate).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) : '—'}
                </span>
                {/* Visibility toggle */}
                <button
                  onClick={e => {
                    e.stopPropagation()
                    const updated = entries.map(en => en.id === entry.id
                      ? { ...en, visibility: en.visibility === 'public' ? 'private' as const : 'public' as const }
                      : en)
                    save(updated)
                  }}
                  className="text-[9px] font-semibold px-2 py-0.5 rounded border w-fit transition-colors"
                  style={entry.visibility === 'public'
                    ? { background: 'rgba(72,187,154,0.12)', borderColor: 'rgba(72,187,154,0.3)', color: '#48bb9a' }
                    : { background: 'transparent', borderColor: '#2a2a2e', color: '#52525b' }
                  }
                >
                  {entry.visibility === 'public' ? 'Public' : 'Private'}
                </button>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-zinc-600 truncate">{entry.tools || '—'}</span>
                  <button
                    onClick={e => { e.stopPropagation(); save(entries.filter(en => en.id !== entry.id)) }}
                    className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 shrink-0 transition-all"
                  >✕</button>
                </div>
              </div>
              {expand === entry.id && (entry.notes || entry.link) && (
                <div className="px-4 pb-3 flex gap-6 border-t border-[#1a1a1d]" style={{ background: 'rgba(98,114,243,0.04)' }}>
                  {entry.notes && (
                    <div className="pt-3">
                      <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Notes</p>
                      <p className="text-xs text-zinc-400 leading-relaxed">{entry.notes}</p>
                    </div>
                  )}
                  {entry.link && (
                    <div className="pt-3">
                      <p className="text-[9px] text-zinc-600 uppercase tracking-widest mb-1">Link</p>
                      <a href={entry.link} target="_blank" rel="noreferrer" className="text-xs text-[#6272f3] hover:underline">{entry.link}</a>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GenericLog({ type }: { type: 'reference' }) {
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
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Logs</p>
        <h1 className="text-xl font-semibold text-white">{config.title}</h1>
      </div>

      <div className="rounded border border-[#1e1e21] bg-[#111113] p-4 mb-6">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder={config.placeholder}
          rows={3}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addEntry() }}
          className="w-full bg-transparent text-sm text-white placeholder-zinc-600 resize-none focus:outline-none leading-relaxed mb-3"
        />
        <div className="flex items-center gap-3">
          <input
            value={tag}
            onChange={e => setTag(e.target.value)}
            placeholder="Tag (optional)"
            className="text-xs text-white placeholder-zinc-600 bg-transparent border border-[#2a2a2e] rounded px-3 py-1.5 focus:border-[#6272f3]/40 w-36 transition-colors"
          />
          <span className="text-[10px] text-zinc-600 flex-1">⌘ + Enter</span>
          <button
            onClick={addEntry}
            disabled={!draft.trim()}
            className="px-4 py-1.5 rounded bg-[#6272f3] hover:bg-[#7280f5] text-white text-xs font-medium disabled:opacity-30 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {entries.length > 0 && (
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full text-xs text-white placeholder-zinc-600 border border-[#1e1e21] rounded px-4 py-2 bg-[#111113] mb-4"
        />
      )}

      <div className="space-y-px">
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-600 text-sm">{search ? 'No entries match.' : 'No entries yet.'}</p>
          </div>
        )}
        {filtered.map(entry => (
          <div
            key={entry.id}
            className="group flex gap-3 px-4 py-3 border border-[#1a1a1d] rounded bg-[#111113] hover:border-[#2a2a2e] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{entry.text}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-zinc-600 font-mono">
                  {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                {entry.tag && (
                  <span className="text-[9px] font-medium px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/8">
                    {entry.tag}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => save(entries.filter(e => e.id !== entry.id))} className="text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 text-xs shrink-0 transition-all">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LogsPage({ type }: { type: LogType }) {
  if (type === 'inventory') return <InventoryLog />
  if (type === 'practice') return <PracticeLog />
  if (type === 'archive') return <ArchiveLog />
  return <GenericLog type={type} />
}
