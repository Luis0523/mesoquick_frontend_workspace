# 🤖 Tareas Agent A - 09/04/2026 (Sesión 3)

**Fecha:** 09/04/2026  
**Agente:** Agent A - "Orders Entity & Service Setup"  
**Responsabilidad:** Crear la capa de datos y API para pedidos

---

## ⚠️ IMPORTANTE - API EN DESARROLLO

**NOTA:** El módulo de Pedidos está en **Fase 2**. Los endpoints de la API pueden NO estar disponibles aún en el backend. Este código está preparado para cuando la API esté lista.

Si al ejecutar las peticiones obtienes errores 404, es porque el backend aún no tiene los endpoints implementados. **Esto NO es tu culpa**.

---

## 🎯 Objetivo Principal

Implementar la **infraestructura completa de datos** para el módulo de **Pedidos**:
- Entity types con TypeScript estricto
- Service API con endpoints REST (preparado para API futura)
- Zustand store para state management

---

## 📋 Tareas Específicas

### 1. Crear Entity de Order

**Archivo:** `src/entities/order/model/types.ts`

**Requisitos:**

```typescript
// Interface principal
export interface Order {
  // Auto-generados por backend
  id: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  
  // Relaciones
  restaurante_id: number;
  cliente_id: number;
  repartidor_id: number | null;
  
  // Información del cliente
  cliente_nombre: string;
  cliente_telefono: string;
  direccion_entrega: string;
  
  // Detalles del pedido
  items: OrderItem[];
  notas?: string | null;
  
  // Montos (en centavos)
  subtotal: number;
  costo_delivery: number;
  total: number;
  
  // Estado
  estado: OrderStatus;
  
  // Timestamps de estados
  fecha_aceptacion: string | null;
  fecha_preparacion: string | null;
  fecha_listo: string | null;
  fecha_en_camino: string | null;
  fecha_entregado: string | null;
  fecha_cancelado: string | null;
}

// Estados del pedido
export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',           // Recién creado, esperando aceptación
  ACEPTADO = 'ACEPTADO',             // Restaurante aceptó
  PREPARANDO = 'PREPARANDO',         // En preparación
  LISTO = 'LISTO',                   // Listo para recoger
  EN_CAMINO = 'EN_CAMINO',           // Repartidor en camino
  ENTREGADO = 'ENTREGADO',           // Entregado al cliente
  CANCELADO = 'CANCELADO',           // Cancelado
}

// Labels para el UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDIENTE]: 'Pendiente',
  [OrderStatus.ACEPTADO]: 'Aceptado',
  [OrderStatus.PREPARANDO]: 'Preparando',
  [OrderStatus.LISTO]: 'Listo',
  [OrderStatus.EN_CAMINO]: 'En Camino',
  [OrderStatus.ENTREGADO]: 'Entregado',
  [OrderStatus.CANCELADO]: 'Cancelado',
};

// Colores para badges
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.ACEPTADO]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PREPARANDO]: 'bg-orange-100 text-orange-800',
  [OrderStatus.LISTO]: 'bg-purple-100 text-purple-800',
  [OrderStatus.EN_CAMINO]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.ENTREGADO]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELADO]: 'bg-red-100 text-red-800',
};

// Item del pedido
export interface OrderItem {
  id: number;
  pedido_id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;  // En centavos
  subtotal: number;          // En centavos
  notas?: string | null;
}

// DTO para actualizar estado
export interface UpdateOrderStatusDTO {
  estado: OrderStatus;
}

// DTO para actualizar (si aplica)
export interface UpdateOrderDTO {
  notas?: string;
}

// Helpers
export const isOrderActive = (status: OrderStatus): boolean => {
  return ![OrderStatus.ENTREGADO, OrderStatus.CANCELADO].includes(status);
};

export const canChangeStatus = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
  // Lógica de transiciones válidas
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDIENTE]: [OrderStatus.ACEPTADO, OrderStatus.CANCELADO],
    [OrderStatus.ACEPTADO]: [OrderStatus.PREPARANDO, OrderStatus.CANCELADO],
    [OrderStatus.PREPARANDO]: [OrderStatus.LISTO, OrderStatus.CANCELADO],
    [OrderStatus.LISTO]: [OrderStatus.EN_CAMINO, OrderStatus.CANCELADO],
    [OrderStatus.EN_CAMINO]: [OrderStatus.ENTREGADO, OrderStatus.CANCELADO],
    [OrderStatus.ENTREGADO]: [],
    [OrderStatus.CANCELADO]: [],
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
};
```

