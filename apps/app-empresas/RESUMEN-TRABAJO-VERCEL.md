# Resumen de Trabajo y Despliegue en Vercel

## Objetivo

Preparar `app-empresas` para operar tanto con el modulo de restaurantes como con el modulo de negocios generales, validar los endpoints disponibles desde colecciones Postman y dejar el frontend listo para despliegue en Vercel.

## Validaciones de Backend Realizadas

### Negocios generales

Se reviso la coleccion:

```txt
context/endpoints_base/negocios/MS-BUSINESS - Inventory Stable v3.postman_collection.json
```

Se valido que el backend correcto requiere prefijo `/api`:

```txt
https://proyectoarqui.onrender.com/api
```

Pruebas realizadas:

```txt
GET /api/health
GET /api/businesses
POST /api/businesses
POST /api/businesses/:businessId/product-types
POST /api/businesses/:businessId/products
GET /api/businesses/:businessId/catalog
GET /api/businesses/:businessId/inventory/products/:productId
```

Datos creados para pruebas:

```txt
businessId: 2030001
productTypeId: 60001
productId: 60001
```

### Restaurantes

Se revisaron las colecciones:

```txt
context/endpoints_base/restaurantes/PRODUCTOS-COLLECTION.postman_collection.json
context/endpoints_base/restaurantes/PEDIDOS-COLLECTION.postman_collection.json
context/endpoints_base/restaurantes/HORARIOS-COLLECTION.postman_collection.json
context/endpoints_base/restaurantes/RESTAURANTES-COLLECTION.postman_collection.json
context/endpoints_base/restaurantes/MASTER-COLLECTION.postman_collection.json
```

La coleccion master agrego inventario para restaurantes:

```txt
POST /restaurantes/:restaurante_id/inventario
GET /restaurantes/:restaurante_id/inventario
POST /restaurantes/:restaurante_id/inventario/:inventario_id/movimientos
GET /restaurantes/:restaurante_id/inventario/:inventario_id/historial
POST /restaurantes/:restaurante_id/inventario/proveedores
```

Se valido broker auth con credenciales de prueba documentadas en:

```txt
context/PRUEBAS_BROKER_ADMIN_AUTH.md
```

Credenciales usadas para pruebas:

```txt
email: maria.protocol1768009601@pizza.com
password: PasswordSeguro123
```

Resultado validado:

```txt
POST https://broker-services-production.up.railway.app/api/auth/login -> 200 OK
GET /restaurantes/4/inventario -> 200 OK
```

Restaurante de prueba:

```txt
restaurantId: 4
nombre: Broker Protocol Fixed 1768009601
```

## Cambios Implementados

### Configuracion de APIs

Se agrego soporte para dos clientes/API:

```txt
src/shared/api/apiClient.ts
src/shared/api/businessApiClient.ts
```

`apiClient` se usa para broker/restaurantes.

`businessApiClient` se usa para negocios generales.

### Contexto de comercio

Se agrego:

```txt
src/shared/business/businessContext.ts
```

Este archivo decide si la app trabaja como:

```txt
restaurant
business
```

La decision puede venir por usuario autenticado, `localStorage` o variables de entorno:

```txt
VITE_COMMERCE_KIND
VITE_DEFAULT_RESTAURANT_ID
VITE_DEFAULT_BUSINESS_ID
```

### Login y autenticacion

Se agrego switch de autenticacion:

```txt
VITE_AUTH_MODE=broker
VITE_AUTH_MODE=mock
```

En produccion, el codigo fuerza `broker` aunque se configure `mock`.

Esto evita que el modo de pruebas llegue activo a produccion.

### Productos

Se adapto `productsService` para soportar ambos backends.

Restaurantes:

```txt
/restaurantes/:id/productos
```

Negocios generales:

```txt
/businesses/:id/products
/businesses/:id/product-types
/businesses/:id/catalog
```

Tambien se agrego normalizacion de datos para que la UI pueda consumir ambos contratos.

### Inventario

Se agrego pantalla:

```txt
src/pages/inventory/InventoryPage.tsx
```

Ruta:

```txt
/inventory
```

Se agrego item al sidebar:

```txt
Inventario
```

Para negocios generales usa:

```txt
GET /businesses/:businessId/inventory
```

Para restaurantes usa:

```txt
GET /restaurantes/:restaurantId/inventario
POST /restaurantes/:restaurantId/inventario
POST /restaurantes/:restaurantId/inventario/:inventarioId/movimientos
```

En la UI se agregaron acciones:

```txt
Actualizar
Agregar producto
Crear inventario
Registrar movimiento
Editar producto
Eliminar producto, cuando aplica para negocios generales
```

### Pedidos

La pantalla de pedidos quedo preparada para recepcion de pedidos.

Para negocios generales se dejo un espacio informativo porque el backend probado expone reserva/confirmacion/liberacion interna de stock, pero no un listado operativo publico de pedidos.

### Estilos y textos

Se neutralizo la UI para que no este orientada solo a restaurantes:

```txt
Gestiona tu restaurante -> Gestiona tu negocio
Registrar restaurante -> Registrar negocio
Icono Pizza -> Icono ShoppingBag
Placeholders de comida -> Producto destacado / producto general
```

Se mantuvo la linea grafica existente.

## Configuracion de Produccion

Se agrego:

```txt
vercel.json
DEPLOYMENT.md
```

`vercel.json` define:

```txt
framework: vite
buildCommand: npm run build
outputDirectory: dist
```

Tambien define rewrites para evitar CORS:

```txt
/api -> https://broker-services-production.up.railway.app/api
/business-api -> https://proyectoarqui.onrender.com/api
/* -> /index.html
```

Esto permite usar React Router en produccion y evita que el navegador llame directamente a backends externos.

## Variables Recomendadas en Vercel

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

No se recomienda configurar credenciales de prueba en produccion:

```txt
VITE_TEST_USER_EMAIL
VITE_TEST_USER_PASSWORD
```

## Despliegue en Vercel

Se inicio sesion con Vercel CLI usando:

```bash
npx vercel
```

Durante la configuracion se eligio:

```txt
Project name: app-empresas
Directory: ./
Framework: vite
Build command: npm run build
Output directory: dist
```

Vercel creo:

```txt
.vercel/
```

Y enlazo el proyecto local con:

```txt
luis0523s-projects/app-empresas
```

## Comandos Utiles

### Validar build local

```bash
npm run build
```

### Deploy preview

```bash
npx vercel
```

### Deploy produccion

```bash
npx vercel --prod
```

## Estado Final

Build validado correctamente con:

```bash
npm run build
```

El proyecto queda listo para continuar pruebas en Vercel y para alternar entre restaurantes y negocios generales mediante variables de entorno.
