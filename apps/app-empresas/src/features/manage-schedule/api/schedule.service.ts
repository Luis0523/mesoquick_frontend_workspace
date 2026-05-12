import { apiClient } from '@/shared/api/apiClient';
import type { Schedule, CreateScheduleDTO, UpdateScheduleDTO } from '@/entities/schedule/model/types';

interface GetSchedulesParams {
  activo?: boolean;
}

interface ApiWrapperResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const scheduleService = {
  /**
   * Obtener todos los horarios de un restaurante
   * GET /restaurantes/:rid/horarios
   */
  getAll: async (restaurantId: number, params?: GetSchedulesParams): Promise<Schedule[]> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Schedule[]>>(
      `/restaurantes/${restaurantId}/horarios`,
      { params }
    );
    return data.data;
  },

  /**
   * Obtener un horario por ID
   * GET /restaurantes/:rid/horarios/:hid
   */
  getById: async (restaurantId: number, scheduleId: number): Promise<Schedule> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Schedule>>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`
    );
    return data.data;
  },

  /**
   * Crear un nuevo horario
   * POST /restaurantes/:rid/horarios
   */
  create: async (restaurantId: number, dto: CreateScheduleDTO): Promise<Schedule> => {
    const { data } = await apiClient.post<ApiWrapperResponse<Schedule>>(
      `/restaurantes/${restaurantId}/horarios`,
      dto
    );
    return data.data;
  },

  /**
   * Actualizar un horario existente
   * PUT /restaurantes/:rid/horarios/:hid
   */
  update: async (
    restaurantId: number,
    scheduleId: number,
    dto: UpdateScheduleDTO
  ): Promise<Schedule> => {
    const { data } = await apiClient.put<ApiWrapperResponse<Schedule>>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`,
      dto
    );
    return data.data;
  },

  /**
   * Eliminar un horario (soft delete)
   * DELETE /restaurantes/:rid/horarios/:hid
   */
  delete: async (restaurantId: number, scheduleId: number): Promise<void> => {
    await apiClient.delete(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`
    );
  },

  /**
   * Toggle estado activo/inactivo
   * PATCH /restaurantes/:rid/horarios/:hid/activo
   */
  toggleActive: async (
    restaurantId: number,
    scheduleId: number,
    activo: boolean
  ): Promise<Schedule> => {
    const { data } = await apiClient.patch<ApiWrapperResponse<Schedule>>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}/activo`,
      { activo }
    );
    return data.data;
  },
};
