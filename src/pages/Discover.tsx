import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../context/AppContext'

const SPECIALTY_FILTERS = ['All', 'Videography', 'Photography', 'Film Direction', 'Music Production', 'Color Grading', 'Commercial', 'Wedding', 'Worship']

export function Discover() {
  const { state } = useApp()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  const profile = state.producerProfile
  const packages = state.pricingPackages.filter(p => p.isActive)
  const posts = state.feedPosts.filter(p => p.isPublished && p.clientApproved).slice(0, 3)

  const isVisible = profile.isPublic && profile.displayName
  const matchesFilter = filter === 'All' || profile.specialties.includes(filter)
  const matchesSearch = !search || profile.displayName.toLowerCase().includes(search.toLowerCase()) || profile.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))
  const matchesLocation = !location || (profile.location || '').toLowerCase().includes(location.toLowerCase())

  const showProfile = isVisible && matchesFilter && matchesSearch && matchesLocation

  return (
    <div className="min-h-screen" style={{ background: '#0c0c0e' }}>
      {/* Nav */}
      <nav className="sticky top-0 z-10 border-b border-white/6 px-6 py-3 flex items-center justify-between" style={{ background: 'rgba(12,12,14,0.92)', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center text-white text-xs font-black">IX</div>
          <span className="text-xs font-semibold text-white">Interdisciplinary</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/community" className="text-xs text-slate-400 hover:text-white transition-colors">Community</Link>
          <Link to="/app" className="text-xs text-white px-3 py-1.5 rounded-lg" style={{ background: '#6272f3' }}>Studio</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Marketplace</span>
          <h1 className="text-3xl font-bold text-white mt-2 mb-2">Find Your Producer</h1>
          <p className="text-sm text-slate-400">Browse film and music professionals. View portfolios, pricing, and book directly.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or specialty..."
              className="text-xs text-white placeholder-slate-600 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-500/60 w-full sm:w-72"
              style={{ background: '#141416' }}
            />
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Filter by location (city, state)..."
              className="text-xs text-white placeholder-slate-600 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-brand-500/60 w-full sm:w-60"
              style={{ background: '#141416' }}
            />
            {location && (
              <button
                onClick={() => setLocation('')}
                className="text-[10px] text-slate-500 hover:text-white px-3 py-2 border border-white/8 rounded-lg transition-colors shrink-0"
                style={{ background: '#141416' }}
              >
                Clear location
              </button>
            )}
          </div>
          <div className="flex gap-1 p-1 rounded-lg overflow-x-auto" style={{ background: '#1a1a1d' }}>
            {SPECIALTY_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={clsx('px-2.5 py-1 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors shrink-0', filter === f ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white')}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Producer cards */}
        {!showProfile ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4 text-slate-700">◈</p>
            <p className="text-slate-500 text-sm mb-2">
              {!isVisible ? 'No producers are publicly listed yet.' : 'No producers match your search.'}
            </p>
            <p className="text-xs text-slate-600">
              {!isVisible && (
                <>Are you a producer? <Link to="/app/profile" className="text-brand-400">Set up your public profile →</Link></>
              )}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ProducerCard
              profile={profile}
              packages={packages}
              posts={posts}
            />
          </div>
        )}

        {/* How hiring works */}
        <div className="mt-16 rounded-2xl border border-white/8 p-8" style={{ background: '#111113' }}>
          <h2 className="text-lg font-bold text-white mb-6 text-center">How hiring works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Browse', desc: 'Find a producer whose style and pricing match your project.' },
              { step: '2', title: 'Review', desc: 'View their portfolio, gear list, and pricing packages.' },
              { step: '3', title: 'Book', desc: 'Contact them directly or via their linked booking tool.' },
              { step: '4', title: 'Track', desc: 'Get access to your private portal to follow the project.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-8 h-8 rounded-full mx-auto mb-3 flex items-center justify-center text-xs font-black text-white" style={{ background: 'rgba(98,114,243,0.3)', border: '1px solid rgba(98,114,243,0.4)' }}>
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

function ProducerCard({ profile, packages, posts }: { profile: any; packages: any[]; posts: any[] }) {
  const lowestPrice = packages.length > 0 ? Math.min(...packages.map((p: any) => p.price)) : null
  const lowestPkg = packages.find((p: any) => p.price === lowestPrice)

  return (
    <Link to={`/p/${profile.handle || 'profile'}`} className="group block">
      <div
        className="rounded-2xl border border-white/8 overflow-hidden transition-all duration-200 group-hover:border-white/20"
        style={{ background: '#141416' }}
      >
        {/* Cover / avatar */}
        <div className="relative h-20" style={{ background: 'linear-gradient(135deg, rgba(98,114,243,0.3), rgba(72,187,154,0.15))' }}>
          <div
            className="absolute bottom-0 left-4 translate-y-1/2 w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white border-2 border-white/10"
            style={{ background: profile.avatarColor || '#6272f3' }}
          >
            {(profile.displayName || 'P').charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="pt-8 px-4 pb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-bold text-white">{profile.displayName}</p>
              {profile.handle && <p className="text-[10px] text-slate-600 font-mono">@{profile.handle}</p>}
            </div>
            {lowestPrice !== null && (
              <div className="text-right">
                <p className="text-[10px] text-slate-600">{lowestPkg?.priceType ?? 'Starting at'}</p>
                <p className="text-xs font-bold" style={{ color: '#f59e0b' }}>${lowestPrice.toLocaleString()}</p>
              </div>
            )}
          </div>

          {profile.tagline && <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">{profile.tagline}</p>}

          {profile.location && (
            <p className="text-[10px] text-slate-600 mb-2 font-mono">/ {profile.location}</p>
          )}

          {/* Specialties */}
          <div className="flex flex-wrap gap-1 mb-3">
            {profile.specialties.slice(0, 4).map((s: string) => (
              <span key={s} className="px-2 py-0.5 rounded-full text-[9px] border border-white/10 text-slate-400" style={{ background: '#1a1a1d' }}>
                {s}
              </span>
            ))}
          </div>

          {/* Portfolio thumbnails */}
          {posts.length > 0 && (
            <div className="grid grid-cols-3 gap-1 mb-3">
              {posts.map((p: any) => (
                <div key={p.id} className="aspect-video rounded-lg flex items-center justify-center" style={{ background: 'rgba(98,114,243,0.15)' }}>
                  <span className="text-[8px] text-slate-700">{p.category}</span>
                </div>
              ))}
            </div>
          )}

          <div
            className="w-full py-2 rounded-xl text-[10px] font-bold text-center text-white transition-opacity group-hover:opacity-90 mt-1"
            style={{ background: 'rgba(98,114,243,0.25)', border: '1px solid rgba(98,114,243,0.35)' }}
          >
            View Profile & Book →
          </div>
        </div>
      </div>
    </Link>
  )
}
