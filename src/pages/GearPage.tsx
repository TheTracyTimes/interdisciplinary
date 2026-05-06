import { useApp } from '../context/AppContext'

const COND_COLOR: Record<string, string> = {
  Good: '#48bb9a', 'Needs Repair': '#f59e0b', 'Replace Soon': '#e85d4a',
}

const CAT_ORDER = ['Camera', 'Audio', 'Lighting', 'Support', 'Computer', 'Other']

export function GearPage() {
  const { state } = useApp()

  if (!state.equipmentPublic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0c0c0e' }}>
        <p className="text-4xl mb-4 text-slate-600">⚙</p>
        <p className="text-white font-semibold mb-1">Gear list not public</p>
        <p className="text-sm text-slate-500">This producer hasn't made their gear list public yet.</p>
      </div>
    )
  }

  const owned = state.equipment.filter(e => e.owned)
  const grouped: Record<string, typeof owned> = {}
  owned.forEach(e => {
    if (!grouped[e.category]) grouped[e.category] = []
    grouped[e.category].push(e)
  })

  return (
    <div className="min-h-screen" style={{ background: '#0c0c0e' }}>
      <div
        className="sticky top-0 z-10 border-b border-white/6 px-6 py-3 flex items-center gap-3"
        style={{ background: '#111113' }}
      >
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">
          IX
        </div>
        <span className="text-xs font-semibold text-white">Equipment List</span>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-1">Gear</h1>
        <p className="text-sm text-slate-500 mb-8">{owned.length} items in kit</p>

        {owned.length === 0 ? (
          <p className="text-slate-600 text-sm">No gear listed.</p>
        ) : (
          <div className="space-y-6">
            {CAT_ORDER.map(cat => {
              const items = grouped[cat]
              if (!items?.length) return null
              return (
                <div key={cat}>
                  <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-2">{cat}</p>
                  <div className="space-y-1.5">
                    {items.map(e => (
                      <div
                        key={e.id}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/6"
                        style={{ background: '#141416' }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COND_COLOR[e.condition] ?? '#888' }} />
                        <p className="flex-1 text-sm text-white">{e.item}</p>
                        {e.notes && <p className="text-xs text-slate-600 truncate max-w-xs">{e.notes}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <p className="text-[10px] text-slate-700 text-center mt-12">
          Powered by Interdisciplinary
        </p>
      </div>
    </div>
  )
}
