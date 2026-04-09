# 🤖 Tareas Agent B - 09/04/2026 (Sesión 3)

**Fecha:** 09/04/2026  
**Agente:** Agent B - "Orders UI Components"  
**Responsabilidad:** Crear las interfaces de usuario para gestión de pedidos

---

## ⚠️ IMPORTANTE - API EN DESARROLLO

**NOTA:** El módulo de Pedidos está en **Fase 2**. La API puede NO estar disponible. Si obtienes errores 404, usa **datos mock temporales** hasta que la API esté lista.

---

## 🎯 Objetivo Principal

Implementar las **páginas de gestión de pedidos** con diseño responsive:
- OrdersListPage con filtros por estado
- OrderDetailPage con timeline de estados
- Cambio de estados del pedido
- Vista responsive

---

## ⚠️ PREREQUISITO

**IMPORTANTE:** Agent A debe completar primero:
- ✅ `entities/order/model/types.ts`
- ✅ `features/manage-orders/api/orders.service.ts`
- ✅ `features/manage-orders/model/useOrdersStore.ts`

---

## 📋 Tareas Específicas

### 1. OrdersListPage - Lista de Pedidos

**Archivo:** `src/pages/orders/OrdersListPage.tsx`

**UI Requerida:**

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, MapPin } from 'lucide-react';
import { useOrdersStore } from '@/features/manage-orders/model/useOrdersStore';
import { OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/entities/order/model/types';
import { formatPrice } from '@/shared/utils/currency';
import { formatDateTime } from '@/shared/utils/date';
import { getCurrentRestaurantId } from '@/shared/mocks/mockAuth';

export const OrdersListPage = () => {
  const navigate = useNavigate();
  const restaurantId = getCurrentRestaurantId();
  const { orders, isLoading, error, fetchActiveOrders } = useOrdersStore();
  
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => {
    // Intentar cargar pedidos activos
    // Si falla (404), mostrar mensaje que API no está lista
    fetchActiveOrders(restaurantId).catch(() => {
      console.log('API de pedidos aún no disponible');
    });
  }, []);

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
```

---

### 2. OrderDetailPage - Detalle del Pedido

**Archivo:** `src/pages/orders/OrderDetailPage.tsx`

**UI Requerida:**

```tsx
import { useEffect, useState } from 'react';
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
```

---

### 3. Actualizar Router

**Archivo:** `src/app/router/index.tsx`

```tsx
import { OrdersListPage } from '@/pages/orders/OrdersListPage';
import { OrderDetailPage } from '@/pages/orders/OrderDetailPage';

// En children:
{
  path: '/orders',
  element: <OrdersListPage />,
},
{
  path: '/orders/:id',
  element: <OrderDetailPage />,
},
```

---

### 4. Actualizar Sidebar

**Archivo:** `src/app/layout/Sidebar.tsx`

```tsx
<Link
  to="/orders"
  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
    location.pathname.startsWith('/orders')
      ? 'bg-primary text-white'
      : 'text-gray-700 hover:bg-gray-100'
  }`}
>
  <Package size={20} />
  <span>Pedidos</span>
</Link>
```

---

## ✅ Criterios de Éxito

- [ ] Muestra mensaje claro si API no está disponible
- [ ] Lista funciona con datos reales o mock
- [ ] Detalle muestra toda la información
- [ ] Cambio de estados solo permite transiciones válidas
- [ ] Timeline muestra el progreso del pedido
- [ ] Responsive design
- [ ] Colores del Brandbook

---

**Última actualización:** 09/04/2026 18:30  
**Estado:** ⏳ Pendiente (API en desarrollo)
