/**
 * Mock de autenticación temporal
 * Mientras el otro equipo desarrolla el login
 */

export interface MockUser {
  id: number;
  restaurante_id: number;
  business_id: number;
  nombre: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
}

// Usuario mockeado para desarrollo
export const MOCK_USER: MockUser = {
  id: 1,
  restaurante_id: 1,
  business_id: 2030001,
  nombre: 'MesoQuick Negocio',
  email: 'admin@mesoquick.com',
  role: 'ADMIN',
};

/**
 * Simula obtener el usuario autenticado
 */
export const getMockUser = (): MockUser => {
  // En el futuro, esto leerá de localStorage o context
  return MOCK_USER;
};

/**
 * Simula verificar si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem('auth_token'));
};

/**
 * Obtener el ID del restaurante del usuario actual
 */
export const getCurrentRestaurantId = (): number => {
  const rawUser = localStorage.getItem('auth_user');
  if (rawUser) {
    try {
      const user = JSON.parse(rawUser) as {
        restaurantId?: number;
        restaurantes?: Array<{ id: number }>;
      };

      return user.restaurantId || user.restaurantes?.[0]?.id || MOCK_USER.restaurante_id;
    } catch {
      return MOCK_USER.restaurante_id;
    }
  }

  return MOCK_USER.restaurante_id;
};

export { getCurrentCommerceId } from '@/shared/business/businessContext';
