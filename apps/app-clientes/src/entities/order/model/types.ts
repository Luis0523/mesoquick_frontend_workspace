export type OrderStatus =
  | 'pendiente'
  | 'recibido'
  | 'preparando'
  | 'listo'
  | 'en_camino'
  | 'entregado'
  | 'cancelado'

export interface OrderTimelineEntry {
  estado: OrderStatus
  fecha: string
  descripcion?: string
}

export interface OrderItem {
  id?: number
  producto_id: number | string
  nombre: string
  cantidad: number
  precio_unitario: number
  notas?: string
  subtotal: number
}

export interface Order {
  id: number
  restaurante_id?: number
  business_id?: number
  cliente_nombre: string
  cliente_telefono: string
  direccion_entrega: string
  referencia?: string
  instrucciones?: string
  estado: OrderStatus
  items: OrderItem[]
  subtotal: number
  costo_envio: number
  total: number
  metodo_pago: string
  timeline: OrderTimelineEntry[]
  created_at: string
  updated_at?: string
}