**Validaciones:**
- ✅ Enum OrderStatus con todos los estados
- ✅ Todos los campos nullable con `| null`
- ✅ Sin uso de `any`
- ✅ Helpers exportados para validación de transiciones

---

### 2. Crear Service de Pedidos

**Archivo:** `src/features/manage-orders/api/orders.service.ts`

**Requisitos:**

```typescript
import { apiClient } from '@/shared/api/apiClient';
import type { Order, UpdateOrderStatusDTO, UpdateOrderDTO } from '@/entities/order/model/types';

interface GetOrdersParams {
  estado?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}

interface ApiWrapperResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const ordersService = {
  /**
   * Obtener todos los pedidos de un restaurante
   * GET /restaurantes/:rid/pedidos
   */
  getAll: async (restaurantId: number, params?: GetOrdersParams): Promise<Order[]> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Order[]>>(
      `/restaurantes/${restaurantId}/pedidos`,
      { params }
    );
    return data.data;
  },

  /**
   * Obtener un pedido por ID
   * GET /restaurantes/:rid/pedidos/:oid
   */
  getById: async (restaurantId: number, orderId: number): Promise<Order> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Order>>(
      `/restaurantes/${restaurantId}/pedidos/${orderId}`
    );
    return data.data;
  },

  /**
   * Actualizar estado de un pedido
   * PATCH /restaurantes/:rid/pedidos/:oid/estado
   */
  updateStatus: async (
    restaurantId: number,
    orderId: number,
    dto: UpdateOrderStatusDTO
  ): Promise<Order> => {
    const { data } = await apiClient.patch<ApiWrapperResponse<Order>>(
      `/restaurantes/${restaurantId}/pedidos/${orderId}/estado`,
      dto
    );
    return data.data;
  },

  /**
   * Actualizar notas del pedido
   * PATCH /restaurantes/:rid/pedidos/:oid
   */
  update: async (
    restaurantId: number,
    orderId: number,
    dto: UpdateOrderDTO
  ): Promise<Order> => {
    const { data } = await apiClient.patch<ApiWrapperResponse<Order>>(
      `/restaurantes/${restaurantId}/pedidos/${orderId}`,
      dto
    );
    return data.data;
  },

  /**
   * Obtener pedidos activos (PENDIENTE, ACEPTADO, PREPARANDO, LISTO, EN_CAMINO)
   * GET /restaurantes/:rid/pedidos/activos
   */
  getActive: async (restaurantId: number): Promise<Order[]> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Order[]>>(
      `/restaurantes/${restaurantId}/pedidos/activos`
    );
    return data.data;
  },

  /**
   * Obtener estadísticas de pedidos
   * GET /restaurantes/:rid/pedidos/estadisticas
   */
  getStats: async (restaurantId: number, fecha?: string): Promise<{
    total_pedidos: number;
    total_ingresos: number;
    pedidos_activos: number;
    pedidos_completados: number;
  }> => {
    const { data } = await apiClient.get<ApiWrapperResponse<any>>(
      `/restaurantes/${restaurantId}/pedidos/estadisticas`,
      { params: { fecha } }
    );
    return data.data;
  },
};
```

**Validaciones:**
- ✅ Nested routes correctas (`/restaurantes/:rid/pedidos`)
- ✅ Tipos de retorno explícitos (Promise<Order>, etc.)
- ✅ JSDoc comments en cada método
- ✅ Extracción de `data.data` por wrapper de API
- ✅ Manejo de parámetros opcionales

---

### 3. Crear Zustand Store

**Archivo:** `src/features/manage-orders/model/useOrdersStore.ts`

**Requisitos:**

