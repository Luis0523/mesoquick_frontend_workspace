import { useNavigate } from 'react-router-dom'
import type { Order, OrderStatus } from '../../entities/order/model/types'

const mockOrders: Order[] = [
  {
    id: 8821, restaurante_id: 1, cliente_nombre: 'Carlos', cliente_telefono: '555-0001',
    direccion_entrega: 'Calle Principal 123', estado: 'en_camino',
    items: [{ producto_id: 1, nombre: 'Pizza Pepperoni Familiar', cantidad: 1, precio_unitario: 18.50, subtotal: 18.50 }],
    subtotal: 18.50, costo_envio: 0, total: 18.50, metodo_pago: 'Efectivo',
    timeline: [], created_at: new Date().toISOString(),
  },
  {
    id: 8815, restaurante_id: 2, cliente_nombre: 'Carlos', cliente_telefono: '555-0001',
    direccion_entrega: 'Calle Principal 123', estado: 'entregado',
    items: [{ producto_id: 2, nombre: 'Hamburguesa Clásica', cantidad: 2, precio_unitario: 12.00, subtotal: 24.00 }],
    subtotal: 24.00, costo_envio: 2.50, total: 26.50, metodo_pago: 'Efectivo',
    timeline: [], created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 8800, restaurante_id: 1, cliente_nombre: 'Carlos', cliente_telefono: '555-0001',
    direccion_entrega: 'Calle Principal 123', estado: 'entregado',
    items: [{ producto_id: 1, nombre: 'Tacos de Canasta', cantidad: 3, precio_unitario: 15.00, subtotal: 45.00 }],
    subtotal: 45.00, costo_envio: 0, total: 45.00, metodo_pago: 'Efectivo',
    timeline: [], created_at: new Date(Date.now() - 172800000).toISOString(),
  },
]

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  pendiente: { label: 'Pendiente', color: 'text-on-tertiary-container bg-on-tertiary-container/10', icon: 'schedule' },
  recibido: { label: 'Recibido', color: 'text-on-tertiary-container bg-on-tertiary-container/10', icon: 'check_circle' },
  preparando: { label: 'Preparando', color: 'text-secondary bg-secondary/5', icon: 'cooking' },
  listo: { label: 'Listo', color: 'text-on-tertiary-container bg-on-tertiary-container/10', icon: 'check_circle' },
  en_camino: { label: 'En camino', color: 'text-secondary bg-secondary/5', icon: 'delivery_dining' },
  entregado: { label: 'Entregado', color: 'text-green-700 bg-green-100', icon: 'check_circle' },
  cancelado: { label: 'Cancelado', color: 'text-error bg-error-container/20', icon: 'cancel' },
}

export function OrdersPage() {
  const navigate = useNavigate()

  const getRelativeDay = (isoDate: string) => {
    const d = new Date(isoDate)
    const today = new Date()
    const diff = Math.floor((today.getTime() - d.getTime()) / 86400000)
    if (diff === 0) return 'Hoy'
    if (diff === 1) return 'Ayer'
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="px-4 pt-6 pb-6">
      <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-primary mb-6">Mis Pedidos</h1>

      {mockOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-16 text-center">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">receipt_long</span>
          <h2 className="text-headline-md font-headline-md text-primary mb-2">No tienes pedidos aún</h2>
          <p className="text-body-md text-on-surface-variant mb-8">Haz tu primer pedido y aparecerá aquí.</p>
          <button
            onClick={() => navigate('/inicio')}
            className="bg-primary text-on-primary py-4 px-8 rounded-2xl font-label-lg text-label-lg active:scale-95 transition-all"
          >
            Explorar restaurantes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {mockOrders.map((order) => {
            const cfg = statusConfig[order.estado]
            return (
              <div
                key={order.id}
                onClick={() => navigate(`/pedidos/${order.id}`)}
                className="bg-surface p-4 rounded-2xl border border-border-subtle shadow-[0_4px_12px_rgba(0,46,33,0.06)] flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-2xl text-on-surface-variant">restaurant</span>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <p className="font-label-lg text-label-lg text-on-surface">Pedido #{order.id}</p>
                    <p className="font-label-sm text-label-sm text-text-secondary">{getRelativeDay(order.created_at)}</p>
                  </div>
                  <p className="font-body-sm text-body-sm text-text-secondary">
                    {order.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')}
                  </p>
                  <span className={`font-label-sm text-label-sm mt-1 inline-flex items-center gap-1 ${cfg.color} px-2 py-0.5 rounded-full`}>
                    <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span> {cfg.label}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
