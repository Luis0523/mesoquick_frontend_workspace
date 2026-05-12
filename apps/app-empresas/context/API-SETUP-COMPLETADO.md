# 🎉 Configuración API Restaurantes - COMPLETADA

**Fecha:** 07/04/2026  
**API Endpoint:** `https://restaurantes.fly.dev/api`  
**Estado:** ✅ Funcional

---

## 📁 Estructura Creada

```
src/
├── shared/
│   ├── config/
│   │   ├── env.config.ts          # Variables de entorno
│   │   └── api.config.ts          # Configuración de Axios
│   ├── api/
│   │   ├── apiClient.ts           # Cliente Axios con interceptores
│   │   └── types.ts               # Tipos comunes de API
│   ├── utils/
│   │   ├── currency.ts            # Conversión centavos/quetzales
│   │   └── date.ts                # Formateo de fechas
│   └── mocks/
│       └── mockAuth.ts            # Mock de autenticación temporal
│
├── entities/
│   └── restaurant/
│       └── model/
│           └── types.ts           # Tipos de Restaurant
│
└── features/
    └── manage-restaurant/
        └── api/
            └── restaurant.service.ts  # Servicios de Restaurant
```

---

## 🔧 Archivos de Configuración

### `.env`
```env
VITE_API_BASE_URL=https://restaurantes.fly.dev/api
VITE_WS_URL=wss://restaurantes.fly.dev
VITE_NODE_ENV=development
VITE_USE_MOCK=false
```

### `vite.config.ts`
- ✅ Path aliases configurados (`@/` → `./src`)
- ✅ Puerto 5174 (diferente a app-repartidores)

### `tsconfig.app.json`
- ✅ Path aliases en TypeScript
- ✅ Strict mode habilitado

---

## 📦 Dependencias Instaladas

```json
{
  "dependencies": {
    "axios": "^1.14.0",
    "zustand": "^5.0.12",
    "react-router-dom": "^7.14.0",
    "lucide-react": "^1.7.0"
  }
}
```

---

## 🔗 API Restaurant Service

### Métodos Disponibles

```typescript
import { restaurantService } from '@/features/manage-restaurant/api/restaurant.service';

// Obtener todos los restaurantes
const restaurants = await restaurantService.getAll({ activo: true });

// Obtener por ID
const restaurant = await restaurantService.getById(1);

// Crear
const newRestaurant = await restaurantService.create({
  nombre: "Pizza Hut",
  direccion: "Calle 123",
  telefono: "555-1234"
});

// Actualizar
const updated = await restaurantService.update(1, {
  nombre: "Pizza Hut Centro"
});

// Eliminar (soft delete)
await restaurantService.delete(1);

// Toggle disponibilidad
const toggled = await restaurantService.toggleAvailability(1, false);
```

---

## 📊 Formato de Respuesta de la API

La API envuelve las respuestas en el siguiente formato:

```json
{
  "success": true,
  "data": [...],
  "count": 2
}
```

El servicio ya extrae automáticamente el campo `data`.

---

## 🔍 Tipos TypeScript

```typescript
interface Restaurant {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  descripcion?: string | null;
  correo?: string | null;
  logo_url?: string | null;
  disponible: boolean;
  activo: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string | null;
  horarios?: unknown[];
}
```

---

## 💰 Utilidades de Moneda

```typescript
import { fromCents, toCents, formatPrice } from '@/shared/utils/currency';

// Backend usa centavos, frontend usa quetzales
const quetzales = fromCents(15000);      // 150
const centavos = toCents(150.50);        // 15050
const formatted = formatPrice(15000);    // "Q150.00"
```

---

## 📅 Utilidades de Fecha

```typescript
import { formatDateTime, formatDate, getRelativeTime } from '@/shared/utils/date';

const dateTime = formatDateTime("2026-04-07T18:30:00Z");  // "07/04/2026 18:30"
const date = formatDate("2026-04-07T18:30:00Z");          // "07/04/2026"
const relative = getRelativeTime("2026-04-07T10:00:00Z"); // "Hace 8 horas"
```

---

## 🔐 Mock de Autenticación

```typescript
import { getMockUser, getCurrentRestaurantId } from '@/shared/mocks/mockAuth';

const user = getMockUser();              // { id: 1, restaurante_id: 1, ... }
const restaurantId = getCurrentRestaurantId();  // 1
```

---

## 🚀 Cómo Ejecutar

### Desde el workspace raíz:
```bash
cd /home/lufi/programacion/mesoquick_frontend_workspace
npm run dev:empresas
```

### Directamente (si las dependencias están instaladas):
```bash
cd /home/lufi/programacion/mesoquick_frontend_workspace/apps/app-empresas
npm run dev
```

**Acceso:** `http://localhost:5174`

---

## ✅ Features Implementados

- [x] Configuración de entorno (.env)
- [x] Cliente Axios con interceptores
- [x] Manejo de errores global
- [x] Path aliases (@/)
- [x] Tipos TypeScript completos
- [x] Servicio de Restaurant con CRUD completo
- [x] Mock de autenticación
- [x] Utilidades de moneda
- [x] Utilidades de fecha
- [x] Demo en App.tsx con datos reales

---

## 📝 Notas Importantes

1. **Formato de API:** Todas las respuestas vienen envueltas en `{ success, data, count }`
2. **Campos Nullable:** `descripcion`, `correo`, `logo_url`, `fecha_actualizacion`
3. **Relaciones:** La API incluye `horarios: []` en la respuesta (implementar después)
4. **Path Aliases:** Usar `@/` para imports (ej: `import { x } from '@/shared/api/apiClient'`)
5. **Puerto:** App corre en puerto `5174` (repartidores usa 5173)

---

## ⚠️ Pendientes (Próxima Sesión)

- [ ] Configurar Tailwind CSS
- [ ] Crear estructura completa de FSD (pages, widgets)
- [ ] Implementar Zustand stores
- [ ] Configurar React Router DOM
- [ ] Crear componentes UI base
- [ ] Implementar MainLayout con Sidebar
- [ ] Crear páginas (Dashboard, Restaurant, Products, Schedule)

---

## 🧪 Testing Manual

### Test 1: Verificar API
```bash
curl https://restaurantes.fly.dev/api/restaurantes | jq '.'
```

### Test 2: Ver en navegador
1. Ejecutar `npm run dev:empresas`
2. Abrir `http://localhost:5174`
3. Deberías ver la lista de restaurantes de la API real

---

**Última actualización:** 07/04/2026 19:30
