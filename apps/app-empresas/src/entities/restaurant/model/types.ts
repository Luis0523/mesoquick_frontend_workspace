/**
 * Tipos y interfaces para la entidad Restaurant
 */

// Interfaz principal de Restaurant
export interface Restaurant {
  // Auto-generados por backend
  id: number;
  businessId?: number;
  fecha_creacion: string;        // ISO 8601 timestamp
  fecha_actualizacion: string | null;   // ISO 8601 timestamp
  
  // Campos obligatorios
  nombre: string;
  legalName?: string;
  businessType?: string;
  direccion: string;
  telefono: string;
  
  // Campos opcionales
  descripcion?: string | null;
  correo?: string | null;
  logo_url?: string | null;
  
  // Estados
  disponible: boolean;  // Toggle operacional (acepta pedidos ahora)
  activo: boolean;      // Soft delete (existe en BD)
  businessStatus?: string;
  
  // Relaciones (opcional en la respuesta)
  horarios?: unknown[]; // TODO: Tipar cuando se implemente Schedule
}

// DTO para crear un restaurante
export interface CreateRestaurantDTO {
  nombre: string;
  direccion: string;
  telefono: string;
  descripcion?: string;
  correo?: string;
  logo_url?: string;
  disponible?: boolean;
}

// DTO para actualizar un restaurante (todos los campos opcionales)
export type UpdateRestaurantDTO = Partial<CreateRestaurantDTO>;

// DTO para toggle de disponibilidad
export interface ToggleAvailabilityDTO {
  disponible: boolean;
}

// Query params para listar restaurantes
export interface RestaurantQueryParams {
  activo?: boolean;
  disponible?: boolean;
}

// Validación de campos
export const RESTAURANT_VALIDATION = {
  nombre: {
    required: true,
    minLength: 3,
    maxLength: 255,
  },
  telefono: {
    required: true,
    pattern: /^[0-9-+\s()]+$/,
    minLength: 8,
  },
  direccion: {
    required: true,
    minLength: 10,
  },
  correo: {
    required: false,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
} as const;
