/**
 * Tipos comunes de API
 */

// Response genérica de la API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

// Parámetros de query comunes
export interface QueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

// Query params para filtrado de recursos
export interface FilterParams {
  activo?: boolean;
  disponible?: boolean;
}

// Metadata de paginación (si la API lo soporta)
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Response con paginación
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
