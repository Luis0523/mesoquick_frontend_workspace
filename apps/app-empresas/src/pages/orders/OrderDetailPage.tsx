import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, User, MapPin, Phone, FileText } from 'lucide-react';
import { useOrdersStore } from '@/features/manage-orders/model/useOrdersStore';
import { 
  OrderStatus, 
  ORDER_STATUS_LABELS, 
  ORDER_STATUS_COLORS,
  canChangeStatus 
} from '@/entities/order/model/types';
import { formatPrice } from '@/shared/utils/currency';
import { formatDateTime } from '@/shared/utils/date';
import { getCurrentRestaurantId } from '@/shared/mocks/mockAuth';

export const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id!);
  const restaurantId = getCurrentRestaurantId();
  
  const { currentOrder, isLoading, error, fetchOrderById, updateOrderStatus } = useOrdersStore();

  useEffect(() => {
    fetchOrderById(restaurantId, orderId).catch(() => {
      console.log('API de pedidos aún no disponible');
    });
  }, [orderId]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!currentOrder) return;
    
    if (!canChangeStatus(currentOrder.estado, newStatus)) {
      alert('Cambio de estado no permitido');
      return;
    }

    try {
      await updateOrderStatus(restaurantId, orderId, newStatus);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
    }
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 text-primary hover:underline"
          >
            ← Volver a Pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-primary">Pedido #{currentOrder.id}</h1>
          <p className="text-gray-600 flex items-center gap-1 mt-1">
            <Clock size={14} />
            {formatDateTime(currentOrder.fecha_creacion)}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[currentOrder.estado]}`}>
          {ORDER_STATUS_LABELS[currentOrder.estado]}
        </span>
      </div>

      {/* Grid de 2 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Información del Cliente */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <User size={20} />
              Información del Cliente
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium">{currentOrder.cliente_nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Phone size={14} />
                  Teléfono
                </p>
                <p className="font-medium">{currentOrder.cliente_telefono}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <MapPin size={14} />
                  Dirección de Entrega
                </p>
                <p className="font-medium">{currentOrder.direccion_entrega}</p>
              </div>
              {currentOrder.notas && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <FileText size={14} />
                    Notas
                  </p>
                  <p className="text-sm bg-gray-50 p-3 rounded">{currentOrder.notas}</p>
                </div>
              )}
            </div>
          </div>

          {/* Productos del Pedido */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Productos</h2>
            <div className="space-y-3">
              {currentOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium">{item.producto_nombre}</p>
                    {item.notas && (
                      <p className="text-sm text-gray-500">Nota: {item.notas}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {item.cantidad} x {formatPrice(item.precio_unitario)}
                    </p>
                    <p className="text-sm text-gray-600">
                      = {formatPrice(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>{formatPrice(currentOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Costo de Delivery:</span>
                <span>{formatPrice(currentOrder.costo_delivery)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary">
                <span>Total:</span>
                <span>{formatPrice(currentOrder.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna lateral - Acciones */}
        <div className="space-y-6">
          {/* Cambiar Estado */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Cambiar Estado</h2>
            <div className="space-y-2">
              {Object.values(OrderStatus).map((status) => {
                const isCurrentStatus = currentOrder.estado === status;
                const canChange = canChangeStatus(currentOrder.estado, status);
                const isDisabled = isCurrentStatus || !canChange;

                return (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={isDisabled}
                    className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                      isCurrentStatus
                        ? 'bg-primary text-white cursor-default'
                        : canChange
                        ? 'bg-white border border-gray-300 hover:bg-gray-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {ORDER_STATUS_LABELS[status]}
                    {isCurrentStatus && ' (actual)'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline de Estados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Historial</h2>
            <div className="space-y-4">
              {currentOrder.fecha_creacion && (
                <TimelineItem 
                  label="Creado" 
                  date={currentOrder.fecha_creacion} 
                  completed 
                />
              )}
              {currentOrder.fecha_aceptacion && (
                <TimelineItem 
                  label="Aceptado" 
                  date={currentOrder.fecha_aceptacion} 
                  completed 
                />
              )}
              {currentOrder.fecha_preparacion && (
                <TimelineItem 
                  label="Preparando" 
                  date={currentOrder.fecha_preparacion} 
                  completed 
                />
              )}
              {currentOrder.fecha_listo && (
                <TimelineItem 
                  label="Listo" 
                  date={currentOrder.fecha_listo} 
                  completed 
                />
              )}
              {currentOrder.fecha_en_camino && (
                <TimelineItem 
                  label="En Camino" 
                  date={currentOrder.fecha_en_camino} 
                  completed 
                />
              )}
              {currentOrder.fecha_entregado && (
                <TimelineItem 
                  label="Entregado" 
                  date={currentOrder.fecha_entregado} 
                  completed 
                />
              )}
              {currentOrder.fecha_cancelado && (
                <TimelineItem 
                  label="Cancelado" 
                  date={currentOrder.fecha_cancelado} 
                  completed 
                  error 
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente auxiliar para timeline
const TimelineItem = ({ 
  label, 
  date, 
  completed, 
  error 
}: { 
  label: string; 
  date: string; 
  completed: boolean; 
  error?: boolean;
}) => (
  <div className="flex gap-3">
    <div className={`w-2 h-2 rounded-full mt-1 ${
      error ? 'bg-red-500' : completed ? 'bg-green-500' : 'bg-gray-300'
    }`} />
    <div>
      <p className={`font-medium ${error ? 'text-red-600' : 'text-gray-800'}`}>
        {label}
      </p>
      <p className="text-xs text-gray-500">
        {formatDateTime(date)}
      </p>
    </div>
  </div>
);
