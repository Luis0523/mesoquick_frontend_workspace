import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../features/manage-cart/model/cartStore'

export function ProductDetailPage() {
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const product = {
    id: 1,
    name: 'Hamburguesa de la Casa',
    description: 'Nuestra hamburguesa insignia preparada con 200g de carne de res premium, queso cheddar madurado, cebollas caramelizadas al vino tinto, arúgula fresca y nuestra salsa secreta en pan brioche artesanal.',
    price: 12.50,
    rating: 4.8,
    estimatedTime: '20-30 min',
  }

  const handleAdd = () => {
    addItem({
      productId: product.id,
      sourceType: 'restaurant',
      sourceId: 1,
      sourceName: 'La Cocina de Doña Rosa',
      name: product.name,
      price: product.price,
      quantity,
      notes,
    })
    navigate(-1)
  }

  return (
    <div className="min-h-dvh bg-background pb-32">
      <header className="flex justify-between items-center w-full px-4 py-2 sticky top-0 z-50 bg-surface shadow-sm">
        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low active:scale-95 transition-all">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
        </button>
        <div className="flex-1 flex flex-col items-center">
          <span className="text-label-sm font-label-sm text-on-surface-variant">Calle Principal 123</span>
        </div>
        <button onClick={() => navigate('/carrito')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low active:scale-95 transition-all">
          <span className="material-symbols-outlined text-primary">shopping_cart</span>
        </button>
      </header>

      <section className="relative w-full aspect-[4/3] overflow-hidden">
        <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
          <span className="material-symbols-outlined text-8xl text-on-surface-variant">lunch_dining</span>
        </div>
        <div className="absolute top-4 right-4">
          <button className="bg-surface/80 backdrop-blur-md p-2 rounded-full shadow-md text-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined">favorite</span>
          </button>
        </div>
      </section>

      <article className="px-4 -mt-6 relative z-10 bg-surface rounded-t-2xl pt-6">
        <div className="flex justify-between items-start mb-2">
          <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-primary">{product.name}</h1>
          <span className="font-headline-md text-headline-md text-secondary">${product.price.toFixed(2)}</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4 leading-relaxed">
          {product.description}
        </p>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg">
            <span className="material-symbols-outlined text-tertiary-container mr-1 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="font-label-lg text-label-lg text-on-surface">{product.rating} (120+)</span>
          </div>
          <div className="flex items-center bg-surface-container-low px-2 py-1 rounded-lg">
            <span className="material-symbols-outlined text-on-surface-variant mr-1 text-[18px]">schedule</span>
            <span className="font-label-lg text-label-lg text-on-surface">{product.estimatedTime}</span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-headline-md text-headline-md-mobile text-primary">Instrucciones Especiales</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-32 p-4 bg-surface-container-lowest border border-border-subtle rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-on-surface-variant/50 text-body-md font-body-md resize-none"
              placeholder="Ej. Sin cebolla, aderezo aparte..."
            />
          </div>

          <div className="flex items-center justify-center gap-8 py-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container-high text-primary hover:bg-surface-container-highest active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
            <span className="font-headline-lg text-headline-lg text-on-surface">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-container active:scale-90 transition-all shadow-md"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </article>

      <footer className="fixed bottom-0 left-0 w-full bg-surface shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-4 pt-4 pb-8 z-50">
        <div className="max-w-screen-xl mx-auto">
          <button
            onClick={handleAdd}
            className="w-full bg-primary text-on-primary py-4 px-6 rounded-2xl flex justify-between items-center hover:bg-primary-container transition-all active:scale-[0.98] shadow-lg"
          >
            <span className="font-label-lg text-label-lg uppercase tracking-wider">Agregar al carrito</span>
            <span className="font-headline-md text-headline-md">${(product.price * quantity).toFixed(2)}</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
