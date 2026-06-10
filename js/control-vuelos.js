// =============================================================================
//  SPACEX FLIGHT CONTROL CENTER
//  Proyecto de Desempeno - SENA Formacion Complementaria 
// =============================================================================


// -----------------------------------------------------------------------------
//  SECCION 1 - ALMACEN DE DATOS
//  Aqui guardamos la lista de lanzamientos y un contador para los IDs
// -----------------------------------------------------------------------------

let lanzamientos = [];   // Array donde se guardan todos los lanzamientos
let contadorId   = 1;    // Numero que sube con cada lanzamiento nuevo


// -----------------------------------------------------------------------------
//  SECCION 2 - FUNCIONES UTILITARIAS
//  Funciones pequenas que se usan en varias partes del codigo
// -----------------------------------------------------------------------------

// Genera un ID unico: SX-2026-001, SX-2026-002, etc.
function generarId() {
    const numero = String(contadorId).padStart(3, "0");
    contadorId = contadorId + 1;
    return "SX-2026-" + numero;
}

// Convierte "2026-06-01T14:30" a "01/06/2026 14:30"
function formatearFecha(fechaTexto) {
    if (!fechaTexto) return "-";
    const fecha    = new Date(fechaTexto);
    const dia      = String(fecha.getDate()).padStart(2, "0");
    const mes      = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio     = fecha.getFullYear();
    const horas    = String(fecha.getHours()).padStart(2, "0");
    const minutos  = String(fecha.getMinutes()).padStart(2, "0");
    return dia + "/" + mes + "/" + anio + " " + horas + ":" + minutos;
}

// Convierte el valor del select al nombre que se ve en la tarjeta
function nombreCohete(tipo) {
    if (tipo === "falcon")       return "FALCON 9";
    if (tipo === "falcon-heavy") return "FALCON HEAVY";
    if (tipo === "starship")     return "STARSHIP";
    return tipo;
}


// -----------------------------------------------------------------------------
//  SECCION 3 - RENDERIZADO DE TARJETAS
//  Lee el array de lanzamientos y dibuja las tarjetas en la pantalla
// -----------------------------------------------------------------------------

function renderizarTarjetas() {
    const grid         = document.getElementById("grid-lanzamientos");
    const estadoVacio  = document.getElementById("estado-vacio");
    const contVisibles = document.getElementById("contador-visibles");
    const contTopbar   = document.getElementById("contador-lanzamientos");

  // 1. Borrar las tarjetas que ya estaban en pantalla
    const tarjetasViejas = grid.querySelectorAll(".organism-launch-card");
    tarjetasViejas.forEach(function(tarjeta) {
        tarjeta.remove();
    });

  // 2. Decidir que lanzamientos mostrar segun el filtro activo
    const botonActivo  = document.querySelector(".atom-btn--filter-active");
    const filtroActual = botonActivo.dataset.filter;

    let lanzamientosFiltrados = [];

    if (filtroActual === "todos") {
    lanzamientosFiltrados = lanzamientos;
    } else {
    lanzamientosFiltrados = lanzamientos.filter(function(l) {
        return l.estado === filtroActual;
    });
    }

  // 3. Mostrar u ocultar el mensaje "No hay lanzamientos"
    if (lanzamientos.length === 0) {
    estadoVacio.style.display = "";      // muestra el mensaje
    } else {
    estadoVacio.style.display = "none";  // lo oculta
    }

  // 4. Crear e insertar una tarjeta por cada lanzamiento filtrado
    lanzamientosFiltrados.forEach(function(lanzamiento) {
    const tarjeta = crearTarjeta(lanzamiento);
    grid.appendChild(tarjeta);
    });

  // 5. Actualizar contadores de texto
    contVisibles.textContent = lanzamientosFiltrados.length + " REGISTROS";
    contTopbar.textContent   = lanzamientos.length;

  // 6. Actualizar el panel de estadisticas
    actualizarEstadisticas();
}


