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
  neutral: 'bg-white/5 text-zinc-400 border border-white/8',
  film:    'bg-white/5 text-zinc-300 border border-white/8',
  music:   'bg-white/5 text-zinc-300 border border-white/8',
  creator: 'bg-white/5 text-zinc-300 border border-white/8',
  pro:     'bg-white/5 text-zinc-300 border border-white/8',
  free:    'bg-white/5 text-zinc-400 border border-white/8',
}

const SIZE: Record<Size, string> = {
  xs: 'px-1.5 py-0.5 text-[10px]',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function Badge({ variant = 'neutral', size = 'md', className, children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded font-medium tracking-wide',
        VARIANT[variant],
        SIZE[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
