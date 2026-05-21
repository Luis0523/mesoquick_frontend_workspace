import axios from 'axios';
import { create } from 'zustand';
import { logisticsService } from '../api/logistics.service';
import {
  connectLogisticsSocket,
  disconnectLogisticsSocket,
} from '@/shared/logistics/logisticsSocket';
import type {
  LogisticsOrder,
  LogisticsOrderDetail,
  LogisticsOrderStatus,
  WsNewOrder,
} from '@/entities/logistics-order/model/types';
import { getCommerceContext } from '@/shared/business/businessContext';

function extractError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'Error desconocido';
}

interface LogisticsStore {
  orders: LogisticsOrder[];
  currentOrder: LogisticsOrderDetail | null;
  pendingCount: number;
  isWsConnected: boolean;
  isLoading: boolean;
  error: string | null;

  fetchOrders: (params?: { estado?: string; page?: number; limit?: number }) => Promise<void>;
  fetchOrderById: (orderId: number) => Promise<void>;
  confirmOrder: (orderId: number) => Promise<void>;
  markAsPrepared: (orderId: number) => Promise<void>;
  connectWebSocket: () => void;
  disconnectWebSocket: () => void;
  updateOrderFromWs: (entregaId: number, updates: Partial<LogisticsOrder>) => void;
  addNewOrderFromWs: (data: WsNewOrder) => void;
  initOrders: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useLogisticsStore = create<LogisticsStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  pendingCount: 0,
  isWsConnected: false,
  isLoading: false,
  error: null,

  fetchOrders: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const restauranteId = getCommerceContext().id;
      const { orders } = await logisticsService.getOrders(restauranteId, params);
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar pedidos',
        isLoading: false,
      });
    }
  },

  fetchOrderById: async (orderId: number) => {
    set({ isLoading: true, error: null });
    try {
      const restauranteId = getCommerceContext().id;
      const order = await logisticsService.getOrderById(restauranteId, orderId);
      set({ currentOrder: order, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar pedido',
        isLoading: false,
      });
    }
  },

  confirmOrder: async (orderId: number) => {
    set({ isLoading: true, error: null });
    try {
      const restauranteId = getCommerceContext().id;
      const updated = await logisticsService.confirmOrder(restauranteId, orderId);
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id_entrega === orderId ? { ...o, estado_entrega: 'preparando' as LogisticsOrderStatus } : o
        ),
        currentOrder: state.currentOrder?.id_entrega === orderId ? updated : state.currentOrder,
        pendingCount: Math.max(0, state.pendingCount - 1),
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({ error: extractError(error), isLoading: false });
      get().fetchOrderById(orderId);
    }
  },

  markAsPrepared: async (orderId: number) => {
    set({ isLoading: true, error: null });
    try {
      const restauranteId = getCommerceContext().id;
      const updated = await logisticsService.markAsPrepared(restauranteId, orderId);
      set((state) => ({
        orders: state.orders.map((o) =>
          o.id_entrega === orderId ? { ...o, estado_entrega: 'preparado' as LogisticsOrderStatus } : o
        ),
        currentOrder: state.currentOrder?.id_entrega === orderId ? updated : state.currentOrder,
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({ error: extractError(error), isLoading: false });
      get().fetchOrderById(orderId);
    }
  },

  connectWebSocket: () => {
    const restauranteId = getCommerceContext().id;
    const socket = connectLogisticsSocket(restauranteId);
    set({ isWsConnected: true });

    socket.on('restaurante:order:new', (data: WsNewOrder) => {
      get().addNewOrderFromWs(data);
    });

    socket.on('restaurante:order:confirmed', (data: { entrega_id: number; estado: string }) => {
      get().updateOrderFromWs(data.entrega_id, { estado_entrega: 'preparando' as LogisticsOrderStatus });
    });

    socket.on('restaurante:order:prepared', (data: { entrega_id: number; estado: string }) => {
      get().updateOrderFromWs(data.entrega_id, { estado_entrega: 'preparado' as LogisticsOrderStatus });
    });
  },

  disconnectWebSocket: () => {
    const restauranteId = getCommerceContext().id;
    disconnectLogisticsSocket(restauranteId);
    set({ isWsConnected: false });
  },

  updateOrderFromWs: (entregaId, updates) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id_entrega === entregaId ? { ...o, ...updates } : o
      ),
      currentOrder:
        state.currentOrder?.id_entrega === entregaId
          ? { ...state.currentOrder, ...updates }
          : state.currentOrder,
    }));
  },

  addNewOrderFromWs: (data) => {
    const newOrder: LogisticsOrder = {
      id_entrega: data.entrega_id,
      restaurante_id: data.restaurante_id,
      estado_entrega: 'pendiente_restaurante',
      monto_cobrar: data.monto_cobrar,
      tarifa_ofrecida: data.tarifa_ofrecida,
      metodo_pago: data.metodo_pago,
      distancia_estimada_km: data.distancia_estimada_km,
      negocio_nombre: data.negocio_nombre,
      cliente_nombre: data.cliente_nombre,
      direccion_entrega: data.direccion_entrega,
      detalles_orden: data.detalles_orden,
      categoria: null,
      created_at: data.created_at,
      updated_at: null,
    };
    set((state) => ({
      orders: [newOrder, ...state.orders],
      pendingCount: state.pendingCount + 1,
    }));
  },

  initOrders: async () => {
    await get().fetchOrders();
    get().connectWebSocket();
  },

  clearError: () => set({ error: null }),

  reset: () => set({
    orders: [],
    currentOrder: null,
    pendingCount: 0,
    isWsConnected: false,
    isLoading: false,
    error: null,
  }),
}));
