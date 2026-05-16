# Requisitos Iniciales - MesoFood

Fecha: 15/05/2026
Proyecto: `@mesoquick/app-clientes`
Aplicacion: MesoFood - App cliente para pedidos de comida y negocios activos

## Objetivo

Crear una aplicacion web de cliente, similar en concepto a PedidosYa, enfocada inicialmente en:

- Ver restaurantes activos y disponibles.
- Ver negocios activos de otros tipos cuando el backend de negocios lo permita.
- Explorar productos por restaurante o negocio.
- Armar carrito y hacer un pedido.
- Consultar el estado basico del pedido.
- Preparar la base para integracion futura con logistica, pagos y autenticacion.

## Estado Actual De App Clientes

- El proyecto actual es una app Vite + React + TypeScript con mockup inicial de Vite.
- Dependencias actuales principales: `react`, `react-dom`, `typescript`, `vite`.
- Todavia no tiene router, cliente HTTP, estado global, estructura modular ni flujo real de cliente.
- Hay colecciones Postman disponibles en `context/postman/` para negocios, restaurantes y logistica.
- La app debe evolucionar desde mockup hacia una aplicacion completa de consumo cliente.

## Referencia Revisada

Se reviso `app-empresas` solo como referencia y no se modifico nada en ese directorio.

Patrones utiles detectados:

- Estructura modular tipo Feature-Sliced Design: `app`, `pages`, `features`, `entities`, `widgets`, `shared`.
- Uso de React Router para rutas.
- Uso de Zustand para estado global por dominio.
- Uso de Axios para cliente HTTP compartido.
- Uso de Tailwind CSS y Montserrat.
- Separacion de configuracion API en `shared/config` y cliente HTTP en `shared/api`.

## Stack Propuesto

- React 19.
- TypeScript.
- Vite.
- React Router DOM para navegacion.
- Axios para llamadas HTTP.
- Zustand para estado global del carrito, sesion y datos de dominio cuando sea necesario.
- Tailwind CSS para estilos y sistema visual.
- Lucide React para iconografia.

## Estructura Propuesta

```txt
src/
├── app/
│   ├── layout/
│   │   ├── AppLayout.tsx
│   │   └── CheckoutLayout.tsx
│   ├── router/
│   │   └── index.tsx
│   └── providers/
│       └── AppProviders.tsx
├── pages/
│   ├── home/
│   │   └── HomePage.tsx
│   ├── restaurants/
│   │   ├── RestaurantsPage.tsx
│   │   └── RestaurantDetailPage.tsx
│   ├── businesses/
│   │   ├── BusinessesPage.tsx
│   │   └── BusinessDetailPage.tsx
│   ├── product/
│   │   └── ProductDetailPage.tsx
│   ├── cart/
│   │   └── CartPage.tsx
│   ├── checkout/
│   │   └── CheckoutPage.tsx
│   ├── orders/
│   │   ├── OrdersPage.tsx
│   │   └── OrderTrackingPage.tsx
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   └── not-found/
│       └── NotFoundPage.tsx
├── widgets/
│   ├── app-header/
│   ├── bottom-nav/
│   ├── hero-search/
│   ├── restaurant-card/
│   ├── business-card/
│   ├── product-card/
│   └── cart-summary/
├── features/
│   ├── browse-restaurants/
│   ├── browse-businesses/
│   ├── browse-products/
│   ├── manage-cart/
│   ├── create-order/
│   ├── track-order/
│   └── auth-customer/
├── entities/
│   ├── restaurant/
│   │   └── model/types.ts
│   ├── business/
│   │   └── model/types.ts
│   ├── product/
│   │   └── model/types.ts
│   ├── order/
│   │   └── model/types.ts
│   ├── customer/
│   │   └── model/types.ts
│   └── delivery/
│       └── model/types.ts
└── shared/
    ├── api/
    │   ├── apiClient.ts
    │   ├── restaurantsClient.ts
    │   └── businessesClient.ts
    ├── config/
    │   ├── env.config.ts
    │   └── services.config.ts
    ├── lib/
    ├── ui/
    └── utils/
```

## Rutas Iniciales

```txt
/                         Home con busqueda, categorias y destacados
/restaurantes             Listado de restaurantes activos/disponibles
/restaurantes/:id         Detalle de restaurante y productos
/negocios                 Listado de negocios activos no restaurante
/negocios/:id             Detalle de negocio y productos
/producto/:id             Detalle rapido del producto
/carrito                  Carrito editable
/checkout                 Direccion, resumen y confirmacion de pedido
/pedidos                  Historial basico del cliente
/pedidos/:id              Seguimiento del pedido
/login                    Inicio de sesion futuro
/registro                 Registro futuro
*                         404
```

## Experiencia Cliente MVP

Flujo principal:

1. Cliente entra a MesoFood.
2. Ve buscador, categorias y restaurantes/negocios activos.
3. Selecciona un restaurante o negocio.
4. Revisa productos disponibles.
5. Agrega productos al carrito.
6. Revisa carrito y cantidades.
7. Ingresa datos de entrega provisionalmente.
8. Confirma pedido.
9. Ve pantalla de seguimiento basico.

## Modulos Funcionales

