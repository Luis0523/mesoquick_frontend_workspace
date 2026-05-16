export interface RestaurantProduct {
  id: number
  restaurante_id?: number
  tipo_producto_id?: number
  nombre: string
  descripcion?: string
  precio: number
  activo: boolean
  image_url?: string
}

export interface BusinessProduct {
  id: number
  businessId?: number
  productTypeId?: number
  name: string
  description?: string
  internalCode?: string
  basePrice: number
  imageUrl?: string
  imagePublicId?: string
  productStatus: 'active' | 'inactive'
  visibleInCatalog: boolean
}

export type ProductSource = 'restaurant' | 'business'

export interface CartItem {
  productId: number | string
  sourceType: ProductSource
  sourceId: number | string
  sourceName: string
  name: string
  price: number
  quantity: number
  notes?: string
  imageUrl?: string
}
