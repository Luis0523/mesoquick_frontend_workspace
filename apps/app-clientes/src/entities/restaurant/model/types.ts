export interface Restaurant {
  id: number
  nombre: string
  descripcion?: string
  direccion: string
  telefono: string
  correo?: string
  logo_url?: string
  disponible: boolean
  activo: boolean
}

export interface RestaurantSchedule {
  id?: number
  restaurante_id?: number
  dia_semana: number
  hora_apertura: string
  hora_cierre: string
}

export interface RestaurantCategory {
  id: number
  nombre: string
}
