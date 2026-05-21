import { apiClient } from '@/shared/api/apiClient';
import type { Combo, CreateComboDTO, UpdateComboDTO } from '@/entities/combo/model/types';

const BASE_PATH = '/restaurantes';

interface ApiWrapperResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export const combosService = {
  getAll: async (restaurantId: number): Promise<Combo[]> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Combo[]>>(
      `${BASE_PATH}/${restaurantId}/combos`
    );
    return data.data ?? data;
  },

  getById: async (restaurantId: number, comboId: number): Promise<Combo> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Combo>>(
      `${BASE_PATH}/${restaurantId}/combos/${comboId}`
    );
    return data.data ?? data;
  },

  create: async (restaurantId: number, dto: CreateComboDTO): Promise<Combo> => {
    const { data } = await apiClient.post<ApiWrapperResponse<Combo>>(
      `${BASE_PATH}/${restaurantId}/combos`,
      dto
    );
    return data.data ?? data;
  },

  update: async (restaurantId: number, comboId: number, dto: UpdateComboDTO): Promise<Combo> => {
    const { data } = await apiClient.put<ApiWrapperResponse<Combo>>(
      `${BASE_PATH}/${restaurantId}/combos/${comboId}`,
      dto
    );
    return data.data ?? data;
  },

  delete: async (restaurantId: number, comboId: number): Promise<void> => {
    await apiClient.delete(`${BASE_PATH}/${restaurantId}/combos/${comboId}`);
  },

  toggleActive: async (restaurantId: number, comboId: number, activo: boolean): Promise<Combo> => {
    const { data } = await apiClient.patch<ApiWrapperResponse<Combo>>(
      `${BASE_PATH}/${restaurantId}/combos/${comboId}/activo`,
      { activo }
    );
    return data.data ?? data;
  },

  addProducts: async (
    restaurantId: number,
    comboId: number,
    productos: { producto_id: number; cantidad: number }[]
  ): Promise<Combo> => {
    const { data } = await apiClient.post<ApiWrapperResponse<Combo>>(
      `${BASE_PATH}/${restaurantId}/combos/${comboId}/productos`,
      { productos }
    );
    return data.data ?? data;
  },
};
