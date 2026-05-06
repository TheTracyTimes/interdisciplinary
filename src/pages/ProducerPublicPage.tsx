import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { FeedPostType } from '../types'

const TYPE_COLOR: Record<FeedPostType, string> = {
  Portfolio: '#6272f3', Victory: '#f59e0b', Method: '#48bb9a', 'Behind the Scenes': '#e85d4a',
}

const COND_COLOR: Record<string, string> = {
  Good: '#48bb9a', 'Needs Repair': '#f59e0b', 'Replace Soon': '#e85d4a',
}

export function ProducerPublicPage() {
  const { state } = useApp()
  const profile = state.producerProfile
  const posts = state.feedPosts.filter(p => p.isPublished && p.clientApproved)
  const packages = state.pricingPackages.filter(p => p.isActive)
  const equipment = state.equipment.filter(e => e.owned)

  if (!profile.isPublic || !profile.displayName) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#0c0c0e' }}>
        <p className="text-4xl mb-4 text-slate-600">◈</p>
        <p className="text-white font-semibold mb-1">Profile not public</p>
        <p className="text-sm text-slate-500 mb-4">This producer hasn't made their profile public yet.</p>
        <Link to="/discover" className="text-xs text-brand-400 hover:text-brand-300">← Back to Discover</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0c0c0e' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-white/6 px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(12,12,14,0.92)', backdropFilter: 'blur(12px)' }}>
        <Link to="/discover" className="text-xs text-slate-400 hover:text-white transition-colors">← Discover</Link>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-[9px] font-black">IX</div>
          <span className="text-xs text-slate-500">Interdisciplinary</span>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative">
        <div className="h-40 w-full" style={{ background: `linear-gradient(135deg, ${profile.avatarColor || '#6272f3'}30, rgba(72,187,154,0.15))` }} />
        <div className="absolute bottom-0 left-6 translate-y-1/2">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black text-white border-4"
            style={{ background: profile.avatarColor || '#6272f3', borderColor: '#0c0c0e' }}
          >
            {(profile.displayName || 'P').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        {/* Profile info */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">{profile.displayName}</h1>
            {profile.handle && <p className="text-sm text-slate-500 font-mono">@{profile.handle}</p>}
            {profile.tagline && <p className="text-sm text-slate-400 mt-1 italic">"{profile.tagline}"</p>}
            <div className="flex items-center gap-4 mt-2">
              {profile.location && <span className="text-xs text-slate-500">📍 {profile.location}</span>}
              {profile.yearsExperience > 0 && <span className="text-xs text-slate-500">{profile.yearsExperience} yrs experience</span>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            {profile.instagramUrl && (
              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors" style={{ background: '#141416' }}>
                Instagram
              </a>
            )}
            {profile.websiteUrl && (
              <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-white px-3 py-1.5 rounded-lg transition-opacity hover:opacity-90" style={{ background: '#6272f3' }}>
                Website →
              </a>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-2xl">{profile.bio}</p>
        )}

        {/* Specialties */}
        {profile.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {profile.specialties.map(s => (
              <span key={s} className="px-3 py-1 rounded-full text-xs border border-white/10 text-slate-300" style={{ background: '#1a1a1d' }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio */}
            {posts.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Portfolio</h2>
                <div className="space-y-4">
                  {posts.map(post => (
                    <div key={post.id} className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#141416' }}>
                      {post.mediaUrl && (
                        <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer">
                          <div className="w-full aspect-video flex items-center justify-center border-b border-white/6 hover:bg-white/4 transition-colors" style={{ background: '#111113' }}>
                            <div className="text-center">
                              <p className="text-3xl opacity-20 mb-1">▶</p>
                              <p className="text-xs text-slate-600">View →</p>
                            </div>
                          </div>
                        </a>
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider" style={{ background: TYPE_COLOR[post.type] + '25', color: TYPE_COLOR[post.type] }}>{post.type}</span>
                          <span className="text-[10px] text-slate-600">{post.category}</span>
                          {post.clientApproved && <span className="text-[9px] text-emerald-400 ml-auto">✓ Client Approved</span>}
                        </div>
                        <h3 className="text-sm font-bold text-white mb-1">{post.title}</h3>
                        {post.body && <p className="text-xs text-slate-400 leading-relaxed">{post.body}</p>}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map(t => <span key={t} className="text-[9px] text-slate-600">#{t}</span>)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Equipment */}
            {state.equipmentPublic && equipment.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Gear</h2>
                <div className="space-y-1.5">
                  {equipment.map(e => (
                    <div key={e.id} className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-white/6" style={{ background: '#141416' }}>
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COND_COLOR[e.condition] ?? '#888' }} />
                      <span className="text-xs text-white">{e.item}</span>
                      <span className="ml-auto text-[10px] text-slate-600">{e.category}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar: Packages */}
          <div className="space-y-4">
            {packages.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Pricing</h2>
                <div className="space-y-3">
                  {packages.map(pkg => (
                    <div
                      key={pkg.id}
                      className="rounded-2xl border p-4"
                      style={{
                        background: pkg.popular ? 'rgba(98,114,243,0.08)' : '#141416',
                        borderColor: pkg.popular ? 'rgba(98,114,243,0.35)' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      {pkg.popular && (
                        <span className="text-[9px] font-bold text-brand-400 uppercase tracking-wider mb-2 block">Most Popular</span>
                      )}
                      <p className="text-sm font-bold text-white mb-0.5">{pkg.name}</p>
                      {pkg.tagline && <p className="text-[10px] text-slate-500 mb-2">{pkg.tagline}</p>}
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-2xl font-black text-white">${pkg.price.toLocaleString()}</span>
                        <span className="text-xs text-slate-500">{pkg.priceType}</span>
                      </div>
                      {pkg.deliveryTime && <p className="text-[10px] text-slate-600 mb-3">⏱ {pkg.deliveryTime}</p>}
                      {pkg.includes.length > 0 && (
                        <ul className="space-y-1.5 mb-4">
                          {pkg.includes.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="text-emerald-400">✓</span>{item}
                            </li>
                          ))}
                        </ul>
                      )}
                      {profile.websiteUrl ? (
                        <a
                          href={profile.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2 rounded-xl text-[10px] font-bold text-white text-center hover:opacity-90 transition-opacity"
                          style={{ background: pkg.popular ? '#6272f3' : 'rgba(98,114,243,0.2)', border: pkg.popular ? 'none' : '1px solid rgba(98,114,243,0.3)' }}
                        >
                          Book This Package →
                        </a>
                      ) : (
                        <div className="w-full py-2 rounded-xl text-[10px] font-bold text-slate-500 text-center border border-white/8">
                          Contact to Book
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {packages.length === 0 && (
              <div className="rounded-2xl border border-white/8 p-4 text-center" style={{ background: '#141416' }}>
                <p className="text-xs text-slate-500">Contact producer for pricing</p>
                {profile.websiteUrl && (
                  <a href={profile.websiteUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-brand-400 hover:text-brand-300">
                    Visit Website →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
