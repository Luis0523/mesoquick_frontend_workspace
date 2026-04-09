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
