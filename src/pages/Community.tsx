import { useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { useApp } from '../context/AppContext'
import type { FeedPost, FeedPostType } from '../types'

const TYPE_COLOR: Record<FeedPostType, string> = {
  Portfolio: '#6272f3',
  Victory: '#f59e0b',
  Method: '#48bb9a',
  'Behind the Scenes': '#e85d4a',
}

const CATEGORIES = ['All', 'Film', 'Music', 'Photography', 'Commercial', 'Wedding', 'Other']

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function Community() {
  const { state, toggleFeedLike, addFeedComment } = useApp()
  const [catFilter, setCatFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState<FeedPostType | 'All'>('All')
  const [commentingOn, setCommentingOn] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')

  const archivePublic = (() => {
    try {
      const all = JSON.parse(localStorage.getItem('log_archive') || '[]')
      return all.filter((e: any) => e.visibility === 'public').map((e: any) => ({
        id: 'archive_' + e.id,
        type: 'Portfolio' as FeedPostType,
        category: e.type === 'Film' ? 'Film' : e.type === 'Music' ? 'Music' : 'Other',
        title: e.title,
        body: [e.genre, e.duration, e.tools].filter(Boolean).join(' · ') + (e.notes ? `\n${e.notes}` : ''),
        isPublished: true,
        clientApproved: true,
        createdAt: e.addedAt,
        likes: 0,
        comments: [],
        _isArchive: true,
        _link: e.link,
        _completedDate: e.completedDate,
        _discipline: e.type,
      }))
    } catch { return [] }
  })()

  const posts = [
    ...state.feedPosts.filter(p => p.isPublished),
    ...archivePublic,
  ]
    .filter(p => catFilter === 'All' || p.category === catFilter)
    .filter(p => typeFilter === 'All' || p.type === typeFilter)
    .sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt))

  const profile = state.producerProfile

  function handleComment(postId: string) {
    if (!commentText.trim()) return
    addFeedComment(postId, {
      author: commentAuthor || 'Anonymous',
      body: commentText.trim(),
      timestamp: new Date().toISOString(),
    })
    setCommentText('')
    setCommentingOn(null)
  }

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
          <Link to="/app" className="text-xs text-white px-3 py-1.5 rounded-lg" style={{ background: '#6272f3' }}>Studio</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Community</h1>
            <p className="text-xs text-slate-500 mt-1">Portfolio showcases, victories, and methods from the creative community</p>
          </div>
          <Link to="/app/portfolio" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
            + Share your work
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#1a1a1d' }}>
            {(['All', 'Portfolio', 'Victory', 'Method', 'Behind the Scenes'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t as any)}
                className={clsx('px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors', typeFilter === t ? 'text-white' : 'text-slate-500 hover:text-white')}
                style={typeFilter === t && t !== 'All' ? { background: TYPE_COLOR[t as FeedPostType] + '40', color: TYPE_COLOR[t as FeedPostType] } : typeFilter === t ? { background: '#333' } : {}}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: '#1a1a1d' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCatFilter(c)} className={clsx('px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors', catFilter === c ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white')}>{c}</button>
            ))}
          </div>
        </div>

        {/* Feed */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4 text-slate-700">⊡</p>
            <p className="text-slate-500 mb-2">No posts yet.</p>
            <Link to="/app/portfolio" className="text-xs text-brand-400">Be the first to share your work →</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <article
                key={post.id}
                className="rounded border border-[#1e1e21] overflow-hidden"
                style={{ background: '#111113' }}
              >
                {/* Archive post marker */}
                {post._isArchive && (
                  <div className="h-0.5" style={{
                    background: post._discipline === 'Film' ? '#06b6d4'
                      : post._discipline === 'Music' ? '#6272f3'
                      : '#48bb9a'
                  }} />
                )}
                {/* Post header */}
                <div className="px-5 pt-4 pb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center text-sm font-black text-white shrink-0"
                      style={{ background: profile.avatarColor || '#6272f3' }}
                    >
                      {(profile.displayName || 'P').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{profile.displayName || 'Producer'}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className="text-[9px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wider bg-white/5 border border-white/8 text-zinc-400"
                        >
                          {post._isArchive ? 'Archived Project' : post.type}
                        </span>
                        {post._discipline && (
                          <span className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                            style={post._discipline === 'Film'
                              ? { background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }
                              : post._discipline === 'Music'
                              ? { background: 'rgba(98,114,243,0.1)', color: '#6272f3' }
                              : { background: 'rgba(72,187,154,0.1)', color: '#48bb9a' }
                            }
                          >{post._discipline}</span>
                        )}
                        <span className="text-[10px] text-zinc-600">{timeAgo(post.createdAt)}</span>
                        {!post._isArchive && post.clientApproved && (
                          <span className="text-[9px] text-emerald-400">✓ Client approved</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[9px] text-slate-600 px-1.5 py-0.5 rounded-full border border-white/6">#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="px-5 pb-3">
                  <h3 className="text-sm font-semibold text-white mb-1.5">{post.title}</h3>
                  {post.body && <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">{post.body}</p>}
                  {post._isArchive && post._link && (
                    <a href={post._link} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-[10px] text-[#6272f3] hover:underline font-mono"
                    >
                      View project →
                    </a>
                  )}
                  {post._isArchive && post._completedDate && (
                    <p className="text-[10px] text-zinc-600 font-mono mt-1">
                      Completed {new Date(post._completedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>

                {/* Media */}
                {post.mediaUrl && (
                  <div className="px-5 pb-3">
                    <a href={post.mediaUrl} target="_blank" rel="noopener noreferrer">
                      <div
                        className="w-full aspect-video rounded-xl border border-white/8 flex items-center justify-center hover:border-white/20 transition-colors"
                        style={{ background: '#1a1a1d' }}
                      >
                        <div className="text-center">
                          <p className="text-2xl mb-1 opacity-30">▶</p>
                          <p className="text-xs text-slate-600">View Media →</p>
                        </div>
                      </div>
                    </a>
                  </div>
                )}

                {/* Category + actions */}
                <div className="px-5 pb-4 flex items-center justify-between border-t border-white/6 pt-3 mt-1">
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider">{post.category}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleFeedLike(post.id)}
                      className={clsx('flex items-center gap-1.5 text-xs transition-colors', post.likedByMe ? 'text-brand-400' : 'text-slate-600 hover:text-slate-400')}
                    >
                      {post.likedByMe ? '♥' : '♡'} {post.likes}
                    </button>
                    <button
                      onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors"
                    >
                      ◎ {post.comments.length}
                    </button>
                  </div>
                </div>

                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="px-5 pb-3 space-y-2 border-t border-white/6 pt-3">
                    {post.comments.map(c => (
                      <div key={c.id} className="flex gap-2">
                        <span className="text-[10px] font-semibold text-slate-400 shrink-0">{c.author}</span>
                        <span className="text-[10px] text-slate-500">{c.body}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment input */}
                {commentingOn === post.id && (
                  <div className="px-5 pb-4 pt-2 border-t border-white/6 space-y-2">
                    <input
                      value={commentAuthor}
                      onChange={e => setCommentAuthor(e.target.value)}
                      placeholder="Your name"
                      className="w-full text-xs text-white placeholder-slate-600 bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500/60"
                    />
                    <div className="flex gap-2">
                      <input
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleComment(post.id) }}
                        placeholder="Add a comment..."
                        className="flex-1 text-xs text-white placeholder-slate-600 bg-white/4 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-500/60"
                      />
                      <button
                        onClick={() => handleComment(post.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white"
                        style={{ background: '#6272f3' }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
