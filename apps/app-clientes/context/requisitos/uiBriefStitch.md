# Brief UI Para Stitch - MesoFood

Fecha: 15/05/2026
Proyecto: MesoFood - App cliente de pedidos
Color principal: `#0c4635`

## Objetivo Del Mockup

Generar un mockup mobile-first para una app cliente tipo PedidosYa, llamada MesoFood, donde los usuarios puedan descubrir restaurantes y negocios activos, ver productos, agregar al carrito y hacer un pedido.

La UI debe sentirse moderna, confiable, rapida y enfocada en comida/locales cercanos. Debe priorizar pantallas moviles, pero funcionar tambien como web responsive.

## Estilo Visual

- Color principal: `#0c4635`, verde profundo, usado en header, botones principales, badges activos y elementos de marca.
- Fondo general: crema o gris muy claro, sugerido `#f7f4ee` o `#f8faf7`.
- Superficies/cards: blanco `#ffffff`.
- Acento secundario: naranja suave para comida/promociones, sugerido `#f97316`.
- Exito/disponible: verde claro `#22c55e`.
- Texto principal: casi negro `#1f2937`.
- Texto secundario: gris `#6b7280`.
- Bordes: gris/verde muy suave `#d9e5df`.
- Estilo de cards: bordes redondeados grandes, sombra suave, imagen amplia arriba o a la izquierda segun pantalla.
- Tipografia: sans serif moderna, amigable y legible. Puede ser Inter, Nunito Sans o Montserrat.
- Iconografia: simple, lineal, con iconos de ubicacion, busqueda, carrito, pedidos, usuario, filtros y categorias.

## Personalidad De Marca

- Nombre visible: MesoFood.
- Sensacion: local, confiable, fresca y practica.
- Evitar una UI generica. Debe sentirse como una app real de delivery con enfasis en restaurantes de la region.
- Usar fotografia de comida en cards, banners y productos.
- Mantener CTA muy claros: “Buscar comida”, “Agregar”, “Ver restaurante”, “Confirmar pedido”.

## Navegacion Principal

Debe tener una navegacion inferior mobile con 4 tabs:

- Inicio
- Buscar
- Pedidos
- Perfil

En desktop/tablet, puede transformarse en header superior con logo, buscador, links y carrito.

## Pantallas Necesarias

Se necesitan 10 pantallas principales para el mockup inicial.

## 1. Splash / Bienvenida

Pantalla inicial de marca.

Debe tener:

- Logo o texto “MesoFood”.
- Fondo usando `#0c4635`.
- Ilustracion o fotografia sutil de comida.
- Texto corto: “Comida y negocios cerca de ti”.
- Boton principal: “Empezar”.

## 2. Home / Inicio

Pantalla principal de descubrimiento.

Debe tener:

- Header con saludo: “Hola, ¿que se te antoja hoy?”
- Selector de ubicacion o direccion de entrega.
- Buscador grande: “Buscar restaurantes, negocios o productos”.
- Banner promocional principal con color `#0c4635` y acento naranja.
- Seccion de categorias horizontales: Pizza, Hamburguesas, Pollo, Bebidas, Postres, Farmacia, Tiendas.
- Seccion “Restaurantes activos”.
- Seccion “Negocios cerca de ti”.
- Cards con imagen, nombre, estado abierto, tiempo estimado, costo de envio y rating futuro.
- Bottom navigation activa en Inicio.

## 3. Buscar / Explorar

Pantalla para buscar y filtrar.

Debe tener:

- Campo de busqueda fijo arriba.
- Chips de filtros: Abierto ahora, Envio gratis, Mejor valorados, Menor tiempo, Restaurantes, Negocios.
- Lista de resultados combinando restaurantes y negocios.
- Opcion de vista por categoria.
- Estado vacio amigable si no hay resultados.

## 4. Listado De Restaurantes

Pantalla enfocada solo en restaurantes.

Debe tener:

- Titulo: “Restaurantes”.
- Filtros por categoria de comida.
- Toggle/chip “Solo disponibles”.
- Cards verticales con imagen grande, nombre, descripcion corta, estado abierto/disponible, tiempo estimado, rating y etiqueta destacada.
- Indicador visual para cerrado/no disponible, sin ocultar completamente el card.

## 5. Detalle De Restaurante

Pantalla de menu de un restaurante.

Debe tener:

