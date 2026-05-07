import { useState, useEffect } from 'react'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Input, Textarea, Toggle } from '../../components/ui/Input'
import { SPECIALTIES } from '../../types'

const AVATAR_COLORS = ['#6272f3', '#48bb9a', '#e85d4a', '#f59e0b', '#a855f7', '#06b6d4', '#ec4899', '#84cc16']

export function ProfilePage() {
  const { state, updateProducerProfile } = useApp()
  const [form, setForm] = useState({ ...state.producerProfile })
  const [saved, setSaved] = useState(false)

  useEffect(() => { setForm({ ...state.producerProfile }) }, [state.producerProfile])

  function handleSave() {
    updateProducerProfile(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleSpecialty(s: string) {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(s) ? f.specialties.filter(x => x !== s) : [...f.specialties, s],
    }))
  }

  const handle = form.handle || form.displayName.toLowerCase().replace(/\s+/g, '')
  const profileUrl = `${window.location.origin}/p/${handle}`

  return (
    <div className="p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Public Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">Your producer profile visible on Discover and your public page</p>
        </div>
        <div className="flex items-center gap-2">
          {form.isPublic && handle && (
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-400 hover:text-brand-300">
              Preview →
            </a>
          )}
          <Button size="sm" onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Profile'}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Visibility */}
        <div className="rounded-xl border border-white/8 p-4" style={{ background: '#141416' }}>
          <Toggle
            label="Make profile public"
            description="Show your profile on Discover and allow clients to view your public page"
            checked={form.isPublic}
            onChange={v => setForm(f => ({ ...f, isPublic: v }))}
          />
          {form.isPublic && handle && (
            <div className="mt-3 flex items-center gap-2 bg-white/4 rounded-lg px-3 py-2 border border-white/8">
              <span className="text-xs text-slate-500">Your page:</span>
              <code className="text-xs text-brand-400 font-mono flex-1 truncate">{profileUrl}</code>
              <button
                onClick={() => navigator.clipboard.writeText(profileUrl)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                Copy
              </button>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="rounded-xl border border-white/8 p-4 space-y-4" style={{ background: '#141416' }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Profile Picture</p>
          <div className="flex items-center gap-4">
            {/* Preview */}
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt="avatar preview"
                className="w-14 h-14 rounded-xl object-cover border-2 border-white/20 shrink-0"
                style={{ objectPosition: 'top center' }}
                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
            ) : (
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black text-white shrink-0"
                style={{ background: form.avatarColor }}
              >
                {(form.displayName || 'P').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 space-y-2">
              <Input
                label="Photo URL"
                placeholder="https://... (paste a direct image link)"
                value={(form as any).avatarUrl || ''}
                onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
              />
              <p className="text-[10px] text-slate-600">Or choose an avatar color:</p>
              <div className="flex flex-wrap gap-2">
                {AVATAR_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm(f => ({ ...f, avatarColor: c, avatarUrl: '' }))}
                    className="w-6 h-6 rounded-lg border-2 transition-all"
                    style={{
                      background: c,
                      borderColor: !form.avatarUrl && form.avatarColor === c ? 'white' : 'transparent',
                      transform: !form.avatarUrl && form.avatarColor === c ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="rounded-xl border border-white/8 p-4 space-y-4" style={{ background: '#141416' }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Basic Info</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Display Name"
              placeholder="Your full name or brand"
              value={form.displayName}
              onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
            />
            <Input
              label="Handle (@username)"
              placeholder="yourhandle"
              value={form.handle}
              onChange={e => setForm(f => ({ ...f, handle: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))}
            />
          </div>
          <Input
            label="Tagline"
            placeholder="e.g. Cinematic storytelling for brands and churches"
            value={form.tagline}
            onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
          />
          <Textarea
            label="Bio"
            placeholder="Tell potential clients who you are and what you do..."
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={4}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Location"
              placeholder="City, State"
              value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            />
            <Input
              label="Years of Experience"
              type="number"
              value={form.yearsExperience || ''}
              onChange={e => setForm(f => ({ ...f, yearsExperience: Number(e.target.value) }))}
            />
          </div>
        </div>

        {/* Specialties */}
        <div className="rounded-xl border border-white/8 p-4" style={{ background: '#141416' }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Specialties</p>
          <div className="flex flex-wrap gap-2">
            {SPECIALTIES.map(s => (
              <button
                key={s}
                onClick={() => toggleSpecialty(s)}
                className="px-3 py-1.5 rounded-lg text-xs border transition-all"
                style={{
                  background: form.specialties.includes(s) ? 'rgba(98,114,243,0.2)' : 'rgba(255,255,255,0.04)',
                  borderColor: form.specialties.includes(s) ? 'rgba(98,114,243,0.5)' : 'rgba(255,255,255,0.1)',
                  color: form.specialties.includes(s) ? '#a5b4fc' : '#94a3b8',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Links */}
        <div className="rounded-xl border border-white/8 p-4 space-y-4" style={{ background: '#141416' }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rates & Links</p>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Starting Rate ($)"
              type="number"
              placeholder="850"
              value={form.startingRate || ''}
              onChange={e => setForm(f => ({ ...f, startingRate: Number(e.target.value) }))}
            />
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Rate Type</label>
              <select
                value={form.rateType}
                onChange={e => setForm(f => ({ ...f, rateType: e.target.value as any }))}
                className="w-full text-xs text-white bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:border-brand-500/60"
                style={{ background: '#1a1a1d' }}
              >
                {['Starting At', 'Per Hour', 'Per Project'].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <Input
            label="Website / Booking Link"
            placeholder="https://yourwebsite.com or Honeybook link"
            value={form.websiteUrl}
            onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Instagram URL"
              placeholder="https://instagram.com/you"
              value={form.instagramUrl}
              onChange={e => setForm(f => ({ ...f, instagramUrl: e.target.value }))}
            />
            <Input
              label="YouTube URL"
              placeholder="https://youtube.com/@you"
              value={form.youtubeUrl}
              onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
