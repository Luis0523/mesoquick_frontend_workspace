# 🗺️ Flujo de Navegación y Páginas

**Proyecto:** MesoQuick - App Empresas  
**Última actualización:** 07/04/2026

---

## 📑 Índice

1. [Estructura de Páginas](#estructura-de-páginas)
2. [Flujo de Navegación](#flujo-de-navegación)
3. [Sidebar Navigation](#sidebar-navigation)
4. [Priorización (MVP)](#priorización-mvp)
5. [Especificación de Páginas](#especificación-de-páginas)

---

## Estructura de Páginas

### Vista General

```
pages/
├── dashboard/              # 🔴 CRÍTICO - Fase 1
│   └── DashboardPage.tsx
│
├── restaurant/             # 🔴 CRÍTICO - Fase 1
│   ├── RestaurantPage.tsx
│   └── EditRestaurantPage.tsx
│
├── products/               # 🔴 CRÍTICO - Fase 1
│   ├── ProductsListPage.tsx
│   ├── CreateProductPage.tsx
│   └── EditProductPage.tsx
│
├── schedule/               # 🔴 CRÍTICO - Fase 1
│   └── SchedulePage.tsx
│
├── orders/                 # 🟡 IMPORTANTE - Fase 2
│   ├── OrdersListPage.tsx
│   └── OrderDetailPage.tsx
│
├── profile/                # 🟡 IMPORTANTE - Fase 2
│   └── ProfilePage.tsx
│
└── not-found/              # 🔴 CRÍTICO - Fase 1
    └── NotFoundPage.tsx
```

---

## Flujo de Navegación

### Diagrama de Flujo Principal

```
                [App Inicia]
                     ↓
        [Mock Usuario Autenticado]
          (restaurante_id: 1)
                     ↓
              [DASHBOARD] ← Hub Central
                     │
      ┌──────────────┼──────────────┐
      │              │              │
  [MI          [PRODUCTOS]     [HORARIOS]
RESTAURANTE]        │              │
      │         ┌───┴───┐          │
      │    [Crear] [Editar]   [Gestionar]
      │         │       │          │
 [Editar]  [Detalle]   │          │
      │         │       │          │
      └─────────┼───────┼──────────┘
                │       │
            [PEDIDOS] ──→ [Detalle]
                │
            [PERFIL]
```

### Rutas de la Aplicación

```typescript
// src/app/router/index.tsx

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Redirect raíz a dashboard
      { 
        path: '/', 
        element: <Navigate to="/dashboard" replace /> 
      },
      
      // Dashboard
      { 
        path: '/dashboard', 
        element: <DashboardPage /> 
      },
      
      // Restaurante
      { 
        path: '/restaurant', 
        element: <RestaurantPage /> 
      },
      { 
        path: '/restaurant/edit', 
        element: <EditRestaurantPage /> 
      },
      
      // Productos
      { 
        path: '/products', 
        element: <ProductsListPage /> 
      },
      { 
        path: '/products/new', 
        element: <CreateProductPage /> 
      },
      { 
        path: '/products/:id/edit', 
        element: <EditProductPage /> 
      },
      
      // Horarios
      { 
        path: '/schedule', 
        element: <SchedulePage /> 
      },
      
      // Pedidos
      { 
        path: '/orders', 
        element: <OrdersListPage /> 
      },
      { 
        path: '/orders/:id', 
        element: <OrderDetailPage /> 
      },
      
      // Perfil
      { 
        path: '/profile', 
        element: <ProfilePage /> 
      },
      
      // 404
      { 
        path: '*', 
        element: <NotFoundPage /> 
      },
    ],
  },
];
```

---

## Sidebar Navigation

### Estructura del Menú

```
┌─────────────────────────────────────┐
│  MesoQuick                          │
│  🏪 Pizza Hut Centro                │
│  ────────────────────────────────   │
│                                     │
│  📊 Dashboard                       │
│  🏪 Mi Restaurante                  │
│  🍕 Productos                       │
│  🕐 Horarios                        │
│  📦 Pedidos                         │
│  ────────────────────────────────   │
│  👤 Perfil                          │
│  🚪 Cerrar Sesión                   │
└─────────────────────────────────────┘
```

### Implementación

```typescript
// src/app/layout/MainLayout.tsx

import { BaseSidebar } from '@mesoquick/ui-kit';
import { Link } from 'react-router-dom';

const navItems = [
  { 
    label: 'Dashboard', 
    icon: 'LayoutDashboard', 
    path: '/dashboard' 
  },
  { 
    label: 'Mi Restaurante', 
    icon: 'Store', 
    path: '/restaurant' 
  },
  { 
    label: 'Productos', 
    icon: 'Pizza', 
    path: '/products' 
  },
  { 
    label: 'Horarios', 
    icon: 'Clock', 
    path: '/schedule' 
  },
  { 
    label: 'Pedidos', 
    icon: 'Package', 
    path: '/orders' 
  },
  { 
    type: 'separator' 
  },
  { 
    label: 'Perfil', 
    icon: 'User', 
    path: '/profile' 
  },
  { 
    label: 'Cerrar Sesión', 
    icon: 'LogOut', 
    action: 'logout' 
  },
];
```

---

## Priorización (MVP)

### 🔴 Fase 1 - CRÍTICO (Sprint 1-3)

**Objetivo:** Sistema funcional para gestión básica del restaurante

1. **Dashboard** - Vista principal con estadísticas
2. **Mi Restaurante** - Visualización y edición de datos
3. **Productos** - CRUD completo de menú
4. **Horarios** - Gestión de horarios semanales
5. **Not Found** - Página 404

**Duración estimada:** 3 sprints (6 semanas)

---

### 🟡 Fase 2 - IMPORTANTE (Sprint 4-5)

**Objetivo:** Monitoreo y gestión de pedidos

6. **Pedidos** - Lista y detalle de órdenes
7. **Perfil** - Configuración de cuenta

**Duración estimada:** 2 sprints (4 semanas)

---

### 🟢 Fase 3 - COMPLEMENTARIAS (Futuro)

**Objetivo:** Features avanzados

8. **Onboarding** - Primera experiencia de usuario
9. **Estadísticas** - Analytics detallados
10. **Reportes** - Exportación de datos
11. **Notificaciones** - Sistema de alertas

---

## Especificación de Páginas

---

### 1. Dashboard Page

**Ruta:** `/dashboard`  
**Componente:** `DashboardPage.tsx`

#### Wireframe Conceptual

```
┌────────────────────────────────────────────────────────┐
│  Dashboard                                             │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 🏪 Estado del Negocio                            │ │
│  │ Pizza Hut Centro                                 │ │
│  │ Toggle: [●] Disponible / [ ] Cerrado             │ │
│  │ Horario actual: Abierto (08:00 - 22:00)         │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐  │
│  │ Pedidos  │ │ Ingresos │ │ Productos│ │ Rating  │  │
│  │   24     │ │ Q1,250   │ │    18    │ │  4.5⭐  │  │
│  │   hoy    │ │   hoy    │ │  activos │ │         │  │
│  └──────────┘ └──────────┘ └──────────┘ └─────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 📦 Pedidos Activos (3)                           │ │
│  │ ┌────────────────────────────────────────────┐   │ │
│  │ │ #12345 - Juan Pérez       Q125.00   [Ver] │   │ │
│  │ │ 🟡 Preparando - 15:30                     │   │ │
│  │ └────────────────────────────────────────────┘   │ │
│  │ ... más pedidos                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ ⚠️ Alertas                                        │ │
│  │ • 2 productos sin stock                          │ │
│  │ • Domingo sin horario configurado                │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

#### Features del Dashboard

```typescript
// Widgets principales
- RestaurantStatusWidget    // Toggle disponibilidad + info
- StatsCards               // Métricas del día
- ActiveOrdersPanel        // Pedidos en proceso
- AlertsWidget             // Notificaciones importantes
- QuickActionsPanel        // Accesos directos
```

---

### 2. Restaurant Page

**Ruta:** `/restaurant`  
**Componente:** `RestaurantPage.tsx`

#### Vista de Lectura

```
┌────────────────────────────────────────────────────────┐
│  Mi Restaurante                        [✏️ Editar]      │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ 🖼️ Logo                                           │ │
│  │ Pizza Hut Centro                                 │ │
│  │ Las mejores pizzas de la ciudad                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  Información General                                   │
│  • Dirección: Av. Principal 123                       │
│  • Teléfono: 555-1234                                 │
│  • Correo: contacto@pizzahut.com                      │
│                                                        │
│  Estado Operacional                                    │
│  • Disponibilidad: 🟢 Abierto                         │
│  • Horarios: 7 días configurados   [Gestionar →]     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Ruta:** `/restaurant/edit`  
**Componente:** `EditRestaurantPage.tsx`

#### Modo Edición

```
┌────────────────────────────────────────────────────────┐
│  Editar Restaurante               [Guardar] [Cancelar] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Nombre *                                              │
│  [Pizza Hut Centro                                  ]  │
│                                                        │
│  Descripción                                           │
│  [Las mejores pizzas de la ciudad                   ]  │
│  [                                                  ]  │
│                                                        │
│  Dirección *                                           │
│  [Av. Principal 123                                 ]  │
│                                                        │
│  Teléfono *              Correo                        │
│  [555-1234        ]      [contacto@pizzahut.com     ]  │
│                                                        │
│  Logo URL                                              │
│  [https://example.com/logo.png                      ]  │
│                                                        │
│  Disponibilidad                                        │
│  [ ] Cerrado temporalmente                            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

### 3. Products List Page

**Ruta:** `/products`  
**Componente:** `ProductsListPage.tsx`

```
┌────────────────────────────────────────────────────────┐
│  Productos                        [+ Nuevo Producto]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  🔍 [Buscar...        ]  [Categoría ▼]  [Estado ▼]    │
│                                                        │
│  [Todos] [Activos] [Inactivos]                        │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ 🖼️ Imagen    │  │ 🖼️ Imagen    │  │ 🖼️ Imagen   │ │
│  │ Hamburguesa  │  │ Pizza        │  │ Coca Cola   │ │
│  │ Clásica      │  │ Margarita    │  │ 500ml       │ │
│  │ Comida Rápida│  │ Pizzas       │  │ Bebidas     │ │
│  │ Q150.00      │  │ Q250.00      │  │ Q10.00      │ │
│  │ ✅ Activo    │  │ ✅ Activo    │  │ ✅ Activo   │ │
│  │ [⚙️] [👁️] [🗑️]│  │ [⚙️] [👁️] [🗑️]│  │ [⚙️] [👁️] [🗑️]│ │
│  └──────────────┘  └──────────────┘  └─────────────┘ │
│  ... más productos                                     │
└────────────────────────────────────────────────────────┘
```

**Ruta:** `/products/new` o `/products/:id/edit`  
**Componente:** `CreateProductPage.tsx` / `EditProductPage.tsx`

```
┌────────────────────────────────────────────────────────┐
│  Nuevo Producto                   [Guardar] [Cancelar] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Nombre *                                              │
│  [Hamburguesa Especial                              ]  │
│                                                        │
│  Categoría *                                           │
│  [Comida Rápida                                    ▼]  │
│                                                        │
│  Descripción                                           │
│  [Hamburguesa premium con carne angus              ]  │
│  [                                                  ]  │
│                                                        │
│  Precio (Q) *                                          │
│  [180.00                ]                              │
│                                                        │
│  Imagen URL                                            │
│  [https://example.com/productos/hamburguesa.jpg    ]  │
│                                                        │
│  Estado                                                │
│  [●] Activo    [ ] Inactivo                           │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

### 4. Schedule Page

**Ruta:** `/schedule`  
**Componente:** `SchedulePage.tsx`

```
┌────────────────────────────────────────────────────────┐
│  Horarios de Operación                                 │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Copiar a todos] [Aplicar Lun-Vie] [Aplicar Sáb-Dom] │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ LUNES                                     [+ ]   │ │
│  │ 🟢 08:00 - 22:00                  [✏️] [🗑️]      │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ MARTES                                    [+ ]   │ │
│  │ 🟢 09:00 - 14:00                  [✏️] [🗑️]      │ │
│  │ 🟢 17:00 - 22:00                  [✏️] [🗑️]      │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ... resto de días                                     │
│                                                        │
│  [Modal Crear/Editar Horario]                         │
│  ┌────────────────────────────────────┐               │
│  │ Día: [Miércoles           ▼]       │               │
│  │ Apertura: [08:00      ]            │               │
│  │ Cierre:   [22:00      ]            │               │
│  │ [●] Activo                          │               │
│  │         [Guardar] [Cancelar]        │               │
│  └────────────────────────────────────┘               │
└────────────────────────────────────────────────────────┘
```

---

### 5. Orders List Page

**Ruta:** `/orders`  
**Componente:** `OrdersListPage.tsx`

```
┌────────────────────────────────────────────────────────┐
│  Pedidos                                               │
├────────────────────────────────────────────────────────┤
│                                                        │
│  [Activos] [Historial] [Todos]                        │
│                                                        │
│  🔍 [Buscar por ID...]    [📅 Rango de fechas]        │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Pedido #12345                         [Ver →]   │ │
│  │ 🕐 15:30 - 16/04/2026                           │ │
│  │ Cliente: Juan Pérez                              │ │
│  │ Total: Q125.00                                   │ │
│  │ Estado: 🟡 Preparando                            │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ... más pedidos                                       │
└────────────────────────────────────────────────────────┘
```

**Ruta:** `/orders/:id`  
**Componente:** `OrderDetailPage.tsx`

```
┌────────────────────────────────────────────────────────┐
│  Pedido #12345                           [← Volver]    │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Información General                                   │
│  • Fecha: 16/04/2026 15:30                            │
│  • Cliente: Juan Pérez (5551-2345)                    │
│  • Dirección: Calle 123, Zona 10                      │
│                                                        │
│  Productos                                             │
│  • 2x Hamburguesa Clásica    Q300.00                  │
│  • 1x Coca Cola 500ml        Q10.00                   │
│  ───────────────────────────────────                  │
│  Subtotal:                   Q310.00                  │
│  Delivery:                   Q25.00                   │
│  Total:                      Q335.00                  │
│                                                        │
│  Estado del Pedido                                     │
│  ✅ Recibido        15:30                             │
│  ✅ Preparando      15:35                             │
│  ⏳ Listo           ?                                  │
│  ⬜ En camino       ?                                  │
│  ⬜ Entregado       ?                                  │
│                                                        │
│  [Marcar como Listo]  [Cancelar Pedido]               │
└────────────────────────────────────────────────────────┘
```

---

### 6. Profile Page

**Ruta:** `/profile`  
**Componente:** `ProfilePage.tsx`

```
┌────────────────────────────────────────────────────────┐
│  Perfil                                                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Datos del Negocio                                     │
│  → Ver en "Mi Restaurante"                            │
│                                                        │
│  Cuenta y Seguridad                                    │
│  • Email: admin@pizzahut.com          [Cambiar]       │
│  • Contraseña: ••••••••               [Cambiar]       │
│                                                        │
│  Notificaciones                                        │
│  [✓] Email nuevos pedidos                             │
│  [✓] SMS pedidos urgentes                             │
│  [ ] Alertas bajo inventario                          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

### 7. Not Found Page

**Ruta:** `*` (catch-all)  
**Componente:** `NotFoundPage.tsx`

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│                    404                                 │
│          Página no encontrada                          │
│                                                        │
│  La página que buscas no existe o fue movida.         │
│                                                        │
│              [← Volver al Dashboard]                   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 🎯 Convenciones de Navegación

### Breadcrumbs (Futuro)
```
Dashboard > Productos > Editar Producto
Dashboard > Mi Restaurante > Editar
Dashboard > Pedidos > Pedido #12345
```

### Acciones Comunes
- **Guardar:** Siempre con confirmación visual
- **Cancelar:** Pregunta si hay cambios sin guardar
- **Eliminar:** Modal de confirmación
- **Volver:** Breadcrumb o botón explícito

### Estados de Carga
- Skeleton loaders durante fetch
- Spinners para acciones (guardar, eliminar)
- Error boundaries para errores

---

**Última actualización:** 07/04/2026  
**Próxima revisión:** Al finalizar Fase 1
