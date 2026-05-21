export type LogisticsOrderStatus =
  | 'pendiente_restaurante'
  | 'preparando'
  | 'preparado'
  | 'pendiente'
  | 'asignada'
  | 'en_ruta'
  | 'entregada'
  | 'cancelada';

export interface LogisticsOrder {
  id_entrega: number;
  restaurante_id: number;
  estado_entrega: LogisticsOrderStatus;
  monto_cobrar: number;
  tarifa_ofrecida: number;
  metodo_pago: string;
  distancia_estimada_km: number;
  negocio_nombre: string;
  cliente_nombre: string;
  direccion_entrega: string;
  detalles_orden: string[];
  categoria: { id: number; name: string } | null;
  created_at: string;
  updated_at: string | null;

  repartidor?: {
    id: number;
    nombre: string;
    telefono: string;
    vehiculo: string;
  } | null;
}

export interface LogisticsOrderDetail extends LogisticsOrder {
  asignaciones_activas?: {
    id_asignacion: number;
    repartidor_nombre: string;
    repartidor_telefono: string;
    vehiculo: string;
    estado_asignacion: string;
    fecha_asignacion: string;
  }[];
  historial_estados?: {
    estado: string;
    timestamp: string;
  }[];
}

export interface WsNewOrder {
  entrega_id: number;
  restaurante_id: number;
  monto_cobrar: number;
  tarifa_ofrecida: number;
  metodo_pago: string;
  distancia_estimada_km: number;
  negocio_nombre: string;
  cliente_nombre: string;
  direccion_entrega: string;
  detalles_orden: string[];
  categoria_id: number;
  created_at: string;
  timestamp: string;
}

export interface WsOrderEvent {
  entrega_id: number;
  restaurante_id: number;
  estado: string;
  publicado_repartidores?: boolean;
  timestamp: string;
}

export const LOGISTICS_STATUS_LABELS: Record<LogisticsOrderStatus, string> = {
  pendiente_restaurante: 'Pendiente de confirmar',
  preparando: 'En preparación',
  preparado: 'Listo, esperando repartidor',
  pendiente: 'Publicado para repartidores',
  asignada: 'Repartidor asignado',
  en_ruta: 'En camino al cliente',
  entregada: 'Entregado',
  cancelada: 'Cancelado',
};

export const LOGISTICS_STATUS_COLORS: Record<LogisticsOrderStatus, string> = {
  pendiente_restaurante: 'bg-yellow-100 text-yellow-800',
  preparando: 'bg-orange-100 text-orange-800',
  preparado: 'bg-blue-100 text-blue-800',
  pendiente: 'bg-purple-100 text-purple-800',
  asignada: 'bg-indigo-100 text-indigo-800',
  en_ruta: 'bg-cyan-100 text-cyan-800',
  entregada: 'bg-green-100 text-green-800',
  cancelada: 'bg-red-100 text-red-800',
};

export type TabKey = 'activos' | 'pendiente_restaurante' | 'preparando' | 'delivery' | 'historial';

export const STATUS_TABS: { key: TabKey; label: string; estados: LogisticsOrderStatus[] }[] = [
  { key: 'pendiente_restaurante', label: 'Pendientes de confirmar', estados: ['pendiente_restaurante'] },
  { key: 'preparando', label: 'En preparación', estados: ['preparando'] },
  { key: 'delivery', label: 'Completados / En delivery', estados: ['pendiente', 'asignada', 'en_ruta'] },
  { key: 'historial', label: 'Historial', estados: ['entregada', 'cancelada'] },
];

export const isLogisticsOrderActive = (status: LogisticsOrderStatus): boolean =>
  !['entregada', 'cancelada'].includes(status);
