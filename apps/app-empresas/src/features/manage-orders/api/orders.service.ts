import { apiClient } from '@/shared/api/apiClient';
import type { Order, UpdateOrderDTO } from '@/entities/order/model/types';

interface GetOrdersParams {
  estado_id?: number;
  cliente_id?: number;
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
   * PUT /restaurantes/:rid/pedidos/:oid/estado
   */
  updateStatus: async (
    restaurantId: number,
    orderId: number,
    dto: { estado_id: number; motivo?: string }
  ): Promise<Order> => {
    const { data } = await apiClient.put<ApiWrapperResponse<Order>>(
      `/restaurantes/${restaurantId}/pedidos/${orderId}/estado`,
      dto
    );
    return data.data;
  },

  /**
   * Actualizar pedido (notas, direccion)
   * PUT /restaurantes/:rid/pedidos/:oid
   */
  update: async (
    restaurantId: number,
    orderId: number,
    dto: UpdateOrderDTO
  ): Promise<Order> => {
    const { data } = await apiClient.put<ApiWrapperResponse<Order>>(
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await apiClient.get<ApiWrapperResponse<any>>(
      `/restaurantes/${restaurantId}/pedidos/estadisticas`,
      { params: { fecha } }
    );
    return data.data;
  },
};
