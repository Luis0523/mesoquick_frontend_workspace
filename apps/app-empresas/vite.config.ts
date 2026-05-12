import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5174, // Puerto para app-empresas (repartidores usa 5173)
    host: '0.0.0.0', // Permitir conexiones externas
    watch: {
      usePolling: true, // Necesario para Docker
    },
    proxy: {
      // Proxy para evitar CORS
      '/api': {
        target: 'https://broker-services-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/business-api': {
        target: 'https://proyectoarqui.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/business-api/, '/api'),
      },
    },
  },
})
