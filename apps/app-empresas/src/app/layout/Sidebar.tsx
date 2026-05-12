/**
 * Sidebar de navegación
 * Menú lateral con navegación principal de la app
 */

import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Clock, 
  Package, 
  Boxes,
  User, 
  LogOut 
} from 'lucide-react';
import { useRestaurantStore } from '@/features/manage-restaurant/model/useRestaurantStore';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { getCommerceContext } from '@/shared/business/businessContext';

export const Sidebar = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const { user, logout } = useAuthStore();
  const commerce = getCommerceContext();

  const navItems = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard' 
    },
    { 
      label: 'Mi Negocio', 
      icon: Store, 
      path: '/restaurant' 
    },
    { 
      label: 'Productos', 
      icon: ShoppingBag, 
      path: '/products'
    },
    { 
      label: 'Inventario', 
      icon: Boxes, 
      path: '/inventory'
    },
    { 
      label: 'Horarios', 
      icon: Clock, 
      path: '/schedule'
    },
    { 
      label: 'Pedidos', 
      icon: Package, 
      path: '/orders'
    },
  ];

  const bottomItems = [
    { 
      label: 'Perfil', 
      icon: User, 
      path: '/profile',
      disabled: true // TODO: Habilitar cuando esté implementado
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary">MesoQuick</h1>
        <p className="text-sm text-gray-600 mt-1 truncate">
          {restaurant?.nombre || commerce.name || user?.restaurantes?.[0]?.nombre || user?.email || 'Cargando...'}
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isDisabled = item.disabled;

          if (isDisabled) {
            return (
              <div
                key={item.path}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed"
                title="Próximamente"
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </NavLink>
          );
        })}

        <button
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full text-left transition-colors"
          onClick={logout}
          type="button"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};
