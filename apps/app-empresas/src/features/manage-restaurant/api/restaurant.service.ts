/**
 * Servicio de API para Restaurantes
 * Maneja todas las operaciones CRUD de restaurantes
 */

import { apiClient, handleApiError } from '@/shared/api/apiClient';
import { businessApiClient } from '@/shared/api/businessApiClient';
import { getCommerceContext, isBusinessCommerce } from '@/shared/business/businessContext';
import type {
  Restaurant,
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
  ToggleAvailabilityDTO,
  RestaurantQueryParams,
} from '@/entities/restaurant/model/types';

const BASE_PATH = '/restaurantes';

type BusinessResponse = {
  businessId: number;
  tradeName: string;
  legalName?: string;
  businessType?: string;
  businessStatus?: string;
  description?: string | null;
  address: string;
  phone: string;
  email?: string | null;
  logoUrl?: string | null;
  availability?: { isAvailable?: boolean };
  createdAt?: string;
  updatedAt?: string;
};

const normalizeBusiness = (business: BusinessResponse): Restaurant => ({
  id: business.businessId,
  businessId: business.businessId,
  fecha_creacion: business.createdAt || '',
  fecha_actualizacion: business.updatedAt || null,
  nombre: business.tradeName,
  legalName: business.legalName,
  businessType: business.businessType,
  direccion: business.address,
  telefono: business.phone,
  descripcion: business.description || null,
  correo: business.email || null,
  logo_url: business.logoUrl || null,
  disponible: Boolean(business.availability?.isAvailable ?? business.businessStatus === 'active'),
  activo: !['inactive', 'retired', 'suspended'].includes(business.businessStatus || ''),
  businessStatus: business.businessStatus,
});

const toBusinessUpdateDTO = (dto: UpdateRestaurantDTO) => ({
  tradeName: dto.nombre,
  description: dto.descripcion,
  address: dto.direccion,
  phone: dto.telefono,
  email: dto.correo,
  logoUrl: dto.logo_url,
});

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
      if (isBusinessCommerce()) {
        const { data } = await businessApiClient.get<BusinessResponse[]>('/businesses', { params });
        return data.map(normalizeBusiness);
      }

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
      if (isBusinessCommerce()) {
        const context = getCommerceContext();
        const { data } = await businessApiClient.get<BusinessResponse>(`/businesses/${id || context.id}`);
        return normalizeBusiness(data);
      }

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
      if (isBusinessCommerce()) {
        const { data } = await businessApiClient.patch<BusinessResponse>(`/businesses/${id}`, toBusinessUpdateDTO(dto));
        return normalizeBusiness(data);
      }

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
      if (isBusinessCommerce()) {
        const { data } = await businessApiClient.patch<BusinessResponse>(`/businesses/${id}/availability`, {
          businessStatus: disponible ? 'active' : 'temporarily_closed',
          clearActiveTemporaryClosures: true,
        });
        return normalizeBusiness(data);
      }

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
