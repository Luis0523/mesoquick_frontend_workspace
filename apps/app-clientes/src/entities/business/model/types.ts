export type BusinessType =
  | 'pharmacy'
  | 'supermarket'
  | 'convenience_store'
  | 'hardware_store'
  | 'restaurant'
  | 'bakery'
  | 'pet_store'
  | 'other'

export type BusinessStatus = 'active' | 'inactive' | 'suspended'

export interface Business {
  businessId: number
  tradeName: string
  legalName?: string
  businessType: BusinessType
  businessStatus: BusinessStatus
  description?: string
  address?: string
  phone?: string
  email?: string
  taxId?: string
  logoUrl?: string
  logoPublicId?: string
}

export interface BusinessProductType {
  id: number
  businessId?: number
  name: string
  description?: string
  product_type_status: 'active' | 'inactive'
}

export interface BusinessSchedule {
  id?: number
  businessId?: number
  dayOfWeek: number
  openingTime: string
  closingTime: string
}
