import { useNavigate } from 'react-router-dom'
import { OrderTimeline } from '../../widgets/order-timeline/OrderTimeline'
import { formatPrice } from '../../shared/utils/currency'

const mockOrder = {
  id: 8821,
  estado: 'en_camino' as const,
  items: [
    { nombre: 'Pizza Margherita Especial', cantidad: 1, precio: 12.50 },
    { nombre: 'Refresco de Cola 330ml', cantidad: 2, precio: 2.00 },
  ],
  subtotal: 16.50,
  total: 16.50,
  direccion: 'Calle Principal 123, 4B',
  driver: { nombre: 'Carlos M.', rating: 4.9, telefono: '+34 612 345 678' },
  timeline: [
    { estado: 'recibido' as const, fecha: '14:10', descripcion: 'Hemos recibido tu pedido con éxito.' },
    { estado: 'preparando' as const, fecha: '14:25', descripcion: 'El restaurante está cocinando tus platos.' },
    { estado: 'en_camino' as const, fecha: '14:38', descripcion: 'Carlos ya tiene tu pedido y se dirige a tu ubicación.' },
  ],
}

export function OrderTrackingPage() {
  const navigate = useNavigate()

  return (
    <div className="px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary">Pedido #{mockOrder.id}</h1>
          <p className="text-body-sm text-on-surface-variant">Llegada estimada: 14:45 - 15:00</p>
        </div>
        <span className="bg-on-tertiary-container/10 text-on-tertiary-container px-3 py-1 rounded-full text-label-sm font-label-lg">En camino</span>
      </div>

      <div className="bg-surface rounded-2xl overflow-hidden shadow-[0_4px_12px_rgba(12,70,53,0.06)] mb-6">
        <div className="w-full aspect-[16/9] bg-surface-container-highest flex items-center justify-center relative">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant">map</span>
          <div className="absolute bottom-4 left-4 right-4 bg-surface rounded-xl p-3 flex items-center gap-4 shadow-[0_4px_12px_rgba(12,70,53,0.06)]">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-fixed bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
            <div className="flex-1">
              <p className="text-label-lg font-bold text-primary">{mockOrder.driver.nombre}</p>
              <p className="text-label-sm text-on-surface-variant">Repartidor • {mockOrder.driver.rating} ★</p>
            </div>
            <button className="bg-primary text-on-primary p-2 rounded-full flex items-center justify-center active:scale-95 transition-all">
              <span className="material-symbols-outlined">call</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 shadow-[0_4px_12px_rgba(12,70,53,0.06)] mb-6">
        <h2 className="font-headline-md text-headline-md text-primary mb-6">Estado del pedido</h2>
        <OrderTimeline currentStatus={mockOrder.estado} />

        <div className="mt-10 space-y-3">
          <button className="w-full py-4 bg-primary text-on-primary rounded-2xl font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">receipt_long</span>
            Ver detalle
          </button>
          <button className="w-full py-4 border-2 border-primary text-primary rounded-2xl font-bold hover:bg-surface-container-low active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">support_agent</span>
            Contactar soporte
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 shadow-[0_4px_12px_rgba(12,70,53,0.06)]">
        <h2 className="font-headline-md text-headline-md text-primary mb-4">Resumen</h2>
        <div className="space-y-4">
          {mockOrder.items.map((item, i) => (
            <div key={i} className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-surface-container-high rounded-lg flex-shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant">fastfood</span>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-primary">{item.cantidad}x {item.nombre}</p>
                </div>
              </div>
              <span className="font-label-lg text-label-lg text-primary">{formatPrice(item.precio * item.cantidad)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border-subtle pt-4 mt-4 space-y-2">
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Subtotal</span>
            <span>{formatPrice(mockOrder.subtotal)}</span>
          </div>
          <div className="flex justify-between text-body-md text-on-surface-variant">
            <span>Envío</span>
            <span className="text-on-tertiary-container">Gratis</span>
          </div>
          <div className="flex justify-between text-headline-md font-headline-md text-primary pt-2">
            <span>Total</span>
            <span>{formatPrice(mockOrder.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-primary-container rounded-2xl p-8 text-on-primary relative overflow-hidden">
        <div className="relative z-10 max-w-md">
          <h3 className="text-headline-lg font-headline-lg mb-2">¿Olvidaste algo?</h3>
          <p className="text-on-primary-container mb-6">Añade una bebida o postre de tiendas locales cercanas.</p>
          <button
            onClick={() => navigate('/inicio')}
            className="px-6 py-2 bg-on-primary text-primary-container rounded-full font-bold text-label-lg hover:bg-white transition-colors"
          >
            Explorar tiendas
          </button>
        </div>
      </div>
    </div>
  )
}
