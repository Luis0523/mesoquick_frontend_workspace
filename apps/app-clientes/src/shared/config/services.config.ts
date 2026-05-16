export const SERVICES = {
  RESTAURANTS: {
    BASE: '/restaurantes',
    BY_ID: (id: number | string) => `/restaurantes/${id}`,
    DISPONIBILIDAD: (id: number | string) => `/restaurantes/${id}/disponibilidad`,
    PRODUCTOS: (id: number | string) => `/restaurantes/${id}/productos`,
    PRODUCTO_BY_ID: (restId: number | string, prodId: number | string) =>
      `/restaurantes/${restId}/productos/${prodId}`,
    HORARIOS: (id: number | string) => `/restaurantes/${id}/horarios`,
    PEDIDOS: (id: number | string) => `/restaurantes/${id}/pedidos`,
    PEDIDO_BY_ID: (restId: number | string, pedidoId: number | string) =>
      `/restaurantes/${restId}/pedidos/${pedidoId}`,
  },
  BUSINESSES: {
    BASE: '/businesses',
    BY_ID: (id: number | string) => `/businesses/${id}`,
    AVAILABILITY: (id: number | string) => `/businesses/${id}/availability`,
    PRODUCT_TYPES: (id: number | string) => `/businesses/${id}/product-types`,
    PRODUCTS: (id: number | string) => `/businesses/${id}/products`,
    PRODUCT_BY_ID: (bizId: number | string, prodId: number | string) =>
      `/businesses/${bizId}/products/${prodId}`,
    CATALOG: (id: number | string) => `/businesses/${id}/catalog`,
    SCHEDULES: (id: number | string) => `/businesses/${id}/schedules`,
  },
  LOGISTICS: {
    ENTREGAS: '/api/logistica/entregas',
    ENTREGA_BY_ID: (id: number | string) => `/api/logistica/entregas/${id}`,
    FEED: '/api/logistica/feed/disponibles',
    ASIGNACIONES: '/api/logistica/asignaciones',
  },
} as const
