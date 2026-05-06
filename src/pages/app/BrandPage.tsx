import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'

type Track = 'diy' | 'hire' | 'ai'

const TAGLINE_BANK = [
  'Cinematic storytelling for brands that move people.',
  'Where vision meets execution — frame by frame.',
  'Capturing the moments that define your story.',
  'Professional production. Personal touch.',
  'From concept to screen, built around you.',
  'Sound, vision, and everything in between.',
  'Premium creative for clients who expect more.',
  'Turning briefs into breakthroughs.',
]

const BIO_TEMPLATES = [
  (name: string, loc: string, yrs: number, specs: string[]) =>
    `${name} is a ${loc ? loc + '-based ' : ''}creative producer with ${yrs > 0 ? `${yrs} years of` : ''} experience in ${specs.slice(0, 3).join(', ')}. Known for a meticulous eye for detail and a commitment to storytelling that resonates, ${name.split(' ')[0]} works directly with clients from concept through delivery — ensuring every project reflects the vision it was meant to carry.`,
  (name: string, loc: string, yrs: number, specs: string[]) =>
    `Based ${loc ? `in ${loc}` : 'wherever the work takes them'}, ${name} brings ${yrs > 0 ? `${yrs}+ years of` : 'deep'} expertise in ${specs.slice(0, 2).join(' and ')} to every project. Whether it's a wedding film, brand campaign, or original score, the goal is always the same: work that outlasts the moment.`,
]

const PALETTE_SETS = [
  { name: 'Midnight Studio', colors: ['#0c0c0e', '#1a1a1d', '#6272f3', '#a5b4fc'] },
  { name: 'Cinematic Rust', colors: ['#0f0a08', '#1e1410', '#e85d4a', '#fca090'] },
  { name: 'Emerald Lab', colors: ['#080f0c', '#0f1e18', '#48bb9a', '#9ae0c8'] },
  { name: 'Amber Grain', colors: ['#0f0c07', '#1e1a0e', '#f59e0b', '#fcd47a'] },
  { name: 'Violet Noir', colors: ['#0a080f', '#18141e', '#a855f7', '#d8b4fe'] },
  { name: 'Slate Chrome', colors: ['#0a0c10', '#14181f', '#64748b', '#cbd5e1'] },
]