// Crea el elemento HTML de una tarjeta usando createElement (sin innerHTML)
function crearTarjeta(lanzamiento) {

  // Articulo principal
    const article = document.createElement("article");
    article.className        = "organism-launch-card organism-launch-card--" + lanzamiento.estado;
    article.dataset.id       = lanzamiento.id;
    article.dataset.tipo     = lanzamiento.tipo;
    article.dataset.estado   = lanzamiento.estado;

  // Cabecera: ID + badge de estado
    const header = document.createElement("div");
    header.className = "molecule-card-header";

    const spanId = document.createElement("span");
    spanId.className   = "molecule-card-header__id atom-mono";
    spanId.textContent = lanzamiento.id;

    const badge = document.createElement("span");
    badge.className   = "atom-badge atom-badge--" + lanzamiento.estado;
    badge.textContent = lanzamiento.estado.toUpperCase();

    header.appendChild(spanId);
    header.appendChild(badge);

  // Cuerpo: datos del lanzamiento
    const body = document.createElement("div");
    body.className = "molecule-card-body";

    const divNombre = document.createElement("div");
    divNombre.className   = "molecule-card-body__name";
    divNombre.textContent = lanzamiento.nombre;

    const divTipo = document.createElement("div");
    divTipo.className   = "molecule-card-body__type";
    divTipo.textContent = nombreCohete(lanzamiento.tipo);

    const divObjetivo = document.createElement("div");
    divObjetivo.className   = "molecule-card-body__objective";
    divObjetivo.textContent = lanzamiento.objetivo;

    const divFecha = document.createElement("div");
    divFecha.className   = "molecule-card-body__date atom-mono";
    divFecha.textContent = formatearFecha(lanzamiento.fecha);

    body.appendChild(divNombre);
    body.appendChild(divTipo);
    body.appendChild(divObjetivo);
    body.appendChild(divFecha);

  // Pie: botones de accion
    const footer = document.createElement("div");
    footer.className = "molecule-card-footer";

    const btnEditar = document.createElement("button");
    btnEditar.className      = "atom-btn atom-btn--secondary atom-btn--sm";
    btnEditar.dataset.action = "editar";
    btnEditar.dataset.id     = lanzamiento.id;
    btnEditar.textContent    = "EDITAR";

    const btnCancelar = document.createElement("button");
    btnCancelar.className      = "atom-btn atom-btn--danger atom-btn--sm";
    btnCancelar.dataset.action = "cancelar";
    btnCancelar.dataset.id     = lanzamiento.id;
    btnCancelar.textContent    = "CANCELAR";

  // Deshabilitar botones si el lanzamiento ya no esta pendiente
    if (lanzamiento.estado !== "pendiente") {
    btnEditar.disabled   = true;
    btnCancelar.disabled = true;
    }

  // Conectar click de los botones
    btnEditar.addEventListener("click", function() {
    activarEdicion(lanzamiento.id);
    });

    btnCancelar.addEventListener("click", function() {
    cancelarLanzamiento(lanzamiento.id);
    });

    footer.appendChild(btnEditar);
    footer.appendChild(btnCancelar);

  // Ensamblar la tarjeta
    article.appendChild(header);
    article.appendChild(body);
    article.appendChild(footer);

  // Animacion hover (Seccion 4) - se agrega aqui mismo

}


// -----------------------------------------------------------------------------
//  SECCION 4 - ANIMACIONES HOVER
//  Los eventos mouseover y mouseout ya estan dentro de crearTarjeta()
// -----------------------------------------------------------------------------

article.addEventListener("mouseover", function() {
        article.classList.add("is-hovered");
    });

    article.addEventListener("mouseout", function() {
    article.classList.remove("is-hovered");
    });

    return article;
    
// -----------------------------------------------------------------------------
//  SECCION 5 - FORMULARIO: REGISTRO Y EDICION
//  Lee los campos, valida que no esten vacios y guarda el lanzamiento
// -----------------------------------------------------------------------------

