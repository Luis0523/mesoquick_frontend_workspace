/**
 * Utilidades para manejo de fechas
 * El backend usa ISO 8601, el frontend formatea para display
 */

/**
 * Formatea una fecha ISO a formato legible
 * "2026-04-07T18:30:00Z" → "07/04/2026 18:30"
 */
export const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formatea solo la fecha
 * "2026-04-07T18:30:00Z" → "07/04/2026"
 */
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Formatea solo la hora
 * "2026-04-07T18:30:00Z" → "18:30"
 */
export const formatTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${hours}:${minutes}`;
};

/**
 * Obtiene una fecha relativa
 * "2026-04-07T10:00:00Z" → "Hace 8 horas" (si ahora son las 18:00)
 */
export const getRelativeTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `Hace ${days} día${days > 1 ? 's' : ''}`;
  if (hours > 0) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'Hace un momento';
};

/**
 * Valida formato de hora HH:MM:SS
 */
export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
  return timeRegex.test(time);
};

/**
 * Valida que hora_cierre > hora_apertura
 */
export const isValidTimeRange = (apertura: string, cierre: string): boolean => {
  if (!isValidTimeFormat(apertura) || !isValidTimeFormat(cierre)) {
    return false;
  }
  return cierre > apertura;
};
