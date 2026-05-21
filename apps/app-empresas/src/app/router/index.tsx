/**
 * Configuración de React Router
 * Define todas las rutas de la aplicación
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages (lazy loading para mejor performance)
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { RestaurantPage } from '@/pages/restaurant/RestaurantPage';
import { ProductsListPage } from '@/pages/products/ProductsListPage';
import { CreateProductPage } from '@/pages/products/CreateProductPage';
import { EditProductPage } from '@/pages/products/EditProductPage';
import { InventoryPage } from '@/pages/inventory/InventoryPage';
import { CombosListPage } from '@/pages/combos/CombosListPage';
import { CreateComboPage } from '@/pages/combos/CreateComboPage';
import { EditComboPage } from '@/pages/combos/EditComboPage';
import { SchedulePage } from '@/pages/schedule/SchedulePage';
import { OrdersListPage } from '@/pages/orders/OrdersListPage';
import { OrderDetailPage } from '@/pages/orders/OrderDetailPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          // Redirect raíz a dashboard
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          
          // Dashboard
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          
          // Mi Negocio
          {
            path: 'restaurant',
            element: <RestaurantPage />,
          },
          
          // TODO: Agregar más rutas según se implementen
          {
            path: 'products',
            element: <ProductsListPage />,
          },
          {
            path: 'products/new',
            element: <CreateProductPage />,
          },
          {
            path: 'products/:id/edit',
            element: <EditProductPage />,
          },
          {
            path: 'inventory',
            element: <InventoryPage />,
          },
          {
            path: 'combos',
            element: <CombosListPage />,
          },
          {
            path: 'combos/new',
            element: <CreateComboPage />,
          },
          {
            path: 'combos/:id/edit',
            element: <EditComboPage />,
          },
          {
            path: 'schedule',
            element: <SchedulePage />,
          },
          {
            path: 'orders',
            element: <OrdersListPage />,
          },
          {
            path: 'orders/:id',
            element: <OrderDetailPage />,
          },
          // {
          //   path: 'profile',
          //   element: <ProfilePage />,
          // },
          
          // 404 - Debe estar al final
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
