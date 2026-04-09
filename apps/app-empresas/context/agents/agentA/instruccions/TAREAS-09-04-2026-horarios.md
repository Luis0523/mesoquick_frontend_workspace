# 🤖 Tareas Agent A - 09/04/2026 (Sesión 2)

**Fecha:** 09/04/2026  
**Agente:** Agent A - "Schedule Entity & Service Setup"  
**Responsabilidad:** Crear la capa de datos y API para horarios

---

## 🎯 Objetivo Principal

Implementar la **infraestructura completa de datos** para el módulo de **Horarios**:
- Entity types con TypeScript estricto
- Service API con endpoints REST
- Zustand store para state management

---

## 📋 Tareas Específicas

### 1. Crear Entity de Schedule

**Archivo:** `src/entities/schedule/model/types.ts`

**Requisitos:**

```typescript
// Interface principal
export interface Schedule {
  // Auto-generados por backend
  id: number;
  restaurante_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  
  // Campos obligatorios
  dia_semana: DayOfWeek;     // 0=Lunes, 1=Martes, ..., 6=Domingo
  hora_apertura: string;      // Format: "HH:MM:SS" (24h)
  hora_cierre: string;        // Format: "HH:MM:SS" (24h)
  
  // Estado
  activo: boolean;            // Permite desactivar temporalmente
}

// Enum de días de la semana
export enum DayOfWeek {
  LUNES = 0,
  MARTES = 1,
  MIERCOLES = 2,
  JUEVES = 3,
  VIERNES = 4,
  SABADO = 5,
  DOMINGO = 6,
}

// Labels para el UI
export const DAY_NAMES: Record<DayOfWeek, string> = {
  [DayOfWeek.LUNES]: 'Lunes',
  [DayOfWeek.MARTES]: 'Martes',
  [DayOfWeek.MIERCOLES]: 'Miércoles',
  [DayOfWeek.JUEVES]: 'Jueves',
  [DayOfWeek.VIERNES]: 'Viernes',
  [DayOfWeek.SABADO]: 'Sábado',
  [DayOfWeek.DOMINGO]: 'Domingo',
};

// Labels cortos para vista compacta
export const DAY_SHORT_NAMES: Record<DayOfWeek, string> = {
  [DayOfWeek.LUNES]: 'Lun',
  [DayOfWeek.MARTES]: 'Mar',
  [DayOfWeek.MIERCOLES]: 'Mié',
  [DayOfWeek.JUEVES]: 'Jue',
  [DayOfWeek.VIERNES]: 'Vie',
  [DayOfWeek.SABADO]: 'Sáb',
  [DayOfWeek.DOMINGO]: 'Dom',
};

// DTOs para crear/actualizar
export interface CreateScheduleDTO {
  dia_semana: DayOfWeek;
  hora_apertura: string;  // "HH:MM:SS" o "HH:MM"
  hora_cierre: string;    // "HH:MM:SS" o "HH:MM"
}

export type UpdateScheduleDTO = Partial<Omit<CreateScheduleDTO, 'dia_semana'>>;

// Helper para validación
export const isValidTimeRange = (apertura: string, cierre: string): boolean => {
  return apertura < cierre;
};

// Helper para formatear hora
export const formatTime = (time: string): string => {
  // "08:00:00" -> "08:00"
  return time.substring(0, 5);
};

// Helper para normalizar hora (agregar segundos si falta)
export const normalizeTime = (time: string): string => {
  // "08:00" -> "08:00:00"
  return time.length === 5 ? `${time}:00` : time;
};
```

**Validaciones:**
- ✅ Enum DayOfWeek con valores 0-6
- ✅ Todos los campos nullable con `| null`
- ✅ Sin uso de `any`
- ✅ Helpers exportados y con tipos correctos

---

### 2. Crear Service de Horarios

**Archivo:** `src/features/manage-schedule/api/schedule.service.ts`

**Requisitos:**

