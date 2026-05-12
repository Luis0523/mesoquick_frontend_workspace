import { create } from 'zustand';
import { scheduleService } from '../api/schedule.service';
import type { Schedule, CreateScheduleDTO, UpdateScheduleDTO } from '@/entities/schedule/model/types';

interface ScheduleStore {
  // Estado
  schedules: Schedule[];
  currentSchedule: Schedule | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  fetchSchedules: (restaurantId: number, activo?: boolean) => Promise<void>;
  fetchScheduleById: (restaurantId: number, scheduleId: number) => Promise<void>;
  createSchedule: (restaurantId: number, dto: CreateScheduleDTO) => Promise<Schedule>;
  updateSchedule: (restaurantId: number, scheduleId: number, dto: UpdateScheduleDTO) => Promise<Schedule>;
  deleteSchedule: (restaurantId: number, scheduleId: number) => Promise<void>;
  toggleActive: (restaurantId: number, scheduleId: number, activo: boolean) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  // Estado inicial
  schedules: [],
  currentSchedule: null,
  isLoading: false,
  error: null,

  // Fetch all schedules
  fetchSchedules: async (restaurantId: number, activo?: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const schedules = await scheduleService.getAll(restaurantId, { activo });
      set({ schedules, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar horarios',
        isLoading: false,
      });
    }
  },

  // Fetch single schedule
  fetchScheduleById: async (restaurantId: number, scheduleId: number) => {
    set({ isLoading: true, error: null });
    try {
      const schedule = await scheduleService.getById(restaurantId, scheduleId);
      set({ currentSchedule: schedule, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al cargar horario',
        isLoading: false,
      });
    }
  },

  // Create schedule
  createSchedule: async (restaurantId: number, dto: CreateScheduleDTO) => {
    set({ isLoading: true, error: null });
    try {
      const newSchedule = await scheduleService.create(restaurantId, dto);
      set((state) => ({
        schedules: [...state.schedules, newSchedule],
        isLoading: false,
      }));
      return newSchedule;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al crear horario',
        isLoading: false,
      });
      throw error;
    }
  },

  // Update schedule
  updateSchedule: async (restaurantId: number, scheduleId: number, dto: UpdateScheduleDTO) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSchedule = await scheduleService.update(restaurantId, scheduleId, dto);
      set((state) => ({
        schedules: state.schedules.map((s) =>
          s.id === scheduleId ? (updatedSchedule || { ...s, ...dto } as Schedule) : s
        ),
        currentSchedule: state.currentSchedule?.id === scheduleId ? (updatedSchedule || { ...state.currentSchedule, ...dto } as Schedule) : state.currentSchedule,
        isLoading: false,
      }));
      return updatedSchedule;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al actualizar horario',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete schedule (soft delete)
  deleteSchedule: async (restaurantId: number, scheduleId: number) => {
    set({ isLoading: true, error: null });
    try {
      await scheduleService.delete(restaurantId, scheduleId);
      set((state) => ({
        schedules: state.schedules.filter((s) => s.id !== scheduleId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Error al eliminar horario',
        isLoading: false,
      });
      throw error;
    }
  },

  // Toggle active state
  toggleActive: async (restaurantId: number, scheduleId: number, activo: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const updatedSchedule = await scheduleService.toggleActive(restaurantId, scheduleId, activo);
      set((state) => ({
        schedules: state.schedules.map((s) =>
          s.id === scheduleId ? (updatedSchedule || { ...s, activo }) : s
        ),
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

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    schedules: [],
    currentSchedule: null,
    isLoading: false,
    error: null,
  }),
}));
