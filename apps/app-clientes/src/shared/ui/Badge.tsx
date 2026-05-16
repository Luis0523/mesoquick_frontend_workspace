import type { ReactNode } from 'react'

type BadgeVariant = 'success' | 'warning' | 'info' | 'premium' | 'neutral' | 'secondary'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
}

const styles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-secondary/5 text-secondary',
  info: 'bg-on-tertiary-container/10 text-on-tertiary-container',
  premium: 'bg-surface text-secondary',
  neutral: 'bg-surface-container-highest text-on-surface-variant',
  secondary: 'bg-primary/5 text-primary',
}

export function Badge({ children, variant = 'success' }: BadgeProps) {
  return (
    <span className={`${styles[variant]} px-2 py-0.5 rounded-full text-label-sm font-label-sm`}>
      {children}
    </span>
  )
}
