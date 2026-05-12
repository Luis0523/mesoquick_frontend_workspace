import { create } from 'zustand';
import { ordersService } from '../api/orders.service';
import type { Order, UpdateOrderDTO } from '@/entities/order/model/types';
import { OrderStatus } from '@/entities/order/model/types';

interface OrdersStore {
  // Estado
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchOrders: (restaurantId: number, params?: any) => Promise<void>;
  fetchOrderById: (restaurantId: number, orderId: number) => Promise<void>;
  fetchActiveOrders: (restaurantId: number) => Promise<void>;
  updateOrderStatus: (restaurantId: number, orderId: number, estado: OrderStatus, motivo?: string) => Promise<Order>;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  updateOrderStatus: async (restaurantId: number, orderId: number, estado: OrderStatus, motivo?: string) => {
    set({ isLoading: true, error: null });
    try {
      const STATUS_TO_ID: Record<OrderStatus, number> = {
        [OrderStatus.PENDIENTE]: 1,
        [OrderStatus.ACEPTADO]: 2,
        [OrderStatus.PREPARANDO]: 3,
        [OrderStatus.LISTO]: 4,
        [OrderStatus.EN_CAMINO]: 5,
        [OrderStatus.ENTREGADO]: 6,
        [OrderStatus.CANCELADO]: 7,
      };
      const estado_id = STATUS_TO_ID[estado];
      const updatedOrder = await ordersService.updateStatus(restaurantId, orderId, { estado_id, motivo });
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? (updatedOrder || o) : o
        ),
        currentOrder: state.currentOrder?.id === orderId ? (updatedOrder || state.currentOrder) : state.currentOrder,
        isLoading: false,
      }));
      return updatedOrder as Order;
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
          o.id === orderId ? (updatedOrder || { ...o, ...dto } as Order) : o
        ),
        currentOrder: state.currentOrder?.id === orderId ? (updatedOrder || { ...state.currentOrder, ...dto } as Order) : state.currentOrder,
        isLoading: false,
      }));
      return updatedOrder as Order;
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
