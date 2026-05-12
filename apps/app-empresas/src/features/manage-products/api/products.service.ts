import { apiClient } from '@/shared/api/apiClient';
import { businessApiClient } from '@/shared/api/businessApiClient';
import { isBusinessCommerce } from '@/shared/business/businessContext';
import { PRODUCT_TYPE_LABELS } from '@/entities/product/model/types';
import type { Product, CreateProductDTO, ProductCategory, UpdateProductDTO } from '@/entities/product/model/types';

interface GetProductsParams {
  activo?: boolean;
}

interface ApiWrapperResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

type BusinessProduct = {
  productId?: number;
  product_id?: number;
  businessId?: number;
  business_id?: number;
  productTypeId?: number;
  product_type_id?: number;
  name: string;
  description?: string | null;
  internalCode?: string;
  internal_code?: string;
  basePrice?: number | string;
  base_price?: number | string;
  imageUrl?: string | null;
  image_url?: string | null;
  productStatus?: string;
  product_status?: string;
  visibleInCatalog?: boolean;
  visible_in_catalog?: boolean | number;
  stock?: Product['stock'];
  createdAt?: string;
  created_at?: string;
  updatedAt?: string;
  updated_at?: string;
};

type BusinessProductType = {
  productTypeId?: number;
  product_type_id?: number;
  name: string;
  description?: string | null;
  productTypeStatus?: string;
  product_type_status?: string;
};

const unwrap = <T>(response: T | ApiWrapperResponse<T>): T => {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as ApiWrapperResponse<T>).data;
  }

  return response as T;
};

const normalizeBusinessProduct = (product: BusinessProduct): Product => ({
  id: product.productId || product.product_id || 0,
  restaurante_id: product.businessId || product.business_id || 0,
  business_id: product.businessId || product.business_id,
  fecha_creacion: product.createdAt || product.created_at || '',
  fecha_actualizacion: product.updatedAt || product.updated_at || null,
  tipo_producto_id: product.productTypeId || product.product_type_id || 0,
  nombre: product.name,
  precio: product.basePrice ?? product.base_price ?? 0,
  descripcion: product.description || null,
  imagen_url: product.imageUrl || product.image_url || null,
  activo: (product.productStatus || product.product_status || 'active') === 'active',
  visible_in_catalog: Boolean(product.visibleInCatalog ?? product.visible_in_catalog),
  stock: product.stock || null,
});

const toBusinessProductDTO = (dto: CreateProductDTO | UpdateProductDTO) => ({
  name: dto.nombre,
  description: dto.descripcion,
  internalCode: dto.internal_code,
  basePrice: dto.precio,
  imageUrl: dto.imagen_url,
  productStatus: 'active',
  visibleInCatalog: dto.visible_in_catalog ?? true,
  productTypeId: dto.tipo_producto_id,
});

const normalizeProductType = (type: BusinessProductType): ProductCategory => ({
  id: type.productTypeId || type.product_type_id || 0,
  name: type.name,
  description: type.description,
  status: type.productTypeStatus || type.product_type_status,
});

export const productsService = {
  /**
   * Obtener todos los productos de un restaurante
   * GET /restaurantes/:rid/productos
   */
  getAll: async (restaurantId: number, params?: GetProductsParams): Promise<Product[]> => {
    if (isBusinessCommerce()) {
      const { data } = await businessApiClient.get<BusinessProduct[]>(
        `/businesses/${restaurantId}/products`,
        { params: { productStatus: params?.activo === false ? 'inactive' : undefined } }
      );
      return data.map(normalizeBusinessProduct);
    }

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
    if (isBusinessCommerce()) {
      const { data } = await businessApiClient.get<BusinessProduct>(`/businesses/${restaurantId}/products/${productId}`);
      return normalizeBusinessProduct(data);
    }

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
    if (isBusinessCommerce()) {
      const { data } = await businessApiClient.post<BusinessProduct>(
        `/businesses/${restaurantId}/products`,
        toBusinessProductDTO(dto)
      );
      return normalizeBusinessProduct(data);
    }

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
    if (isBusinessCommerce()) {
      const { data } = await businessApiClient.patch<BusinessProduct>(
        `/businesses/${restaurantId}/products/${productId}`,
        toBusinessProductDTO(dto)
      );
      return normalizeBusinessProduct(data);
    }

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
    if (isBusinessCommerce()) {
      await businessApiClient.delete(`/businesses/${restaurantId}/products/${productId}`, {
        data: { deletionReason: 'Eliminado desde panel de gestion' },
      });
      return;
    }

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
    if (isBusinessCommerce()) {
      const { data } = await businessApiClient.patch<BusinessProduct>(
        `/businesses/${restaurantId}/products/${productId}`,
        { productStatus: activo ? 'active' : 'inactive' }
      );
      return normalizeBusinessProduct(data);
    }

    const { data } = await apiClient.patch<ApiWrapperResponse<Product>>(
      `/restaurantes/${restaurantId}/productos/${productId}/activo`,
      { activo }
    );
    return data.data;
  },

  getCategories: async (restaurantId: number): Promise<ProductCategory[]> => {
    if (isBusinessCommerce()) {
      const { data } = await businessApiClient.get<BusinessProductType[]>(`/businesses/${restaurantId}/product-types`);
      return data.map(normalizeProductType);
    }

    return Object.entries(PRODUCT_TYPE_LABELS).map(([id, name]) => ({
      id: Number(id),
      name,
      status: 'active',
    }));
  },

  createCategory: async (restaurantId: number, name: string): Promise<ProductCategory> => {
    const { data } = await businessApiClient.post<BusinessProductType | ApiWrapperResponse<BusinessProductType>>(
      `/businesses/${restaurantId}/product-types`,
      { name, description: `Categoria ${name}`, product_type_status: 'active' }
    );
    return normalizeProductType(unwrap(data));
  },

  getInventory: async (restaurantId: number) => {
    if (!isBusinessCommerce()) {
      const { data } = await apiClient.get(`/restaurantes/${restaurantId}/inventario`);
      return unwrap(data);
    }

    const { data } = await businessApiClient.get(`/businesses/${restaurantId}/inventory`);
    return data;
  },

  createInventory: async (restaurantId: number, dto: {
    producto_id: number;
    cantidad_disponible: number;
    cantidad_minima: number;
    unidad_medida: string;
  }) => {
    const { data } = await apiClient.post(`/restaurantes/${restaurantId}/inventario`, dto);
    return unwrap(data);
  },

  registerInventoryMovement: async (restaurantId: number, inventoryId: number, dto: {
    tipo_movimiento: string;
    cantidad: number;
    usuario_responsable: string;
  }) => {
    const { data } = await apiClient.post(
      `/restaurantes/${restaurantId}/inventario/${inventoryId}/movimientos`,
      dto
    );
    return unwrap(data);
  },

  getInventoryHistory: async (restaurantId: number, inventoryId: number) => {
    const { data } = await apiClient.get(`/restaurantes/${restaurantId}/inventario/${inventoryId}/historial`);
    return unwrap(data);
  },

  createInventoryProvider: async (restaurantId: number, dto: { nombre: string; telefono: string }) => {
    const { data } = await apiClient.post(`/restaurantes/${restaurantId}/inventario/proveedores`, dto);
    return unwrap(data);
  },
};
