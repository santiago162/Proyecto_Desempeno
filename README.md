# SpaceX Flight Control Center
## Proyecto de Desempeño · SENA 3406211

---

## Descripción

Herramienta web para el registro y monitoreo en tiempo real de lanzamientos espaciales de SpaceX. La interfaz está construida; el aprendiz debe implementar toda la lógica JavaScript para que la aplicación sea funcional.

---

## Estructura del Proyecto

```
Proyecto_Desempeno/
├── spacex_control_vuelos.html   ← Interfaz de usuario  (NO modificar)
├── css/
│   └── styles-vuelos.css        ← Estilos             (NO modificar)
├── js/
│   └── control-vuelos.js        ← ✏️  Tu código va aquí
├── ENUNCIADO.md                 ← Enunciado y rúbrica
└── README.md                    ← Este archivo
```

---

## Cómo Ejecutar

1. Abre `spacex_control_vuelos.html` directamente en Chrome o Firefox.
2. No se requiere servidor, instalación ni configuración adicional.
3. Activa las herramientas de desarrollo con **F12** → pestaña **Console** para depurar.

---

## Archivo a Implementar

Completa el archivo `js/control-vuelos.js`. Está dividido en **10 secciones** con comentarios que indican qué debes implementar en cada una. Trabaja las secciones en orden.

---

## IDs Disponibles en el HTML

Usa estos IDs para acceder a los elementos desde JavaScript.

| ID | Elemento HTML | Para qué sirve |
|---|---|---|
| `reloj-principal` | `<span>` | Mostrar la hora UTC actualizada |
| `contador-lanzamientos` | `<span>` | Total de vuelos (topbar) |
| `form-lanzamiento` | `<form>` | Capturar el evento `submit` |
| `input-nombre-serie` | `<input text>` | Leer el nombre de la serie |
| `select-tipo-cohete` | `<select>` | Leer el tipo de cohete seleccionado |
| `input-fecha-lanzamiento` | `<input datetime-local>` | Leer la fecha y hora programada |
| `input-objetivo-mision` | `<input text>` | Leer el objetivo de la misión |
| `input-id-edicion` | `<input hidden>` | ID del registro en modo edición |
| `btn-registrar` | `<button submit>` | Botón principal del formulario |
| `btn-cancelar-edicion` | `<button>` | Salir del modo edición |
| `stat-pendientes` | `<span>` | Mostrar conteo de pendientes |
| `stat-lanzados` | `<span>` | Mostrar conteo de lanzados |
| `stat-cancelados` | `<span>` | Mostrar conteo de cancelados |
| `stat-total` | `<span>` | Mostrar total general |
| `grupo-filtros` | `<div>` | Contenedor de botones de filtro |
| `contador-visibles` | `<span>` | Cantidad de tarjetas visibles |
| `grid-lanzamientos` | `<div>` | Contenedor principal de tarjetas |
| `estado-vacio` | `<div>` | Mensaje de lista vacía |

---

## Estructura de una Tarjeta

Cada tarjeta que insertes en `#grid-lanzamientos` debe tener esta estructura:

```html
<article class="organism-launch-card organism-launch-card--[estado]"
         data-id="[id]"
         data-tipo="[tipo]"
         data-estado="[estado]">

  <div class="molecule-card-header">
    <span class="molecule-card-header__id atom-mono">[ID]</span>
    <span class="atom-badge atom-badge--[estado]">[ESTADO EN MAYÚSCULAS]</span>
  </div>

  <div class="molecule-card-body">
    <div class="molecule-card-body__name">[NOMBRE SERIE]</div>
    <div class="molecule-card-body__type">[TIPO DE COHETE]</div>
    <div class="molecule-card-body__objective">[OBJETIVO]</div>
    <div class="molecule-card-body__date atom-mono">[FECHA Y HORA]</div>
  </div>

  <div class="molecule-card-footer">
    <button class="atom-btn atom-btn--secondary atom-btn--sm"
            data-action="editar"
            data-id="[id]">EDITAR</button>
    <button class="atom-btn atom-btn--danger atom-btn--sm"
            data-action="cancelar"
            data-id="[id]">CANCELAR</button>
  </div>

</article>
```

Reemplaza `[estado]`, `[id]`, `[tipo]` y los demás campos con los valores reales de cada lanzamiento.

---

## Clases CSS para las Tarjetas

| Clase | Descripción |
|---|---|
| `organism-launch-card` | Clase base obligatoria en toda tarjeta |
| `organism-launch-card--pendiente` | Modificador visual: estado pendiente |
| `organism-launch-card--lanzado` | Modificador visual: estado lanzado |
| `organism-launch-card--cancelado` | Modificador visual: estado cancelado |
| `is-hovered` | Activa la animación hover (agregar en `mouseover`, quitar en `mouseout`) |
| `atom-badge--pendiente` | Badge color ámbar |
| `atom-badge--lanzado` | Badge color azul |
| `atom-badge--cancelado` | Badge color rojo |

---

## Atributos `data-` en las Tarjetas

| Atributo | Valor | Para qué sirve |
|---|---|---|
| `data-id` | ID del lanzamiento | Identificar el registro al editar o cancelar |
| `data-tipo` | `falcon` · `falcon-heavy` · `starship` | El CSS colorea el tipo según este valor |
| `data-estado` | `pendiente` · `lanzado` · `cancelado` | El filtrado lee este atributo |

---

## Atributo `data-filter` en los Botones de Filtro

Los botones del grupo `#grupo-filtros` ya tienen este atributo definido en el HTML:

| Botón | `data-filter` |
|---|---|
| TODOS | `todos` |
| PENDIENTE | `pendiente` |
| LANZADO | `lanzado` |
| CANCELADO | `cancelado` |

Clase CSS del botón activo: `atom-btn--filter-active`

---

## Modelo del Objeto Lanzamiento (sugerido)

```javascript
{
  id:       "SX-2026-001",         // String — identificador único generado
  nombre:   "STARLINK-GROUP-9-1",  // String — nombre de la serie
  tipo:     "falcon",              // String — falcon | falcon-heavy | starship
  fecha:    "2026-05-30T14:30",    // String — valor del input datetime-local
  objetivo: "Despliegue Starlink", // String — descripción del objetivo
  estado:   "pendiente"            // String — pendiente | lanzado | cancelado
}
```

---

## Conceptos Evaluados

| Unidad | Tema |
|---|---|
| 1 | Variables: `const`, `let` |
| 2 | Tipos de datos: strings, numbers, booleans |
| 3 | Estructuras: arrays de objetos |
| 4 | Operadores: comparación, lógicos, ternario |
| 5 | Funciones, arrow functions, `forEach`, `filter`, `find` |
| 6 | `if/else`, `try/catch` |
| 7 | DOM, eventos, `setInterval` |

---

## Consejo de Depuración

Usa la consola del navegador (F12) para verificar el estado de tu almacén de datos en cualquier momento. Un `console.log` estratégico en cada función te ayudará a rastrear errores antes de que aparezcan en la interfaz.
