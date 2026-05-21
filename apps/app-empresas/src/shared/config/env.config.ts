/**
 * Configuración de variables de entorno
 * Centraliza todas las variables de entorno de la aplicación
 */

export const ENV = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://restaurantes.fly.dev/api',
  BUSINESS_API_BASE_URL: import.meta.env.VITE_BUSINESS_API_BASE_URL || 'https://proyectoarqui.onrender.com/api',
  COMMERCE_KIND: import.meta.env.VITE_COMMERCE_KIND || '',
  DEFAULT_BUSINESS_ID: Number(import.meta.env.VITE_DEFAULT_BUSINESS_ID || 2030001),
  DEFAULT_RESTAURANT_ID: Number(import.meta.env.VITE_DEFAULT_RESTAURANT_ID || 1),
  AUTH_MODE: import.meta.env.PROD ? 'broker' : import.meta.env.VITE_AUTH_MODE || 'broker',
  TEST_USER_EMAIL: import.meta.env.VITE_TEST_USER_EMAIL || 'test@mesoquick.com',
  TEST_USER_PASSWORD: import.meta.env.VITE_TEST_USER_PASSWORD || 'test1234',
  WS_URL: import.meta.env.VITE_WS_URL || 'wss://restaurantes.fly.dev',
  LOGISTICS_WS_URL: import.meta.env.VITE_LOGISTICS_WS_URL || 'https://modulo-logistica.fly.dev',
  LOGISTICS_API_URL: import.meta.env.VITE_LOGISTICS_API_URL || '/logistica-api',
  
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
    BUSINESS_API_BASE_URL: ENV.BUSINESS_API_BASE_URL,
    COMMERCE_KIND: ENV.COMMERCE_KIND,
    DEFAULT_BUSINESS_ID: ENV.DEFAULT_BUSINESS_ID,
    AUTH_MODE: ENV.AUTH_MODE,
    NODE_ENV: ENV.NODE_ENV,
    USE_MOCK: ENV.USE_MOCK,
  });
}
