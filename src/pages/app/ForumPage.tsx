import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea, Select } from '../../components/ui/Input'

type ForumPost = {
  id: string
  title: string
  body: string
  category: string
  author: string
  timestamp: string
  replies: ForumReply[]
}

type ForumReply = {
  id: string
  author: string
  body: string
  timestamp: string
}

const CATEGORIES = ['General', 'Film Production', 'Music Production', 'Business', 'Gear', 'Clients', 'Resources']
const CAT_OPTIONS = CATEGORIES.map(v => ({ value: v, label: v }))

const STORAGE_KEY = 'forum_posts_v1'

function loadPosts(): ForumPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePosts(posts: ForumPost[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)) } catch {}
}

const CAT_COLOR: Record<string, string> = {
  'Film Production': '#e85d4a',
  'Music Production': '#48bb9a',
  'Business': '#6272f3',
  'Gear': '#f59e0b',
  General: '#8888a0',
  Clients: '#a855f7',
  Resources: '#06b6d4',
}

export function ForumPage() {
  const { state } = useApp()
  const [posts, setPosts] = useState<ForumPost[]>(loadPosts)
  const [selectedPost, setSelectedPost] = useState<string | null>(null)
  const [catFilter, setCatFilter] = useState('All')
  const [newPostOpen, setNewPostOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyAuthor, setReplyAuthor] = useState('')

  const [newPostForm, setNewPostForm] = useState({
    title: '', body: '', category: 'General', author: '',
  })

  function updatePosts(updated: ForumPost[]) {
    setPosts(updated)
    savePosts(updated)
  }

  function handleCreatePost() {
    if (!newPostForm.title.trim()) return
    const post: ForumPost = {
      id: crypto.randomUUID(),
      title: newPostForm.title,
      body: newPostForm.body,
      category: newPostForm.category,
      author: newPostForm.author || 'Anonymous',
      timestamp: new Date().toISOString(),
      replies: [],
    }
    updatePosts([post, ...posts])
    setNewPostOpen(false)
    setNewPostForm({ title: '', body: '', category: 'General', author: '' })
  }

  function handleReply() {
    if (!replyText.trim() || !selectedPost) return
    const reply: ForumReply = {
      id: crypto.randomUUID(),
      author: replyAuthor || 'Anonymous',
      body: replyText,
      timestamp: new Date().toISOString(),
    }
    updatePosts(posts.map(p =>
      p.id === selectedPost ? { ...p, replies: [...p.replies, reply] } : p
    ))
    setReplyText('')
  }

  const filtered = posts.filter(p => catFilter === 'All' || p.category === catFilter)
  const openPost = selectedPost ? posts.find(p => p.id === selectedPost) : null

  const unreadMessages = state.portalMessages.filter(m => !m.read).length

  return (
    <div className="flex h-full">
      {/* Left: post list */}
      <div className="flex flex-col w-full max-w-sm border-r border-white/6" style={{ background: '#0c0c0e' }}>
        <div className="px-4 py-4 border-b border-white/6 flex items-center justify-between shrink-0" style={{ background: '#111113' }}>
          <div>
            <h1 className="text-base font-bold text-white">Forum</h1>
            <p className="text-[10px] text-slate-500 mt-0.5">{posts.length} discussions</p>
          </div>
          <Button size="xs" onClick={() => setNewPostOpen(true)}>+ Post</Button>
        </div>

        {/* Category filter */}
        <div className="px-3 py-2 border-b border-white/6 flex gap-1 flex-wrap" style={{ background: '#111113' }}>
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              className={clsx('px-2 py-0.5 rounded-md text-[10px] font-medium transition-colors', catFilter === cat ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-white')}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              <p className="text-sm">No discussions yet.</p>
              <button onClick={() => setNewPostOpen(true)} className="mt-2 text-xs text-brand-400">+ Start a discussion</button>
            </div>
          ) : filtered.map(post => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post.id)}
              className={clsx(
                'px-4 py-3 border-b border-white/4 cursor-pointer transition-colors',
                selectedPost === post.id ? 'bg-brand-600/10 border-l-2 border-l-brand-500' : 'hover:bg-white/4',
              )}
            >
              <div className="flex items-start gap-2 mb-1">
                <span
                  className="mt-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                  style={{ background: (CAT_COLOR[post.category] ?? '#888') + '20', color: CAT_COLOR[post.category] ?? '#888' }}
                >
                  {post.category}
                </span>
              </div>
              <p className="text-xs font-medium text-white leading-snug mb-1">{post.title}</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-600">{post.author}</span>
                <span className="text-[10px] text-slate-700">·</span>
                <span className="text-[10px] text-slate-600">{new Date(post.timestamp).toLocaleDateString()}</span>
                {post.replies.length > 0 && (
                  <span className="ml-auto text-[10px] text-slate-500">{post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Client messages indicator */}
        {unreadMessages > 0 && (
          <div className="px-4 py-2 border-t border-white/6 flex items-center justify-between" style={{ background: '#111113' }}>
            <span className="text-xs text-slate-400">{unreadMessages} unread client message{unreadMessages > 1 ? 's' : ''}</span>
            <a href="/app/client-projects" className="text-xs text-brand-400 hover:text-brand-300">View →</a>
          </div>
        )}
      </div>

      {/* Right: post detail */}
      {openPost ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-white/6 shrink-0" style={{ background: '#111113' }}>
            <div className="flex items-start gap-2 mb-1">
              <span
                className="text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider"
                style={{ background: (CAT_COLOR[openPost.category] ?? '#888') + '20', color: CAT_COLOR[openPost.category] ?? '#888' }}
              >
                {openPost.category}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">{openPost.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{openPost.author} · {new Date(openPost.timestamp).toLocaleDateString()}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Original post */}
            <div className="rounded-xl border border-white/8 p-4" style={{ background: '#141416' }}>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{openPost.body}</p>
            </div>

            {/* Replies */}
            {openPost.replies.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
                  {openPost.replies.length} {openPost.replies.length === 1 ? 'Reply' : 'Replies'}
                </p>
                {openPost.replies.map(r => (
                  <div key={r.id} className="rounded-xl border border-white/6 p-4" style={{ background: '#1a1a1d' }}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-white">{r.author}</span>
                      <span className="text-[10px] text-slate-600">{new Date(r.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{r.body}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Reply form */}
            <div className="rounded-xl border border-white/8 p-4 space-y-3" style={{ background: '#141416' }}>
              <p className="text-xs font-medium text-white">Reply</p>
              <Input
                label="Your name"
                placeholder="Anonymous"
                value={replyAuthor}
                onChange={e => setReplyAuthor(e.target.value)}
              />
              <Textarea
                label="Message"
                placeholder="Write a reply..."
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                rows={3}
              />
              <Button size="sm" onClick={handleReply}>Post Reply</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-700">
          <div className="text-center">
            <p className="text-4xl mb-3">⊡</p>
            <p className="text-sm">Select a discussion to read</p>
            <button
              onClick={() => setNewPostOpen(true)}
              className="mt-3 text-xs text-brand-400 hover:text-brand-300"
            >
              + Start a discussion
            </button>
          </div>
        </div>
      )}

      {/* New post modal */}
      <Modal
        open={newPostOpen}
        onClose={() => setNewPostOpen(false)}
        title="New Discussion"
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setNewPostOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleCreatePost}>Post</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            placeholder="What's the discussion about?"
            value={newPostForm.title}
            onChange={e => setNewPostForm(f => ({ ...f, title: e.target.value }))}
          />
          <Select
            label="Category"
            options={CAT_OPTIONS}
            value={newPostForm.category}
            onChange={e => setNewPostForm(f => ({ ...f, category: e.target.value }))}
          />
          <Textarea
            label="Body"
            placeholder="Share your thoughts, ask a question, or start a conversation..."
            value={newPostForm.body}
            onChange={e => setNewPostForm(f => ({ ...f, body: e.target.value }))}
            rows={5}
          />
          <Input
            label="Your name"
            placeholder="Anonymous"
            value={newPostForm.author}
            onChange={e => setNewPostForm(f => ({ ...f, author: e.target.value }))}
          />
        </div>
      </Modal>
    </div>
  )
}
