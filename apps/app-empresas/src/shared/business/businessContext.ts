import type { AuthUser } from '@/entities/auth/model/types';
import { ENV } from '@/shared/config/env.config';

export type CommerceKind = 'restaurant' | 'business';

export interface CommerceContext {
  kind: CommerceKind;
  id: number;
  name?: string;
}

type StoredBusiness = {
  id?: number;
  businessId?: number;
  tradeName?: string;
  name?: string;
  nombre?: string;
  businessType?: string;
};

const DEFAULT_RESTAURANT_ID = ENV.DEFAULT_RESTAURANT_ID;
const DEFAULT_BUSINESS_ID = ENV.DEFAULT_BUSINESS_ID;

const readStoredUser = (): AuthUser | null => {
  const rawUser = localStorage.getItem('auth_user');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
};

export const getCommerceContext = (): CommerceContext => {
  const user = readStoredUser();
  const envKind = ENV.COMMERCE_KIND === 'business' || ENV.COMMERCE_KIND === 'restaurant' ? ENV.COMMERCE_KIND : null;
  const configuredKind = (localStorage.getItem('commerce_kind') as CommerceKind | null) || envKind;
  const role = String(user?.role || user?.rol || '').toLowerCase();
  const hasBusiness = Boolean(user?.businessId || user?.negocioId || user?.businesses?.length || user?.negocios?.length);
  const hasRestaurant = Boolean(user?.restaurantId || user?.restaurantes?.length);
  const kind: CommerceKind = configuredKind || user?.accountType || (hasBusiness || role.includes('business') || role.includes('empresa') ? 'business' : 'restaurant');

  if (kind === 'business') {
    const firstBusiness = (user?.businesses?.[0] || user?.negocios?.[0]) as StoredBusiness | undefined;
    const id = user?.businessId || user?.negocioId || firstBusiness?.businessId || firstBusiness?.id || DEFAULT_BUSINESS_ID;

    return {
      kind,
      id,
      name: firstBusiness?.tradeName || firstBusiness?.name || firstBusiness?.nombre || user?.email,
    };
  }

  const firstRestaurant = user?.restaurantes?.[0];
  return {
    kind: hasRestaurant || !hasBusiness ? 'restaurant' : 'business',
    id: user?.restaurantId || firstRestaurant?.id || DEFAULT_RESTAURANT_ID,
    name: firstRestaurant?.nombre || user?.email,
  };
};

export const getCurrentCommerceId = () => getCommerceContext().id;
export const isBusinessCommerce = () => getCommerceContext().kind === 'business';
