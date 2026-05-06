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
        'rounded-lg border',
        glass
          ? 'bg-white/[0.03] border-white/8 backdrop-blur-sm'
          : 'bg-[#111113] border-[#1e1e21]',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}
