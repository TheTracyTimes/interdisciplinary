import clsx from 'clsx'

interface CardProps {
  className?: string
  glass?: boolean
  onClick?: () => void
  children: React.ReactNode
}

export function Card({ className, glass, onClick, children }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl border border-white/10',
        glass ? 'bg-white/5 backdrop-blur-sm' : 'bg-slate-900/60',
        className,
      )}
    >
      {children}
    </div>
  )
}
