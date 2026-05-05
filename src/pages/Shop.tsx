import { useState } from 'react'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PRODUCTS, PRODUCT_CATEGORIES } from '../data/products'
import type { Product, ProductCategory } from '../data/products'

const FORMAT_COLORS: Record<string, string> = {
  '.cube': 'bg-violet-500/20 text-violet-300',
  '.3dl': 'bg-blue-500/20 text-blue-300',
  '.look': 'bg-indigo-500/20 text-indigo-300',
  '.fxp': 'bg-teal-500/20 text-teal-300',
  '.adg': 'bg-green-500/20 text-green-300',
  '.nki': 'bg-amber-500/20 text-amber-300',
  '.wav': 'bg-rose-500/20 text-rose-300',
  '.aiff': 'bg-orange-500/20 text-orange-300',
  '.xml': 'bg-slate-500/20 text-slate-300',
  '.pst': 'bg-pink-500/20 text-pink-300',
}

function LUTPreview({ colors }: { colors: string[] }) {
  return (
    <div className="flex h-full rounded-t-xl overflow-hidden">
      {colors.map((c, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
      ))}
    </div>
  )
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  const [downloaded, setDownloaded] = useState(false)

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:border-white/25 transition-all group flex flex-col"
      onClick={() => onSelect(product)}
    >
      {/* Preview area */}
      <div className="h-24 relative">
        {product.previewColors ? (
          <LUTPreview colors={product.previewColors} />
        ) : (
          <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-4xl">
              {product.category === 'preset' ? '🎛' : product.category === 'sample-pack' ? '🥁' : '📋'}
            </span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <Badge variant="creator" size="xs">Featured</Badge>
          </div>
        )}
        <div className="absolute top-2 right-2">
          {product.tier === 'free' ? (
            <Badge variant="free" size="xs">Free</Badge>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/60 text-white">
              ${product.price}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider">{product.subcategory}</span>
        </div>
        <h3 className="font-semibold text-white text-sm mb-2 group-hover:text-brand-300 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 flex-1 mb-3">
          {product.description}
        </p>

        {/* Formats */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.format.slice(0, 3).map((f) => (
            <span key={f} className={clsx('px-1.5 py-0.5 rounded text-xs font-mono', FORMAT_COLORS[f] ?? 'bg-white/10 text-slate-400')}>
              {f}
            </span>
          ))}
        </div>

        {/* Downloads count */}
        {product.downloads && (
          <p className="text-xs text-slate-600 mb-3">
            {product.downloads.toLocaleString()} downloads
          </p>
        )}

        {/* CTA */}
        {product.tier === 'free' ? (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={handleDownload}
          >
            {downloaded ? '✓ Downloaded' : '↓ Download Free'}
          </Button>
        ) : (
          <Button variant="primary" size="sm" className="w-full" onClick={(e) => e.stopPropagation()}>
            Buy — ${product.price}
          </Button>
        )}
      </div>
    </Card>
  )
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [downloaded, setDownloaded] = useState(false)

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Preview */}
        <div className="h-32 relative">
          {product.previewColors ? (
            <LUTPreview colors={product.previewColors} />
          ) : (
            <div className="h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
              <span className="text-6xl">
                {product.category === 'preset' ? '🎛' : product.category === 'sample-pack' ? '🥁' : '📋'}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 text-lg"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{product.subcategory}</p>
              <h2 className="text-xl font-bold text-white">{product.name}</h2>
            </div>
            {product.tier === 'free' ? (
              <Badge variant="free">Free</Badge>
            ) : (
              <span className="text-2xl font-black text-white">${product.price}</span>
            )}
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-5">{product.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Formats</p>
              <div className="flex flex-wrap gap-1">
                {product.format.map((f) => (
                  <span key={f} className={clsx('px-2 py-0.5 rounded text-xs font-mono', FORMAT_COLORS[f] ?? 'bg-white/10 text-slate-400')}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Compatible with</p>
              <div className="flex flex-col gap-0.5">
                {product.compatible.slice(0, 4).map((c) => (
                  <span key={c} className="text-xs text-slate-400">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-xs text-slate-400 border border-white/8">
                {tag}
              </span>
            ))}
          </div>

          {product.tier === 'free' ? (
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => setDownloaded(true)}
            >
              {downloaded ? '✓ Downloaded — check your downloads folder' : '↓ Download Free'}
            </Button>
          ) : (
            <Button variant="primary" size="lg" className="w-full">
              Buy for ${product.price} — Instant Download
            </Button>
          )}

          <p className="text-center text-xs text-slate-600 mt-3">
            Instant download · No subscription required · Commercial license included
          </p>
        </div>
      </div>
    </div>
  )
}

export function Shop() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [activeTier, setActiveTier] = useState<'all' | 'free' | 'paid'>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Product | null>(null)

  const filtered = PRODUCTS.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false
    if (activeTier !== 'all' && p.tier !== activeTier) return false
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.tags.some((t) => t.includes(search.toLowerCase()))) return false
    return true
  })

  const featured = PRODUCTS.filter((p) => p.featured)
  const freeCount = PRODUCTS.filter((p) => p.tier === 'free').length

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/8 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="free" size="sm">{freeCount} free products</Badge>
            <Badge variant="neutral" size="sm">Instant download</Badge>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            Creative Assets Store
          </h1>
          <p className="text-slate-400 max-w-2xl mb-6">
            LUTs for your color grade. Presets for your mix. Sample packs for your session.
            Everything built for independent creatives — compatible with the tools you already use.
          </p>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search LUTs, presets, samples..."
            className="w-full max-w-md bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 text-sm"
          />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Category + tier filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <div className="flex gap-1 flex-wrap">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  activeCategory === cat.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10',
                )}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-auto">
            {(['all', 'free', 'paid'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize',
                  activeTier === tier
                    ? 'bg-white/15 text-white'
                    : 'text-slate-500 hover:text-white',
                )}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Featured strip (only on all/no search) */}
        {activeCategory === 'all' && !search && activeTier === 'all' && (
          <div className="mb-10">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Featured</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={setSelected} />
              ))}
            </div>
          </div>
        )}

        {/* Main grid */}
        {(activeCategory !== 'all' || search || activeTier !== 'all') && (
          <div>
            <p className="text-sm text-slate-500 mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-600">
                <p>No products match those filters.</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} onSelect={setSelected} />
              ))}
            </div>
          </div>
        )}

        {activeCategory === 'all' && !search && activeTier === 'all' && (
          <>
            {/* LUTs section */}
            <SectionGrid title="🎨 LUTs — Color Grades" category="lut" onSelect={setSelected} />
            {/* Presets section */}
            <SectionGrid title="🎛 Presets — Music Production" category="preset" onSelect={setSelected} />
            {/* Samples section */}
            <SectionGrid title="🥁 Sample Packs" category="sample-pack" onSelect={setSelected} />
          </>
        )}

        {/* Business note */}
        <div className="mt-16 border-t border-white/8 pt-10">
          <Card className="p-6 border-brand-500/20 bg-brand-500/5">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex-1">
                <h3 className="font-bold text-white mb-2">Sell your own LUTs or presets</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Are you a colorist, mixer, or producer with assets worth selling?
                  Creator and Pro plan members can submit products to the store.
                  You set the price, we handle delivery. 80/20 revenue split in your favor.
                </p>
              </div>
              <Button variant="secondary" size="sm" className="shrink-0">
                Apply to sell
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function SectionGrid({ title, category, onSelect }: { title: string; category: string; onSelect: (p: Product) => void }) {
  const products = PRODUCTS.filter((p) => p.category === category)
  if (products.length === 0) return null
  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
