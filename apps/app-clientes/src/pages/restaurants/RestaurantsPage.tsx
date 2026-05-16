import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Restaurant } from '../../entities/restaurant/model/types'

const categories = ['Todos', 'Pizza', 'Hamburguesas', 'Tacos', 'Sushi', 'Postres']

const mockRestaurants: (Restaurant & { rating: number })[] = [
  { id: 1, nombre: 'La Bella Italia', descripcion: 'Auténtica cocina italiana con ingredientes importados y pasta hecha a mano.', direccion: 'Av. Italia 123', telefono: '555-1001', disponible: true, activo: true, rating: 4.8 },
  { id: 2, nombre: 'Burger Master', descripcion: 'Hamburguesas de autor con carne premium seleccionada y salsas de la casa.', direccion: 'Calle 5 #10', telefono: '555-1002', disponible: true, activo: true, rating: 4.5 },
  { id: 3, nombre: 'Tokyo Sushi Bar', descripcion: 'El mejor sushi de la ciudad preparado por maestros expertos.', direccion: 'Zona Viva', telefono: '555-1003', disponible: false, activo: true, rating: 4.3 },
]

export function RestaurantsPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  const filtered = mockRestaurants.filter((r) => {
    if (onlyAvailable && !r.disponible) return false
    return true
  })

  return (
    <div>
      <div className="py-4 overflow-x-auto whitespace-nowrap px-4 flex gap-4 hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 py-2 rounded-full font-label-lg text-label-lg active:scale-95 transition-all ${
              selectedCategory === cat
                ? 'bg-primary text-on-primary'
                : 'bg-white text-primary border border-border-subtle hover:bg-surface-container-low'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 pb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-body-md font-body-md text-on-surface">Solo disponibles</span>
          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              onlyAvailable ? 'bg-primary-container' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                onlyAvailable ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <button className="flex items-center gap-1 text-primary font-label-lg text-label-lg">
          <span className="material-symbols-outlined">filter_list</span>
          Filtros
        </button>
      </div>

      <section className="px-4 space-y-6">
        {filtered.map((r) => (
          <article
            key={r.id}
            onClick={() => navigate(`/restaurantes/${r.id}`)}
            className={`bg-surface rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(0,46,33,0.06)] hover:translate-y-[-2px] transition-transform duration-300 cursor-pointer group ${
              !r.disponible ? 'opacity-75 grayscale-[0.3]' : ''
            }`}
          >
            <div className="relative aspect-video w-full overflow-hidden">
              <div className="w-full h-full bg-surface-container-highest group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-on-surface-variant">restaurant</span>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-tertiary-fixed/90 text-on-tertiary-fixed px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {r.rating}
                </span>
              </div>
              {!r.disponible && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="bg-white/90 text-primary px-4 py-2 rounded-full font-label-lg text-label-lg">Cerrado ahora</span>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-headline-md font-headline-md text-primary">{r.nombre}</h2>
                <span className={`px-3 py-1 rounded-full text-label-sm font-label-sm ${r.disponible ? 'bg-green-100 text-green-700' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                  {r.disponible ? 'Disponible' : 'Cerrado'}
                </span>
              </div>
              <p className="text-body-md font-body-md text-on-surface-variant mb-4">{r.descripcion}</p>
              <div className="flex items-center gap-4 text-on-surface-variant">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  <span className="text-body-sm font-body-sm">25-35 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">delivery_dining</span>
                  <span className="text-body-sm font-body-sm">Envío gratis</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