function manejarFormulario(evento) {
  evento.preventDefault(); // Evita que la pagina se recargue al enviar

    try {
        // Leer los valores de cada campo
        const nombre    = document.getElementById("input-nombre-serie").value.trim();
        const tipo      = document.getElementById("select-tipo-cohete").value;
        const fecha     = document.getElementById("input-fecha-lanzamiento").value;
        const objetivo  = document.getElementById("input-objetivo-mision").value.trim();
        const idEdicion = document.getElementById("input-id-edicion").value;

    // Validar que ningun campo este vacio
    if (nombre === "" || tipo === "" || fecha === "" || objetivo === "") {
        alert("Todos los campos son obligatorios. Por favor completalos.");
      return; // Salir sin guardar
    }

    if (idEdicion !== "") {
      // MODO EDICION: buscar el lanzamiento y actualizarlo
        let i = 0;
        while (i < lanzamientos.length) {
            if (lanzamientos[i].id === idEdicion) {
            lanzamientos[i].nombre   = nombre;
            lanzamientos[i].tipo     = tipo;
            lanzamientos[i].fecha    = fecha;
            lanzamientos[i].objetivo = objetivo;
            break;
        }
        i++;
        }
        salirModoEdicion();

    } else {
      // MODO NUEVO: crear el objeto y agregarlo al array
        const nuevoLanzamiento = {
            id:       generarId(),
            nombre:   nombre,
            tipo:     tipo,
            fecha:    fecha,
            objetivo: objetivo,
            estado:   "pendiente"
        };

        lanzamientos.push(nuevoLanzamiento);
    }

    // Limpiar el formulario y volver a dibujar las tarjetas
    limpiarFormulario();
    renderizarTarjetas();

    } catch (error) {
    console.error("Error en el formulario:", error);
    alert("Ocurrio un error. Revisa la consola con F12.");
    }
}

// Borra todos los campos del formulario
function limpiarFormulario() {
    document.getElementById("input-nombre-serie").value      = "";
    document.getElementById("select-tipo-cohete").value      = "";
    document.getElementById("input-fecha-lanzamiento").value = "";
    document.getElementById("input-objetivo-mision").value   = "";
    document.getElementById("input-id-edicion").value        = "";
}


// -----------------------------------------------------------------------------
//  SECCION 6 - CAMBIOS DE ESTADO
//  Funciones para editar un lanzamiento o cancelarlo
// -----------------------------------------------------------------------------

// Carga los datos de un lanzamiento en el formulario para editarlo
function activarEdicion(id) {
    // Buscar el lanzamiento en el array
    const lanzamiento = lanzamientos.find(function(l) {
        return l.id === id;
    });

    if (!lanzamiento) return;

    // Solo se pueden editar los pendientes
    if (lanzamiento.estado !== "pendiente") {
        alert("Solo se pueden editar lanzamientos PENDIENTES.");
        return;
    }

    // Llenar el formulario con los datos actuales
    document.getElementById("input-nombre-serie").value      = lanzamiento.nombre;
    document.getElementById("select-tipo-cohete").value      = lanzamiento.tipo;
    document.getElementById("input-fecha-lanzamiento").value = lanzamiento.fecha;
    document.getElementById("input-objetivo-mision").value   = lanzamiento.objetivo;
    document.getElementById("input-id-edicion").value        = lanzamiento.id;

    // Cambiar texto del boton y mostrar "Cancelar edicion"
    document.getElementById("btn-registrar").textContent = "GUARDAR CAMBIOS";
    document.getElementById("btn-cancelar-edicion").style.display = "inline-flex";
    }

    // Restaura el formulario a su estado inicial
    function salirModoEdicion() {
    limpiarFormulario();
    document.getElementById("btn-registrar").textContent = "REGISTRAR LANZAMIENTO";
    document.getElementById("btn-cancelar-edicion").style.display = "none";
    }

    // Cambia el estado de un lanzamiento a "cancelado"
    function cancelarLanzamiento(id) {
    const lanzamiento = lanzamientos.find(function(l) {
        return l.id === id;
    });

    if (!lanzamiento) return;

    if (lanzamiento.estado !== "pendiente") {
        alert("Solo se pueden cancelar lanzamientos PENDIENTES.");
        return;
    }

    const confirmar = confirm("Confirmas la cancelacion del vuelo " + id + "?");
    if (!confirmar) return;

    lanzamiento.estado = "cancelado";
    renderizarTarjetas();
    }


