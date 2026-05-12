/**
 * Configuración de Axios
 * Define la configuración base para todas las peticiones HTTP
 */

import { ENV } from './env.config';

export const API_CONFIG = {
  baseURL: ENV.API_BASE_URL,
  timeout: 15000, // 15 segundos
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Cambiar a true si se necesitan cookies
} as const;

// Endpoints comunes (para referencia)
export const ENDPOINTS = {
  // Restaurantes
  RESTAURANTS: '/restaurantes',
  RESTAURANT_BY_ID: (id: number) => `/restaurantes/${id}`,
  RESTAURANT_AVAILABILITY: (id: number) => `/restaurantes/${id}/disponibilidad`,
  
  // Productos
  PRODUCTS: (restaurantId: number) => `/restaurantes/${restaurantId}/productos`,
  PRODUCT_BY_ID: (restaurantId: number, productId: number) => 
    `/restaurantes/${restaurantId}/productos/${productId}`,
  PRODUCT_TOGGLE: (restaurantId: number, productId: number) => 
    `/restaurantes/${restaurantId}/productos/${productId}/activo`,
  
  // Horarios
  SCHEDULES: (restaurantId: number) => `/restaurantes/${restaurantId}/horarios`,
  SCHEDULE_BY_ID: (restaurantId: number, scheduleId: number) => 
    `/restaurantes/${restaurantId}/horarios/${scheduleId}`,
  SCHEDULE_TOGGLE: (restaurantId: number, scheduleId: number) => 
    `/restaurantes/${restaurantId}/horarios/${scheduleId}/activo`,
} as const;
