import { useState } from 'react'
import clsx from 'clsx'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { PRODUCTS, PRODUCT_CATEGORIES, ALL_NLES, ALL_DAWS } from '../data/products'
import type { Product, ProductCategory } from '../data/products'

const FORMAT_COLORS: Record<string, string> = {
  '.cube':     'bg-violet-500/20 text-violet-300',
  '.3dl':      'bg-blue-500/20 text-blue-300',
  '.look':     'bg-indigo-500/20 text-indigo-300',
  '.fxp':      'bg-teal-500/20 text-teal-300',
  '.adg':      'bg-green-500/20 text-green-300',
  '.adv':      'bg-emerald-500/20 text-emerald-300',
  '.pst':      'bg-pink-500/20 text-pink-300',
  '.aupreset': 'bg-orange-500/20 text-orange-300',
  '.fst':      'bg-amber-500/20 text-amber-300',
  '.tfx':      'bg-cyan-500/20 text-cyan-300',
  '.exs':      'bg-lime-500/20 text-lime-300',
  '.nki':      'bg-yellow-500/20 text-yellow-300',
  '.wav':      'bg-rose-500/20 text-rose-300',
  '.aiff':     'bg-red-500/20 text-red-300',
  '.xml':      'bg-slate-500/20 text-slate-300',
}

function ColorPreview({ colors }: { colors: string[] }) {
  return (
    <div className="flex h-full rounded-t-xl overflow-hidden">
      {colors.map((c, i) => (
        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
      ))}
    </div>
  )
}

function SavingsBadge({ original, current }: { original: number; current: number }) {
  const pct = Math.round((1 - current / original) * 100)
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
      Save {pct}%
    </span>
  )
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  const [downloaded, setDownloaded] = useState(false)
  const isBundle = product.category === 'bundle'

  return (
    <Card
      className={clsx(
        'overflow-hidden cursor-pointer transition-all group flex flex-col',
        isBundle
          ? 'hover:border-brand-400/50 border-brand-500/20 bg-brand-500/5'
          : 'hover:border-white/25',
      )}
      onClick={() => onSelect(product)}
    >
      <div className="h-24 relative">
        {product.previewColors ? (
          <ColorPreview colors={product.previewColors} />
        ) : (
          <div className="h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <span className="text-4xl">
              {product.category === 'preset' ? '🎛' : product.category === 'sample-pack' ? '🥁' : '📦'}
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {isBundle && <Badge variant="creator" size="xs">Bundle</Badge>}
          {product.featured && !isBundle && <Badge variant="neutral" size="xs">Featured</Badge>}
        </div>

        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {product.tier === 'free' ? (
            <Badge variant="free" size="xs">Free</Badge>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-black/70 text-white">
              ${product.price}
            </span>
          )}
          {product.originalPrice && (
            <span className="px-1.5 py-0.5 rounded text-xs text-slate-400 line-through bg-black/50">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 uppercase tracking-wider">{product.subcategory}</span>
          {product.originalPrice && (
            <SavingsBadge original={product.originalPrice} current={product.price} />
          )}
        </div>

        <h3 className="font-semibold text-white text-sm mb-2 group-hover:text-brand-300 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 flex-1 mb-3">
          {product.description}
        </p>

        {isBundle && product.includes && (
          <ul className="mb-3 space-y-0.5">
            {product.includes.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-slate-400">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span className="truncate">{item}</span>
              </li>
            ))}
            {product.includes.length > 3 && (
              <li className="text-xs text-slate-600">+ {product.includes.length - 3} more</li>
            )}
          </ul>
        )}

        {!isBundle && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.format.slice(0, 4).map((f) => (
              <span key={f} className={clsx('px-1.5 py-0.5 rounded text-xs font-mono', FORMAT_COLORS[f] ?? 'bg-white/10 text-slate-400')}>
                {f}
              </span>
            ))}
            {product.format.length > 4 && (
              <span className="px-1.5 py-0.5 rounded text-xs bg-white/5 text-slate-500">+{product.format.length - 4}</span>
            )}
          </div>
        )}

        {product.downloads && (
          <p className="text-xs text-slate-600 mb-3">{product.downloads.toLocaleString()} downloads</p>
        )}

        {product.tier === 'free' ? (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={(e) => { e.stopPropagation(); setDownloaded(true); setTimeout(() => setDownloaded(false), 2000) }}
          >
            {downloaded ? '✓ Downloaded' : '↓ Download Free'}
          </Button>
        ) : (
          <Button
            variant={isBundle ? 'primary' : 'outline'}
            size="sm"
            className="w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {isBundle ? `Get Bundle — $${product.price}` : `Buy — $${product.price}`}
          </Button>
        )}
      </div>
    </Card>
  )
}

function CompatibilityGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          🎬 NLE Compatible
        </h4>
        <div className="space-y-2">
          {ALL_NLES.map((nle) => (
            <div key={nle} className="flex items-center gap-2">
              <span className="text-emerald-400 text-xs">✓</span>
              <span className="text-sm text-slate-300">{nle}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          🎵 DAW Compatible
        </h4>
        <div className="space-y-2">
          {ALL_DAWS.map((daw) => (
            <div key={daw} className="flex items-center gap-2">
              <span className="text-emerald-400 text-xs">✓</span>
              <span className="text-sm text-slate-300">{daw}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [downloaded, setDownloaded] = useState(false)
  const isBundle = product.category === 'bundle'

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-white/10 rounded-2xl max-w-xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-36 relative shrink-0">
          {product.previewColors ? (
            <ColorPreview colors={product.previewColors} />
          ) : (
            <div className="h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
              <span className="text-6xl">
                {product.category === 'preset' ? '🎛' : product.category === 'sample-pack' ? '🥁' : '📦'}
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
          <div className="flex items-start justify-between gap-4 mb-1">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{product.subcategory}</p>
              <h2 className="text-xl font-bold text-white">{product.name}</h2>
            </div>
            <div className="text-right shrink-0">
              {product.tier === 'free' ? (
                <Badge variant="free">Free</Badge>
              ) : (
                <div>
                  <div className="text-2xl font-black text-white">${product.price}</div>
                  {product.originalPrice && (
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-sm text-slate-500 line-through">${product.originalPrice}</span>
                      <SavingsBadge original={product.originalPrice} current={product.price} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-5">{product.description}</p>

          {isBundle && product.includes && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">What's included</p>
              <div className="space-y-2">
                {product.includes.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 text-sm shrink-0">✓</span>
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Formats</p>
              <div className="flex flex-wrap gap-1">
                {product.format.map((f) => (
                  <span key={f} className={clsx('px-1.5 py-0.5 rounded text-xs font-mono', FORMAT_COLORS[f] ?? 'bg-white/10 text-slate-400')}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Works with</p>
              <div className="space-y-0.5 max-h-32 overflow-y-auto">
                {product.compatible.map((c) => (
                  <div key={c} className="flex items-center gap-1.5">
                    <span className="text-emerald-400 text-xs">✓</span>
                    <span className="text-xs text-slate-400">{c}</span>
                  </div>
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
              {downloaded ? '✓ Downloaded — check your Downloads folder' : '↓ Download Free'}
            </Button>
          ) : (
            <Button variant="primary" size="lg" className="w-full">
              {isBundle ? `Get the Bundle — $${product.price}` : `Buy for $${product.price}`} — Instant Download
            </Button>
          )}

          <p className="text-center text-xs text-slate-600 mt-3">
            Instant download · Commercial license included · All formats in one zip
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
    if (search) {
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q)) || p.subcategory.toLowerCase().includes(q)
    }
    return true
  })

  const isFiltered = activeCategory !== 'all' || search || activeTier !== 'all'
  const bundles = PRODUCTS.filter((p) => p.category === 'bundle')

  return (
    <div className="min-h-screen bg-slate-950">
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-white/8 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="free" size="sm">{PRODUCTS.filter(p => p.tier === 'free').length} free products</Badge>
            <Badge variant="neutral" size="sm">Instant download</Badge>
            <Badge variant="creator" size="sm">Commercial license</Badge>
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Creative Assets Store</h1>
          <p className="text-slate-400 max-w-2xl mb-2">
            LUTs for your color grade. Presets for your mix. Bundles for your workflow.
            Every product ships in all formats — compatible with every NLE and DAW listed below.
          </p>
          <p className="text-xs text-slate-600 mb-6">
            NLEs: {ALL_NLES.join(' · ')} &nbsp;|&nbsp; DAWs: {ALL_DAWS.join(' · ')}
          </p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, tags, formats..."
            className="w-full max-w-md bg-slate-800 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 text-sm"
          />
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-8">
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
                  activeTier === tier ? 'bg-white/15 text-white' : 'text-slate-500 hover:text-white',
                )}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {isFiltered ? (
          <div>
            <p className="text-sm text-slate-500 mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-600">No products match those filters.</div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => <ProductCard key={p.id} product={p} onSelect={setSelected} />)}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-12">
              <div className="flex items-baseline gap-3 mb-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">📦 Bundles</h2>
                <span className="text-xs text-emerald-400">Best value</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bundles.map((p) => <ProductCard key={p.id} product={p} onSelect={setSelected} />)}
              </div>
            </div>

            <Section title="🎨 LUTs — Color Grades" category="lut" onSelect={setSelected} />
            <Section title="🎛 Presets — Music Production" category="preset" onSelect={setSelected} />
            <Section title="🥁 Sample Packs" category="sample-pack" onSelect={setSelected} />

            <div className="mt-12 mb-10 border-t border-white/8 pt-10">
              <h2 className="text-lg font-bold text-white mb-6">Full compatibility — every product</h2>
              <CompatibilityGrid />
            </div>

            <Card className="p-6 border-brand-500/20 bg-brand-500/5">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex-1">
                  <h3 className="font-bold text-white mb-2">Sell your own LUTs or presets here</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Colorists, mixers, and producers can submit products to the store.
                    You set the price, we handle delivery. <span className="text-white font-medium">80/20 revenue split</span> in your favor.
                    Creator plan or higher required.
                  </p>
                </div>
                <Button variant="secondary" size="sm" className="shrink-0">Apply to sell</Button>
              </div>
            </Card>
          </>
        )}
      </div>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

function Section({ title, category, onSelect }: { title: string; category: string; onSelect: (p: Product) => void }) {
  const items = PRODUCTS.filter((p) => p.category === category)
  if (!items.length) return null
  return (
    <div className="mb-10">
      <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => <ProductCard key={p.id} product={p} onSelect={onSelect} />)}
      </div>
    </div>
  )
}
