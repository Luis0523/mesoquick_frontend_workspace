import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Clock,
  MapPin,
  DollarSign,
  User,
  ChefHat,
  CheckCircle,
  Bell,
} from 'lucide-react';
import { useLogisticsStore } from '@/features/manage-orders/model/useLogisticsStore';
import {
  LOGISTICS_STATUS_LABELS,
  STATUS_TABS,
  type TabKey,
} from '@/entities/logistics-order/model/types';
import { getRelativeTime } from '@/shared/utils/date';

export const OrdersListPage = () => {
  const navigate = useNavigate();
  const {
    orders,
    pendingCount,
    isWsConnected,
    error,
    initOrders,
    fetchOrders,
    confirmOrder,
    markAsPrepared,
    disconnectWebSocket,
  } = useLogisticsStore();

  const [activeTab, setActiveTab] = useState<TabKey>('pendiente_restaurante');

  useEffect(() => {
    initOrders();
    return () => { disconnectWebSocket(); };
  }, [initOrders, disconnectWebSocket]);

  const currentTab = STATUS_TABS.find((t) => t.key === activeTab)!;
  const filteredOrders = orders.filter((o) =>
    currentTab.estados.includes(o.estado_entrega)
  );

  const getTabCount = (key: TabKey) => {
    const tab = STATUS_TABS.find((t) => t.key === key)!;
    return orders.filter((o) => tab.estados.includes(o.estado_entrega)).length;
  };

  const handleConfirm = async (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation();
    await confirmOrder(orderId);
  };

  const handlePrepared = async (e: React.MouseEvent, orderId: number) => {
    e.stopPropagation();
    await markAsPrepared(orderId);
  };

  if (error && orders.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <Package size={56} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">
            Módulo de Logística
          </h2>
          <p className="text-yellow-700 mb-4">
            Conectando con el servidor de pedidos...
          </p>
          <p className="text-sm text-yellow-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-semibold text-primary">Pedidos</h1>
          {pendingCount > 0 && activeTab === 'pendiente_restaurante' && (
            <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium animate-pulse">
              <Bell size={16} />
              {pendingCount} nuevo{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
          {isWsConnected && (
            <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              Live
            </span>
          )}
        </div>
        <button
          onClick={() => fetchOrders()}
          className="text-sm text-primary hover:underline"
        >
          Refrescar
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => {
          const count = getTabCount(tab.key);
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            No hay pedidos en esta sección
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {activeTab === 'pendiente_restaurante'
              ? 'Los nuevos pedidos aparecerán aquí en tiempo real'
              : activeTab === 'historial'
              ? 'Los pedidos entregados aparecerán aquí'
              : ''}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id_entrega}
              onClick={() => navigate(`/orders/${order.id_entrega}`)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
            >
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-primary">
                      Pedido #{order.id_entrega}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      {getRelativeTime(order.created_at)}
                    </p>
                  </div>
                  {order.estado_entrega === 'pendiente_restaurante' && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="flex items-center gap-1.5 text-sm text-gray-700">
                    <User size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{order.cliente_nombre}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-gray-700">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{order.direccion_entrega}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-sm text-gray-700">
                    <DollarSign size={14} className="text-gray-400 shrink-0" />
                    <span>Q{Number(order.monto_cobrar).toFixed(2)}</span>
                    <span className="text-xs text-gray-400 ml-1">
                      ({order.metodo_pago})
                    </span>
                  </p>
                </div>

                {(order.detalles_orden?.length ?? 0) > 0 && (
                  <div className="border-t pt-2 mb-3">
                    <p className="text-xs text-gray-500 mb-1">Productos:</p>
                    <div className="flex flex-wrap gap-1">
                      {(order.detalles_orden ?? []).slice(0, 3).map((d, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                        >
                          {d}
                        </span>
                      ))}
                      {(order.detalles_orden?.length ?? 0) > 3 && (
                        <span className="text-xs text-gray-400">
                          +{order.detalles_orden.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="px-4 pb-4">
                <span
                  className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${
                    order.estado_entrega === 'pendiente_restaurante'
                      ? 'bg-yellow-100 text-yellow-800'
                      : order.estado_entrega === 'preparando'
                      ? 'bg-orange-100 text-orange-800'
                      : order.estado_entrega === 'preparado' || order.estado_entrega === 'pendiente'
                      ? 'bg-blue-100 text-blue-800'
                      : order.estado_entrega === 'asignada' || order.estado_entrega === 'en_ruta'
                      ? 'bg-indigo-100 text-indigo-800'
                      : order.estado_entrega === 'entregada'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {LOGISTICS_STATUS_LABELS[order.estado_entrega]}
                </span>
              </div>

              {order.estado_entrega === 'pendiente_restaurante' && (
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => handleConfirm(e, order.id_entrega)}
                    className="w-full flex items-center justify-center gap-1 bg-green-base hover:bg-green-bright text-white text-sm px-3 py-2 rounded-lg transition-colors"
                  >
                    <CheckCircle size={16} />
                    Confirmar pedido
                  </button>
                </div>
              )}

              {order.estado_entrega === 'preparando' && (
                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => handlePrepared(e, order.id_entrega)}
                    className="w-full flex items-center justify-center gap-1 bg-primary hover:bg-primary/90 text-white text-sm px-3 py-2 rounded-lg transition-colors"
                  >
                    <ChefHat size={16} />
                    Marcar como preparado
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
