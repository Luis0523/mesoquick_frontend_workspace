/**
 * Configuración de variables de entorno
 * Centraliza todas las variables de entorno de la aplicación
 */

export const ENV = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://restaurantes.fly.dev/api',
  WS_URL: import.meta.env.VITE_WS_URL || 'wss://restaurantes.fly.dev',
  
  // Environment
  NODE_ENV: import.meta.env.VITE_NODE_ENV || import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  
  // Mock mode
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
} as const;

// Log configuration en desarrollo
if (ENV.IS_DEVELOPMENT) {
  console.log('🔧 Environment Configuration:', {
    API_BASE_URL: ENV.API_BASE_URL,
    NODE_ENV: ENV.NODE_ENV,
    USE_MOCK: ENV.USE_MOCK,
  });
}