- Home: busqueda, categorias, banners, negocios destacados y restaurantes disponibles.
- Restaurantes: listado, filtros por disponible/activo, detalle, horarios, productos.
- Negocios: listado de negocios activos por tipo, detalle y productos cuando aplique.
- Productos: cards, detalle, cantidad, notas, precio y disponibilidad.
- Carrito: items, cantidades, subtotal, costo de envio provisional, total.
- Checkout: datos de cliente, direccion, referencia, instrucciones y confirmacion.
- Pedidos: historial y estado simple.
- Perfil cliente: futuro, para direcciones, telefono y preferencias.

## Modelos Iniciales Sugeridos

```ts
export interface Restaurant {
  id: number;
  nombre: string;
  descripcion?: string;
  direccion: string;
  telefono: string;
  correo?: string;
  logo_url?: string;
  disponible: boolean;
  activo: boolean;
}

export interface Business {
  businessId: number;
  tradeName: string;
  legalName?: string;
  businessType: string;
  businessStatus: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
}

export interface Product {
  id: number | string;
  restaurantId?: number;
  businessId?: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  active: boolean;
  categoryId?: number | string;
}

export interface CartItem {
  productId: number | string;
  sourceType: 'restaurant' | 'business';
  sourceId: number | string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  imageUrl?: string;
}
```

## Diseno Visual Propuesto

Nombre de marca: MesoFood.

Direccion visual:

- Mas orientada a consumo rapido, calida y mobile-first.
- Mantener coherencia con MesoQuick, pero diferenciar la experiencia cliente.
- Enfasis en comida, apetito, cards grandes, imagenes, radios amplios y acciones claras.

Paleta sugerida:

- Primario: `#F97316` naranja comida/accion principal.
- Primario oscuro: `#C2410C` hover/contraste.
- Fondo base: `#FFF7ED` crema calido.
- Superficie: `#FFFFFF` cards y paneles.
- Texto principal: `#1F2937`.
- Texto secundario: `#6B7280`.
- Exito/disponible: `#16A34A`.
- Alerta/acento: `#FACC15`.
- Borde suave: `#FED7AA`.

Tipografia:

- Mantener Montserrat si se decide alinear con `app-empresas`.
- Alternativa futura: `Inter` o `Nunito Sans` para una experiencia mas amable de cliente.

Componentes visuales clave:

- Header con ubicacion, buscador y acceso al carrito.
- Bottom navigation mobile con Inicio, Buscar, Pedidos y Perfil.
- Cards de restaurantes con imagen, estado abierto/cerrado, tiempo estimado y rating futuro.
- Cards de producto con imagen, descripcion corta, precio y boton agregar.
- Carrito persistente como drawer o pagina dedicada.

## Servicios Y URLs Provisionales

Estos enlaces quedan documentados para futuras sesiones y configuracion de variables de entorno.

```env
VITE_BUSINESSES_API_URL=https://proyectoarqui.onrender.com
VITE_RESTAURANTS_API_URL=https://restaurantes.fly.dev
```

Servicios:

- Negocios: `https://proyectoarqui.onrender.com/`
- Restaurantes: `https://restaurantes.fly.dev`

Nota: las rutas exactas deben validarse contra las colecciones Postman y los backends activos antes de implementar servicios definitivos.

## Colecciones Postman Disponibles

- Negocios: `context/postman/negocios/MS-BUSINESS - Inventory Stable v3.postman_collection (1).json`
- Restaurantes: `context/postman/restaurantes/MASTER-COLLECTION.postman_collection.json`
- Logistica: `context/postman/logistica/MASTER-LOGISTICA.postman_collection.json`

Endpoints relevantes detectados:

- Restaurantes: `GET /restaurantes?activo=true`, `GET /restaurantes/:id`, `GET /restaurantes/:id/productos` segun coleccion.
- Restaurantes disponibilidad: `PATCH /restaurantes/:id/disponibilidad` para contexto operativo, aunque en cliente solo se consume disponibilidad.
- Negocios: `GET /businesses`, `GET /businesses/:businessId`, rutas anidadas de `product-types` y productos por negocio segun coleccion.
- Logistica: rutas bajo `/api/logistica`, utiles mas adelante para entregas y seguimiento.

## Prioridades De Implementacion

1. Reemplazar mockup Vite por landing/home real de MesoFood.
2. Agregar router y layout base responsive.
3. Agregar sistema visual base con Tailwind.
4. Crear configuracion de servicios y clientes HTTP.
5. Crear entidades `restaurant`, `business`, `product`, `cart` y `order`.
6. Implementar listado de restaurantes activos.
7. Implementar detalle de restaurante con productos.
8. Implementar carrito local con Zustand.
9. Implementar checkout provisional.
10. Preparar pedidos/seguimiento con endpoints disponibles.

## Decisiones Pendientes

- Confirmar si MesoFood debe consumir ambos servicios desde el inicio o iniciar solo con restaurantes.
- Confirmar formato real de respuesta en produccion para negocios y restaurantes.
- Confirmar si habra autenticacion de cliente en el MVP.
- Confirmar si el pedido se crea en servicio de restaurantes, negocios, logistica o un broker/gateway.
- Confirmar estrategia de imagenes reales, placeholders y almacenamiento.
- Confirmar moneda, costos de envio y reglas de disponibilidad.

## Reglas Para Futuras Sesiones

- No modificar `app-empresas`; usarlo solo como referencia.
- Trabajar solo dentro de `apps/app-clientes` salvo instruccion explicita.
- Mantener esta documentacion actualizada cuando cambien endpoints, estructura o decisiones de producto.
- Validar colecciones Postman antes de conectar nuevas pantallas al backend.
