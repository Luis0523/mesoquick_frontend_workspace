/**
 * Dashboard Page
 * Página principal con estadísticas y resumen
 */

import { useEffect } from 'react';
import { useRestaurantStore } from '@/features/manage-restaurant/model/useRestaurantStore';
import { getCurrentRestaurantId } from '@/shared/mocks/mockAuth';
import { Store, TrendingUp, Package, Star } from 'lucide-react';

export const DashboardPage = () => {
  const { restaurant, isLoading, error, fetchRestaurant } = useRestaurantStore();
  const restaurantId = getCurrentRestaurantId();

  useEffect(() => {
    fetchRestaurant(restaurantId);
  }, [fetchRestaurant, restaurantId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bienvenido a {restaurant?.nombre || 'tu restaurante'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Store}
          label="Estado"
          value={restaurant?.disponible ? 'Abierto' : 'Cerrado'}
          color={restaurant?.disponible ? 'green' : 'red'}
        />
        <StatCard
          icon={Package}
          label="Pedidos Hoy"
          value="0"
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          label="Ingresos Hoy"
          value="Q0.00"
          color="purple"
        />
        <StatCard
          icon={Star}
          label="Calificación"
          value="5.0"
          color="yellow"
        />
      </div>

      {/* Restaurant Info */}
      {restaurant && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Información del Restaurante
          </h2>
          <div className="space-y-3">
            <InfoRow label="Nombre" value={restaurant.nombre} />
            <InfoRow label="Dirección" value={restaurant.direccion} />
            <InfoRow label="Teléfono" value={restaurant.telefono} />
            {restaurant.correo && (
              <InfoRow label="Correo" value={restaurant.correo} />
            )}
            {restaurant.descripcion && (
              <InfoRow label="Descripción" value={restaurant.descripcion} />
            )}
          </div>
        </div>
      )}

      {/* Próximamente */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          🚀 Próximamente
        </h3>
        <ul className="text-blue-700 space-y-1 text-sm">
          <li>• Gráficas de estadísticas</li>
          <li>• Pedidos activos en tiempo real</li>
          <li>• Alertas y notificaciones</li>
          <li>• Resumen de ventas</li>
        </ul>
      </div>
    </div>
  );
};

// Componente auxiliar para las tarjetas de estadísticas
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  color: 'green' | 'red' | 'blue' | 'purple' | 'yellow';
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => {
  const colorClasses = {
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]}`}>
        <Icon size={24} />
      </div>
      <p className="text-gray-600 text-sm mt-4">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
};

// Componente auxiliar para mostrar información
interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span className="text-gray-900">{value}</span>
  </div>
);
