import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import clsx from 'clsx'

const base = 'w-full rounded-lg border border-white/10 bg-white/4 px-3 py-2 text-sm text-white placeholder-slate-600 transition-colors focus:outline-none focus:border-brand-500/60 focus:bg-white/6'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-400 tracking-wide">{label}</label>}
      <input className={clsx(base, error && 'border-red-500/60', className)} {...props} />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-400 tracking-wide">{label}</label>}
      <select
        className={clsx(base, 'appearance-none cursor-pointer', error && 'border-red-500/60', className)}
        style={{ background: '#1a1a1d' }}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-slate-400 tracking-wide">{label}</label>}
      <textarea
        rows={3}
        className={clsx(base, 'resize-none', error && 'border-red-500/60', className)}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
  description?: string
}

export function Toggle({ label, checked, onChange, description }: ToggleProps) {
  return (
    <label className="flex items-center justify-between gap-3 cursor-pointer group">
      <div>
        <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</p>
        {description && <p className="text-xs text-slate-600 mt-0.5">{description}</p>}
      </div>
      <div
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative w-9 h-5 rounded-full transition-colors shrink-0',
          checked ? 'bg-brand-600' : 'bg-white/10',
        )}
      >
        <div
          className={clsx(
            'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          )}
        />
      </div>
    </label>
  )
}
