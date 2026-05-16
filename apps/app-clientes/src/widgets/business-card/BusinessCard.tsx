import type { Business } from '../../entities/business/model/types'

interface BusinessCardProps {
  business: Business
  onClick?: () => void
}

const typeLabels: Record<string, string> = {
  pharmacy: 'Farmacia',
  supermarket: 'Supermercado',
  convenience_store: 'Tienda de Conveniencia',
  hardware_store: 'Ferretería',
  restaurant: 'Restaurante',
  bakery: 'Panadería',
  pet_store: 'Tienda de Mascotas',
  other: 'Otro',
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  const isActive = business.businessStatus === 'active'

  return (
    <div
      onClick={onClick}
      className="bg-surface rounded-2xl shadow-[0_4px_12px_rgba(0,46,33,0.06)] overflow-hidden flex flex-col group cursor-pointer active:scale-[0.98] transition-all"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant">store</span>
        </div>
        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-label-sm font-label-sm uppercase tracking-wider backdrop-blur-md ${
              isActive
                ? 'bg-on-tertiary-container/10 text-on-tertiary-container'
                : 'bg-surface-container-highest/80 text-on-surface-variant'
            }`}
          >
            {isActive ? 'Abierto ahora' : 'Cerrado'}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-headline-md font-headline-md text-primary">{business.tradeName}</h3>
            <p className="text-on-surface-variant text-body-sm">
              {typeLabels[business.businessType] || business.businessType}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-surface-container px-2 py-1 rounded-lg">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="text-label-sm text-on-surface">4.7</span>
          </div>
        </div>
        <div className="mt-auto pt-4">
          <button
            onClick={(e) => { e.stopPropagation(); onClick?.() }}
            className="w-full bg-primary py-4 rounded-2xl text-on-primary font-label-lg hover:bg-primary-container transition-colors active:scale-95 flex items-center justify-center gap-2"
          >
            Ver productos
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}
