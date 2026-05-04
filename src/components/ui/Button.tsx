import clsx from 'clsx'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({ variant = 'primary', size = 'md', className, children, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
        {
          'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800': variant === 'primary',
          'bg-white/10 text-white hover:bg-white/20 border border-white/10': variant === 'secondary',
          'text-slate-300 hover:text-white hover:bg-white/10': variant === 'ghost',
          'bg-rose-600 text-white hover:bg-rose-700': variant === 'danger',
          'border border-white/20 text-white hover:bg-white/10': variant === 'outline',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