```typescript
import { create } from 'zustand';
import { ordersService } from '../api/orders.service';
import type { Order, UpdateOrderStatusDTO, UpdateOrderDTO, OrderStatus } from '@/entities/order/model/types';

interface OrdersStore {
  // Estado
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchOrders: (restaurantId: number, params?: any) => Promise<void>;
  fetchOrderById: (restaurantId: number, orderId: number) => Promise<void>;
  fetchActiveOrders: (restaurantId: number) => Promise<void>;
  updateOrderStatus: (restaurantId: number, orderId: number, estado: OrderStatus) => Promise<Order>;
  updateOrder: (restaurantId: number, orderId: number, dto: UpdateOrderDTO) => Promise<Order>;
  clearError: () => void;
  reset: () => void;
}

export const useOrdersStore = create<OrdersStore>((set) => ({
  // Estado inicial
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  // Fetch all orders
  fetchOrders: async (restaurantId: number, params?: any) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await ordersService.getAll(restaurantId, params);
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar pedidos',
        isLoading: false,
      });
    }
  },

  // Fetch single order
  fetchOrderById: async (restaurantId: number, orderId: number) => {
    set({ isLoading: true, error: null });
    try {
      const order = await ordersService.getById(restaurantId, orderId);
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar pedido',
        isLoading: false,
      });
    }
  },

  // Fetch active orders
  fetchActiveOrders: async (restaurantId: number) => {
    set({ isLoading: true, error: null });
    try {
      const orders = await ordersService.getActive(restaurantId);
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar pedidos activos',
        isLoading: false,
      });
    }
  },

  // Update order status
  updateOrderStatus: async (restaurantId: number, orderId: number, estado: OrderStatus) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await ordersService.updateStatus(restaurantId, orderId, { estado });
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? updatedOrder : o
        ),
        currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
        isLoading: false,
      }));
      return updatedOrder;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar estado',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update order
  updateOrder: async (restaurantId: number, orderId: number, dto: UpdateOrderDTO) => {
    set({ isLoading: true, error: null });
    try {
      const updatedOrder = await ordersService.update(restaurantId, orderId, dto);
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? updatedOrder : o
        ),
        currentOrder: state.currentOrder?.id === orderId ? updatedOrder : state.currentOrder,
        isLoading: false,
      }));
      return updatedOrder;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar pedido',
        isLoading: false,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
  }),
}));
```

**Validaciones:**
- ✅ Estado inmutable (usar spread operator)
- ✅ Loading state en cada acción async
- ✅ Error handling con try/catch
- ✅ Actualización optimista del state
- ✅ Tipos explícitos en interface

---

## ✅ Criterios de Éxito

### TypeScript
- [ ] Compila sin errores: `npm run build`
- [ ] Sin uso de `any` (excepto en stats que puede variar)
- [ ] Todos los tipos exportados correctamente
- [ ] Imports con path alias `@/`

### Service API
- [ ] Nested routes correctas
- [ ] Métodos con JSDoc
- [ ] Extracción correcta de `data.data`
- [ ] Preparado para cuando API esté disponible

### Zustand Store
- [ ] Estado inicial correcto
- [ ] Loading states en todas las acciones
- [ ] Error handling completo
- [ ] Funciones helper implementadas

---

## 📚 Referencias

**Documentos:**
- `/context/instruccions/02-API-ENDPOINTS-Y-MODELOS.md` (Sección 4: Pedidos - Modelo tentativo)

**Código de referencia:**
- `src/entities/product/model/types.ts`
- `src/entities/schedule/model/types.ts`
- `src/features/manage-products/api/products.service.ts`
- `src/features/manage-schedule/model/useScheduleStore.ts`

---

## 🧪 Testing Manual

```bash
# 1. Compilar sin errores
npm run build

# 2. Verificar que los tipos se importan correctamente
# (Agent B los usará)
```

**NOTA:** No podrás probar las llamadas a la API hasta que el backend implemente los endpoints.

---

**Última actualización:** 09/04/2026 18:30  
**Estado:** ⏳ Pendiente (API del backend en desarrollo)  
**Siguiente paso:** Agent B implementará UI (puede usar datos mock si API no está lista)