// -----------------------------------------------------------------------------
//  SECCION 7 - FILTRADO POR ESTADO
//  Muestra u oculta tarjetas segun el boton de filtro que se presione
// -----------------------------------------------------------------------------

    function inicializarFiltros() {
    const botones = document.querySelectorAll("#grupo-filtros [data-filter]");

    botones.forEach(function(boton) {
        boton.addEventListener("click", function() {

        // Quitar la clase activa de todos los botones
        botones.forEach(function(btn) {
            btn.classList.remove("atom-btn--filter-active");
        });

        // Poner la clase activa solo en el boton presionado
        boton.classList.add("atom-btn--filter-active");

        // Volver a dibujar las tarjetas con el nuevo filtro
        renderizarTarjetas();
        });
    });
    }


// -----------------------------------------------------------------------------
//  SECCION 8 - RELOJ Y MONITOREO AUTOMATICO
//  Cada segundo: actualiza la hora UTC y revisa si algun vuelo ya se lanzo
// -----------------------------------------------------------------------------

    function iniciarReloj() {
    setInterval(function() {

        // Tarea A: mostrar la hora UTC actual
        const ahora    = new Date();
        const horas    = String(ahora.getUTCHours()).padStart(2, "0");
        const minutos  = String(ahora.getUTCMinutes()).padStart(2, "0");
        const segundos = String(ahora.getUTCSeconds()).padStart(2, "0");

        document.getElementById("reloj-principal").textContent =
        horas + ":" + minutos + ":" + segundos + "Z";

        // Tarea B: detectar lanzamientos cuya fecha ya paso
        let huboCambio = false;

        lanzamientos.forEach(function(lanzamiento) {
        if (lanzamiento.estado === "pendiente") {
            const fechaProgramada = new Date(lanzamiento.fecha);

            if (ahora >= fechaProgramada) {
            lanzamiento.estado = "lanzado";
            huboCambio = true;
            }
        }
        });

        // Solo redibujar si algo cambio
        if (huboCambio) {
        renderizarTarjetas();
        }

    }, 1000); // cada 1000 milisegundos = 1 segundo
    }


// -----------------------------------------------------------------------------
//  SECCION 9 - ESTADISTICAS
//  Cuenta los lanzamientos por estado y los muestra en el panel
// -----------------------------------------------------------------------------

function actualizarEstadisticas() {
    let pendientes = 0;
    let lanzados   = 0;
    let cancelados = 0;

    lanzamientos.forEach(function(l) {
        if (l.estado === "pendiente")  pendientes = pendientes + 1;
        if (l.estado === "lanzado")    lanzados   = lanzados   + 1;
        if (l.estado === "cancelado")  cancelados = cancelados + 1;
    });

    document.getElementById("stat-pendientes").textContent = pendientes;
    document.getElementById("stat-lanzados").textContent   = lanzados;
    document.getElementById("stat-cancelados").textContent = cancelados;
    document.getElementById("stat-total").textContent      = lanzamientos.length;
    }


// -----------------------------------------------------------------------------
//  SECCION 10 - INICIALIZACION
//  Todo esto se ejecuta cuando la pagina termino de cargar completamente
// -----------------------------------------------------------------------------

    document.addEventListener("DOMContentLoaded", function() {

    // Ocultar el boton "Cancelar Edicion" al arrancar la app
    document.getElementById("btn-cancelar-edicion").style.display = "none";

    // Conectar el formulario al evento submit
    document.getElementById("form-lanzamiento").addEventListener("submit", manejarFormulario);

    // Conectar el boton "Cancelar Edicion"
    document.getElementById("btn-cancelar-edicion").addEventListener("click", salirModoEdicion);

    // Activar los botones de filtro
    inicializarFiltros();

    // Arrancar el reloj y el monitor automatico
    iniciarReloj();

    // Primer dibujo de tarjetas y estadisticas
    renderizarTarjetas();
    actualizarEstadisticas();

    });