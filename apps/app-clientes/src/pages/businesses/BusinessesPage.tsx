import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BusinessCard } from '../../widgets/business-card/BusinessCard'
import type { Business } from '../../entities/business/model/types'

const businessTypes = ['Todos', 'Farmacias', 'Tiendas', 'Conveniencia', 'Mascotas']

const mockBusinesses: Business[] = [
  { businessId: 1, tradeName: 'Farmacia San Rafael', businessType: 'pharmacy', businessStatus: 'active', description: 'Cuidado de la Salud', address: 'Zona 1', phone: '555-3001', email: 'sanrafael@example.com', logoUrl: '' },
  { businessId: 2, tradeName: 'La Tienda de Ana', businessType: 'convenience_store', businessStatus: 'active', description: 'Hogar y Estilo', address: 'Zona 3', phone: '555-3002' },
  { businessId: 3, tradeName: 'Express Local', businessType: 'convenience_store', businessStatus: 'active', description: 'Abarrotes y Conveniencia', address: 'Zona 5', phone: '555-3003' },
  { businessId: 4, tradeName: 'Mundo Mascotas', businessType: 'pet_store', businessStatus: 'active', description: 'Animales y Accesorios', address: 'Zona 2', phone: '555-3004' },
]

const typeFilterMap: Record<string, string | undefined> = {
  'Farmacias': 'pharmacy',
  'Tiendas': undefined,
  'Conveniencia': 'convenience_store',
  'Mascotas': 'pet_store',
}

export function BusinessesPage() {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('Todos')

  const filtered = selectedType === 'Todos'
    ? mockBusinesses
    : mockBusinesses.filter((b) => b.businessType === typeFilterMap[selectedType])

  return (
    <div>
      <section className="px-4 pt-8 pb-4">
        <h1 className="text-headline-xl-mobile font-headline-xl-mobile text-primary">Negocios activos</h1>
        <p className="text-on-surface-variant mt-1">Servicios locales y retail a tu disposición</p>
      </section>

      <div className="px-4 mb-6">
        <div className="relative flex items-center bg-surface-container-lowest border border-border-subtle rounded-full px-4 py-3 shadow-[0_4px_12px_rgba(0,46,33,0.06)]">
          <span className="material-symbols-outlined text-on-surface-variant mr-3">search</span>
          <input className="bg-transparent border-none focus:ring-0 w-full text-body-md placeholder:text-on-surface-variant/60 outline-none" placeholder="¿Qué negocio buscas?" />
        </div>
      </div>

      <section className="mb-6">
        <div className="flex overflow-x-auto gap-4 px-4 hide-scrollbar">
          {businessTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`flex-shrink-0 px-6 py-2.5 rounded-2xl font-label-lg transition-all active:scale-95 ${
                selectedType === type
                  ? 'bg-primary text-on-primary shadow-md'
                  : 'bg-surface border border-border-subtle text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-6">
        {filtered.map((b) => (
          <BusinessCard
            key={b.businessId}
            business={b}
            onClick={() => navigate(`/negocios/${b.businessId}`)}
          />
        ))}
      </section>
    </div>
  )
}
