# 🤖 SKILL: Generar Historial de Sesión

**Comando de activación:** "Genera el historial de la sesión"  
**Ubicación de archivos:** `/context/history/`  
**Formato de nombre:** `avance-DDMM.md` (ejemplo: `avance-0704.md`)

---

## 📋 Propósito

Este skill permite generar automáticamente un archivo Markdown que documenta el progreso y los avances realizados durante una sesión de trabajo en el proyecto app-empresas.

---

## 🎯 Comportamiento Esperado

Cuando el usuario escriba **"Genera el historial de la sesión"**, debes:

1. ✅ Obtener la fecha actual en formato DDMM
2. ✅ Crear archivo en: `/home/lufi/programacion/mesoquick_frontend_workspace/apps/app-empresas/context/history/avance-DDMM.md`
3. ✅ Si el archivo ya existe, agregar una sección nueva al final con timestamp
4. ✅ Documentar todo lo realizado en la sesión actual

---

## 📝 Estructura del Archivo

```markdown
# Avance de Sesión - DD/MM/YYYY

**Fecha:** DD/MM/YYYY  
**Hora inicio:** HH:MM  
**Hora fin:** HH:MM  
**Duración:** X horas

---

## 📋 Resumen Ejecutivo

[Breve descripción de 2-3 líneas sobre lo realizado en la sesión]

---

## ✅ Tareas Completadas

### 1. [Nombre de la tarea]
- **Descripción:** [Qué se hizo]
- **Archivos creados/modificados:**
  - `ruta/al/archivo.ext`
- **Resultado:** [Qué funciona ahora]

### 2. [Otra tarea]
...

---

## 📁 Archivos Creados

- `path/to/file1.ts` - Descripción breve
- `path/to/file2.tsx` - Descripción breve

---

## 🔧 Archivos Modificados

- `path/to/modified.ts` - Cambios realizados
- `path/to/another.tsx` - Cambios realizados

---

## 🚀 Funcionalidades Implementadas

- [x] Feature 1
- [x] Feature 2
- [ ] Feature pendiente (si aplica)

---

## 🐛 Issues Encontrados y Resueltos

### Issue 1: [Título del problema]
- **Problema:** Descripción del error
- **Solución:** Cómo se resolvió
- **Archivos afectados:** Lista de archivos

---

## 📝 Notas y Observaciones

- Nota importante 1
- Nota importante 2
- Decisiones técnicas tomadas

---

## 🎯 Próximos Pasos

1. [ ] Tarea pendiente 1
2. [ ] Tarea pendiente 2
3. [ ] Tarea pendiente 3

---

## 🔗 Referencias

- Links a documentación consultada
- PRs o commits relevantes (si aplica)
- Recursos externos utilizados

---

**Última actualización:** DD/MM/YYYY HH:MM
```

---

## 🔍 Ejemplo de Uso

**Usuario escribe:**
```
Genera el historial de la sesión
```

**Sistema responde:**
```
✅ Historial generado: /context/history/avance-0704.md

Resumen de la sesión:
- Análisis completo de arquitectura
- Documentación de endpoints API
- Definición de flujo de páginas
- 3 archivos de documentación creados

¿Deseas revisar el archivo generado?
```

---

## ⚙️ Reglas de Generación

### Si es la primera sesión del día:
- Crear archivo nuevo: `avance-DDMM.md`
- Usar estructura completa

### Si ya existe el archivo:
- Agregar sección nueva al final
- Usar header: `## 🕐 Sesión [HH:MM - HH:MM]`
- Mantener estructura pero como subsecciones

### Formato de fecha:
- DDMM para nombre de archivo (ej: `avance-0704.md`)
- DD/MM/YYYY en el contenido (ej: `07/04/2026`)

---

## 📊 Métricas a Incluir (cuando aplique)

- ✅ Número de archivos creados
- ✅ Número de archivos modificados
- ✅ Líneas de código agregadas (estimado)
- ✅ Features completados
- ✅ Tests agregados (si aplica)
- ✅ Tiempo estimado de trabajo

---

## 🎨 Formato y Estilo

- **Usar emojis** para secciones principales
- **Markdown limpio** y bien estructurado
- **Listas con checkboxes** para tareas
- **Code blocks** para código relevante
- **Links relativos** a archivos del proyecto
- **Timestamps precisos**

---

## 🚫 Qué NO incluir

- ❌ Código completo (solo snippets relevantes)
- ❌ Errores de sintaxis o experimentación fallida
- ❌ Información sensible (tokens, passwords)
- ❌ Conversaciones completas (solo decisiones clave)

---

## 🔄 Versionado

Si hay múltiples sesiones en el mismo día, agregar al mismo archivo con separadores:

```markdown
---

## 🕐 Sesión 2: 14:00 - 16:30

[Contenido de segunda sesión]

---

## 🕐 Sesión 3: 19:00 - 21:00

[Contenido de tercera sesión]
```

---

## ✅ Checklist de Validación

Antes de finalizar el historial, verificar:

- [ ] Fecha y hora correctas
- [ ] Todos los archivos mencionados existen
- [ ] Rutas de archivos son correctas
- [ ] Resumen ejecutivo es claro
- [ ] Próximos pasos están definidos
- [ ] Formato Markdown es válido
- [ ] No hay información sensible

---

## 📚 Archivos Relacionados

- `/context/instruccions/01-ARQUITECTURA-Y-ESTRUCTURA.md`
- `/context/instruccions/02-API-ENDPOINTS-Y-MODELOS.md`
- `/context/instruccions/03-FLUJO-NAVEGACION-Y-PAGINAS.md`

---

**Skill creado:** 07/04/2026  
**Última actualización:** 07/04/2026  
**Versión:** 1.0
