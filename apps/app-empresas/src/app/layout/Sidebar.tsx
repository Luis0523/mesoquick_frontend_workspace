import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  ShoppingBag, 
  Clock, 
  Package, 
  Boxes,
  Gift,
  User, 
  LogOut,
  Sofa
} from 'lucide-react';
import { useRestaurantStore } from '@/features/manage-restaurant/model/useRestaurantStore';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { getCommerceContext } from '@/shared/business/businessContext';

export const Sidebar = () => {
  const restaurant = useRestaurantStore((state) => state.restaurant);
  const { user, logout } = useAuthStore();
  const commerce = getCommerceContext();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
      label: 'Combos', 
      icon: Gift, 
      path: '/combos'
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
      disabled: true
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0">
      {/* Header */}
      <div className="p-6 bg-gradient-to-br from-primary to-[#0a5a40]">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-secondary/20 rounded-xl p-2">
            <Sofa size={24} className="text-secondary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">MesoFood</h1>
            <p className="text-xs text-secondary/80 font-medium">Panel Empresarial</p>
          </div>
        </div>
        {isAuthenticated && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-sm text-white/90 truncate font-medium">
              {restaurant?.nombre || commerce.name || user?.restaurantes?.[0]?.nombre || user?.email || 'Cargando...'}
            </p>
          </div>
        )}
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
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-gray-600 hover:bg-primary/5 hover:text-primary'
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
      <div className="p-4 border-t border-gray-100 space-y-1 bg-gray-50/50">
        {isAuthenticated ? (
          <>
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
                        : 'text-gray-600 hover:bg-primary/5 hover:text-primary'
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              );
            })}

            <button
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 w-full text-left transition-all duration-200"
              onClick={logout}
              type="button"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </>
        ) : (
          <p className="text-xs text-gray-400 text-center py-2">
            Inicia sesión para acceder
          </p>
        )}
      </div>
    </aside>
  );
};