export function BrandPage() {
  const { state, updateProducerProfile } = useApp()
  const navigate = useNavigate()
  const profile = state.producerProfile

  const [track, setTrack] = useState<Track>('diy')
  const [aiMode, setAiMode] = useState<'bio' | 'tagline' | 'palette'>('bio')
  const [aiInput, setAiInput] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [generating, setGenerating] = useState(false)
  const [appliedPalette, setAppliedPalette] = useState<string | null>(null)

  function handleGenerate() {
    setGenerating(true)
    setAiResult('')
    setTimeout(() => {
      if (aiMode === 'bio') {
        const template = BIO_TEMPLATES[Math.floor(Math.random() * BIO_TEMPLATES.length)]
        setAiResult(template(
          profile.displayName || 'Your Name',
          profile.location || '',
          profile.yearsExperience || 0,
          profile.specialties.length > 0 ? profile.specialties : ['film production', 'creative direction'],
        ))
      } else if (aiMode === 'tagline') {
        const picks = [...TAGLINE_BANK].sort(() => Math.random() - 0.5).slice(0, 3)
        setAiResult(picks.join('\n'))
      }
      setGenerating(false)
    }, 1100)
  }

  function applyBio() {
    updateProducerProfile({ ...profile, bio: aiResult })
    setAiResult('')
  }

  function applyTagline(line: string) {
    updateProducerProfile({ ...profile, tagline: line })
  }

  function applyColor(color: string, paletteName: string) {
    updateProducerProfile({ ...profile, avatarColor: color })
    setAppliedPalette(paletteName)
  }

  const profileComplete = !!(profile.displayName && profile.bio && profile.tagline && profile.handle)
  const profileScore = [
    profile.displayName, profile.bio, profile.tagline, profile.handle,
    profile.location, profile.specialties.length > 0, profile.websiteUrl,
    profile.instagramUrl || profile.youtubeUrl,
  ].filter(Boolean).length

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Brand Studio</h1>
        <p className="text-xs text-slate-500 mt-0.5">Build, delegate, or generate your public presence</p>
      </div>

      {/* Profile completeness */}
      <div className="rounded-xl border border-white/8 p-4 mb-6" style={{ background: '#141416' }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-300">Profile Strength</p>
          <span className="text-xs font-mono text-slate-400">{profileScore}/8</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1a1a1d' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(profileScore / 8) * 100}%`,
              background: profileScore >= 7 ? '#48bb9a' : profileScore >= 4 ? '#6272f3' : '#e85d4a',
            }}
          />
        </div>
        {!profileComplete && (
          <p className="text-[10px] text-slate-600 mt-2">
            Missing: {[
              !profile.displayName && 'display name',
              !profile.bio && 'bio',
              !profile.tagline && 'tagline',
              !profile.handle && 'handle',
            ].filter(Boolean).join(', ')}
          </p>
        )}
      </div>

      {/* Track selector */}
      <div className="flex gap-1 p-1 rounded-xl mb-6 w-fit" style={{ background: '#1a1a1d' }}>
        {([
          { id: 'diy', label: 'DIY', icon: '⊡' },
          { id: 'hire', label: 'Hire', icon: '◎' },
          { id: 'ai', label: 'AI Studio', icon: '◈' },
        ] as { id: Track; label: string; icon: string }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTrack(t.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all"
            style={track === t.id
              ? { background: '#6272f3', color: '#fff' }
              : { color: '#94a3b8' }
            }
          >
            <span className="text-[11px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* DIY Track */}
      {track === 'diy' && (
        <div className="space-y-3">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-4">Self-serve brand tools</p>
          {[
            { label: 'Public Profile', sub: 'Handle, bio, specialties, avatar, social links', icon: '◉', path: '/app/profile', done: !!(profile.displayName && profile.bio) },
            { label: 'Portfolio & Feed', sub: 'Showcase finished work, victories, and methods', icon: '⊡', path: '/app/portfolio', done: state.feedPosts.filter(p => p.isPublished).length > 0 },
            { label: 'Pricing Packages', sub: 'Create packages clients can browse and book', icon: '$', path: '/app/packages', done: state.pricingPackages.length > 0 },
            { label: 'Messages', sub: 'Manage encrypted client conversations', icon: '✉', path: '/app/messages', done: state.messageThreads.length > 0 },
          ].map(item => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-4 rounded-xl border border-white/8 p-4 text-left hover:border-white/20 transition-colors group"
              style={{ background: '#141416' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                style={{ background: 'rgba(98,114,243,0.15)' }}
              >
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white group-hover:text-brand-300 transition-colors">{item.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.done
                  ? <span className="text-[9px] text-emerald-400 font-medium">● Done</span>
                  : <span className="text-[9px] text-slate-600">○ Empty</span>
                }
                <span className="text-slate-600 group-hover:text-slate-300 transition-colors">→</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Hire Track */}
      {track === 'hire' && (
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-4">Connect with brand creatives</p>
          <div className="rounded-xl border border-white/8 p-8 text-center" style={{ background: '#141416' }}>
            <p className="text-3xl mb-3 opacity-30">◎</p>
            <p className="text-sm font-semibold text-white mb-1">Brand Specialist Marketplace</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              Connect with designers, copywriters, and brand strategists who specialize in creative professionals. Post a brief and get matched.
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6 text-left">
              {[
                { icon: '◈', title: 'Logo & Identity', desc: 'Visual brand mark, color system, typography' },
                { icon: '⊡', title: 'Bio & Copy', desc: 'Professional bio, tagline, pitch writing' },
                { icon: '◉', title: 'Full Brand Kit', desc: 'End-to-end identity, portfolio, social presence' },
              ].map(s => (
                <div key={s.title} className="rounded-lg border border-white/8 p-3" style={{ background: '#1a1a1d' }}>
                  <p className="text-base mb-2 opacity-40">{s.icon}</p>
                  <p className="text-xs font-semibold text-slate-300 mb-1">{s.title}</p>
                  <p className="text-[10px] text-slate-600">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-xs text-slate-500" style={{ background: '#1a1a1d' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Launching soon — join the waitlist
            </div>
          </div>
        </div>
      )}

      {/* AI Studio Track */}
      {track === 'ai' && (
        <div>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-4">AI-powered brand generation</p>

          {/* Mode tabs */}
          <div className="flex gap-1 p-1 rounded-lg mb-5 w-fit" style={{ background: '#1a1a1d' }}>
            {([
              { id: 'bio', label: 'Bio Writer' },
              { id: 'tagline', label: 'Tagline' },
              { id: 'palette', label: 'Color Palette' },
            ] as { id: 'bio' | 'tagline' | 'palette'; label: string }[]).map(m => (
              <button
                key={m.id}
                onClick={() => { setAiMode(m.id); setAiResult('') }}
                className="px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
                style={aiMode === m.id ? { background: '#333', color: '#fff' } : { color: '#64748b' }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {aiMode === 'bio' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/8 p-4" style={{ background: '#141416' }}>
                <p className="text-xs text-slate-400 mb-3">Generating from your profile: <span className="text-brand-400">{profile.displayName || 'unnamed'}</span> · {profile.specialties.slice(0, 2).join(', ') || 'no specialties set'} · {profile.location || 'no location'}</p>
                <Textarea
                  label="Additional context (optional)"
                  placeholder="e.g. I focus on faith-based orgs and indie artists, been shooting since 2019..."
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                  rows={2}
                />
              </div>
              <Button size="sm" onClick={handleGenerate} disabled={generating}>
                {generating ? '◈ Generating...' : '◈ Generate Bio'}
              </Button>
              {aiResult && (
                <div className="rounded-xl border border-brand-500/25 p-4" style={{ background: 'rgba(98,114,243,0.06)' }}>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap mb-3">{aiResult}</p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={applyBio}>Apply to Profile</Button>
                    <Button variant="outline" size="sm" onClick={handleGenerate}>Regenerate</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {aiMode === 'tagline' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/8 p-4" style={{ background: '#141416' }}>
                <p className="text-xs text-slate-400 mb-3">Generating taglines for: <span className="text-brand-400">{profile.specialties.slice(0, 2).join(', ') || 'your creative work'}</span></p>
                <Input
                  label="Your style or vibe (optional)"
                  placeholder="e.g. cinematic, intimate, bold, minimal..."
                  value={aiInput}
                  onChange={e => setAiInput(e.target.value)}
                />
              </div>
              <Button size="sm" onClick={handleGenerate} disabled={generating}>
                {generating ? '◈ Generating...' : '◈ Generate Taglines'}
              </Button>
              {aiResult && (
                <div className="rounded-xl border border-brand-500/25 p-4 space-y-2" style={{ background: 'rgba(98,114,243,0.06)' }}>
                  <p className="text-[10px] text-slate-500 mb-3">Click a tagline to apply it to your profile</p>
                  {aiResult.split('\n').map((line, i) => (
                    <button
                      key={i}
                      onClick={() => applyTagline(line)}
                      className="w-full text-left text-xs text-slate-300 px-3 py-2 rounded-lg border border-white/8 hover:border-brand-500/40 hover:text-white transition-all"
                      style={{ background: '#1a1a1d' }}
                    >
                      "{line}"
                    </button>
                  ))}
                  <Button variant="outline" size="sm" onClick={handleGenerate}>More options</Button>
                </div>
              )}
            </div>
          )}

          {aiMode === 'palette' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-4">Choose a palette that fits your brand. Your current avatar color updates immediately.</p>
              {PALETTE_SETS.map(palette => (
                <div
                  key={palette.name}
                  className="rounded-xl border border-white/8 p-4 flex items-center gap-4"
                  style={{ background: '#141416' }}
                >
                  <div className="flex gap-1 shrink-0">
                    {palette.colors.map(c => (
                      <div key={c} className="w-8 h-8 rounded-lg" style={{ background: c, border: '1px solid rgba(255,255,255,0.1)' }} />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-300">{palette.name}</p>
                    {appliedPalette === palette.name && (
                      <p className="text-[10px] text-emerald-400 mt-0.5">✓ Applied</p>
                    )}
                  </div>
                  <button
                    onClick={() => applyColor(palette.colors[2], palette.name)}
                    className="text-xs text-brand-400 hover:text-brand-300 shrink-0 transition-colors"
                  >
                    Apply →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
