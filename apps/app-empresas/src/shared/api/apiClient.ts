/**
 * Cliente Axios configurado
 * Instancia única de axios con interceptores globales
 * 
 * TODO: Migrar a @mesoquick/core-network cuando esté disponible
 * Según manual de estandarización, todas las peticiones deben usar
 * la instancia Singleton del paquete compartido para garantizar:
 * - Inyección automática de JWT
 * - Manejo de 401 con refresh token
 * - Manejo de 5xx con reconexión automática
 */

import axios, { AxiosError } from 'axios';
import { API_CONFIG } from '../config/api.config';
import { ENV } from '../config/env.config';
import { getAuthToken } from '@/features/auth/model/useAuthStore';

// Crear instancia de axios
export const apiClient = axios.create(API_CONFIG);

// Interceptor de Request
apiClient.interceptors.request.use(
  (config) => {
    // Log en desarrollo
    if (ENV.IS_DEVELOPMENT) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
    }

    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor de Response
apiClient.interceptors.response.use(
  (response) => {
    // Log en desarrollo
    if (ENV.IS_DEVELOPMENT) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores global
    if (error.response) {
      const status = error.response.status;
      
      switch (status) {
        case 401:
          console.error('🔒 No autorizado - Redirigir a login');
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        
        case 403:
          console.error('🚫 Acceso denegado');
          break;
        
        case 404:
          console.error('🔍 Recurso no encontrado');
          break;
        
        case 500:
          console.error('💥 Error del servidor');
          break;
        
        default:
          console.error(`❌ Error ${status}:`, error.response.data);
      }
    } else if (error.request) {
      console.error('📡 Sin respuesta del servidor:', error.message);
    } else {
      console.error('❌ Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Helper para manejo de errores tipado
export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message || 'Error desconocido',
      status: error.response?.status,
      data: error.response?.data,
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: 'Error desconocido',
  };
};
