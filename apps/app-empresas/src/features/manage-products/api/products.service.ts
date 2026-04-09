import { apiClient } from '@/shared/api/apiClient';
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/entities/product/model/types';

interface GetProductsParams {
  activo?: boolean;
}

interface ApiWrapperResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const productsService = {
  /**
   * Obtener todos los productos de un restaurante
   * GET /restaurantes/:rid/productos
   */
  getAll: async (restaurantId: number, params?: GetProductsParams): Promise<Product[]> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Product[]>>(
      `/restaurantes/${restaurantId}/productos`,
      { params }
    );
    return data.data;
  },

  /**
   * Obtener un producto por ID
   * GET /restaurantes/:rid/productos/:pid
   */
  getById: async (restaurantId: number, productId: number): Promise<Product> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Product>>(
      `/restaurantes/${restaurantId}/productos/${productId}`
    );
    return data.data;
  },

  /**
   * Crear un nuevo producto
   * POST /restaurantes/:rid/productos
   */
  create: async (restaurantId: number, dto: CreateProductDTO): Promise<Product> => {
    const { data } = await apiClient.post<ApiWrapperResponse<Product>>(
      `/restaurantes/${restaurantId}/productos`,
      dto
    );
    return data.data;
  },

  /**
   * Actualizar un producto existente
   * PUT /restaurantes/:rid/productos/:pid
   */
  update: async (
    restaurantId: number,
    productId: number,
    dto: UpdateProductDTO
  ): Promise<Product> => {
    const { data } = await apiClient.put<ApiWrapperResponse<Product>>(
      `/restaurantes/${restaurantId}/productos/${productId}`,
      dto
    );
    return data.data;
  },

  /**
   * Eliminar un producto (soft delete)
   * DELETE /restaurantes/:rid/productos/:pid
   */
  delete: async (restaurantId: number, productId: number): Promise<void> => {
    await apiClient.delete(
      `/restaurantes/${restaurantId}/productos/${productId}`
    );
  },

  /**
   * Toggle estado activo/inactivo
   * PATCH /restaurantes/:rid/productos/:pid/activo
   */
  toggleActive: async (
    restaurantId: number,
    productId: number,
    activo: boolean
  ): Promise<Product> => {
    const { data } = await apiClient.patch<ApiWrapperResponse<Product>>(
      `/restaurantes/${restaurantId}/productos/${productId}/activo`,
      { activo }
    );
    return data.data;
  },
};
