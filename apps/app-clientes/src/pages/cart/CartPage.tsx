import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../features/manage-cart/model/cartStore'
import { formatPrice } from '../../shared/utils/currency'

export function CartPage() {
  const navigate = useNavigate()
  const { items, sourceName, notes, updateQuantity, removeItem, setOrderNotes, getSubtotal } = useCartStore()

  const subtotal = getSubtotal()
  const shipping = items.length > 0 ? 0 : 0
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 pt-20 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">shopping_cart</span>
        <h2 className="text-headline-lg font-headline-lg text-primary mb-2">Tu carrito está vacío</h2>
        <p className="text-body-md text-on-surface-variant mb-8">¿Qué se te antoja hoy?</p>
        <button
          onClick={() => navigate('/inicio')}
          className="bg-primary text-on-primary py-4 px-8 rounded-2xl font-label-lg text-label-lg active:scale-95 transition-all"
        >
          Explorar restaurantes
        </button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4 pb-36">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-primary">Tu Carrito</h1>
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-secondary font-label-lg text-label-lg hover:underline">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Agregar más
        </button>
      </div>

      {sourceName && (
        <p className="text-body-sm text-on-surface-variant mb-4">
          <span className="font-semibold text-primary">{sourceName}</span>
        </p>
      )}

      <section className="space-y-4">
        {items.map((item) => (
          <div key={item.productId} className="bg-surface rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,46,33,0.06)] flex flex-col gap-3 border border-surface-container-highest">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant">fastfood</span>
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md-mobile text-headline-md-mobile text-primary">{item.name}</h3>
                    {item.notes && <p className="text-body-sm text-on-surface-variant">{item.notes}</p>}
                  </div>
                  <span className="font-label-lg text-label-lg text-primary">{formatPrice(item.price)}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center bg-surface-container-low rounded-full px-2 py-1 border border-border-subtle">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container-high rounded-full active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined">remove</span>
                    </button>
                    <span className="px-3 font-label-lg text-label-lg text-on-surface">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-primary hover:bg-surface-container-high rounded-full active:scale-90 transition-all"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.productId)} className="text-error/80 hover:text-error transition-colors p-1">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="mt-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">notes</span>
          <input
            value={notes}
            onChange={(e) => setOrderNotes(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-border-subtle rounded-xl text-body-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/60"
            placeholder="Agregar nota al restaurante..."
          />
        </div>
      </div>

      <section className="mt-6 bg-surface rounded-2xl p-6 shadow-[0_4px_12px_rgba(0,46,33,0.06)] border border-surface-container-highest">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">Resumen de Pago</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Costo de Envío</span>
            <span className="text-on-tertiary-container font-medium">Gratis</span>
          </div>
          <div className="pt-3 border-t border-border-subtle flex justify-between items-center">
            <span className="font-headline-md text-headline-md text-primary">Total</span>
            <span className="font-headline-lg text-headline-lg text-primary">{formatPrice(total)}</span>
          </div>
        </div>
      </section>

      <div className="fixed bottom-0 left-0 w-full z-50 bg-surface border-t border-border-subtle px-4 py-4 pb-safe shadow-lg">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline-md text-headline-md flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
          >
            Continuar con el pago
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  )
}
