// Interface principal
export interface Product {
  // Auto-generados por backend
  id: number;
  restaurante_id: number;
  business_id?: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  
  // Campos obligatorios
  tipo_producto_id: number;  // FK a catálogo de categorías
  nombre: string;
  precio: number | string;   // Backend puede devolver string "7600.00" o number 7600
  
  // Campos opcionales
  descripcion?: string | null;
  imagen_url?: string | null;
  
  // Estado
  activo: boolean;           // Disponible para venta
  visible_in_catalog?: boolean;
  stock?: {
    productStockId?: number;
    availableQuantity?: number;
    reservedQuantity?: number;
    minimumAlertQuantity?: number;
    product_stock_id?: number;
    available_quantity?: number;
    reserved_quantity?: number;
    minimum_alert_quantity?: number;
  } | null;
}

// Enum de categorías
export enum ProductType {
  COMIDA_RAPIDA = 1,
  PIZZA = 2,
  BEBIDA = 3,
  POSTRE = 4,
  ENTRADA = 5,
  PLATO_FUERTE = 6,
}

// Labels para el UI
export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  [ProductType.COMIDA_RAPIDA]: 'Comida Rápida',
  [ProductType.PIZZA]: 'Pizza',
  [ProductType.BEBIDA]: 'Bebida',
  [ProductType.POSTRE]: 'Postre',
  [ProductType.ENTRADA]: 'Entrada',
  [ProductType.PLATO_FUERTE]: 'Plato Fuerte',
};

export interface ProductCategory {
  id: number;
  name: string;
  description?: string | null;
  status?: string;
}

// DTOs para crear/actualizar
export interface CreateProductDTO {
  tipo_producto_id: number;
  nombre: string;
  precio: number;            // Ya debe venir en centavos
  descripcion?: string;
  imagen_url?: string;
  visible_in_catalog?: boolean;
  internal_code?: string;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

// Helpers para conversión de precios (Neutralizados para usar valores reales de la DB)
export const fromCents = (cents: number | string): number => Number(cents);
export const toCents = (quetzales: number | string): number => Number(quetzales);

// Helper para formatear precio
export const formatProductPrice = (cents: number | string): string => {
  return `Q${fromCents(cents).toFixed(2)}`;
};
