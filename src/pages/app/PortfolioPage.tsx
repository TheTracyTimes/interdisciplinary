import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea, Select, Toggle } from '../../components/ui/Input'
import type { FeedPost, FeedPostType } from '../../types'

const TYPE_OPTIONS: { value: FeedPostType; label: string }[] = [
  { value: 'Portfolio', label: 'Portfolio — finished project showcase' },
  { value: 'Victory', label: 'Victory — milestone or achievement' },
  { value: 'Method', label: 'Method — tip, technique, or workflow' },
  { value: 'Behind the Scenes', label: 'Behind the Scenes — process shot or story' },
]
const CATEGORY_OPTIONS = ['Film', 'Music', 'Photography', 'Commercial', 'Wedding', 'Worship', 'Other'].map(v => ({ value: v, label: v }))

const TYPE_COLOR: Record<FeedPostType, string> = {
  Portfolio: '#6272f3', Victory: '#f59e0b', Method: '#48bb9a', 'Behind the Scenes': '#e85d4a',
}

const defaultForm = {
  type: 'Portfolio' as FeedPostType, title: '', body: '', mediaUrl: '',
  tags: '', category: 'Film', clientApproved: false, isPublished: false, linkedProjectId: '',
}

export function PortfolioPage() {
  const { state, createFeedPost, updateFeedPost, deleteFeedPost, toggleFeedLike } = useApp()
  const [filter, setFilter] = useState<'All' | FeedPostType>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })

  const posts = state.feedPosts
    .filter(p => filter === 'All' || p.type === filter)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  function openCreate() { setForm({ ...defaultForm }); setEditId(null); setModalOpen(true) }
  function openEdit(p: FeedPost) {
    setForm({ type: p.type, title: p.title, body: p.body, mediaUrl: p.mediaUrl, tags: p.tags.join(', '), category: p.category, clientApproved: p.clientApproved, isPublished: p.isPublished, linkedProjectId: p.linkedProjectId ?? '' })
    setEditId(p.id); setModalOpen(true)
  }
  function handleSave() {
    const data = {
      type: form.type, title: form.title, body: form.body, mediaUrl: form.mediaUrl,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      category: form.category, clientApproved: form.clientApproved,
      isPublished: form.isPublished, linkedProjectId: form.linkedProjectId || undefined,
      publishedAt: form.isPublished ? new Date().toISOString() : undefined,
    }
    if (editId) updateFeedPost(editId, data)
    else createFeedPost(data)
    setModalOpen(false)
  }

  const projectOptions = [{ value: '', label: 'No project' }, ...state.creativeProjects.map(p => ({ value: p.id, label: p.title }))]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-bold text-white">Portfolio & Feed</h1>
          <p className="text-xs text-slate-500 mt-0.5">{state.feedPosts.filter(p => p.isPublished).length} published · {state.feedPosts.filter(p => !p.isPublished).length} drafts</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="/community" target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-brand-400 transition-colors">View Community →</a>
          <Button size="sm" onClick={openCreate}>+ New Post</Button>
        </div>
      </div>

      {/* Type filter */}
      <div className="flex gap-1 p-1 rounded-lg mb-5 w-fit" style={{ background: '#1a1a1d' }}>
        {(['All', 'Portfolio', 'Victory', 'Method', 'Behind the Scenes'] as const).map(t => (
          <button
            key={t}
            onClick={() => setFilter(t as any)}
            className={clsx('px-3 py-1 rounded-md text-xs font-medium transition-colors', filter === t ? 'text-white' : 'text-slate-500 hover:text-white')}
            style={filter === t && t !== 'All' ? { background: TYPE_COLOR[t as FeedPostType] + '35', color: TYPE_COLOR[t as FeedPostType] } : filter === t ? { background: '#333' } : {}}
          >
            {t}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-4xl mb-3">⊡</p>
          <p className="text-sm">No posts yet.</p>
          <button onClick={openCreate} className="mt-2 text-xs text-brand-400">+ Create your first post</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {posts.map(post => (
            <div
              key={post.id}
              className="rounded-2xl border border-white/8 overflow-hidden cursor-pointer hover:border-white/20 transition-colors"
              style={{ background: '#141416' }}
              onClick={() => openEdit(post)}
            >
              {post.mediaUrl && (
                <div className="w-full aspect-video flex items-center justify-center border-b border-white/6" style={{ background: '#111113' }}>
                  <p className="text-[10px] text-slate-700">Media linked</p>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider" style={{ background: TYPE_COLOR[post.type] + '25', color: TYPE_COLOR[post.type] }}>
                    {post.type}
                  </span>
                  {post.isPublished
                    ? <span className="text-[9px] text-emerald-400 ml-auto">● Published</span>
                    : <span className="text-[9px] text-slate-600 ml-auto">○ Draft</span>
                  }
                </div>
                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2">{post.title || 'Untitled'}</h3>
                {post.body && <p className="text-xs text-slate-500 line-clamp-2 mb-2">{post.body}</p>}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map(t => <span key={t} className="text-[9px] text-slate-700">#{t}</span>)}
                  </div>
                  <div className="flex items-center gap-3">
                    {post.clientApproved && <span className="text-[9px] text-emerald-400">✓ Client</span>}
                    <button
                      onClick={e => { e.stopPropagation(); toggleFeedLike(post.id) }}
                      className={clsx('text-xs', post.likedByMe ? 'text-brand-400' : 'text-slate-600')}
                    >
                      {post.likedByMe ? '♥' : '♡'} {post.likes}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); deleteFeedPost(post.id) }}
                      className="text-slate-700 hover:text-red-400 text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Post' : 'New Post'}
        size="lg"
        footer={
          <>
            {editId && <Button variant="danger" size="sm" onClick={() => { deleteFeedPost(editId!); setModalOpen(false) }}>Delete</Button>}
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Post Type"
            options={TYPE_OPTIONS}
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value as FeedPostType }))}
          />
          <Input label="Title" placeholder="e.g. Wedding Film — John & Jane" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Textarea label="Caption / Body" placeholder="Tell the story behind this post..." value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={4} />
          <Input label="Media URL" placeholder="https://vimeo.com/... or YouTube link" value={form.mediaUrl} onChange={e => setForm(f => ({ ...f, mediaUrl: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" options={CATEGORY_OPTIONS} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            <Input label="Tags (comma-separated)" placeholder="cinematic, church, wedding" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          </div>
          <Select label="Linked Project (optional)" options={projectOptions} value={form.linkedProjectId} onChange={e => setForm(f => ({ ...f, linkedProjectId: e.target.value }))} />
          <div className="space-y-2">
            <Toggle label="Client Approved" description="Client has given permission to share this work publicly" checked={form.clientApproved} onChange={v => setForm(f => ({ ...f, clientApproved: v }))} />
            <Toggle label="Published" description="Show this post in your public portfolio and the community feed" checked={form.isPublished} onChange={v => setForm(f => ({ ...f, isPublished: v }))} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
