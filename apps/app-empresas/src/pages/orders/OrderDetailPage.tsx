import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  User,
  MapPin,
  Phone,
  Car,
  ChefHat,
  CheckCircle,
  Package,
  X,
} from 'lucide-react';
import { useLogisticsStore } from '@/features/manage-orders/model/useLogisticsStore';
import { getRelativeTime } from '@/shared/utils/date';

const STATUS_FLOW: { status: string; label: string; icon: typeof Clock }[] = [
  { status: 'pendiente_restaurante', label: 'Restaurante recibió el pedido', icon: Clock },
  { status: 'preparando', label: 'Preparando tu pedido', icon: ChefHat },
  { status: 'preparado', label: 'Buscando repartidor', icon: Package },
  { status: 'asignada', label: 'En camino', icon: Car },
  { status: 'en_ruta', label: 'En camino', icon: Car },
  { status: 'entregada', label: '¡Entregado!', icon: CheckCircle },
];

export const OrderDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const orderId = parseInt(id!);
  const { currentOrder, isLoading, error, fetchOrderById, confirmOrder, markAsPrepared, clearError } =
    useLogisticsStore();
  const [dismissedError, setDismissedError] = useState(false);

  useEffect(() => {
    fetchOrderById(orderId);
  }, [fetchOrderById, orderId]);

  const handleConfirm = () => {
    setDismissedError(true);
    confirmOrder(orderId);
  };

  const handlePrepared = () => {
    setDismissedError(true);
    markAsPrepared(orderId);
  };

  if (isLoading || !currentOrder) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error && !currentOrder) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button onClick={() => navigate('/orders')} className="mt-4 text-primary hover:underline">
            ← Volver a Pedidos
          </button>
        </div>
      </div>
    );
  }

  const currentStatus = currentOrder.estado_entrega;
  const statusForFlow =
    currentStatus === 'pendiente' ? 'preparado' :
    currentStatus === 'pendiente_restaurante' ? 'pendiente_restaurante' :
    currentStatus;
  const currentStatusIndex = STATUS_FLOW.findIndex((s) => s.status === statusForFlow);
  const isCancelled = currentStatus === 'cancelada';
  const needsConfirm = currentStatus === 'pendiente_restaurante';
  const needsPrepare = currentStatus === 'preparando';

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="text-gray-600 hover:text-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-primary">Pedido #{currentOrder.id_entrega}</h1>
          <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
            <Clock size={14} />
            {getRelativeTime(currentOrder.created_at)}
          </p>
        </div>
        {!isCancelled && currentOrder.estado_entrega !== 'entregada' && (
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>

      {error && !dismissedError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="flex-1 text-sm text-red-700">{error}</p>
          <button
            onClick={() => { setDismissedError(true); clearError(); }}
            className="text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {isCancelled ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-lg font-semibold text-red-700">Pedido cancelado</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-primary mb-6">Estado del pedido</h2>
              <div className="space-y-0">
                {STATUS_FLOW.map((step, i) => {
                  const isCompleted = i <= currentStatusIndex;
                  const isCurrent = i === currentStatusIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          } ${isCurrent ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}
                        >
                          <Icon size={16} />
                        </div>
                        {i < STATUS_FLOW.length - 1 && (
                          <div
                            className={`w-0.5 h-8 ${
                              isCompleted && !isCancelled ? 'bg-green-400' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className={`pb-8 ${isCurrent ? 'font-semibold' : ''}`}>
                        <p
                          className={`text-sm ${
                            isCompleted ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <User size={20} />
              Cliente
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-medium">{currentOrder.cliente_nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} />
                  Dirección de entrega
                </p>
                <p className="font-medium">{currentOrder.direccion_entrega}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Método de pago</p>
                <p className="font-medium">{currentOrder.metodo_pago}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Productos</h2>
            <ul className="space-y-2">
              {(currentOrder.detalles_orden ?? []).map((detalle, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                  {detalle}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-primary mb-4">Resumen</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Monto a cobrar</span>
                <span className="font-bold text-lg text-primary">
                  Q{Number(currentOrder.monto_cobrar).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tarifa de delivery</span>
                <span>Q{Number(currentOrder.tarifa_ofrecida).toFixed(2)}</span>
              </div>
              {Number(currentOrder.distancia_estimada_km) > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Distancia estimada</span>
                  <span>{Number(currentOrder.distancia_estimada_km)} km</span>
                </div>
              )}
            </div>
          </div>

          {needsConfirm && (
            <button
              onClick={handleConfirm}
              className="w-full flex items-center justify-center gap-2 bg-green-base hover:bg-green-bright text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <CheckCircle size={20} />
              Confirmar pedido
            </button>
          )}

          {needsPrepare && (
            <button
              onClick={handlePrepared}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ChefHat size={20} />
              Marcar como preparado
            </button>
          )}

          {currentOrder.estado_entrega === 'asignada' && currentOrder.repartidor && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <Car size={20} />
                Repartidor
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{currentOrder.repartidor.nombre}</p>
                <p className="flex items-center gap-1 text-gray-600">
                  <Phone size={14} />
                  {currentOrder.repartidor.telefono}
                </p>
                <p className="text-gray-500">{currentOrder.repartidor.vehiculo}</p>
              </div>
            </div>
          )}

          {currentOrder.historial_estados && currentOrder.historial_estados.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-primary mb-4">Historial</h2>
              <div className="space-y-3">
                {currentOrder.historial_estados.map((h, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800">{h.estado}</p>
                      <p className="text-xs text-gray-500">{h.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
