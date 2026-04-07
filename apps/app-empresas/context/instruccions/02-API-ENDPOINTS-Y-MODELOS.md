# 🔗 API Endpoints y Modelos de Datos

**Proyecto:** MesoQuick - App Empresas  
**Base URL:** `http://broker-gateway:8000/api`  
**Última actualización:** 07/04/2026

---

## 📋 Índice de Recursos

1. [Restaurantes](#1-restaurantes)
2. [Productos](#2-productos)
3. [Horarios](#3-horarios)
4. [Pedidos (Pendiente)](#4-pedidos-pendiente)

---

## 1. Restaurantes

### Modelo de Datos

```typescript
// src/entities/restaurant/model/types.ts

export interface Restaurant {
  // Auto-generados por backend
  id: number;
  fecha_creacion: string;        // ISO 8601
  fecha_actualizacion: string;   // ISO 8601
  
  // Campos obligatorios
  nombre: string;
  direccion: string;
  telefono: string;
  
  // Campos opcionales
  descripcion?: string;
  correo?: string;
  logo_url?: string;
  
  // Estados
  disponible: boolean;  // Toggle operacional (acepta pedidos ahora)
  activo: boolean;      // Soft delete (existe en BD)
}

// DTO para crear/actualizar
export interface CreateRestaurantDTO {
  nombre: string;
  direccion: string;
  telefono: string;
  descripcion?: string;
  correo?: string;
  logo_url?: string;
  disponible?: boolean;
}

export type UpdateRestaurantDTO = Partial<CreateRestaurantDTO>;
```

### Endpoints

| Método | Endpoint | Descripción | Body | Query Params |
|--------|----------|-------------|------|--------------|
| **GET** | `/restaurantes` | Listar todos | - | `activo`, `disponible` |
| **GET** | `/restaurantes/:id` | Obtener por ID | - | - |
| **POST** | `/restaurantes` | Crear nuevo | `CreateRestaurantDTO` | - |
| **PUT** | `/restaurantes/:id` | Actualizar | `UpdateRestaurantDTO` | - |
| **DELETE** | `/restaurantes/:id` | Soft delete | - | - |
| **PATCH** | `/restaurantes/:id/disponibilidad` | Toggle disponibilidad | `{ disponible: boolean }` | - |

### Ejemplos de Request/Response

#### GET /restaurantes?activo=true&disponible=true

```json
// Response 200 OK
[
  {
    "id": 1,
    "nombre": "Pizza Hut Centro",
    "descripcion": "Las mejores pizzas de la ciudad",
    "direccion": "Av. Principal 123",
    "telefono": "555-1234",
    "correo": "contacto@pizzahut.com",
    "logo_url": "https://example.com/logo.png",
    "disponible": true,
    "activo": true,
    "fecha_creacion": "2026-01-15T10:30:00Z",
    "fecha_actualizacion": "2026-04-07T14:20:00Z"
  }
]
```

#### POST /restaurantes (Mínimo)

```json
// Request
{
  "nombre": "Restaurante Express",
  "direccion": "Calle 123",
  "telefono": "555-5555"
}

// Response 201 Created
{
  "id": 2,
  "nombre": "Restaurante Express",
  "direccion": "Calle 123",
  "telefono": "555-5555",
  "disponible": true,
  "activo": true,
  "fecha_creacion": "2026-04-07T18:00:00Z",
  "fecha_actualizacion": "2026-04-07T18:00:00Z"
}
```

#### PATCH /restaurantes/1/disponibilidad

```json
// Request
{
  "disponible": false
}

// Response 200 OK
{
  "id": 1,
  "nombre": "Pizza Hut Centro",
  "disponible": false,
  // ... resto de campos
}
```

### Servicio TypeScript

```typescript
// src/features/manage-restaurant/api/restaurant.service.ts
import { apiClient } from '@/shared/api/apiClient';
import type { Restaurant, CreateRestaurantDTO, UpdateRestaurantDTO } from '@/entities/restaurant/model/types';

const BASE_PATH = '/restaurantes';

export const restaurantService = {
  getAll: async (params?: { activo?: boolean; disponible?: boolean }) => {
    const { data } = await apiClient.get<Restaurant[]>(BASE_PATH, { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await apiClient.get<Restaurant>(`${BASE_PATH}/${id}`);
    return data;
  },

  create: async (dto: CreateRestaurantDTO) => {
    const { data } = await apiClient.post<Restaurant>(BASE_PATH, dto);
    return data;
  },

  update: async (id: number, dto: UpdateRestaurantDTO) => {
    const { data } = await apiClient.put<Restaurant>(`${BASE_PATH}/${id}`, dto);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await apiClient.delete(`${BASE_PATH}/${id}`);
    return data;
  },

  toggleAvailability: async (id: number, disponible: boolean) => {
    const { data } = await apiClient.patch<Restaurant>(
      `${BASE_PATH}/${id}/disponibilidad`,
      { disponible }
    );
    return data;
  },
};
```

---

## 2. Productos

### Modelo de Datos

```typescript
// src/entities/product/model/types.ts

export interface Product {
  // Auto-generados
  id: number;
  restaurante_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  
  // Campos obligatorios
  tipo_producto_id: number;  // FK a catálogo de categorías
  nombre: string;
  precio: number;            // En centavos (15000 = Q150.00)
  
  // Campos opcionales
  descripcion?: string;
  imagen_url?: string;
  
  // Estado
  activo: boolean;           // Disponible para venta
}

// Catálogo de tipos de producto (puede venir del backend)
export enum ProductType {
  COMIDA_RAPIDA = 1,
  PIZZA = 2,
  BEBIDA = 3,
  POSTRE = 4,
  ENTRADA = 5,
  PLATO_FUERTE = 6,
}

export interface CreateProductDTO {
  tipo_producto_id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imagen_url?: string;
}

export type UpdateProductDTO = Partial<CreateProductDTO>;

// Helper para conversión de precios
export const fromCents = (cents: number): number => cents / 100;
export const toCents = (quetzales: number): number => Math.round(quetzales * 100);
```

### Endpoints

| Método | Endpoint | Descripción | Body | Query Params |
|--------|----------|-------------|------|--------------|
| **GET** | `/restaurantes/:rid/productos` | Listar productos | - | `activo` |
| **GET** | `/restaurantes/:rid/productos/:pid` | Obtener por ID | - | - |
| **POST** | `/restaurantes/:rid/productos` | Crear producto | `CreateProductDTO` | - |
| **PUT** | `/restaurantes/:rid/productos/:pid` | Actualizar | `UpdateProductDTO` | - |
| **DELETE** | `/restaurantes/:rid/productos/:pid` | Soft delete | - | - |
| **PATCH** | `/restaurantes/:rid/productos/:pid/activo` | Toggle activo | `{ activo: boolean }` | - |

### Ejemplos de Request/Response

#### GET /restaurantes/1/productos?activo=true

```json
// Response 200 OK
[
  {
    "id": 1,
    "restaurante_id": 1,
    "tipo_producto_id": 1,
    "nombre": "Hamburguesa Clásica",
    "descripcion": "Hamburguesa con carne de res, lechuga, tomate",
    "imagen_url": "https://example.com/productos/hamburguesa.jpg",
    "precio": 15000,
    "activo": true,
    "fecha_creacion": "2026-02-10T08:00:00Z",
    "fecha_actualizacion": "2026-04-01T10:15:00Z"
  },
  {
    "id": 2,
    "restaurante_id": 1,
    "tipo_producto_id": 3,
    "nombre": "Coca Cola 500ml",
    "precio": 1000,
    "activo": true,
    "fecha_creacion": "2026-02-10T08:05:00Z",
    "fecha_actualizacion": "2026-02-10T08:05:00Z"
  }
]
```

#### POST /restaurantes/1/productos

```json
// Request
{
  "tipo_producto_id": 2,
  "nombre": "Pizza Margarita",
  "descripcion": "Pizza con tomate, mozzarella y albahaca",
  "precio": 25000,
  "imagen_url": "https://example.com/productos/pizza.jpg"
}

// Response 201 Created
{
  "id": 3,
  "restaurante_id": 1,
  "tipo_producto_id": 2,
  "nombre": "Pizza Margarita",
  "descripcion": "Pizza con tomate, mozzarella y albahaca",
  "precio": 25000,
  "imagen_url": "https://example.com/productos/pizza.jpg",
  "activo": true,
  "fecha_creacion": "2026-04-07T18:10:00Z",
  "fecha_actualizacion": "2026-04-07T18:10:00Z"
}
```

### Servicio TypeScript

```typescript
// src/features/manage-products/api/products.service.ts
import { apiClient } from '@/shared/api/apiClient';
import type { Product, CreateProductDTO, UpdateProductDTO } from '@/entities/product/model/types';

export const productsService = {
  getAll: async (restaurantId: number, params?: { activo?: boolean }) => {
    const { data } = await apiClient.get<Product[]>(
      `/restaurantes/${restaurantId}/productos`,
      { params }
    );
    return data;
  },

  getById: async (restaurantId: number, productId: number) => {
    const { data } = await apiClient.get<Product>(
      `/restaurantes/${restaurantId}/productos/${productId}`
    );
    return data;
  },

  create: async (restaurantId: number, dto: CreateProductDTO) => {
    const { data } = await apiClient.post<Product>(
      `/restaurantes/${restaurantId}/productos`,
      dto
    );
    return data;
  },

  update: async (restaurantId: number, productId: number, dto: UpdateProductDTO) => {
    const { data } = await apiClient.put<Product>(
      `/restaurantes/${restaurantId}/productos/${productId}`,
      dto
    );
    return data;
  },

  delete: async (restaurantId: number, productId: number) => {
    const { data } = await apiClient.delete(
      `/restaurantes/${restaurantId}/productos/${productId}`
    );
    return data;
  },

  toggleActive: async (restaurantId: number, productId: number, activo: boolean) => {
    const { data } = await apiClient.patch<Product>(
      `/restaurantes/${restaurantId}/productos/${productId}/activo`,
      { activo }
    );
    return data;
  },
};
```

---

## 3. Horarios

### Modelo de Datos

```typescript
// src/entities/schedule/model/types.ts

export interface Schedule {
  // Auto-generados
  id: number;
  restaurante_id: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  
  // Campos obligatorios
  dia_semana: DayOfWeek;     // 0=Lunes, 1=Martes, ..., 6=Domingo
  hora_apertura: string;      // Format: "HH:MM:SS" (24h)
  hora_cierre: string;        // Format: "HH:MM:SS" (24h)
  
  // Estado
  activo: boolean;            // Permite desactivar temporalmente
}

export enum DayOfWeek {
  LUNES = 0,
  MARTES = 1,
  MIERCOLES = 2,
  JUEVES = 3,
  VIERNES = 4,
  SABADO = 5,
  DOMINGO = 6,
}

export const DAY_NAMES: Record<DayOfWeek, string> = {
  [DayOfWeek.LUNES]: 'Lunes',
  [DayOfWeek.MARTES]: 'Martes',
  [DayOfWeek.MIERCOLES]: 'Miércoles',
  [DayOfWeek.JUEVES]: 'Jueves',
  [DayOfWeek.VIERNES]: 'Viernes',
  [DayOfWeek.SABADO]: 'Sábado',
  [DayOfWeek.DOMINGO]: 'Domingo',
};

export interface CreateScheduleDTO {
  dia_semana: DayOfWeek;
  hora_apertura: string;
  hora_cierre: string;
}

export type UpdateScheduleDTO = Partial<Omit<CreateScheduleDTO, 'dia_semana'>>;

// Helper para validación
export const isValidTimeRange = (apertura: string, cierre: string): boolean => {
  return apertura < cierre;
};
```

### Endpoints

| Método | Endpoint | Descripción | Body | Query Params |
|--------|----------|-------------|------|--------------|
| **GET** | `/restaurantes/:rid/horarios` | Listar horarios | - | `activo` |
| **GET** | `/restaurantes/:rid/horarios/:hid` | Obtener por ID | - | - |
| **POST** | `/restaurantes/:rid/horarios` | Crear horario | `CreateScheduleDTO` | - |
| **PUT** | `/restaurantes/:rid/horarios/:hid` | Actualizar | `UpdateScheduleDTO` | - |
| **DELETE** | `/restaurantes/:rid/horarios/:hid` | Soft delete | - | - |
| **PATCH** | `/restaurantes/:rid/horarios/:hid/activo` | Toggle activo | `{ activo: boolean }` | - |

### Ejemplos de Request/Response

#### GET /restaurantes/1/horarios?activo=true

```json
// Response 200 OK
[
  {
    "id": 1,
    "restaurante_id": 1,
    "dia_semana": 0,
    "hora_apertura": "08:00:00",
    "hora_cierre": "22:00:00",
    "activo": true,
    "fecha_creacion": "2026-01-20T10:00:00Z",
    "fecha_actualizacion": "2026-01-20T10:00:00Z"
  },
  {
    "id": 2,
    "restaurante_id": 1,
    "dia_semana": 1,
    "hora_apertura": "09:00:00",
    "hora_cierre": "14:00:00",
    "activo": true,
    "fecha_creacion": "2026-01-20T10:01:00Z",
    "fecha_actualizacion": "2026-01-20T10:01:00Z"
  },
  {
    "id": 3,
    "restaurante_id": 1,
    "dia_semana": 1,
    "hora_apertura": "17:00:00",
    "hora_cierre": "22:00:00",
    "activo": true,
    "fecha_creacion": "2026-01-20T10:02:00Z",
    "fecha_actualizacion": "2026-01-20T10:02:00Z"
  }
]
```

#### POST /restaurantes/1/horarios

```json
// Request
{
  "dia_semana": 5,
  "hora_apertura": "10:00:00",
  "hora_cierre": "23:00:00"
}

// Response 201 Created
{
  "id": 10,
  "restaurante_id": 1,
  "dia_semana": 5,
  "hora_apertura": "10:00:00",
  "hora_cierre": "23:00:00",
  "activo": true,
  "fecha_creacion": "2026-04-07T18:15:00Z",
  "fecha_actualizacion": "2026-04-07T18:15:00Z"
}
```

### Servicio TypeScript

```typescript
// src/features/manage-schedule/api/schedule.service.ts
import { apiClient } from '@/shared/api/apiClient';
import type { Schedule, CreateScheduleDTO, UpdateScheduleDTO } from '@/entities/schedule/model/types';

export const scheduleService = {
  getAll: async (restaurantId: number, params?: { activo?: boolean }) => {
    const { data } = await apiClient.get<Schedule[]>(
      `/restaurantes/${restaurantId}/horarios`,
      { params }
    );
    return data;
  },

  getById: async (restaurantId: number, scheduleId: number) => {
    const { data } = await apiClient.get<Schedule>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`
    );
    return data;
  },

  create: async (restaurantId: number, dto: CreateScheduleDTO) => {
    const { data } = await apiClient.post<Schedule>(
      `/restaurantes/${restaurantId}/horarios`,
      dto
    );
    return data;
  },

  update: async (restaurantId: number, scheduleId: number, dto: UpdateScheduleDTO) => {
    const { data } = await apiClient.put<Schedule>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`,
      dto
    );
    return data;
  },

  delete: async (restaurantId: number, scheduleId: number) => {
    const { data } = await apiClient.delete(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}`
    );
    return data;
  },

  toggleActive: async (restaurantId: number, scheduleId: number, activo: boolean) => {
    const { data } = await apiClient.patch<Schedule>(
      `/restaurantes/${restaurantId}/horarios/${scheduleId}/activo`,
      { activo }
    );
    return data;
  },
};
```

---

## 4. Pedidos (Pendiente)

### Estado Actual
- ❌ Endpoints aún no disponibles en las colecciones
- ⏳ Depende del módulo de pedidos del backend

### Modelo Tentativo

```typescript
// src/entities/order/model/types.ts (PENDIENTE)

