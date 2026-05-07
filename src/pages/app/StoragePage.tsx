import { useState } from 'react'

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    storage: 5,
    storageLabel: '5 GB',
    features: [
      'Script & score file exports',
      'Storyboard panels',
      'Project attachments',
      'Community posts',
    ],
    color: '#52525b',
    cta: 'Current plan',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    storage: 100,
    storageLabel: '100 GB',
    features: [
      'Everything in Free',
      'High-res portfolio media',
      'Client deliverable uploads',
      'Audio & video file storage',
      'Version history (30 days)',
    ],
    color: '#6272f3',
    cta: 'Upgrade to Pro',
  },
  {
    id: 'studio',
    name: 'Studio',
    price: 29,
    storage: 1000,
    storageLabel: '1 TB',
    features: [
      'Everything in Pro',
      'Full project archive backups',
      'Raw footage & session files',
      'Team member access',
      'Version history (1 year)',
      'Priority upload speeds',
    ],
    color: '#06b6d4',
    cta: 'Upgrade to Studio',
  },
]

const STORAGE_KEY = 'storage_tier'

function bytesToGB(bytes: number) {
  return (bytes / 1e9).toFixed(2)
}

export function StoragePage() {
  const [currentTier, setCurrentTier] = useState<string>(() =>
    localStorage.getItem(STORAGE_KEY) || 'free'
  )
  const [confirming, setConfirming] = useState<string | null>(null)

  const tier = TIERS.find(t => t.id === currentTier) ?? TIERS[0]

  // Mock usage — stored in localStorage as bytes
  const usedBytes = parseInt(localStorage.getItem('storage_used_bytes') || '0')
  const usedGB = parseFloat(bytesToGB(usedBytes))
  const totalGB = tier.storage
  const usedPct = Math.min((usedGB / totalGB) * 100, 100)

  function selectTier(id: string) {
    setCurrentTier(id)
    localStorage.setItem(STORAGE_KEY, id)
    setConfirming(null)
  }

  return (
    <div className="min-h-full p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Settings</p>
        <h1 className="text-xl font-semibold text-white">Cloud Storage</h1>
        <p className="text-xs text-zinc-600 mt-0.5">Store scripts, scores, storyboards, client deliverables, and project archives.</p>
      </div>

      {/* Current usage */}
      <div className="rounded border border-[#1e1e21] bg-[#111113] p-5 mb-8">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-medium text-white mb-0.5">Storage usage</p>
            <p className="text-[10px] text-zinc-500 font-mono">
              {usedGB.toFixed(2)} GB used of {tier.storageLabel}
            </p>
          </div>
          <span
            className="text-[10px] font-semibold px-2.5 py-1 rounded border"
            style={{ background: tier.color + '15', borderColor: tier.color + '35', color: tier.color }}
          >
            {tier.name} plan
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full bg-[#1e1e21] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${usedPct}%`,
              background: usedPct > 85 ? '#e85d4a' : tier.color,
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] font-mono text-zinc-600">{usedPct.toFixed(1)}% used</span>
          <span className="text-[9px] font-mono text-zinc-600">{tier.storageLabel} total</span>
        </div>
      </div>

      {/* Tier cards */}
      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4">Plans</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {TIERS.map(t => {
          const isCurrent = t.id === currentTier
          return (
            <div
              key={t.id}
              className="rounded border flex flex-col"
              style={{
                background: '#111113',
                borderColor: isCurrent ? t.color + '50' : '#1e1e21',
              }}
            >
              {/* Top accent */}
              <div className="h-0.5 rounded-t" style={{ background: isCurrent ? t.color : 'transparent' }} />

              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">{t.storageLabel}</p>
                  </div>
                  <div className="text-right">
                    {t.price === 0 ? (
                      <p className="text-sm font-bold text-zinc-400">Free</p>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-white">${t.price}</p>
                        <p className="text-[9px] text-zinc-600">/month</p>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 flex-1 mb-5">
                  {t.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-[11px] text-zinc-400">
                      <span style={{ color: t.color }} className="mt-px shrink-0">—</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {isCurrent ? (
                  <div
                    className="w-full py-2 rounded text-center text-[10px] font-medium border"
                    style={{ background: t.color + '12', borderColor: t.color + '30', color: t.color }}
                  >
                    Current plan
                  </div>
                ) : confirming === t.id ? (
                  <div className="space-y-2">
                    <p className="text-[10px] text-zinc-500 text-center">Switch to {t.name}?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirming(null)}
                        className="flex-1 py-1.5 rounded text-[10px] border border-[#2a2a2e] text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => selectTier(t.id)}
                        className="flex-1 py-1.5 rounded text-[10px] font-medium text-white transition-colors"
                        style={{ background: t.color }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirming(t.id)}
                    className="w-full py-2 rounded text-[10px] font-medium text-white transition-colors hover:opacity-90"
                    style={{ background: t.color + 'cc' }}
                  >
                    {t.cta}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* What gets stored */}
      <div className="rounded border border-[#1e1e21] bg-[#111113] p-5">
        <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4">What uses storage</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: 'Scripts & screenplays', note: 'PDF, DOCX, .fountain', size: 'Small' },
            { label: 'Score exports', note: 'PDF, MusicXML, SVG', size: 'Small' },
            { label: 'Storyboard panels', note: 'Images per panel', size: 'Medium' },
            { label: 'Client deliverables', note: 'Uploaded files', size: 'Large' },
            { label: 'Portfolio media', note: 'Photos, video links', size: 'Medium' },
            { label: 'Project archives', note: 'Full project backups', size: 'Large' },
          ].map(item => (
            <div key={item.label} className="rounded border border-[#1a1a1d] px-3 py-2.5 bg-[#0e0e10]">
              <p className="text-xs text-zinc-300 font-medium mb-0.5">{item.label}</p>
              <p className="text-[10px] text-zinc-600">{item.note}</p>
              <p
                className="text-[9px] font-mono mt-1"
                style={{ color: item.size === 'Small' ? '#48bb9a' : item.size === 'Medium' ? '#f59e0b' : '#e85d4a' }}
              >
                {item.size}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
