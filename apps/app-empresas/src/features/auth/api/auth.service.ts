import { apiClient, handleApiError } from '@/shared/api/apiClient';
import { ENV } from '@/shared/config/env.config';
import type { AuthSession, LoginDTO, RestaurantRegisterDTO } from '@/entities/auth/model/types';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const authService = {
  login: async (dto: LoginDTO): Promise<AuthSession> => {
    if (ENV.AUTH_MODE === 'mock' && !ENV.IS_PRODUCTION) {
      const email = dto.email.trim().toLowerCase();
      const expectedEmail = ENV.TEST_USER_EMAIL.trim().toLowerCase();

      if (email !== expectedEmail || dto.password !== ENV.TEST_USER_PASSWORD) {
        throw new Error('Credenciales de prueba invalidas');
      }

      return {
        token: `dev-token-${Date.now()}`,
        usuario: {
          id: 1,
          email,
          firstName: 'Test',
          lastName: 'Negocios',
          role: 'BUSINESS_ADMIN',
          accountType: 'business',
          businessId: ENV.DEFAULT_BUSINESS_ID,
          businesses: [
            {
              businessId: ENV.DEFAULT_BUSINESS_ID,
              tradeName: 'QA Mini Test 1778562533306',
              businessType: 'pharmacy',
            },
          ],
        },
      };
    }

    try {
      const { data: response } = await apiClient.post<ApiResponse<AuthSession>>('/auth/login', dto);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al iniciar sesión: ${apiError.message}`);
    }
  },

  registerRestaurant: async (dto: RestaurantRegisterDTO): Promise<AuthSession> => {
    try {
      const { data: response } = await apiClient.post<ApiResponse<AuthSession>>('/auth/register', dto);
      return response.data;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al registrar restaurante: ${apiError.message}`);
    }
  },

  refresh: async (): Promise<string> => {
    try {
      const { data: response } = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
      return response.data.token;
    } catch (error) {
      const apiError = handleApiError(error);
      throw new Error(`Error al renovar sesión: ${apiError.message}`);
    }
  },
};
