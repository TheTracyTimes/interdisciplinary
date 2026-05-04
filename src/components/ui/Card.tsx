import clsx from 'clsx'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  glass?: boolean
  onClick?: () => void
}

export function Card({ children, className, glass, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-xl border',
        glass
          ? 'bg-white/5 border-white/10 backdrop-blur-sm'
          : 'bg-slate-800/60 border-white/8',
        className,
      )}
    >
      {children}
    </div>
  )
}
