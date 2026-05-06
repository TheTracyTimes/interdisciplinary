import { useState } from 'react'
import clsx from 'clsx'
import { useApp } from '../../context/AppContext'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Input, Textarea, Select, Toggle } from '../../components/ui/Input'
import type { PricingPackage } from '../../types'

const CATEGORY_OPTIONS = ['Videography', 'Photography', 'Music Production', 'Livestream', 'Commercial', 'Wedding', 'Portrait', 'Other'].map(v => ({ value: v, label: v }))
const PRICE_TYPE_OPTIONS = ['Fixed', 'Starting At', 'Per Hour', 'Custom Quote'].map(v => ({ value: v, label: v }))

const defaultForm = {
  name: '', tagline: '', description: '', category: 'Videography',
  price: '', priceType: 'Starting At', deliveryTime: '', includes: '', isActive: true, popular: false,
}

export function PackagesPage() {
  const { state, createPricingPackage, updatePricingPackage, deletePricingPackage } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({ ...defaultForm })

  const active = state.pricingPackages.filter(p => p.isActive)
  const inactive = state.pricingPackages.filter(p => !p.isActive)

  function openCreate() { setForm({ ...defaultForm }); setEditId(null); setModalOpen(true) }
  function openEdit(p: PricingPackage) {
    setForm({ name: p.name, tagline: p.tagline, description: p.description, category: p.category, price: String(p.price), priceType: p.priceType, deliveryTime: p.deliveryTime, includes: p.includes.join('\n'), isActive: p.isActive, popular: p.popular })
    setEditId(p.id); setModalOpen(true)
  }
  function handleSave() {
    const data: any = { ...form, price: Number(form.price) || 0, includes: form.includes ? form.includes.split('\n').map(s => s.trim()).filter(Boolean) : [] }
    if (editId) updatePricingPackage(editId, data)
    else createPricingPackage(data)
    setModalOpen(false)
  }

  function PackageCard({ pkg }: { pkg: PricingPackage }) {
    return (
      <div
        className={clsx('rounded-2xl border p-5 cursor-pointer hover:border-white/25 transition-all', pkg.popular ? 'border-brand-500/35' : 'border-white/8')}
        style={{ background: pkg.popular ? 'rgba(98,114,243,0.08)' : '#141416' }}
        onClick={() => openEdit(pkg)}
      >
        {pkg.popular && <span className="text-[9px] font-bold text-brand-400 uppercase tracking-wider mb-2 block">★ Most Popular</span>}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-white">{pkg.name}</p>
            {pkg.tagline && <p className="text-[10px] text-slate-500 mt-0.5">{pkg.tagline}</p>}
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">${pkg.price.toLocaleString()}</span>
            </div>
            <span className="text-[10px] text-slate-500">{pkg.priceType}</span>
          </div>
        </div>
        {pkg.category && <span className="text-[9px] font-medium px-2 py-0.5 rounded-full border border-white/10 text-slate-400 mb-3 inline-block" style={{ background: '#1a1a1d' }}>{pkg.category}</span>}
        {pkg.deliveryTime && <p className="text-[10px] text-slate-600 mb-3">⏱ {pkg.deliveryTime}</p>}
        {pkg.includes.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {pkg.includes.map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-emerald-400 shrink-0">✓</span>{item}
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-between pt-3 border-t border-white/6">
          <span className={clsx('text-[9px] font-medium', pkg.isActive ? 'text-emerald-400' : 'text-slate-600')}>
            {pkg.isActive ? '● Active' : '○ Hidden'}
          </span>
          <button onClick={e => { e.stopPropagation(); deletePricingPackage(pkg.id) }} className="text-slate-700 hover:text-red-400 text-xs">×</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Pricing Packages</h1>
          <p className="text-xs text-slate-500 mt-0.5">Shown on your public profile and shared with clients</p>
        </div>
        <Button size="sm" onClick={openCreate}>+ Add Package</Button>
      </div>

      {state.pricingPackages.length === 0 ? (
        <div className="text-center py-16 text-slate-600">
          <p className="text-4xl mb-3">$</p>
          <p className="text-sm mb-1">No packages yet.</p>
          <p className="text-xs text-slate-700 mb-3">Create packages to show clients what you offer and at what price.</p>
          <button onClick={openCreate} className="text-xs text-brand-400">+ Create your first package</button>
        </div>
      ) : (
        <div className="space-y-6">
          {active.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-3">Active Packages</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {active.map(p => <PackageCard key={p.id} pkg={p} />)}
              </div>
            </div>
          )}
          {inactive.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold mb-3">Hidden</p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 opacity-50">
                {inactive.map(p => <PackageCard key={p.id} pkg={p} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Package' : 'New Package'}
        size="md"
        footer={
          <>
            {editId && <Button variant="danger" size="sm" onClick={() => { deletePricingPackage(editId!); setModalOpen(false) }}>Delete</Button>}
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Package Name" placeholder="e.g. Event Half-Day" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input label="Tagline" placeholder="e.g. Perfect for intimate celebrations" value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Category" options={CATEGORY_OPTIONS} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
            <Select label="Price Type" options={PRICE_TYPE_OPTIONS} value={form.priceType} onChange={e => setForm(f => ({ ...f, priceType: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price ($)" type="number" placeholder="850" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            <Input label="Delivery Time" placeholder="e.g. 3-4 weeks" value={form.deliveryTime} onChange={e => setForm(f => ({ ...f, deliveryTime: e.target.value }))} />
          </div>
          <Textarea
            label="What's Included (one item per line)"
            placeholder={"Edited highlight reel\nFull ceremony recording\nOnline gallery delivery"}
            value={form.includes}
            onChange={e => setForm(f => ({ ...f, includes: e.target.value }))}
            rows={5}
          />
          <Textarea label="Description" placeholder="Any additional details..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          <div className="space-y-2">
            <Toggle label="Active (visible on your profile)" checked={form.isActive} onChange={v => setForm(f => ({ ...f, isActive: v }))} />
            <Toggle label="Mark as Most Popular" checked={form.popular} onChange={v => setForm(f => ({ ...f, popular: v }))} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
