# PROYECTO DE DESEMPEÑO
## Sistema de Control de Vuelos SpaceX
### SENA · Formación Complementaria · Curso 3406211

---

## Contexto

SpaceX opera una flota de vehículos de lanzamiento reutilizables —Falcon 9, Falcon Heavy y Starship— que parten desde distintas plataformas hacia órbitas comerciales, científicas y de exploración. El equipo de operaciones de vuelo necesita una herramienta web para registrar los lanzamientos programados, monitorear su estado en tiempo real y reaccionar cuando las condiciones operativas cambian.

La interfaz de usuario (HTML y CSS) ya está construida. Tu misión es implementar **toda la lógica JavaScript** en el archivo `js/control-vuelos.js` para que la aplicación sea completamente funcional.

---

## Objetivo General

Implementar las funciones JavaScript de una aplicación web de monitoreo de vuelos espaciales, aplicando los conceptos estudiados en las Unidades 1 a 7 del módulo de JavaScript.

---

## Requerimientos Funcionales

### RF-01 · Registro de Lanzamientos

Al completar y enviar el formulario, la aplicación debe registrar un nuevo lanzamiento con los siguientes datos:

| Campo | Descripción |
|---|---|
| Nombre de serie | Identificador textual del vuelo (Ej: `STARLINK-GROUP-9-1`) |
| Tipo de cohete | Selección entre `FALCON 9`, `FALCON HEAVY` o `STARSHIP` |
| Fecha y hora | Fecha y hora programada para el lanzamiento |
| Objetivo de misión | Descripción del propósito del vuelo |

El sistema debe asignar automáticamente un **identificador único** a cada registro. El estado inicial de todo lanzamiento registrado es **PENDIENTE**.

> Si algún campo está vacío, el registro no debe completarse y el usuario debe ser informado.

---

### RF-02 · Edición de Lanzamientos

El botón **EDITAR** de cada tarjeta debe cargar los datos del lanzamiento en el formulario para que el usuario pueda modificarlos y guardar los cambios.

> Solo pueden editarse lanzamientos con estado **PENDIENTE**.

---

### RF-03 · Detección Automática: Estado LANZADO

La aplicación debe revisar **continuamente** si la fecha y hora programadas de algún lanzamiento pendiente ya se han alcanzado. Cuando se cumpla la condición, el estado del registro debe cambiar automáticamente a **LANZADO** sin intervención del usuario.

---

### RF-04 · Cancelación de Lanzamientos

El botón **CANCELAR** de cada tarjeta debe cambiar el estado del lanzamiento a **CANCELADO**.

> Solo pueden cancelarse lanzamientos con estado **PENDIENTE**.

---

### RF-05 · Representación en Tarjetas

Cada lanzamiento registrado debe visualizarse como una tarjeta en el grid principal. La tarjeta debe mostrar:

- Identificador único del vuelo
- Nombre de la serie
- Tipo de cohete
- Objetivo de la misión
- Fecha y hora de lanzamiento
- Estado actual (badge de color)
- Botones de acción: **EDITAR** y **CANCELAR**

La estructura exacta de la tarjeta y las clases CSS que debes usar están documentadas en el archivo `spacex_control_vuelos.html`.

---

### RF-06 · Animaciones Hover en Tarjetas

Las tarjetas deben reaccionar visualmente al movimiento del cursor mediante **eventos JavaScript**:

- Evento **`mouseover`**: activa la animación de entrada
- Evento **`mouseout`**: activa la animación de salida

> La animación está definida en el CSS. Para activarla debes agregar o eliminar la clase correspondiente usando JavaScript. No se permite usar la pseudoclase CSS `:hover` como sustituto.

---

### RF-07 · Filtrado por Estado

Los botones de la barra de filtros deben mostrar u ocultar tarjetas según el estado seleccionado:

| Filtro | Comportamiento |
|---|---|
| `TODOS` | Muestra todas las tarjetas |
| `PENDIENTE` | Muestra solo las tarjetas con estado pendiente |
| `LANZADO` | Muestra solo las tarjetas con estado lanzado |
| `CANCELADO` | Muestra solo las tarjetas con estado cancelado |

El botón del filtro activo debe marcarse visualmente. El contador de registros visibles debe actualizarse.

---

### RF-08 · Reloj UTC en Tiempo Real

La topbar muestra un reloj que debe actualizarse **cada segundo** con la hora UTC actual en el formato:

```
HH:MM:SSZ
```

Ejemplo: `14:35:09Z`

---

### RF-09 · Estadísticas

El panel de estadísticas debe mantenerse actualizado después de cada cambio, mostrando el conteo de lanzamientos por estado y el total general.

---

## Requerimientos Técnicos

