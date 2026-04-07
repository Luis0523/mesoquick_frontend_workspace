/**
 * Mock de autenticación temporal
 * Mientras el otro equipo desarrolla el login
 */

export interface MockUser {
  id: number;
  restaurante_id: number;
  nombre: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
}

// Usuario mockeado para desarrollo
export const MOCK_USER: MockUser = {
  id: 1,
  restaurante_id: 1,
  nombre: 'Pizza Hut Centro',
  email: 'admin@pizzahut.com',
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
  // En el futuro, verificará token válido
  return true;
};

/**
 * Obtener el ID del restaurante del usuario actual
 */
export const getCurrentRestaurantId = (): number => {
  return MOCK_USER.restaurante_id;
};
