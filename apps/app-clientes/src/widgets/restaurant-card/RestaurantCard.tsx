import type { Restaurant } from '../../entities/restaurant/model/types'

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick?: () => void
  variant?: 'featured' | 'compact'
}

export function RestaurantCard({ restaurant, onClick, variant = 'featured' }: RestaurantCardProps) {
  if (variant === 'compact') {
    return (
      <article
        onClick={onClick}
        className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-border-subtle active:scale-[0.98] transition-all cursor-pointer"
      >
        <div className="relative h-32 w-full">
          <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">restaurant</span>
          </div>
        </div>
        <div className="p-3">
          <h5 className="font-bold text-primary truncate">{restaurant.nombre}</h5>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-on-surface-variant">15-20 min</span>
            <div className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-secondary text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-[11px] font-bold">4.5</span>
            </div>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      onClick={onClick}
      className="bg-surface rounded-2xl overflow-hidden shadow-sm border border-border-subtle flex flex-col active:scale-[0.98] transition-all cursor-pointer"
    >
      <div className="relative h-44 w-full">
        <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant">restaurant</span>
        </div>
        <div className="absolute top-3 right-3 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <span className="material-symbols-outlined text-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          <span className="text-label-sm font-label-sm font-bold">4.8</span>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h4 className="text-headline-md font-headline-md text-primary">{restaurant.nombre}</h4>
          <span className="text-label-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">schedule</span> 25-35 min
          </span>
        </div>
        <p className="text-body-sm font-body-sm text-on-surface-variant">
          {restaurant.descripcion || 'Comida tradicional'}
        </p>
        <div className="mt-2 flex gap-2">
          {restaurant.disponible && (
            <span className="bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-on-tertiary-container/10">
              Abierto
            </span>
          )}
          <span className="bg-secondary/5 text-secondary text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-secondary/10">
            Envío gratis
          </span>
        </div>
      </div>
    </article>
  )
}
