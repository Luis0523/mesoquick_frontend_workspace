interface ProductCardProps {
  name: string
  description?: string
  price: number
  imageUrl?: string
  onAdd?: () => void
}

export function ProductCard({ name, description, price, imageUrl, onAdd }: ProductCardProps) {
  return (
    <div className="bg-surface p-4 rounded-2xl shadow-[0_4px_12px_rgba(12,70,53,0.06)] border border-border-subtle flex gap-4 hover:shadow-[0_8px_16px_rgba(12,70,53,0.1)] transition-all">
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-headline-md text-text-primary text-body-lg">{name}</h3>
          {description && (
            <p className="text-on-surface-variant text-body-sm mt-1 line-clamp-2">{description}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-primary font-bold text-body-md">${price.toFixed(2)}</span>
          <button
            onClick={onAdd}
            className="w-8 h-8 bg-primary text-on-primary rounded-lg flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
          </button>
        </div>
      </div>
      <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img className="w-full h-full object-cover" src={imageUrl} alt={name} />
        ) : (
          <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-on-surface-variant">fastfood</span>
          </div>
        )}
      </div>
    </div>
  )
}
