import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProductCard } from '../../widgets/product-card/ProductCard'
import { CartSummary } from '../../widgets/cart-summary/CartSummary'
import { useCartStore } from '../../features/manage-cart/model/cartStore'
import type { RestaurantProduct } from '../../entities/product/model/types'

const mockProducts: RestaurantProduct[] = [
  { id: 1, restaurante_id: 1, nombre: 'Tacos de Canasta', descripcion: 'Surtido de 3 tacos (papa, adobo y frijol) acompañados de salsa verde casera.', precio: 45.00, activo: true },
  { id: 2, restaurante_id: 1, nombre: 'Empanadas de Viento', descripcion: 'Empanadas de queso fritas espolvoreadas con azúcar fina. 2 unidades.', precio: 38.00, activo: true },
  { id: 3, restaurante_id: 1, nombre: 'Enchiladas Verdes', descripcion: '4 tortillas rellenas de pollo deshebrado bañadas en salsa verde, crema y queso fresco.', precio: 115.00, activo: true },
  { id: 4, restaurante_id: 1, nombre: 'Mole Poblano', descripcion: 'Pieza de pollo servida con mole artesanal, ajonjolí y arroz a la mexicana.', precio: 145.00, activo: true },
]

const categories = ['Entradas', 'Platos Fuertes', 'Bebidas', 'Postres', 'Para Compartir']

export function RestaurantDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, setSource, items } = useCartStore()
  const [activeCategory, setActiveCategory] = useState('Entradas')

  const handleAdd = (product: RestaurantProduct) => {
    setSource(Number(id), mockRestaurant?.nombre || 'Restaurante', 'restaurant')
    addItem({
      productId: product.id,
      sourceType: 'restaurant',
      sourceId: Number(id),
      sourceName: mockRestaurant?.nombre || '',
      name: product.nombre,
      price: product.precio,
      quantity: 1,
      imageUrl: undefined,
    })
  }

  const mockRestaurant = {
    id: 1,
    nombre: 'La Cocina de Doña Rosa',
    descripcion: 'Especialistas en comida tradicional local con un toque moderno y fresco.',
    direccion: 'Calle Real 45, Centro',
    telefono: '555-2001',
    disponible: true,
    activo: true,
  }

  return (
    <div className="min-h-dvh bg-background pb-32">
      <header className="flex justify-between items-center w-full px-4 py-2 sticky top-0 z-50 bg-surface shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="active:scale-95 transition-all p-2 hover:bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <span className="text-headline-md-mobile font-headline-md text-primary truncate max-w-[200px]">{mockRestaurant.nombre}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="active:scale-95 transition-all p-2 hover:bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined text-primary">share</span>
          </button>
        </div>
      </header>

      <section className="relative w-full h-64 overflow-hidden">
        <div className="w-full h-full bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-8xl text-primary-container">restaurant</span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <div className="flex gap-2 mb-2">
            <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-label-sm font-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.8
            </span>
            <span className="bg-surface text-secondary px-3 py-1 rounded-full text-label-sm font-label-sm">Premium</span>
          </div>
          <h1 className="text-headline-xl-mobile font-headline-xl-mobile text-white">{mockRestaurant.nombre}</h1>
        </div>
      </section>

      <section className="px-4 py-4 bg-surface border-b border-border-subtle">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-label-sm font-label-sm font-bold">Abierto</span>
            <span className="text-on-surface-variant text-body-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">schedule</span> 25-35 min
            </span>
          </div>
          <span className="text-on-surface-variant text-body-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">delivery_dining</span> $15.00
          </span>
        </div>
        <p className="mt-2 text-on-surface-variant text-body-sm">{mockRestaurant.descripcion}</p>
      </section>

      <nav className="sticky top-14 z-40 bg-surface border-b border-border-subtle hide-scrollbar overflow-x-auto flex whitespace-nowrap px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-4 px-4 border-b-2 transition-colors text-label-lg whitespace-nowrap ${
              activeCategory === cat
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-on-surface-variant hover:text-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      <main className="p-4 space-y-4">
        <h2 className="text-headline-md font-headline-md text-primary mt-4">{activeCategory} Populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProducts.map((p) => (
            <ProductCard
              key={p.id}
              name={p.nombre}
              description={p.descripcion}
              price={p.precio}
              onAdd={() => handleAdd(p)}
            />
          ))}
        </div>
      </main>

      {items.length > 0 && <CartSummary />}
    </div>
  )
}
