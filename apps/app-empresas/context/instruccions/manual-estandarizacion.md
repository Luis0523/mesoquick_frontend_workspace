Ficha Técnica y Estandarización de Entorno - MesoQuick
Frontend Workspace
1. Especificaciones del Entorno de Ejecución (Runtime)
El proyecto opera bajo una arquitectura de Aislamiento Absoluto del Host (Container-First). No
se utilizan ni se permiten instalaciones locales de Node.js o dependencias en las máquinas
físicas de los desarrolladores (Windows, macOS o Linux). Todo el ecosistema se ejecuta dentro
del contenedor para garantizar paridad total.
Componente Especificación / Versión Propósito / Nota
Motor de
Contenedores
Docker Engine & Docker
Compose V2
Orquestación del entorno de desarrollo.
Se utiliza el flag init: true para que
las señales del sistema (como Ctrl+C)
cierren los procesos de Node de manera
limpia.
Imagen Base (OS) Alpine Linux
(node:20-alpine)
Sistema operativo ligero y estandarizado.
Aislamiento de
Permisos
UID/GID 1000 (usuario
node)
Previene conflictos de permisos
(EACCES) entre el sistema de archivos
del host y el contenedor.
Mapeo de
Volúmenes
Sincronización
Bidireccional (.:/app)
CRÍTICO: Se evita el uso de volúmenes
anónimos. Esto permite que el host (y
editores como VS Code) puedan leer la
carpeta node_modules generada por
Docker, habilitando el autocompletado
estricto de TypeScript sin romper el
aislamiento.
Paridad
Multiplataforma
.gitattributes (*
text=auto eol=lf)
Fuerza a Git a utilizar saltos de línea LF.
Previene que clonar el repositorio en
Windows (CRLF) rompa los scripts de
ejecución dentro del contenedor Linux.
Red de
Contenedores
mesoquick_net (Bridge
driver)
Permite la resolución DNS interna entre
los microservicios y el Frontend.
Gateway Interno http://broker-gateway:800
0
Destino único de todas las peticiones
HTTP/WSS. El Frontend NUNCA ataca
microservicios directamente, permitiendo
la centralización del tráfico.
Exposición de
Puertos
5173:5173 Puerto por defecto de Vite, expuesto
explícitamente hacia la máquina host
mediante el flag --host 0.0.0.0.
2. Stack Tecnológico y Dependencias Base
El ecosistema está construido sobre la siguiente pila de tecnologías, gestionadas mediante NPM
Workspaces (Hoisting activado).
Tecnología Versión Instalada Alcance
Node.js v20.x Motor de ejecución del contenedor.
React ^19.2.x Librería principal de UI.
TypeScript ~5.9.x Modo Estricto obligatorio (noImplicitAny: true).
Se prohíbe terminantemente el uso del tipo any.
Implementa arquitectura Solution-Style
(tsconfig.app.json para el DOM y
tsconfig.node.json para Vite) para evitar colisiones
de tipos.
Vite ^8.0.x Bundler y servidor de desarrollo. CRÍTICO: Configurado
con watch: { usePolling: true } para garantizar
que el HMR (Hot Module Replacement) funcione sin
fallos a través de la máquina virtual de Docker en
cualquier SO.
Tailwind CSS ^3.4.x Motor de estilos basado en utilidades. Única fuente de
verdad para el Brandbook y el paquete
@mesoquick/ui-kit.
PostCSS /
Autoprefixer
^8.5.x Motor de procesamiento de CSS subyacente.
Zustand ^5.0.x Gestor de estado global y local. REGLA FSD: Los stores
compartidos (ej. Billetera) deben vivir en entities/.
Los stores de un caso de uso específico deben vivir
encapsulados en su respectiva feature/. Prohibido
crear un mega-store acoplado.
React Router
DOM
^7.13.x Enrutamiento del lado del cliente (SPA). Define las
fronteras entre rutas públicas (/login) y el Layout
protegido por sesión.
Axios ^1.14.x Cliente HTTP maestro. CRÍTICO: Prohibido instanciarlo
directamente en las vistas. Toda petición usa la instancia
global en core-network para garantizar la inyección
del JWT y el manejo de caducidad (Error 401).
Lucide React ^1.7.x Sistema iconográfico vectorial estandarizado. Ligero y
con soporte nativo para manipulación mediante clases
de Tailwind.
3. Topología del Monorepo (NPM Workspaces)
El código fuente está orquestado bajo el patrón de Micro-Frontends simulados mediante NPM
Workspaces. Se divide en dos dominios estrictamente aislados (apps/ y packages/) para
garantizar un bajo acoplamiento, alta cohesión y despliegues independientes. Todos los módulos
internos se enlazan mediante el namespace @mesoquick/* utilizando el protocolo
"workspace:*".
3.1. Aplicaciones Ejecutables (apps/)
Son los contenedores principales (Verticales de Negocio). Contienen vistas, lógica de negocio y
gestión de estado (Zustand).
● REGLA ARQUITECTÓNICA CRÍTICA: Las aplicaciones son contenedores herméticos.
ESTÁ ESTRICTAMENTE PROHIBIDO que una aplicación importe código de otra
aplicación (Ej. app-repartidores jamás debe importar un componente de
app-clientes).
● Listado de Nodos:
○ @mesoquick/shell-login: El Orquestador Central (IdP). Su única
responsabilidad es procesar las credenciales (Email/Password), obtener el JWT
del Bróker y redirigir al usuario hacia la aplicación correspondiente según su rol.
No debe contener formularios de registro.
○ @mesoquick/app-repartidores: Interfaz operativa (Core Logístico). Contiene
el Dashboard de pedidos asíncronos, rastreo GPS y Billetera Virtual.
○ @mesoquick/app-clientes: Interfaz de consumo (Catálogo, carrito de
compras y tracking de órdenes).
○ @mesoquick/app-empresas: Interfaz administrativa para la gestión de
inventarios (Restaurantes, Farmacias, Supermercados) y recepción de comandas.
○ @mesoquick/app-agentes: Panel de control (Backoffice) para Servicio al
Cliente, resolución de disputas y monitoreo general.
3.2. Librerías Compartidas (packages/ - Internal SDK)
Son los cimientos del ecosistema. Proporcionan utilidades transversales consumidas por las
aplicaciones.
● REGLA ARQUITECTÓNICA CRÍTICA: Los paquetes son agnósticos al negocio. TIENEN
PROHIBIDO importar cualquier archivo, tipo o componente que resida dentro de la
carpeta apps/. Hacerlo crearía una dependencia circular fatal.
● Listado de Paquetes:
○ @mesoquick/ui-kit: Sistema de Diseño y Brandbook. Contiene las
configuraciones maestras de Tailwind y los componentes visuales "tontos" (Dumb
Components: Botones, Modales, Inputs). Restricción: No debe contener
llamadas a la red (Axios) ni estado global (Zustand).
○ @mesoquick/core-network: Motor de Comunicaciones. Aloja la instancia
Singleton de Axios (con interceptores para inyección de JWT y manejo de Error
401) y la clase SocketManager para orquestar la resiliencia y reconexión de los
WebSockets.
○ @mesoquick/eslint-config / @mesoquick/ts-config: Contratos de
calidad estática. Dictan las reglas de validación de código para estandarizar la
sintaxis en todo el Workspace.
4. Arquitectura Interna de Aplicaciones (Feature-Sliced Design)
Cada aplicación dentro de apps/ (ej. app-repartidores) organiza su directorio src/ bajo la
estricta metodología FSD. El objetivo es garantizar un flujo de dependencias unidireccional
(las capas superiores pueden importar a las inferiores, pero NUNCA al revés) y evitar el
acoplamiento cruzado.
La jerarquía de capas, de arriba hacia abajo, es la siguiente:
1. app/ (Capa de Inicialización): Proveedores globales, enrutador principal
(react-router-dom), Layouts base y barreras de contención (ej. <ErrorBoundary
/>, <NotFoundPage />).
2. pages/ (Nodos de Ruteo): Componentes "tontos" (ej. DashboardPage, WalletPage).
Su única responsabilidad es componer la vista importando Widgets y Features. No deben
contener lógica de negocio ni llamadas directas a Axios.
3. widgets/ (Orquestadores de UI): Bloques de interfaz complejos compuestos por
múltiples features. (Ej. ActiveOrderPanel, el cual junta el mapa de la orden, el menú
de acciones y los botones de cambio de estado).
4. features/ (Lógica de Negocio Encapsulada): Casos de uso específicos del usuario
(ej. request-order-cancellation, toggle-courier-status).
○ Estructura Interna: Deben contener estrictamente las subcarpetas ui/
(Componentes), model/ (Estado local en Zustand) y api/ (Llamadas
Axios/WSS).
○ REGLA CRÍTICA DE AISLAMIENTO: ESTÁ ABSOLUTAMENTE PROHIBIDO
que una Feature importe código, componentes o estados de otra Feature. Las
dependencias laterales destruyen la arquitectura.
5. entities/ (Dominio de Negocio Compartido): Interfaces TypeScript (DTOs tipando
estrictamente las respuestas del Bróker: CourierProfile, Order, Transaction).
○ REGLA DE ESTADO GLOBAL: Si un estado de Zustand debe ser leído y mutado
por múltiples features distintas (Ej. El useWalletStore que necesita ser
actualizado por la feature de "Finalizar Viaje"), dicho store DEBE vivir en esta
capa (ej. entities/wallet/model/) para evitar ciclos de dependencia.
6. shared/ (Utilidades Agnósticas): Código que no sabe nada del negocio. Funciones de
formateo (currency.ts), procesadores de imágenes (imageUtils.ts) y la
subcarpeta lib/ para middlewares que operan fuera del ciclo de vida de React (ej.
geolocationManager.ts o temporizadores aislados) para prevenir el thrashing de
eventos.
5. Directivas Operativas de Obligatorio Cumplimiento
Esta sección contiene instrucciones explícitas e inquebrantables para los desarrolladores y
asistentes de Inteligencia Artificial que generen código para el proyecto. Ignorar estas directivas
provocará fallos sistémicos en la arquitectura.
1. Gestión de Dependencias (Container-First): Está estrictamente prohibido ejecutar
npm install en la terminal de la computadora física. Todo paquete debe instalarse
mediante el contenedor apuntando al workspace específico.
○ Comando correcto: docker compose exec frontend-dev npm install
<paquete> -w @mesoquick/<nombre-de-la-app>
○ Resolución de Bloqueos (Linux Host): Si Docker bloquea la carpeta
node_modules generando un error EACCES, el desarrollador debe reclamar los
permisos ejecutando sudo chown -R $USER:$USER . en su máquina local.
2. Evasión de CORS y Enrutamiento Base: Los desarrolladores NUNCA deben usar
URLs absolutas (ej. http://localhost:8000/api/users) en Axios o Fetch.
○ Deben usar rutas relativas (ej. /api/users, /ws/chat).
○ Vite está configurado con un proxy inverso que interceptará dinámicamente /api
y /ws enviándolos al Bróker interno de la red Docker
(http://broker-gateway:8000) leyendo las variables del .env.
3. Resiliencia de Red y Manejo de Sesión (Axios): Toda petición HTTP debe realizarse a
través de la instancia global de Axios alojada en packages/core-network.
○ Cierre de Sesión Seguro (401): Queda prohibido expulsar abruptamente al
usuario ante un Error 401. El interceptor debe pausar la petición, intentar una
renovación silenciosa (POST /api/auth/refresh) y reintentar. Solo si el
refresh falla, se purga el estado.
○ Manejo Global de Caídas (5xx): Los errores de Gateway (500, 502, 503) no
deben romper el árbol de React (Promesas no manejadas). El interceptor debe
despachar eventos globales para renderizar Toasts de "Reconectando..." o
"Problemas de red".
4. Flujos Asíncronos Complejos (WebSockets): Módulos como el Chat o el Tracking
GPS requieren conexión ininterrumpida.
○ La inicialización del cliente WSS debe instanciarse en
packages/core-network mediante la clase SocketManager.
○ Reconexión y Thrashing: Es obligatorio implementar reconexión automática
(Exponential Backoff). Las suscripciones al socket deben ocurrir en middlewares o
stores fuera del ciclo de vida de React (ej. fuera de los useEffect de vistas
comunes) para evitar desconexiones accidentales por re-renderizados.
5. Saltos de Línea (Line Endings): El proyecto impone la normalización absoluta a LF a
través del archivo .gitattributes. Los desarrolladores en entornos Windows deben
asegurarse de que sus IDEs (VS Code) o clientes de Git no reescriban los archivos a
CRLF, ya que esto romperá los scripts de ejecución dentro del contenedor Linux.
6. Integridad de Modales y UI Shared: Al generar componentes emergentes (Modales,
Popups, Menús Desplegables), la interfaz de usuario debe delegar la maquetación
estructural al paquete @mesoquick/ui-kit. Los modales deben renderizarse sobre
overlays estandarizados (bg-black/50) y utilizar el fondo base #f7f7f7 establecido en
el Brandbook global.
6. Guías de Estilo y Brandbook (Tailwind CSS)
Para mantener la consistencia visual y evitar la proliferación de CSS personalizado, todo código
generado debe delegar la maquetación a las clases de utilidad de Tailwind, las cuales están
extendidas e inyectadas globalmente a través del paquete @mesoquick/ui-kit.
● Tipografía Base: font-sans configurada nativamente para utilizar la familia
Montserrat. Pesos permitidos estrictamente: 200 (Light), 400 (Regular), 600
(Semibold/Bold). Prohibido importar fuentes externas fuera de esta configuración.
● Paleta de Colores Estricta: Las clases de Tailwind son la única fuente de verdad para la
identidad corporativa:
○ bg-primary / text-primary: #3c606b (Gris/Azul oscuro corporativo para
headers, textos principales y bordes activos).
○ bg-base: #f7f7f7 (Fondo general de las aplicaciones y layouts maestros).
○ bg-green-base: #56bd64 (Verde estándar para botones primarios, calls to
action y estados de éxito).
○ bg-green-bright: #37e64f (Verde brillante reservado para interacciones de
cursor hover:, focus: o notificaciones dinámicas).
○ text-accent / bg-accent: #edca11 (Amarillo para alertas, propinas o
elementos que requieren atención inmediata).
● Componentes Contenedores (Cards): Priorizar el uso de contenedores para agrupar
información. Deben utilizar fondos blancos (bg-white), sombras suaves (shadow-md) y
bordes redondeados (rounded-lg).
● Directiva de Responsividad: Toda maquetación debe ser construida bajo el paradigma
Mobile-First, utilizando los prefijos de Tailwind (md:, lg:) únicamente cuando la vista en
escritorio exija expansiones.
7. Estrategia de Gestión de Estado (Zustand en FSD)
El uso de Zustand es obligatorio, pero debe someterse rígidamente a los límites de la
arquitectura Feature-Sliced Design para prevenir re-renderizados masivos y dependencias
circulares (Spaghetti State):
● Estados Globales de Plataforma (Capa app/): Datos puramente de infraestructura,
como la sesión del usuario (JWT desencriptado) o el tema, deben inicializarse en el nivel
superior (app/providers/). Deben implementar lógica de persistencia/hidratación (ej.
comprobando localStorage o un endpoint /me) para sobrevivir a recargas del
navegador (F5).
● Estados de Dominio Compartido (Capa entities/): REGLA CRÍTICA: Si un estado
de negocio debe ser leído o mutado por múltiples Features independientes (ej. El saldo
de la Billetera, que debe actualizarse cuando la Feature de "Viaje" finaliza un pedido),
este store DEBE vivir en entities/[dominio]/model/store.ts. Está prohibido
colocar lógica de negocio en la capa shared/.
● Estados Encapsulados (Capa features/): El estado efímero o específico de un caso
de uso (ej. el flujo de pasos de un formulario de registro o los datos de un modal de tarifa)
DEBE vivir dentro de su propia carpeta
features/[nombre-feature]/model/store.ts. Está terminantemente prohibido
crear un "Mega-Store" global que mezcle todos los estados de la aplicación.
● Regla de Selectores Atómicos: Al consumir un store de Zustand dentro de un
componente de React, es obligatorio extraer únicamente las propiedades necesarias
mediante selectores atómicos (ej. const isOpen = useStore(state =>
state.isOpen)). Extraer el objeto completo provocará que el componente se
re-renderice innecesariamente cada vez que cualquier otra parte del store cambie.
8. Flujo de Desarrollo Requerido (El Algoritmo de Creación)
Toda nueva funcionalidad solicitada a un desarrollador humano o a un agente de Inteligencia
Artificial debe seguir estrictamente y sin excepciones el siguiente orden de ejecución
algorítmico. Alterar este orden garantiza la introducción de deuda técnica, tipados inferidos (any)
y rupturas de la arquitectura FSD.
1. Paso 1: Contratos de Dominio (DTOs) Primero. Antes de escribir una sola línea de
lógica de red o de UI, se deben definir las interfaces o types en TypeScript.
○ Dónde: Dentro de la capa entities/[dominio]/model/types.ts (ej.
entities/order/model/types.ts).
○ Regla: Asumir y tipar estrictamente las respuestas del Bróker de Backend. Queda
absolutamente prohibido el uso de any o tipados implícitos.
2. Paso 2: Capa de Red (API). Crear los servicios de consumo HTTP o WebSockets.
○ Dónde: En features/[nombre-feature]/api/.
○ Regla: Se debe importar y utilizar obligatoriamente la instancia Singleton de Axios
(@mesoquick/core-network) utilizando rutas relativas.
3. Paso 3: Gestión de Estado y Lógica (Model). Conectar la capa de red con la memoria
de la aplicación.
○ Dónde: En features/[nombre-feature]/model/.
○ Regla: Crear custom hooks (ej. useFetchOrder) o stores encapsulados de
Zustand para manejar el estado de carga (isLoading), errores (error) y los
datos hidratados con los DTOs del Paso 1.
4. Paso 4: Implementación Visual (UI). Construir los componentes visuales interactivos de
la funcionalidad.
○ Dónde: En features/[nombre-feature]/ui/.
○ Regla: El componente debe ser "puro" a nivel visual, consumiendo el estado del
Model (Paso 3). La maquetación debe usar estrictamente las clases de Tailwind
del Brandbook. Si la feature requiere recolección de datos de usuario, es
obligatorio usar react-hook-form validado con zod.
5. Paso 5: Ensamblaje y Orquestación (Composición). Una Feature FSD nunca se
enruta ni se monta a sí misma. El paso final es exponerla e inyectarla.
○ Dónde: Importar la feature construida en el Paso 4 y colocarla dentro de un
orquestador en la capa widgets/ (ej. ActiveOrderPanel.tsx) o directamente
en el cascarón de enrutamiento en pages/ (ej. DashboardPage.tsx)