- Hero con imagen del restaurante.
- Nombre, descripcion, direccion corta, telefono si aplica.
- Badges: Abierto, Disponible, Tiempo estimado.
- Tabs o chips de categorias de productos.
- Lista de productos con imagen, nombre, descripcion, precio y boton “Agregar”.
- Carrito flotante inferior cuando haya productos agregados.
- Boton de volver.

## 6. Detalle De Producto

Pantalla o modal para configurar producto.

Debe tener:

- Imagen grande del producto.
- Nombre, descripcion y precio.
- Selector de cantidad.
- Campo de notas: “Instrucciones especiales”.
- Boton principal fijo abajo: “Agregar al carrito”.
- Resumen del subtotal del item.

## 7. Negocios Activos

Pantalla para negocios que no son restaurantes.

Debe tener:

- Titulo: “Negocios activos”.
- Categorias: Farmacias, Tiendas, Conveniencia, Servicios, Otros.
- Cards de negocio con logo/imagen, nombre comercial, tipo de negocio, estado activo, direccion corta y boton “Ver productos”.
- Mantener consistencia con restaurantes, pero diferenciando tipo de negocio.

## 8. Carrito

Pantalla para revisar pedido.

Debe tener:

- Titulo: “Tu carrito”.
- Nombre del restaurante o negocio origen.
- Lista de productos con cantidad, precio, notas y controles + / -.
- Opcion para eliminar item.
- Campo para instrucciones del pedido.
- Resumen de costos: subtotal, envio provisional, total.
- Boton principal: “Continuar”.
- Estado vacio con CTA: “Explorar restaurantes”.

## 9. Checkout / Confirmar Pedido

Pantalla para datos de entrega.

Debe tener:

- Datos del cliente: nombre, telefono.
- Direccion de entrega.
- Referencia de direccion.
- Instrucciones para repartidor.
- Resumen compacto del pedido.
- Metodo de pago provisional: “Pago contra entrega” o “Efectivo”.
- Boton principal: “Confirmar pedido”.
- Mensaje de seguridad/confianza.

## 10. Seguimiento De Pedido

Pantalla para ver estado del pedido.

Debe tener:

- Titulo: “Pedido en camino” o estado actual.
- Timeline vertical u horizontal con estados: Pedido recibido, Preparando, Listo para recoger, En camino, Entregado.
- Card con resumen del restaurante/negocio.
- Card con direccion de entrega.
- Resumen de productos.
- Boton secundario: “Ver detalle”.
- Boton opcional: “Contactar soporte”.

## Pantalla Extra Opcional: Perfil

Si Stitch permite mas pantallas, agregar una pantalla de perfil.

Debe tener:

- Nombre del cliente.
- Telefono/correo.
- Direcciones guardadas.
- Historial de pedidos.
- Configuracion basica.
- Cerrar sesion futuro.

## Componentes Clave A Diseñar

- Header con ubicacion y carrito.
- Barra de busqueda.
- Bottom navigation.
- Card de restaurante.
- Card de negocio.
- Card de producto.
- Chips de categorias y filtros.
- Botones primarios con color `#0c4635`.
- Botones secundarios tipo outline.
- Carrito flotante inferior.
- Timeline de pedido.
- Estados vacios.
- Badges de “Abierto”, “Cerrado”, “Disponible”, “Activo”.

## Reglas UX

- Mobile-first: disenar primero para pantalla de telefono.
- CTA principal siempre visible en carrito, detalle de producto y checkout.
- El carrito debe ser facil de encontrar desde cualquier pantalla.
- Las cards deben mostrar disponibilidad claramente.
- El usuario debe poder entender en menos de 3 segundos donde buscar comida y como agregar productos.
- Evitar exceso de texto; usar imagenes, badges y precios claros.
- Mantener contraste alto con `#0c4635` para accesibilidad.

## Prompt Corto Para Stitch

Crear un mockup mobile-first para “MesoFood”, una app cliente de delivery tipo PedidosYa. Usar `#0c4635` como color principal, fondo claro calido, cards blancas redondeadas, fotografias de comida, navegacion inferior con Inicio, Buscar, Pedidos y Perfil. Incluir 10 pantallas: Splash, Home, Buscar, Listado de Restaurantes, Detalle de Restaurante, Detalle de Producto, Negocios Activos, Carrito, Checkout y Seguimiento de Pedido. La app permite descubrir restaurantes y negocios activos, ver productos, agregar al carrito, confirmar pedido y seguir el estado. Estilo moderno, confiable, local, rapido y limpio.
