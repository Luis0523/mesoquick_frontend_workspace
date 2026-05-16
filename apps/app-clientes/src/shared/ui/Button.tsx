import type { ReactNode, ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variants = {
  primary: 'bg-primary text-on-primary hover:bg-primary-container shadow-md active:scale-[0.98]',
  secondary: 'bg-secondary text-on-secondary hover:opacity-90 shadow-md active:scale-[0.98]',
  outline: 'border-2 border-primary text-primary hover:bg-surface-container-low active:scale-[0.98]',
  ghost: 'text-primary hover:bg-surface-container-low active:scale-[0.98]',
}

const sizes = {
  sm: 'py-2 px-4 text-label-sm rounded-xl',
  md: 'py-3 px-6 text-label-lg rounded-2xl',
  lg: 'py-4 px-8 text-label-lg rounded-2xl',
}

export function Button({
  children, variant = 'primary', size = 'lg', fullWidth = false, className = '', ...props
}: ButtonProps) {
  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} font-label-lg transition-all duration-200 flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