| Concepto JS | Unidad | Aplicación obligatoria |
|---|---|---|
| `const` y `let` | 1 | Declaración de variables y datos del almacén |
| Tipos de datos primitivos | 2 | Strings para nombres/IDs, Numbers para fechas, Booleans para validaciones |
| Arrays y objetos literales | 3 | Estructura del almacén y modelo de cada lanzamiento |
| Operadores de comparación y lógicos | 4 | Validación de campos y comparación de fechas |
| Operador ternario | 4 | Asignación condicional de clases o valores |
| Funciones declaradas o de flecha | 5 | Organización del código por responsabilidad |
| Métodos de array (`forEach`, `filter`, `find`) | 5 | Iteración para render y filtrado |
| `if / else` | 6 | Condicionales de estado y validación |
| `try / catch` | 6 | Manejo de errores en el formulario |
| `getElementById`, `querySelector`, `createElement` | 7 | Acceso y creación de elementos del DOM |
| `appendChild`, `innerHTML`, `textContent` | 7 | Inserción de contenido en el DOM |
| `addEventListener` | 7 | Conexión de eventos a elementos |
| `classList.add`, `classList.remove`, `classList.toggle` | 7 | Manipulación de clases CSS |
| `setInterval` | 7 | Reloj y monitoreo automático |

---

## Archivo a Entregar

El **único repoisitorio** que debes completar y debe contener los 3 archivos el html, el css y el js:



---

## Rúbrica de Calificación

### 1 · Formulario y Registro &nbsp;— &nbsp;15 puntos

| Criterio | Puntos |
|---|---|
| Al enviar el formulario se crea el objeto del lanzamiento con todos sus campos y se añade al almacén | 6 |
| El estado inicial asignado es `pendiente` y el ID se genera automáticamente | 2 |
| Si un campo está vacío, el registro no se completa y se informa al usuario | 4 |
| Al presionar **EDITAR**, el formulario carga los datos del registro y al enviarlo se actualiza (no se duplica) | 3 |

**Total sección 1: /15**

---

### 2 · Renderizado de Tarjetas DOM &nbsp;— &nbsp;20 puntos

| Criterio | Puntos |
|---|---|
| Las tarjetas se crean programáticamente usando `createElement` o equivalente (no `innerHTML` de toda la tarjeta) | 6 |
| Cada tarjeta muestra correctamente todos los datos del lanzamiento | 5 |
| Las tarjetas tienen los atributos `data-id`, `data-tipo` y `data-estado` | 3 |
| El estado vacío (`#estado-vacio`) se oculta cuando hay tarjetas y se muestra cuando no las hay | 3 |
| Los botones de las tarjetas están conectados y ejecutan la función correcta | 3 |

**Total sección 2: /20**

---

### 3 · Manejo de Estados &nbsp;— &nbsp;20 puntos

| Criterio | Puntos |
|---|---|
| El estado cambia a `lanzado` automáticamente cuando se alcanza la fecha programada | 10 |
| El estado cambia a `cancelado` al presionar el botón correspondiente | 5 |
| Los cambios de estado se reflejan visualmente en la tarjeta (clase CSS y badge) | 5 |

**Total sección 3: /20**

---

### 4 · Eventos y Animaciones Hover &nbsp;— &nbsp;15 puntos

| Criterio | Puntos |
|---|---|
| Se usan `addEventListener` con `mouseover` y `mouseout` en cada tarjeta (no CSS `:hover`) | 8 |
| La animación de entrada es claramente visible al acercar el cursor | 4 |
| La animación de salida es claramente visible al alejar el cursor | 3 |

**Total sección 4: /15**

---

### 5 · Filtrado por Estado &nbsp;— &nbsp;10 puntos

| Criterio | Puntos |
|---|---|
| Cada botón de filtro muestra únicamente las tarjetas del estado correspondiente | 6 |
| El botón activo se marca visualmente con la clase CSS correcta | 2 |
| El contador de registros visibles se actualiza al cambiar el filtro | 2 |

**Total sección 5: /10**

---

### 6 · Reloj y Monitoreo Automático &nbsp;— &nbsp;10 puntos

| Criterio | Puntos |
|---|---|
| El reloj muestra la hora UTC en formato `HH:MM:SSZ` y se actualiza cada segundo | 5 |
| El monitoreo automático detecta fechas cumplidas y aplica el cambio a `lanzado` sin acción del usuario | 5 |

**Total sección 6: /10**

---

### 7 · Estadísticas &nbsp;— &nbsp;5 puntos

| Criterio | Puntos |
|---|---|
| Los cuatro contadores del panel reflejan correctamente los totales por estado y el total general | 5 |

**Total sección 7: /5**

---

### 8 · Calidad del Código &nbsp;— &nbsp;5 puntos

| Criterio | Puntos |
|---|---|
| Se usa `const` o `let`; no aparece `var` en ninguna línea | 1 |
| Se usa al menos un método de array (`forEach`, `filter`, `find` o `map`) | 2 |
| El código está organizado por secciones, usa nombres descriptivos y es legible | 2 |

**Total sección 8: /5**

---

## Resumen de Puntajes

| Sección | Puntos |
|---|---|
| 1 · Formulario y Registro | 15 |
| 2 · Renderizado de Tarjetas | 20 |
| 3 · Manejo de Estados | 20 |
| 4 · Eventos y Animaciones | 15 |
| 5 · Filtrado por Estado | 10 |
| 6 · Reloj y Monitoreo | 10 |
| 7 · Estadísticas | 5 |
| 8 · Calidad del Código | 5 |
| **TOTAL** | **100** |

---

## Escala de Valoración SENA

| Rango | Valoración |
|---|---|
| 91 – 100 | Excelente |
| 80 – 90  | Sobresaliente |
| 65 – 79  | Aceptable |
| 50 – 64  | Insuficiente |
| 0 – 49   | Deficiente |

---

b