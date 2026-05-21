import axios from 'axios';
import { ENV } from '@/shared/config/env.config';
import type {
  LogisticsOrder,
  LogisticsOrderDetail,
} from '@/entities/logistics-order/model/types';

const logisticsClient = axios.create({
  baseURL: ENV.LOGISTICS_API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiListResponse {
  success: boolean;
  data: LogisticsOrder[];
  pagination: Pagination;
}

interface ApiSingleResponse {
  success: boolean;
  data: LogisticsOrderDetail;
  message?: string;
}

interface ApiActionResponse {
  success: boolean;
  message: string;
  data: LogisticsOrderDetail;
}

function buildHeaders(restauranteId: number) {
  return {
    'x-user-id': String(restauranteId),
    'x-user-role': 'restaurante',
  };
}

export const logisticsService = {
  getOrders: async (
    restauranteId: number,
    params?: { estado?: string; page?: number; limit?: number }
  ): Promise<{ orders: LogisticsOrder[]; pagination: Pagination }> => {
    const { data } = await logisticsClient.get<ApiListResponse>(
      `/logistica/restaurantes/${restauranteId}/pedidos`,
      { params, headers: buildHeaders(restauranteId) }
    );
    return { orders: data.data, pagination: data.pagination };
  },

  getOrderById: async (restauranteId: number, orderId: number): Promise<LogisticsOrderDetail> => {
    const { data } = await logisticsClient.get<ApiSingleResponse>(
      `/logistica/restaurantes/${restauranteId}/pedidos/${orderId}`,
      { headers: buildHeaders(restauranteId) }
    );
    return data.data;
  },

  confirmOrder: async (restauranteId: number, orderId: number): Promise<LogisticsOrderDetail> => {
    const { data } = await logisticsClient.patch<ApiActionResponse>(
      `/logistica/restaurantes/${restauranteId}/pedidos/${orderId}/preparar`,
      {},
      { headers: buildHeaders(restauranteId) }
    );
    return data.data;
  },

  markAsPrepared: async (restauranteId: number, orderId: number): Promise<LogisticsOrderDetail> => {
    const { data } = await logisticsClient.patch<ApiActionResponse>(
      `/logistica/restaurantes/${restauranteId}/pedidos/${orderId}/preparado`,
      {},
      { headers: buildHeaders(restauranteId) }
    );
    return data.data;
  },
};
