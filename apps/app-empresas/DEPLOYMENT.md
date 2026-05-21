# Deployment

## Vercel

Este frontend esta preparado para desplegarse como app Vite en Vercel.

### Build

```bash
npm run build
```

### Variables de produccion

```env
VITE_API_BASE_URL=/api
VITE_BUSINESS_API_BASE_URL=/business-api
VITE_AUTH_MODE=broker
VITE_COMMERCE_KIND=restaurant
VITE_DEFAULT_RESTAURANT_ID=4
VITE_DEFAULT_BUSINESS_ID=2030001
VITE_WS_URL=wss://restaurantes.fly.dev
VITE_USE_MOCK=false
```

`vercel.json` redirige `/api` hacia el broker y `/business-api` hacia el servicio de negocios para evitar problemas de CORS desde el navegador.

En produccion, `VITE_AUTH_MODE` se fuerza a `broker` desde codigo aunque exista otra variable configurada.
