import { create } from 'zustand';
import { combosService } from '../api/combos.service';
import type { Combo, CreateComboDTO, UpdateComboDTO } from '@/entities/combo/model/types';
import { getCommerceContext } from '@/shared/business/businessContext';

interface CombosStore {
  combos: Combo[];
  currentCombo: Combo | null;
  isLoading: boolean;
  error: string | null;

  fetchCombos: () => Promise<void>;
  fetchComboById: (comboId: number) => Promise<void>;
  createCombo: (dto: CreateComboDTO) => Promise<Combo>;
  updateCombo: (comboId: number, dto: UpdateComboDTO) => Promise<Combo>;
  deleteCombo: (comboId: number) => Promise<void>;
  toggleActive: (comboId: number, activo: boolean) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useCombosStore = create<CombosStore>((set) => ({
  combos: [],
  currentCombo: null,
  isLoading: false,
  error: null,

  fetchCombos: async () => {
    set({ isLoading: true, error: null });
    try {
      const restaurantId = getCommerceContext().id;
      const combos = await combosService.getAll(restaurantId);
      set({ combos, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar combos',
        isLoading: false,
      });
    }
  },

  fetchComboById: async (comboId: number) => {
    set({ isLoading: true, error: null });
    try {
      const restaurantId = getCommerceContext().id;
      const combo = await combosService.getById(restaurantId, comboId);
      set({ currentCombo: combo, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar combo',
        isLoading: false,
      });
    }
  },

  createCombo: async (dto: CreateComboDTO) => {
    set({ isLoading: true, error: null });
    try {
      const restaurantId = getCommerceContext().id;
      const newCombo = await combosService.create(restaurantId, dto);
      set((state) => ({
        combos: [...state.combos, newCombo],
        isLoading: false,
      }));
      return newCombo;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear combo',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCombo: async (comboId: number, dto: UpdateComboDTO) => {
    set({ isLoading: true, error: null });
    try {
      const restaurantId = getCommerceContext().id;
      const updated = await combosService.update(restaurantId, comboId, dto);
      set((state) => ({
        combos: state.combos.map((c) => (c.id === comboId ? updated : c)),
        currentCombo: state.currentCombo?.id === comboId ? updated : state.currentCombo,
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar combo',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteCombo: async (comboId: number) => {
    set({ isLoading: true, error: null });
    try {
      const restaurantId = getCommerceContext().id;
      await combosService.delete(restaurantId, comboId);
      set((state) => ({
        combos: state.combos.filter((c) => c.id !== comboId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar combo',
        isLoading: false,
      });
      throw error;
    }
  },

  toggleActive: async (comboId: number, activo: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const restaurantId = getCommerceContext().id;
      const updated = await combosService.toggleActive(restaurantId, comboId, activo);
      set((state) => ({
        combos: state.combos.map((c) => (c.id === comboId ? updated : c)),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cambiar estado',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({
    combos: [],
    currentCombo: null,
    isLoading: false,
    error: null,
  }),
}));
