export type DeliveryStatus =
  | 'pendiente'
  | 'asignado'
  | 'recogido'
  | 'en_camino'
  | 'entregado'
  | 'cancelado'

export interface DeliveryDriver {
  id: number
  nombre: string
  telefono?: string
  calificacion?: number
  fotoUrl?: string
}

export interface Delivery {
  id: number
  pedido_id: number
  repartidor?: DeliveryDriver
  estado: DeliveryStatus
  ubicacion_actual?: {
    lat: number
    lng: number
  }
  tiempo_estimado_minutos?: number
  created_at: string
}
