/**
 * Configuración de React Router
 * Define todas las rutas de la aplicación
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../layout/MainLayout';

// Pages (lazy loading para mejor performance)
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { RestaurantPage } from '@/pages/restaurant/RestaurantPage';
import { NotFoundPage } from '@/pages/not-found/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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
      
      // Mi Restaurante
      {
        path: 'restaurant',
        element: <RestaurantPage />,
      },
      
      // TODO: Agregar más rutas según se implementen
      // {
      //   path: 'products',
      //   element: <ProductsListPage />,
      // },
      // {
      //   path: 'products/new',
      //   element: <CreateProductPage />,
      // },
      // {
      //   path: 'products/:id/edit',
      //   element: <EditProductPage />,
      // },
      // {
      //   path: 'schedule',
      //   element: <SchedulePage />,
      // },
      // {
      //   path: 'orders',
      //   element: <OrdersListPage />,
      // },
      // {
      //   path: 'orders/:id',
      //   element: <OrderDetailPage />,
      // },
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
]);
