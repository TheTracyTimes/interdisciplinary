import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'outline' | 'secondary' | 'ghost' | 'danger'
type Size = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const VARIANT: Record<Variant, string> = {
  primary:   'bg-brand-600 hover:bg-brand-500 text-white border border-brand-600/50',
  outline:   'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border border-white/15 hover:border-white/30',
  secondary: 'bg-white/8 hover:bg-white/12 text-slate-300 border border-white/10',
  ghost:     'bg-transparent hover:bg-white/6 text-slate-400 hover:text-white border border-transparent',
  danger:    'bg-red-600/90 hover:bg-red-500 text-white border border-red-600/50',
}

const SIZE: Record<Size, string> = {
  xs: 'px-2.5 py-1 text-xs gap-1',
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-base gap-2',
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 disabled:opacity-40 disabled:cursor-not-allowed',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
