export const ENV = {
  RESTAURANTS_API_URL: import.meta.env.VITE_RESTAURANTS_API_URL || 'https://restaurantes.fly.dev',
  BUSINESSES_API_URL: import.meta.env.VITE_BUSINESSES_API_URL || 'https://proyectoarqui.onrender.com',
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.MODE === 'production',
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
  USE_MOCK: import.meta.env.VITE_USE_MOCK === 'true',
} as const

if (ENV.IS_DEVELOPMENT) {
  console.log('🔧 ENV:', {
    RESTAURANTS_API_URL: ENV.RESTAURANTS_API_URL,
    BUSINESSES_API_URL: ENV.BUSINESSES_API_URL,
  })
}
