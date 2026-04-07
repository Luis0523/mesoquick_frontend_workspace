/**
 * Zustand Store para gestión de Restaurant
 * Centraliza el estado y lógica de negocio del restaurante
 */

import { create } from 'zustand';
import { restaurantService } from '../api/restaurant.service';
import type {
  Restaurant,
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
} from '@/entities/restaurant/model/types';

interface RestaurantStore {
  // Estado
  restaurant: Restaurant | null;
  restaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;

  // Acciones
  fetchRestaurant: (id: number) => Promise<void>;
  fetchRestaurants: (params?: { activo?: boolean; disponible?: boolean }) => Promise<void>;
  createRestaurant: (dto: CreateRestaurantDTO) => Promise<Restaurant>;
  updateRestaurant: (id: number, dto: UpdateRestaurantDTO) => Promise<void>;
  deleteRestaurant: (id: number) => Promise<void>;
  toggleAvailability: (id: number, disponible: boolean) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

const initialState = {
  restaurant: null,
  restaurants: [],
  isLoading: false,
  error: null,
};

export const useRestaurantStore = create<RestaurantStore>((set, get) => ({
  ...initialState,

  /**
   * Obtener un restaurante por ID
   */
  fetchRestaurant: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await restaurantService.getById(id);
      set({ restaurant: data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Obtener lista de restaurantes
   */
  fetchRestaurants: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const data = await restaurantService.getAll(params);
      set({ restaurants: data, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: message, isLoading: false });
    }
  },

  /**
   * Crear un nuevo restaurante
   */
  createRestaurant: async (dto: CreateRestaurantDTO) => {
    set({ isLoading: true, error: null });
    try {
      const newRestaurant = await restaurantService.create(dto);
      set((state) => ({
        restaurants: [...state.restaurants, newRestaurant],
        restaurant: newRestaurant,
        isLoading: false,
      }));
      return newRestaurant;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Actualizar un restaurante
   */
  updateRestaurant: async (id: number, dto: UpdateRestaurantDTO) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await restaurantService.update(id, dto);
      set((state) => ({
        restaurant: state.restaurant?.id === id ? updated : state.restaurant,
        restaurants: state.restaurants.map((r) => (r.id === id ? updated : r)),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Eliminar un restaurante (soft delete)
   */
  deleteRestaurant: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await restaurantService.delete(id);
      set((state) => ({
        restaurants: state.restaurants.filter((r) => r.id !== id),
        restaurant: state.restaurant?.id === id ? null : state.restaurant,
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Toggle disponibilidad del restaurante
   */
  toggleAvailability: async (id: number, disponible: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await restaurantService.toggleAvailability(id, disponible);
      set((state) => ({
        restaurant: state.restaurant?.id === id ? updated : state.restaurant,
        restaurants: state.restaurants.map((r) => (r.id === id ? updated : r)),
        isLoading: false,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  /**
   * Limpiar error
   */
  clearError: () => set({ error: null }),

  /**
   * Resetear el store
   */
  reset: () => set(initialState),
}));
