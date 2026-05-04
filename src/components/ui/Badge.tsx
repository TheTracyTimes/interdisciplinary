import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variant?: 'free' | 'creator' | 'pro' | 'studio' | 'film' | 'music' | 'neutral'
  size?: 'sm' | 'xs'
  className?: string
}

export function Badge({ children, variant = 'neutral', size = 'sm', className }: Props) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        {
          'px-2 py-0.5 text-xs': size === 'xs',
          'px-2.5 py-0.5 text-xs': size === 'sm',
        },
        {
          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30': variant === 'free',
          'bg-brand-500/20 text-brand-300 border border-brand-500/30': variant === 'creator',
          'bg-amber-500/20 text-amber-300 border border-amber-500/30': variant === 'pro',
          'bg-violet-500/20 text-violet-300 border border-violet-500/30': variant === 'studio',
          'bg-rose-500/20 text-rose-300 border border-rose-500/30': variant === 'film',
          'bg-teal-500/20 text-teal-300 border border-teal-500/30': variant === 'music',
          'bg-white/10 text-slate-400 border border-white/10': variant === 'neutral',
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
