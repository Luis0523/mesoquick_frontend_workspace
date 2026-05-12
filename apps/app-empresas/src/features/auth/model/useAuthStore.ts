import { create } from 'zustand';
import type { AuthSession, AuthUser, LoginDTO, RestaurantRegisterDTO } from '@/entities/auth/model/types';
import { authService } from '../api/auth.service';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

interface AuthStore {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (dto: LoginDTO) => Promise<void>;
  registerRestaurant: (dto: RestaurantRegisterDTO) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const getStoredUser = (): AuthUser | null => {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

const persistSession = ({ token, usuario }: AuthSession) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(usuario));
};

const clearSession = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const useAuthStore = create<AuthStore>((set, get) => {
  const token = getAuthToken();
  const user = getStoredUser();

  return {
    token,
    user,
    isLoading: false,
    error: null,
    isAuthenticated: Boolean(token),

    login: async (dto) => {
      set({ isLoading: true, error: null });
      try {
        const session = await authService.login(dto);
        persistSession(session);
        set({
          token: session.token,
          user: session.usuario,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        set({ error: message, isLoading: false });
        throw error;
      }
    },

    registerRestaurant: async (dto) => {
      set({ isLoading: true, error: null });
      try {
        const session = await authService.registerRestaurant(dto);
        persistSession(session);
        set({
          token: session.token,
          user: session.usuario,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Error desconocido';
        set({ error: message, isLoading: false });
        throw error;
      }
    },

    refreshToken: async () => {
      const currentUser = get().user;
      const token = await authService.refresh();
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      set({ token, user: currentUser, isAuthenticated: true });
    },

    logout: () => {
      clearSession();
      set({ token: null, user: null, isAuthenticated: false, error: null });
    },

    clearError: () => set({ error: null }),
  };
});
