import { useNavigate } from 'react-router-dom'

const recentResults = [
  { id: 1, name: 'La Vera Pizza', type: 'Restaurante', tags: 'Italiana • Pizza', time: '25-35 min', rating: 4.8, badge: 'Abierto', badgeVariant: 'success' as const },
  { id: 2, name: 'BioMarket Centro', type: 'Negocio', tags: 'Supermercado • Orgánico', time: '15-20 min', rating: 4.7, badge: 'Premium', badgeVariant: 'secondary' as const },
  { id: 3, name: 'Burger Craft', type: 'Restaurante', tags: 'Hamburguesas • Americana', time: '30-40 min', rating: 4.5, badge: 'Cierra pronto', badgeVariant: 'warning' as const },
]

export function SearchPage() {
  const navigate = useNavigate()

  return (
    <div>
      <section className="px-4 pt-4 pb-2 sticky top-[53px] bg-background z-40">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full pl-12 pr-4 py-4 bg-surface border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none text-body-md font-body-md placeholder:text-on-surface-variant/60 shadow-[0_4px_12px_rgba(12,70,53,0.06)]"
            placeholder="¿Qué se te antoja hoy?"
            autoFocus
          />
        </div>
      </section>

      <section className="flex overflow-x-auto gap-2 px-4 py-4 hide-scrollbar">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary rounded-full text-label-lg font-label-lg whitespace-nowrap active:scale-95 transition-all">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Filtros
        </button>
        {['Abierto ahora', 'Envío gratis', 'Mejor valorados'].map((chip) => (
          <button
            key={chip}
            className="px-4 py-2 bg-surface-container-low text-on-surface border border-border-subtle rounded-full text-label-lg font-label-lg whitespace-nowrap hover:bg-surface-container-high transition-colors"
          >
            {chip}
          </button>
        ))}
      </section>

      <section className="px-4 mb-6">
        <h2 className="text-headline-md font-headline-md mb-4">Categorías</h2>
        <div className="grid grid-cols-2 grid-rows-2 gap-3 h-[280px]">
          <div className="relative rounded-2xl overflow-hidden bg-primary-container col-span-1 row-span-2 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-4">
              <span className="text-on-primary font-headline-md text-headline-md">Restaurantes</span>
              <span className="text-on-primary/80 text-label-sm font-label-sm">Lo mejor de la zona</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-secondary-container col-span-1 row-span-1 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent flex flex-col justify-end p-4">
              <span className="text-on-primary font-headline-md text-headline-md">Mercado</span>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden bg-tertiary-container col-span-1 row-span-1 cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-tertiary/80 to-transparent flex flex-col justify-end p-4">
              <span className="text-on-primary font-headline-md text-headline-md">Panadería</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-6">
        <h2 className="text-headline-md font-headline-md mb-4">Resultados para ti</h2>
        <div className="flex flex-col gap-4">
          {recentResults.map((result) => (
            <div
              key={result.id}
              onClick={() => navigate(result.type === 'Restaurante' ? `/restaurantes/${result.id}` : `/negocios/${result.id}`)}
              className="bg-surface border border-border-subtle rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(12,70,53,0.06)] group active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="relative h-48 bg-surface-container-higher flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant">
                  {result.type === 'Restaurante' ? 'restaurant' : 'store'}
                </span>
                <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-label-sm font-label-sm font-bold text-on-surface">{result.rating}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-headline-lg text-headline-lg text-primary">{result.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-label-sm font-label-sm ${
                    result.badgeVariant === 'success' ? 'bg-green-100 text-green-700' :
                    result.badgeVariant === 'warning' ? 'bg-surface-container-highest/50 text-on-surface-variant' :
                    'bg-primary/5 text-primary'
                  }`}>
                    {result.badge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-body-sm font-body-sm">
                  <span>{result.tags}</span>
                  <span>•</span>
                  <span>{result.time}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[18px]">delivery_dining</span>
                    <span className="text-label-sm font-label-sm">Envío gratis</span>
                  </div>
                  <span className="text-label-sm font-label-sm">Pedido min. 10€</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
