# 📐 Arquitectura y Estructura - App Empresas

**Fecha:** 07/04/2026  
**Proyecto:** MesoQuick - Aplicación de Empresas/Restaurantes  
**Workspace:** mesoquick_frontend_workspace/apps/app-empresas

---

## 🎯 Objetivo del Proyecto

Desarrollar una aplicación web para que dueños/administradores de restaurantes puedan:
- Gestionar información de su restaurante
- Administrar productos/menú
- Configurar horarios de operación
- Monitorear pedidos en tiempo real
- Cambiar disponibilidad del negocio

---

## 🏗️ Stack Tecnológico

### Core
- **React** 19.2.4
- **TypeScript** ~5.9.3
- **Vite** 8.0.1

### Librerías Principales
- **React Router DOM** 7.13.2 (navegación)
- **Zustand** 5.0.12 (state management)
- **Axios** 1.14.0 (HTTP client)
- **Tailwind CSS** 3.4.19 (estilos)
- **Lucide React** (iconos)

### Paquetes Compartidos (Monorepo)
- `@mesoquick/core-network` - Axios interceptor + SocketManager
- `@mesoquick/ui-kit` - Componentes reutilizables (BaseSidebar, Button, etc.)
- `@mesoquick/eslint-config` - Configuración ESLint compartida
- `@mesoquick/ts-config` - Configuración TypeScript compartida

---

## 📁 Arquitectura: Feature-Sliced Design (FSD)

### Estructura Base

```
src/
├── app/                    # Configuración global de la aplicación
│   ├── layout/            # Layouts principales (MainLayout)
│   ├── router/            # Configuración de rutas
│   └── providers/         # Providers globales (ErrorBoundary, etc.)
│
├── pages/                 # Páginas/vistas de la aplicación
│   ├── dashboard/         # Dashboard principal
│   ├── restaurant/        # Gestión del restaurante
│   ├── products/          # Gestión de productos
│   ├── schedule/          # Gestión de horarios
│   ├── orders/            # Visualización de pedidos
│   ├── profile/           # Perfil de usuario/empresa
│   └── not-found/         # Página 404
│
├── features/              # Features/funcionalidades específicas
│   ├── manage-restaurant/ # CRUD de restaurante
│   ├── manage-products/   # CRUD de productos
│   ├── manage-schedule/   # CRUD de horarios
│   └── view-dashboard-stats/ # Estadísticas del dashboard
│
├── entities/              # Entidades de dominio
│   ├── restaurant/        # Entidad Restaurant
│   ├── product/           # Entidad Product
│   ├── schedule/          # Entidad Schedule
│   └── order/             # Entidad Order
│
├── widgets/               # Componentes complejos reutilizables
│   ├── RestaurantStatsHeader.tsx
│   ├── QuickActionsPanel.tsx
│   └── StatusToggleWidget.tsx
│
└── shared/                # Código compartido
    ├── config/            # Configuraciones
    ├── api/               # Cliente API y tipos
    ├── utils/             # Utilidades
    └── lib/               # Librerías/helpers
```

### Estructura de un Feature (Ejemplo)

```
features/manage-restaurant/
├── ui/                           # Componentes UI
│   ├── RestaurantInfoCard.tsx
│   ├── EditRestaurantForm.tsx
│   └── ToggleAvailability.tsx
├── model/                        # Lógica de negocio y estado
│   ├── types.ts
│   └── useRestaurantStore.ts     # Zustand store
└── api/                          # Servicios API
    └── restaurant.service.ts
```

---

## 🎨 Sistema de Diseño

### Paleta de Colores (Tailwind Config)

```javascript
colors: {
  primary: "#3c606b",        // Azul principal
  base: "#f7f7f7",           // Gris claro (fondo)
  green: {
    base: "#56bd64",         // Verde base
    bright: "#37e64f"        // Verde brillante
  },
  accent: "#edca11"          // Amarillo acento
}
```

### Tipografía
- **Fuente principal:** Montserrat (200, 400, 600)

---

## 🔌 Configuración de API

### Variables de Entorno

```env
# .env
VITE_API_GATEWAY_URL=http://broker-gateway:8000
VITE_WS_URL=ws://broker-gateway:8000
VITE_NODE_ENV=development
```

### Estructura de Configuración (Enfoque Híbrido)

1. **Configuración Central** (`src/shared/config/`)
   - `env.config.ts` - Variables de entorno
   - `api.config.ts` - Configuración de axios

2. **Cliente API Reutilizable** (`src/shared/api/`)
   - `apiClient.ts` - Instancia configurada de axios
   - Interceptores para:
     - Agregar token de autenticación (futuro)
     - Manejo de errores global
     - Logging en desarrollo

3. **Servicios por Feature** (`features/*/api/`)
   - Cada feature tiene su propio archivo de servicios
   - Usa el `apiClient` compartido
   - Endpoints específicos del dominio

