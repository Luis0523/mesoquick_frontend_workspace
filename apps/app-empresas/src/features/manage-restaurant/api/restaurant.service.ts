/**
 * Servicio de API para Restaurantes
 * Maneja todas las operaciones CRUD de restaurantes
 */

import { apiClient, handleApiError } from '@/shared/api/apiClient';
import type {
  Restaurant,
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
  ToggleAvailabilityDTO,
  RestaurantQueryParams,
} from '@/entities/restaurant/model/types';

const BASE_PATH = '/restaurantes';

// Tipos de respuesta de la API
interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

/**
 * Servicio de restaurantes
 */
export const restaurantService = {
  /**
   * Obtener todos los restaurantes
   * GET /restaurantes
   */
  getAll: async (params?: RestaurantQueryParams): Promise<Restaurant[]> => {
    try {
      const { data: response } = await apiClient.get<ApiResponse<Restaurant[]>>(BASE_PATH, { params });
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al obtener restaurantes: ${apiError.message}`);
    }
  },

  /**
   * Obtener un restaurante por ID
   * GET /restaurantes/:id
   */
  getById: async (id: number): Promise<Restaurant> => {
    try {
      const { data: response } = await apiClient.get<ApiResponse<Restaurant>>(`${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al obtener restaurante: ${apiError.message}`);
    }
  },

  /**
   * Crear un nuevo restaurante
   * POST /restaurantes
   */
  create: async (dto: CreateRestaurantDTO): Promise<Restaurant> => {
    try {
      const { data: response } = await apiClient.post<ApiResponse<Restaurant>>(BASE_PATH, dto);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al crear restaurante: ${apiError.message}`);
    }
  },

  /**
   * Actualizar un restaurante
   * PUT /restaurantes/:id
   */
  update: async (id: number, dto: UpdateRestaurantDTO): Promise<Restaurant> => {
    try {
      const { data: response } = await apiClient.put<ApiResponse<Restaurant>>(`${BASE_PATH}/${id}`, dto);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al actualizar restaurante: ${apiError.message}`);
    }
  },

  /**
   * Eliminar un restaurante (soft delete)
   * DELETE /restaurantes/:id
   */
  delete: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`${BASE_PATH}/${id}`);
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al eliminar restaurante: ${apiError.message}`);
    }
  },

  /**
   * Toggle disponibilidad de un restaurante
   * PATCH /restaurantes/:id/disponibilidad
   */
  toggleAvailability: async (id: number, disponible: boolean): Promise<Restaurant> => {
    try {
      const dto: ToggleAvailabilityDTO = { disponible };
      const { data: response } = await apiClient.patch<ApiResponse<Restaurant>>(
        `${BASE_PATH}/${id}/disponibilidad`,
        dto
      );
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al cambiar disponibilidad: ${apiError.message}`);
    }
  },
};