```typescript
import { apiClient } from '@/shared/api/apiClient';
import type { Schedule, CreateScheduleDTO, UpdateScheduleDTO } from '@/entities/schedule/model/types';

interface GetSchedulesParams {
  activo?: boolean;
}

interface ApiWrapperResponse<T> {
  success: boolean;
  data: T;
  count?: number;
}

export const scheduleService = {
  /**
   * Obtener todos los horarios de un restaurante
   * GET /restaurantes/:rid/horarios
   */
  getAll: async (restaurantId: number, params?: GetSchedulesParams): Promise<Schedule[]> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Schedule[]>>(
      `/restaurantes/${restaurantId}/horarios`,
      { params }
    );
    return data.data;
  },

  /**
   * Obtener un horario por ID
   * GET /restaurantes/:rid/horarios/:hid
   */
  getById: async (restaurantId: number, scheduleId: number): Promise<Schedule> => {
    const { data } = await apiClient.get<ApiWrapperResponse<Schedule>>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`
    );
    return data.data;
  },

  /**
   * Crear un nuevo horario
   * POST /restaurantes/:rid/horarios
   */
  create: async (restaurantId: number, dto: CreateScheduleDTO): Promise<Schedule> => {
    const { data } = await apiClient.post<ApiWrapperResponse<Schedule>>(
      `/restaurantes/${restaurantId}/horarios`,
      dto
    );
    return data.data;
  },

  /**
   * Actualizar un horario existente
   * PUT /restaurantes/:rid/horarios/:hid
   */
  update: async (
    restaurantId: number,
    scheduleId: number,
    dto: UpdateScheduleDTO
  ): Promise<Schedule> => {
    const { data } = await apiClient.put<ApiWrapperResponse<Schedule>>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`,
      dto
    );
    return data.data;
  },

  /**
   * Eliminar un horario (soft delete)
   * DELETE /restaurantes/:rid/horarios/:hid
   */
  delete: async (restaurantId: number, scheduleId: number): Promise<void> => {
    await apiClient.delete(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`
    );
  },

  /**
   * Toggle estado activo/inactivo
   * PATCH /restaurantes/:rid/horarios/:hid/activo
   */
  toggleActive: async (
    restaurantId: number,
    scheduleId: number,
    activo: boolean
  ): Promise<Schedule> => {
    const { data } = await apiClient.patch<ApiWrapperResponse<Schedule>>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}/activo`,
      { activo }
    );
    return data.data;
  },
};
```

**Validaciones:**
- ✅ Nested routes correctas (`/restaurantes/:rid/horarios`)
- ✅ Tipos de retorno explícitos (Promise<Schedule>, etc.)
- ✅ JSDoc comments en cada método
- ✅ Extracción de `data.data` por wrapper de API
- ✅ Import de apiClient desde `@/shared/api/apiClient`

---

### 3. Crear Zustand Store

**Archivo:** `src/features/manage-schedule/model/useScheduleStore.ts`

**Requisitos:**

```typescript
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
          s.id === scheduleId ? updatedSchedule : s
        ),
        currentSchedule: state.currentSchedule?.id === scheduleId ? updatedSchedule : state.currentSchedule,
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
          s.id === scheduleId ? updatedSchedule : s
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
```

**Validaciones:**
- ✅ Estado inmutable (usar spread operator)
- ✅ Loading state en cada acción async
- ✅ Error handling con try/catch
- ✅ Actualización optimista del state
- ✅ Tipos explícitos en interface
- ✅ Métodos de utilidad (clearError, reset)

---

## ✅ Criterios de Éxito

### TypeScript
- [ ] Compila sin errores: `npm run build`
- [ ] Sin uso de `any`
- [ ] Todos los tipos exportados correctamente
- [ ] Imports con path alias `@/`

### Service API
- [ ] Nested routes correctas
- [ ] Métodos con JSDoc
- [ ] Extracción correcta de `data.data`
- [ ] Tipos de retorno Promise<T>

### Zustand Store
- [ ] Estado inicial correcto
- [ ] Loading states en todas las acciones
- [ ] Error handling completo
- [ ] Actualización inmutable del estado
- [ ] Funciones helper implementadas

---

## 📚 Referencias

**Documentos:**
- `/context/instruccions/02-API-ENDPOINTS-Y-MODELOS.md` (Sección 3: Horarios)
- `/context/endpoints_base/restaurantes/HORARIOS-COLLECTION.postman_collection.json`

**Código de referencia (MISMO PATRÓN):**
- `src/entities/product/model/types.ts` (estructura similar)
- `src/features/manage-products/api/products.service.ts` (patrón de service)
- `src/features/manage-products/model/useProductsStore.ts` (patrón de store)

**API Base URL:** `/api` (proxy configurado a https://restaurantes.fly.dev)

---

## 🧪 Testing Manual

Una vez completado, verificar:

```bash
# 1. Compilar sin errores
npm run build

# 2. Verificar imports
# Los tipos deben ser importables desde otros archivos
```

---

**Última actualización:** 09/04/2026 18:15  
**Estado:** ⏳ Pendiente  
**Siguiente paso:** Agent B implementará UI con estos datos
