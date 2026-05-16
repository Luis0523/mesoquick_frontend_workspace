import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../features/manage-cart/model/cartStore'
import { formatPrice } from '../../shared/utils/currency'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, notes, getSubtotal, clearCart } = useCartStore()
  const [form, setForm] = useState({ nombre: '', telefono: '', direccion: '', instrucciones: '' })

  const subtotal = getSubtotal()
  const total = subtotal

  const handleConfirm = () => {
    clearCart()
    navigate('/pedidos/1')
  }

  return (
    <div className="min-h-dvh bg-background pb-32">
      <header className="flex justify-between items-center w-full px-4 py-2 sticky top-0 z-50 bg-surface border-b border-border-subtle shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="flex items-center justify-center p-2 active:scale-95 transition-all hover:bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="text-headline-md-mobile font-headline-md text-primary">Confirmar Pedido</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4 pb-32">
        <div className="bg-surface rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(12,70,53,0.06)] border border-border-subtle mb-6">
          <div className="h-48 w-full bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant">map</span>
          </div>
          <div className="absolute -mt-10 ml-4 flex items-center gap-2 bg-surface px-3 py-1.5 rounded-full shadow-md">
            <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
            <span className="font-label-lg text-label-lg text-primary">Ubicación exacta</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7 space-y-4">
            <div className="bg-surface p-6 rounded-2xl shadow-[0_4px_12px_rgba(12,70,53,0.06)] border border-border-subtle">
              <h2 className="font-headline-md text-headline-md mb-4 text-primary">Datos de Entrega</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-label-lg text-label-lg mb-1 text-on-surface-variant">Nombre Completo</label>
                  <input
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest outline-none transition-all"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div>
                  <label className="block font-label-lg text-label-lg mb-1 text-on-surface-variant">Teléfono de contacto</label>
                  <input
                    value={form.telefono}
                    onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest outline-none transition-all"
                    placeholder="+34 000 000 000"
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block font-label-lg text-label-lg mb-1 text-on-surface-variant">Dirección Exacta</label>
                  <input
                    value={form.direccion}
                    onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest outline-none transition-all"
                    placeholder="Calle, número, piso/puerta"
                  />
                </div>
                <div>
                  <label className="block font-label-lg text-label-lg mb-1 text-on-surface-variant">Instrucciones de Entrega</label>
                  <textarea
                    value={form.instrucciones}
                    onChange={(e) => setForm({ ...form, instrucciones: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border-subtle focus:ring-2 focus:ring-primary focus:border-primary bg-surface-container-lowest outline-none transition-all resize-none"
                    placeholder="Ej. El timbre no funciona, llamar al llegar..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-2xl shadow-[0_4px_12px_rgba(12,70,53,0.06)] border border-border-subtle">
              <h2 className="font-headline-md text-headline-md mb-4 text-primary">Método de Pago</h2>
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border-2 border-primary">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-container p-2 rounded-full text-on-primary">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <div>
                    <p className="font-label-lg text-label-lg text-primary">Pago contra entrega</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Paga en efectivo al recibir</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="bg-surface p-6 rounded-2xl shadow-[0_4px_12px_rgba(12,70,53,0.06)] border border-border-subtle sticky top-24">
              <h2 className="font-headline-md text-headline-md mb-4 text-primary">Resumen del Pedido</h2>
              <div className="space-y-4 mb-6">
                {items.slice(0, 3).map((item) => (
                  <div key={item.productId} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-surface-container-high rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">fastfood</span>
                      </div>
                      <div>
                        <p className="font-label-lg text-label-lg text-primary">{item.quantity}x {item.name}</p>
                        {item.notes && <p className="font-body-sm text-body-sm text-on-surface-variant">{item.notes}</p>}
                      </div>
                    </div>
                    <span className="font-label-lg text-label-lg text-primary">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-body-sm text-on-surface-variant text-center">+{items.length - 3} items más</p>
                )}
              </div>
              {notes && (
                <div className="mb-4 p-3 bg-surface-container-low rounded-xl">
                  <p className="text-body-sm text-on-surface-variant">
                    <span className="font-semibold">Nota:</span> {notes}
                  </p>
                </div>
              )}
              <div className="border-t border-border-subtle pt-4 space-y-2">
                <div className="flex justify-between text-body-md font-body-md text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-body-md font-body-md text-on-surface-variant">
                  <span>Costo de envío</span>
                  <span className="text-on-tertiary-container font-semibold">Gratis</span>
                </div>
                <div className="flex justify-between text-headline-md font-headline-md text-primary pt-2">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-6 p-3 bg-secondary/5 rounded-xl flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">timer</span>
                <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant">Entrega estimada: 30-45 min</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full p-4 bg-surface border-t border-border-subtle z-50">
        <button
          onClick={handleConfirm}
          className="w-full bg-primary text-on-primary py-4 rounded-2xl font-headline-md text-headline-md shadow-lg active:scale-95 transition-all flex justify-between items-center px-8"
        >
          <span>Confirmar pedido</span>
          <div className="flex items-center gap-2">
            <span className="w-px h-6 bg-white/20" />
            <span>{formatPrice(total)}</span>
          </div>
        </button>
      </div>
    </div>
  )
}
