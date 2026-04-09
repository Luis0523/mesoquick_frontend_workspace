// Interface principal
export interface Order {
  // Auto-generados por backend
  id: number;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  
  // Relaciones
  restaurante_id: number;
  cliente_id: number;
  repartidor_id: number | null;
  
  // Información del cliente
  cliente_nombre: string;
  cliente_telefono: string;
  direccion_entrega: string;
  
  // Detalles del pedido
  items: OrderItem[];
  notas?: string | null;
  
  // Montos (en centavos)
  subtotal: number;
  costo_delivery: number;
  total: number;
  
  // Estado
  estado: OrderStatus;
  
  // Timestamps de estados
  fecha_aceptacion: string | null;
  fecha_preparacion: string | null;
  fecha_listo: string | null;
  fecha_en_camino: string | null;
  fecha_entregado: string | null;
  fecha_cancelado: string | null;
}

// Estados del pedido
export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',           // Recién creado, esperando aceptación
  ACEPTADO = 'ACEPTADO',             // Restaurante aceptó
  PREPARANDO = 'PREPARANDO',         // En preparación
  LISTO = 'LISTO',                   // Listo para recoger
  EN_CAMINO = 'EN_CAMINO',           // Repartidor en camino
  ENTREGADO = 'ENTREGADO',           // Entregado al cliente
  CANCELADO = 'CANCELADO',           // Cancelado
}

// Labels para el UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDIENTE]: 'Pendiente',
  [OrderStatus.ACEPTADO]: 'Aceptado',
  [OrderStatus.PREPARANDO]: 'Preparando',
  [OrderStatus.LISTO]: 'Listo',
  [OrderStatus.EN_CAMINO]: 'En Camino',
  [OrderStatus.ENTREGADO]: 'Entregado',
  [OrderStatus.CANCELADO]: 'Cancelado',
};

// Colores para badges
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.ACEPTADO]: 'bg-blue-100 text-blue-800',
  [OrderStatus.PREPARANDO]: 'bg-orange-100 text-orange-800',
  [OrderStatus.LISTO]: 'bg-purple-100 text-purple-800',
  [OrderStatus.EN_CAMINO]: 'bg-indigo-100 text-indigo-800',
  [OrderStatus.ENTREGADO]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELADO]: 'bg-red-100 text-red-800',
};

// Item del pedido
export interface OrderItem {
  id: number;
  pedido_id: number;
  producto_id: number;
  producto_nombre: string;
  cantidad: number;
  precio_unitario: number;  // En centavos
  subtotal: number;          // En centavos
  notas?: string | null;
}

// DTO para actualizar estado
export interface UpdateOrderStatusDTO {
  estado: OrderStatus;
}

// DTO para actualizar (si aplica)
export interface UpdateOrderDTO {
  notas?: string;
}

// Helpers
export const isOrderActive = (status: OrderStatus): boolean => {
  return ![OrderStatus.ENTREGADO, OrderStatus.CANCELADO].includes(status);
};

export const canChangeStatus = (currentStatus: OrderStatus, newStatus: OrderStatus): boolean => {
  // Lógica de transiciones válidas
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDIENTE]: [OrderStatus.ACEPTADO, OrderStatus.CANCELADO],
    [OrderStatus.ACEPTADO]: [OrderStatus.PREPARANDO, OrderStatus.CANCELADO],
    [OrderStatus.PREPARANDO]: [OrderStatus.LISTO, OrderStatus.CANCELADO],
    [OrderStatus.LISTO]: [OrderStatus.EN_CAMINO, OrderStatus.CANCELADO],
    [OrderStatus.EN_CAMINO]: [OrderStatus.ENTREGADO, OrderStatus.CANCELADO],
    [OrderStatus.ENTREGADO]: [],
    [OrderStatus.CANCELADO]: [],
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) ?? false;
};
