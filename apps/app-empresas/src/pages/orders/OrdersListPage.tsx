import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, MapPin } from 'lucide-react';
import { useOrdersStore } from '@/features/manage-orders/model/useOrdersStore';
import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/entities/order/model/types';
import { formatPrice } from '@/shared/utils/currency';
import { formatDateTime } from '@/shared/utils/date';
import { getCurrentRestaurantId } from '@/shared/mocks/mockAuth';
import { isBusinessCommerce } from '@/shared/business/businessContext';

export const OrdersListPage = () => {
  const navigate = useNavigate();
  const usesBusinessBackend = isBusinessCommerce();
  const restaurantId = getCurrentRestaurantId();
  const { orders, isLoading, error, fetchActiveOrders } = useOrdersStore();
  
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    if (usesBusinessBackend) return;

    // Intentar cargar pedidos activos
    // Si falla (404), mostrar mensaje que API no está lista
    fetchActiveOrders(restaurantId).catch(() => {
      console.log('API de pedidos aún no disponible');
    });
  }, [fetchActiveOrders, restaurantId, usesBusinessBackend]);

  if (usesBusinessBackend) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Package size={56} className="mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-semibold text-primary mb-2">Recepción de pedidos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Este espacio queda preparado para recibir pedidos de negocios generales. El backend probado expone reserva, confirmación y liberación de stock por endpoints internos; cuando el módulo de pedidos publique el listado operativo, esta pantalla debe consumirlo aquí.
          </p>
        </div>
      </div>
    );
  }

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(o => o.estado === filterStatus);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Package size={48} className="mx-auto text-yellow-600 mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            API de Pedidos en Desarrollo
          </h2>
          <p className="text-yellow-700 mb-4">
            El módulo de pedidos estará disponible cuando el backend implemente los endpoints.
          </p>
          <p className="text-sm text-yellow-600">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-primary">Pedidos</h1>
          <p className="text-gray-600 mt-1">Gestiona los pedidos de tu negocio</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterStatus('ALL')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterStatus === 'ALL'
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Todos ({orders.length})
        </button>
        {Object.values(OrderStatus).map((status) => {
          const count = orders.filter(o => o.estado === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {ORDER_STATUS_LABELS[status]} ({count})
            </button>
          );
        })}
      </div>

      {/* Lista de Pedidos */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">
            {filterStatus === 'ALL' 
              ? 'No hay pedidos registrados' 
              : `No hay pedidos con estado "${ORDER_STATUS_LABELS[filterStatus]}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-primary">
                    Pedido #{order.id}
                  </h3>
                  <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                    <Clock size={14} />
                    {formatDateTime(order.fecha_creacion)}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${ORDER_STATUS_COLORS[order.estado]}`}>
                  {ORDER_STATUS_LABELS[order.estado]}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-medium">{order.cliente_nombre}</p>
                  <p className="text-sm text-gray-500">{order.cliente_telefono}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} />
                    Dirección
                  </p>
                  <p className="text-sm">{order.direccion_entrega}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-green-base">
                    {formatPrice(order.total)}
                  </p>
                </div>
              </div>

              {/* Items preview */}
              <div className="border-t pt-3">
                <p className="text-sm text-gray-600 mb-2">
                  {order.items.length} producto{order.items.length !== 1 ? 's' : ''}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {order.items.slice(0, 3).map((item) => (
                    <span key={item.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {item.cantidad}x {item.producto_nombre}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{order.items.length - 3} más
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
