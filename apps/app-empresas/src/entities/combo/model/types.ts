export interface Combo {
  id: number;
  restaurante_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  tipo_combo_id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number | string;
  activo: boolean;
  productos: ComboProduct[];
}

export interface ComboProduct {
  producto_id: number;
  cantidad: number;
  nombre?: string;
  precio?: number | string;
  imagen_url?: string | null;
}

export interface CreateComboDTO {
  tipo_combo_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  productos: { producto_id: number; cantidad: number }[];
}

export type UpdateComboDTO = Partial<CreateComboDTO>;

export enum ComboType {
  PROMOCION = 1,
  FAMILIAR = 2,
  INDIVIDUAL = 3,
}

export const COMBO_TYPE_LABELS: Record<ComboType, string> = {
  [ComboType.PROMOCION]: 'Promoción',
  [ComboType.FAMILIAR]: 'Familiar',
  [ComboType.INDIVIDUAL]: 'Individual',
};

export const fromCents = (cents: number | string): number => Number(cents);
export const toCents = (quetzales: number | string): number => Number(quetzales);
export const formatComboPrice = (precio: number | string): string => `Q${Number(precio).toFixed(2)}`;