export interface Order {
  id: number;
  restaurante_id: number;
  cliente_id: number;
  repartidor_id?: number;
  
  // Detalles
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  
  // Estado
  estado: OrderStatus;
  
  // Timestamps
  fecha_creacion: string;
  fecha_aceptacion?: string;
  fecha_listo?: string;
  fecha_entregado?: string;
}

export enum OrderStatus {
  PENDIENTE = 'PENDIENTE',
  ACEPTADO = 'ACEPTADO',
  PREPARANDO = 'PREPARANDO',
  LISTO = 'LISTO',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

export interface OrderItem {
  producto_id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}
```

---

## 📝 Notas Importantes

### Patrones Comunes

1. **Soft Delete Global**
   - DELETE no elimina físicamente
   - Marca `activo = false`
   - Filtrar con query param `?activo=true`

2. **Nested Resources**
   - Productos y horarios siempre bajo `/restaurantes/:id`
   - No hay endpoints independientes

3. **Precios en Centavos**
   - Backend usa enteros (15000 = Q150.00)
   - UI debe convertir: `precio / 100`
   - Al guardar: `Math.round(precio * 100)`

4. **Horarios Múltiples**
   - Puede haber varios horarios por día (split shifts)
   - Ejemplo: Lunes 9:00-14:00 y 17:00-22:00

5. **Timestamps**
   - Formato ISO 8601: `2026-04-07T18:23:19.490Z`
   - Auto-generados por backend

### Validaciones Frontend

```typescript
// Restaurante
- nombre: required, max 255
- telefono: required, formato válido
- direccion: required
- correo: optional, email válido

// Producto
- nombre: required, max 255
- precio: required, > 0
- tipo_producto_id: required, exists

// Horario
- hora_cierre > hora_apertura
- formato HH:MM:SS válido
```

---

**Última actualización:** 07/04/2026  
**Siguiente revisión:** Al integrar módulo de pedidos
