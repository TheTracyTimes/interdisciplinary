import clsx from 'clsx'

type Variant = 'neutral' | 'film' | 'music' | 'creator' | 'pro' | 'free'
type Size = 'xs' | 'sm' | 'md'

interface BadgeProps {
  variant?: Variant
  size?: Size
  className?: string
  children: React.ReactNode
}

const VARIANT: Record<Variant, string> = {
  neutral: 'bg-white/10 text-slate-300 border border-white/15',
  film:    'bg-film-500/20 text-red-300 border border-film-500/30',
  music:   'bg-music-500/20 text-emerald-300 border border-music-500/30',
  creator: 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
  pro:     'bg-violet-500/20 text-violet-300 border border-violet-500/30',
  free:    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
}

const SIZE: Record<Size, string> = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function Badge({ variant = 'neutral', size = 'md', className, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
