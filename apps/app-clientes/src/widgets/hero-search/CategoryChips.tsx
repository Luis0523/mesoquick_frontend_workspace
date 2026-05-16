interface CategoryChipsProps {
  categories: { icon: string; label: string }[]
  onSelect?: (label: string) => void
}

export function CategoryChips({ categories, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex overflow-x-auto gap-4 px-4 hide-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => onSelect?.(cat.label)}
          className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-surface shadow-sm border border-border-subtle flex items-center justify-center group-hover:bg-primary-container/10 transition-colors">
            <span className="material-symbols-outlined text-3xl text-primary">{cat.icon}</span>
          </div>
          <span className="text-label-sm font-label-sm text-on-surface">{cat.label}</span>
        </button>
      ))}
    </div>
  )
}
