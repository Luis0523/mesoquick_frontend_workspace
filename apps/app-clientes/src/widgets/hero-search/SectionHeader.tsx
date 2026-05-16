interface SectionHeaderProps {
  title: string
  actionLabel?: string
  onAction?: () => void
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 mb-4">
      <h3 className="text-headline-md font-headline-md text-primary">{title}</h3>
      {actionLabel && (
        <button onClick={onAction} className="text-label-lg font-label-lg text-secondary">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
