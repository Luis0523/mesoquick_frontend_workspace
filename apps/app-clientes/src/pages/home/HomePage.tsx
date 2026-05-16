import { useNavigate } from 'react-router-dom'
import { SectionHeader } from '../../widgets/hero-search/SectionHeader'
import { CategoryChips } from '../../widgets/hero-search/CategoryChips'
import { RestaurantCard } from '../../widgets/restaurant-card/RestaurantCard'
import type { Restaurant } from '../../entities/restaurant/model/types'
import type { Business } from '../../entities/business/model/types'

const categories = [
  { icon: 'local_pizza', label: 'Pizza' },
  { icon: 'lunch_dining', label: 'Burgers' },
  { icon: 'icecream', label: 'Postres' },
  { icon: 'local_cafe', label: 'Café' },
  { icon: 'bakery_dining', label: 'Panadería' },
  { icon: 'shopping_basket', label: 'Súper' },
]

const mockRestaurants: Restaurant[] = [
  { id: 1, nombre: 'El Fogón Criollo', descripcion: 'Comida Típica • Parrilla • Tradición', direccion: 'Av. Principal', telefono: '555-0101', disponible: true, activo: true },
  { id: 2, nombre: 'Burger House', descripcion: 'Hamburguesas • Americana', direccion: 'Av. Central', telefono: '555-0102', disponible: true, activo: true },
  { id: 3, nombre: 'Sushi Garden', descripcion: 'Sushi • Japonés', direccion: 'Calle 5', telefono: '555-0103', disponible: true, activo: true },
]

const mockBusinesses: Business[] = [
  { businessId: 1, tradeName: 'La Esquina Gourmet', businessType: 'supermarket', businessStatus: 'active', description: 'Víveres y Delicatesen', address: 'Zona 1' },
  { businessId: 2, tradeName: 'Pan Artesano San José', businessType: 'bakery', businessStatus: 'active', description: 'Panadería y Pastelería', address: 'Zona 3' },
  { businessId: 3, tradeName: 'Farmacia San Rafael', businessType: 'pharmacy', businessStatus: 'active', description: 'Cuidado de la Salud', address: 'Zona 5' },
]

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="pb-6">
      <section className="px-4 pt-4 flex flex-col gap-4">
        <h1 className="text-headline-xl-mobile font-headline-xl-mobile text-primary">
          Hola, ¿qué se te antoja hoy?
        </h1>
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            className="w-full pl-12 pr-4 py-4 rounded-full border-none bg-surface shadow-sm focus:ring-2 focus:ring-primary text-body-md font-body-md"
            placeholder="Busca comida, tiendas o productos"
            onFocus={() => navigate('/buscar')}
          />
        </div>
      </section>

      <section className="px-4 mt-8">
        <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-primary-container flex items-center justify-between p-6">
          <div className="z-10 max-w-[60%]">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-primary mb-2">
              Envío gratis en tu primer pedido
            </h2>
            <p className="text-body-sm font-body-sm text-on-primary-container">
              Usa el código BIENVENIDO y disfruta del sabor local sin salir de casa.
            </p>
            <button className="mt-4 bg-secondary text-on-secondary px-6 py-2 rounded-full font-label-lg text-label-lg shadow-lg active:scale-95 transition-transform">
              Pedir ahora
            </button>
          </div>
          <div className="absolute right-[-10%] top-0 h-full w-1/2 overflow-hidden transform skew-x-[-12deg] bg-secondary-container" />
        </div>
      </section>

      <section className="mt-8">
        <SectionHeader title="Categorías" />
        <CategoryChips categories={categories} />
      </section>

      <section className="mt-8 px-4">
        <SectionHeader title="Restaurantes activos" actionLabel="Ver todos" onAction={() => navigate('/restaurantes')} />
        <div className="grid grid-cols-1 gap-4">
          {mockRestaurants.slice(0, 1).map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onClick={() => navigate(`/restaurantes/${r.id}`)} />
          ))}
          <div className="grid grid-cols-2 gap-4">
            {mockRestaurants.slice(1).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} variant="compact" onClick={() => navigate(`/restaurantes/${r.id}`)} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-8">
        <SectionHeader title="Negocios cerca de ti" />
        <div className="flex overflow-x-auto gap-4 px-4 hide-scrollbar">
          {mockBusinesses.map((b) => (
            <div
              key={b.businessId}
              onClick={() => navigate(`/negocios/${b.businessId}`)}
              className="flex-shrink-0 w-64 bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-sm cursor-pointer active:scale-[0.98] transition-all"
            >
              <div className="w-full h-32 bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">store</span>
              </div>
              <div className="p-4">
                <h5 className="font-bold text-primary">{b.tradeName}</h5>
                <p className="text-body-sm text-on-surface-variant mb-3">{b.description}</p>
                <span className="bg-on-tertiary-container/10 text-on-tertiary-container text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                  Abierto ahora
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
