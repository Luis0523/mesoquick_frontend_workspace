export interface Customer {
  nombre: string
  telefono: string
  correo?: string
}

export interface DeliveryAddress {
  direccion: string
  referencia?: string
  lat?: number
  lng?: number
}