### Ejemplo de Uso

```typescript
// src/shared/api/apiClient.ts
import axios from 'axios';
import { API_CONFIG } from '@/shared/config/api.config';

export const apiClient = axios.create(API_CONFIG);

// src/features/manage-restaurant/api/restaurant.service.ts
import { apiClient } from '@/shared/api/apiClient';

export const restaurantService = {
  getById: (id: number) => apiClient.get(`/restaurantes/${id}`),
  update: (id: number, data: any) => apiClient.put(`/restaurantes/${id}`, data),
};
```

---

## 🔄 State Management con Zustand

### Patrón de Stores

Cada entidad principal tiene su propio store:

```typescript
// features/manage-restaurant/model/useRestaurantStore.ts
import { create } from 'zustand';
import type { Restaurant } from '@/entities/restaurant/model/types';

interface RestaurantStore {
  restaurant: Restaurant | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchRestaurant: (id: number) => Promise<void>;
  updateRestaurant: (id: number, data: Partial<Restaurant>) => Promise<void>;
  toggleAvailability: (id: number, disponible: boolean) => Promise<void>;
}

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurant: null,
  isLoading: false,
  error: null,
  
  fetchRestaurant: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const data = await restaurantService.getById(id);
      set({ restaurant: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  
  // ... más acciones
}));
```

---

## 🚀 Rutas de la Aplicación

```typescript
// src/app/router/index.tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/restaurant', element: <RestaurantPage /> },
      { path: '/restaurant/edit', element: <EditRestaurantPage /> },
      { path: '/products', element: <ProductsListPage /> },
      { path: '/products/new', element: <CreateProductPage /> },
      { path: '/products/:id/edit', element: <EditProductPage /> },
      { path: '/schedule', element: <SchedulePage /> },
      { path: '/orders', element: <OrdersListPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
```

---

## 🔐 Autenticación (Pendiente)

### Estado Actual
- **Login/Registro:** En desarrollo por otro equipo
- **Solución temporal:** Mock de usuario autenticado

### Mock Temporal

```typescript
// src/shared/mocks/mockAuth.ts
export const MOCK_USER = {
  id: 1,
  restaurante_id: 1,
  nombre: "Pizza Hut Centro",
  email: "admin@pizzahut.com",
  role: "ADMIN"
};
```

### Integración Futura
1. AuthProvider con Context API
2. Protected Routes
3. Token en localStorage
4. Interceptor de axios para agregar token

---

## 📦 Convenciones de Código

### Naming Conventions
- **Componentes:** PascalCase (`RestaurantCard.tsx`)
- **Hooks:** camelCase con prefijo `use` (`useRestaurantStore.ts`)
- **Services:** camelCase con sufijo `Service` (`restaurantService`)
- **Types/Interfaces:** PascalCase (`Restaurant`, `Product`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)

### Imports
```typescript
// Orden de imports
import React from 'react';                    // 1. Librerías externas
import { useNavigate } from 'react-router-dom';

import { Button } from '@mesoquick/ui-kit';   // 2. Paquetes del monorepo

import { useRestaurantStore } from '@/features/...'; // 3. Imports internos
import type { Restaurant } from '@/entities/...';
```

### Alias de Imports
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

---

## 🧪 Testing (Futuro)

- **Unit Tests:** Vitest
- **E2E Tests:** Playwright
- **Coverage:** Mínimo 70%

---

## 🐳 Docker & Deployment

### Desarrollo Local
```bash
# Desde el monorepo raíz
npm install
cd apps/app-empresas
npm run dev
```

### Docker
```bash
docker-compose up frontend-dev
# Acceso: http://localhost:5173
```

### Vite Config
```typescript
server: {
  host: '0.0.0.0',
  port: 5173,
  watch: {
    usePolling: true,  // Para Docker en Windows/Mac
  },
  proxy: {
    '/api': {
      target: 'http://broker-gateway:8000',
      changeOrigin: true,
    },
  },
}
```

---

## 📚 Recursos de Referencia

- **App Repartidores:** `/apps/app-repartidores` (referencia de estructura)
- **UI Kit:** `/packages/ui-kit` (componentes compartidos)
- **Endpoints:** `/apps/app-empresas/context/endpoints_base/` (Postman collections)

---

## 🎯 Próximos Pasos

1. ✅ Análisis de arquitectura (completado)
2. ⏳ Configurar proyecto base (Tailwind, Router, Zustand)
3. ⏳ Crear estructura FSD
4. ⏳ Definir entidades TypeScript
5. ⏳ Implementar Dashboard básico
6. ⏳ CRUD de Restaurante
7. ⏳ CRUD de Productos
8. ⏳ Gestión de Horarios

---

**Última actualización:** 07/04/2026
