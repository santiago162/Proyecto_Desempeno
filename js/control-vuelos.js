// =============================================================================
//  SPACEX FLIGHT CONTROL CENTER
//  Archivo: js/control-vuelos.js
//  Proyecto de Desempeno - SENA 3406211
// =============================================================================


// -----------------------------------------------------------------------------
//  SECCION 1 - ALMACEN DE DATOS
//  Aqui guardamos todos los lanzamientos y variables que necesita la app
// -----------------------------------------------------------------------------

    // Lista donde se guardan todos los lanzamientos registrados
    let lanzamientos = [];

    // Numero que usamos para crear IDs unicos (SX-2026-001, SX-2026-002, etc.)
    let numeroId = 1;

    // Guarda que filtro esta activo ahora mismo
    let filtroActual = "todos";


    // -----------------------------------------------------------------------------
    //  SECCION 2 - FUNCIONES UTILITARIAS
    //  Funciones pequenas que usamos varias veces en el codigo
    // -----------------------------------------------------------------------------

    // Genera un ID unico para cada lanzamiento, ejemplo: SX-2026-001
    function generarId() {
    let anio    = new Date().getFullYear();           // Obtiene el ano actual
    let numero  = String(numeroId).padStart(3, "0"); // Convierte 1 en "001", 2 en "002"...
    numeroId    = numeroId + 1;                       // Aumenta para el siguiente registro
    return "SX-" + anio + "-" + numero;             // Devuelve algo como "SX-2026-001"
    }

    // Convierte el valor interno del cohete al nombre visible en pantalla
    function nombreCohete(tipo) {
    if (tipo === "falcon")       return "FALCON 9";
    if (tipo === "falcon-heavy") return "FALCON HEAVY";
    if (tipo === "starship")     return "STARSHIP";
    return tipo.toUpperCase();
    }

    // Convierte una fecha "2026-05-30T14:30" a formato legible "30/05/2026, 14:30"
    function formatearFecha(fechaStr) {
    if (!fechaStr) return "Sin fecha";
    let fecha = new Date(fechaStr);
    return fecha.toLocaleString("es-CO", {
        day:    "2-digit",
        month:  "2-digit",
        year:   "numeric",
        hour:   "2-digit",
        minute: "2-digit",
        hour12: false
    });
    }


    // -----------------------------------------------------------------------------
    //  SECCION 3 - RENDERIZADO DE TARJETAS
    //  Lee el almacen y dibuja las tarjetas en pantalla
    // -----------------------------------------------------------------------------

    // Dibuja todas las tarjetas en el grid segun el filtro activo
    function renderizarTarjetas() {

    // Obtenemos los elementos del HTML que necesitamos
    let grid         = document.getElementById("grid-lanzamientos");
    let estadoVacio  = document.getElementById("estado-vacio");
    let contVisibles = document.getElementById("contador-visibles");
    let contTopbar   = document.getElementById("contador-lanzamientos");

    // Borramos las tarjetas que ya estaban en pantalla para redibujar
    let tarjetasViejas = grid.querySelectorAll(".organism-launch-card");
    tarjetasViejas.forEach(function(tarjeta) {
        tarjeta.remove();
    });

    // Filtramos los lanzamientos segun el boton activo
    let lanzamientosFiltrados = [];

    if (filtroActual === "todos") {
        // Si el filtro es "todos", mostramos todos
        lanzamientosFiltrados = lanzamientos;
    } else {
        // Si no, mostramos solo los que coincidan con el estado seleccionado
        lanzamientosFiltrados = lanzamientos.filter(function(l) {
        return l.estado === filtroActual;
        });
    }

    // Creamos y agregamos una tarjeta por cada lanzamiento filtrado
    lanzamientosFiltrados.forEach(function(lanzamiento) {
        let tarjeta = crearTarjeta(lanzamiento);
        grid.appendChild(tarjeta);
    });

    // Mostramos el mensaje vacio solo si el almacen no tiene ningun registro
    if (lanzamientos.length === 0) {
        estadoVacio.style.display = "flex";
    } else {
        estadoVacio.style.display = "none";
    }

    // Actualizamos el contador de registros visibles (abajo del filtro)
    let cantidad = lanzamientosFiltrados.length;
    contVisibles.textContent = cantidad + " REGISTROS";

    // Actualizamos el contador de vuelos activos en la barra superior
    let activos = lanzamientos.filter(function(l) {
        return l.estado === "pendiente" || l.estado === "lanzado";
    }).length;
    contTopbar.textContent = activos;

    // Actualizamos el panel de estadisticas
    actualizarEstadisticas();
    }

    // Crea una tarjeta HTML a partir de un objeto lanzamiento
    // Usa createElement para construir cada parte de la tarjeta (requerido por la rubrica)
    function crearTarjeta(lanzamiento) {

    // ── Elemento principal: <article> ──
    let article = document.createElement("article");
    article.className = "organism-launch-card organism-launch-card--" + lanzamiento.estado;
    article.setAttribute("data-id",     lanzamiento.id);
    article.setAttribute("data-tipo",   lanzamiento.tipo);
    article.setAttribute("data-estado", lanzamiento.estado);

    // ── Encabezado: muestra el ID y el badge de estado ──
    let header = document.createElement("div");
    header.className = "molecule-card-header";

    let spanId = document.createElement("span");
    spanId.className = "molecule-card-header__id atom-mono";
    spanId.textContent = lanzamiento.id;

    let badge = document.createElement("span");
    badge.className = "atom-badge atom-badge--" + lanzamiento.estado;
    badge.textContent = lanzamiento.estado.toUpperCase();

    header.appendChild(spanId);
    header.appendChild(badge);

    // ── Cuerpo: nombre, tipo de cohete, objetivo y fecha ──
    let body = document.createElement("div");
    body.className = "molecule-card-body";

    let divNombre = document.createElement("div");
    divNombre.className = "molecule-card-body__name";
    divNombre.textContent = lanzamiento.nombre;

    let divTipo = document.createElement("div");
    divTipo.className = "molecule-card-body__type";
    divTipo.textContent = nombreCohete(lanzamiento.tipo);

    let divObjetivo = document.createElement("div");
    divObjetivo.className = "molecule-card-body__objective";
    divObjetivo.textContent = lanzamiento.objetivo;

    let divFecha = document.createElement("div");
    divFecha.className = "molecule-card-body__date atom-mono";
    divFecha.textContent = formatearFecha(lanzamiento.fecha);

    body.appendChild(divNombre);
    body.appendChild(divTipo);
    body.appendChild(divObjetivo);
    body.appendChild(divFecha);

    // ── Pie: botones EDITAR y CANCELAR ──
    let footer = document.createElement("div");
    footer.className = "molecule-card-footer";

    let btnEditar = document.createElement("button");
    btnEditar.className = "atom-btn atom-btn--secondary atom-btn--sm";
    btnEditar.setAttribute("data-action", "editar");
    btnEditar.setAttribute("data-id", lanzamiento.id);
    btnEditar.textContent = "EDITAR";

    let btnCancelar = document.createElement("button");
    btnCancelar.className = "atom-btn atom-btn--danger atom-btn--sm";
    btnCancelar.setAttribute("data-action", "cancelar");
    btnCancelar.setAttribute("data-id", lanzamiento.id);
    btnCancelar.textContent = "CANCELAR";

    // Si el lanzamiento NO esta pendiente, deshabilitamos los botones
    if (lanzamiento.estado !== "pendiente") {
        btnEditar.disabled        = true;
        btnCancelar.disabled      = true;
        btnEditar.style.opacity   = "0.4";
        btnCancelar.style.opacity  = "0.4";
        btnEditar.style.cursor    = "not-allowed";
        btnCancelar.style.cursor   = "not-allowed";
    }

    // Conectamos los eventos click de los botones de la tarjeta
    btnEditar.addEventListener("click", function() {
        editarLanzamiento(lanzamiento.id);
    });

    btnCancelar.addEventListener("click", function() {
        cancelarLanzamiento(lanzamiento.id);
    });

    footer.appendChild(btnEditar);
    footer.appendChild(btnCancelar);

    // ── Ensamblamos la tarjeta completa ──
    article.appendChild(header);
    article.appendChild(body);
    article.appendChild(footer);

    // ── SECCION 4: Eventos de animacion hover ──
    // mouseover: cuando el cursor entra a la tarjeta, agregamos la clase is-hovered
    article.addEventListener("mouseover", function() {
        article.classList.add("is-hovered");
    });

    // mouseout: cuando el cursor sale de la tarjeta, quitamos la clase is-hovered
    article.addEventListener("mouseout", function() {
        article.classList.remove("is-hovered");
    });

    return article;
    }


    // -----------------------------------------------------------------------------
    //  SECCION 5 - FORMULARIO: REGISTRO Y EDICION
    //  Maneja el envio del formulario para crear o actualizar lanzamientos
    // -----------------------------------------------------------------------------

    // Se ejecuta cuando el usuario hace clic en "REGISTRAR LANZAMIENTO" o "GUARDAR CAMBIOS"
    function manejarFormulario(evento) {

    // Evitamos que la pagina se recargue (comportamiento por defecto del form)
    evento.preventDefault();

    try {

        // Leemos los valores de cada campo del formulario
        let nombre    = document.getElementById("input-nombre-serie").value.trim();
        let tipo      = document.getElementById("select-tipo-cohete").value;
        let fecha     = document.getElementById("input-fecha-lanzamiento").value;
        let objetivo  = document.getElementById("input-objetivo-mision").value.trim();
        let idEdicion = document.getElementById("input-id-edicion").value;

        // Validamos que ningun campo este vacio
        if (nombre === "" || tipo === "" || fecha === "" || objetivo === "") {
        alert("Todos los campos son obligatorios. Por favor, completa el formulario.");
        return; // Detenemos la funcion si hay campos vacios
        }

        // Si idEdicion tiene valor, estamos EDITANDO; si esta vacio, estamos CREANDO
        if (idEdicion !== "") {

        // MODO EDICION: buscamos el lanzamiento y actualizamos sus datos
        for (let i = 0; i < lanzamientos.length; i++) {
            if (lanzamientos[i].id === idEdicion) {
            lanzamientos[i].nombre   = nombre;
            lanzamientos[i].tipo     = tipo;
            lanzamientos[i].fecha    = fecha;
            lanzamientos[i].objetivo = objetivo;
            break; // Salimos del bucle al encontrar el registro
            }
        }

        salirModoEdicion(); // Restauramos el formulario al modo normal

        } else {

        // MODO REGISTRO: creamos el objeto del nuevo lanzamiento
        let nuevoLanzamiento = {
            id:       generarId(),  // ID unico generado automaticamente
            nombre:   nombre,
            tipo:     tipo,
            fecha:    fecha,
            objetivo: objetivo,
            estado:   "pendiente"   // Todo lanzamiento nuevo empieza como pendiente
        };

        // Agregamos el nuevo lanzamiento al almacen
        lanzamientos.push(nuevoLanzamiento);
        }

        // Limpiamos el formulario y redibujamos las tarjetas
        limpiarFormulario();
        renderizarTarjetas();

    } catch (error) {
        // Si ocurre un error inesperado, lo mostramos en la consola y alertamos al usuario
        console.error("Error en el formulario:", error);
        alert("Ocurrio un error inesperado. Abre la consola con F12 para ver el detalle.");
    }
    }

    // Limpia todos los campos del formulario
    function limpiarFormulario() {
    document.getElementById("input-nombre-serie").value      = "";
    document.getElementById("select-tipo-cohete").value      = "";
    document.getElementById("input-fecha-lanzamiento").value = "";
    document.getElementById("input-objetivo-mision").value   = "";
    document.getElementById("input-id-edicion").value        = "";
    }

    // Restaura el formulario al modo registro (sale del modo edicion)
    function salirModoEdicion() {
    document.getElementById("input-id-edicion").value        = "";
    document.getElementById("btn-registrar").textContent     = "REGISTRAR LANZAMIENTO";
    document.getElementById("btn-cancelar-edicion").style.display = "none";
    limpiarFormulario();
    }


    // -----------------------------------------------------------------------------
    //  SECCION 6 - CAMBIOS DE ESTADO
    //  Editar y cancelar lanzamientos
    // -----------------------------------------------------------------------------

    // Carga los datos de un lanzamiento en el formulario para que el usuario los edite
    function editarLanzamiento(id) {

    // Buscamos el lanzamiento en el almacen usando su ID
    let lanzamiento = null;
    for (let i = 0; i < lanzamientos.length; i++) {
        if (lanzamientos[i].id === id) {
        lanzamiento = lanzamientos[i];
        break;
        }
    }

    // Si no encontramos el lanzamiento, salimos
    if (!lanzamiento) return;

    // Solo se pueden editar lanzamientos con estado PENDIENTE
    if (lanzamiento.estado !== "pendiente") {
        alert("Solo se pueden editar lanzamientos con estado PENDIENTE.");
        return;
    }

    // Cargamos los datos del lanzamiento en los campos del formulario
    document.getElementById("input-nombre-serie").value      = lanzamiento.nombre;
    document.getElementById("select-tipo-cohete").value      = lanzamiento.tipo;
    document.getElementById("input-fecha-lanzamiento").value = lanzamiento.fecha;
    document.getElementById("input-objetivo-mision").value   = lanzamiento.objetivo;
    document.getElementById("input-id-edicion").value        = lanzamiento.id;

    // Cambiamos el boton de "Registrar" a "Guardar cambios" y mostramos "Cancelar edicion"
    document.getElementById("btn-registrar").textContent     = "GUARDAR CAMBIOS";
    document.getElementById("btn-cancelar-edicion").style.display = "block";

    // Hacemos scroll al formulario para que el usuario lo vea
    document.getElementById("form-lanzamiento").scrollIntoView({ behavior: "smooth" });
    }

    // Cambia el estado de un lanzamiento a "cancelado"
    function cancelarLanzamiento(id) {

    // Buscamos el lanzamiento en el almacen
    let lanzamiento = null;
    for (let i = 0; i < lanzamientos.length; i++) {
        if (lanzamientos[i].id === id) {
        lanzamiento = lanzamientos[i];
        break;
        }
    }

    // Si no existe, salimos
    if (!lanzamiento) return;

    // Solo se pueden cancelar lanzamientos con estado PENDIENTE
    if (lanzamiento.estado !== "pendiente") {
        alert("Solo se pueden cancelar lanzamientos con estado PENDIENTE.");
        return;
    }

    // Pedimos confirmacion al usuario antes de cancelar
    let confirmar = confirm("Confirmas la cancelacion del lanzamiento " + id + "?");
    if (!confirmar) return;

    // Cambiamos el estado a cancelado y redibujamos
    lanzamiento.estado = "cancelado";
    renderizarTarjetas();
    }


    // -----------------------------------------------------------------------------
    //  SECCION 7 - FILTRADO POR ESTADO
    //  Muestra u oculta tarjetas segun el boton de filtro que se presione
    // -----------------------------------------------------------------------------

    // Se ejecuta cuando el usuario hace clic en un boton de filtro
    function aplicarFiltro(filtro) {

    // Guardamos cual filtro esta activo
    filtroActual = filtro;

    // Quitamos la clase activa de TODOS los botones de filtro
    let botones = document.querySelectorAll("#grupo-filtros .atom-btn--filter");
    botones.forEach(function(btn) {
        btn.classList.remove("atom-btn--filter-active");
    });

    // Ponemos la clase activa SOLO en el boton que se presiono
    let btnActivo = document.querySelector("#grupo-filtros [data-filter='" + filtro + "']");
    if (btnActivo) {
        btnActivo.classList.add("atom-btn--filter-active");
    }

    // Redibujamos las tarjetas con el nuevo filtro aplicado
    renderizarTarjetas();
    }


    // -----------------------------------------------------------------------------
    //  SECCION 8 - RELOJ Y MONITOREO AUTOMATICO
    //  Se ejecuta cada segundo: actualiza el reloj y detecta lanzamientos cumplidos
    // -----------------------------------------------------------------------------

    // Actualiza el reloj UTC en la barra superior con formato HH:MM:SSZ
    function actualizarReloj() {
    let ahora    = new Date();
    let horas    = String(ahora.getUTCHours()).padStart(2, "0");   // "08" en vez de "8"
    let minutos  = String(ahora.getUTCMinutes()).padStart(2, "0");
    let segundos = String(ahora.getUTCSeconds()).padStart(2, "0");

    document.getElementById("reloj-principal").textContent = horas + ":" + minutos + ":" + segundos + "Z";
    }

    // Revisa si algun lanzamiento pendiente ya paso su fecha programada
    // Si ya paso, lo cambia automaticamente a "lanzado"
    function monitorearLanzamientos() {
    let ahora = new Date();
    let huboCambios = false;

    for (let i = 0; i < lanzamientos.length; i++) {
        let l = lanzamientos[i];

        // Solo revisamos los que estan pendientes
        if (l.estado === "pendiente") {

        let fechaProgramada = new Date(l.fecha); // Convertimos el string a fecha real

        // Si la fecha ya paso o es este momento, cambiamos a lanzado
        if (fechaProgramada <= ahora) {
            l.estado    = "lanzado";
            huboCambios = true;
        }
        }
    }

    // Solo redibujamos si hubo algun cambio (para no gastar recursos)
    if (huboCambios) {
        renderizarTarjetas();
    }
    }


    // -----------------------------------------------------------------------------
    //  SECCION 9 - ESTADISTICAS
    //  Cuenta los lanzamientos por estado y actualiza el panel
    // -----------------------------------------------------------------------------

    function actualizarEstadisticas() {

    // Contamos cuantos hay de cada estado recorriendo el almacen
    let pendientes = 0;
    let lanzados   = 0;
    let cancelados = 0;

    for (let i = 0; i < lanzamientos.length; i++) {
        if (lanzamientos[i].estado === "pendiente")  pendientes = pendientes + 1;
        if (lanzamientos[i].estado === "lanzado")    lanzados   = lanzados   + 1;
        if (lanzamientos[i].estado === "cancelado")  cancelados = cancelados + 1;
    }

    let total = lanzamientos.length;

    // Actualizamos los elementos del panel de estadisticas
    document.getElementById("stat-pendientes").textContent = pendientes;
    document.getElementById("stat-lanzados").textContent   = lanzados;
    document.getElementById("stat-cancelados").textContent = cancelados;
    document.getElementById("stat-total").textContent      = total;
    }


    // -----------------------------------------------------------------------------
    //  SECCION 10 - INICIALIZACION
    //  Todo arranca aqui cuando la pagina termina de cargar
    // -----------------------------------------------------------------------------

    document.addEventListener("DOMContentLoaded", function() {

    // 1. Conectamos el formulario: cuando se envie, llama a manejarFormulario
    document.getElementById("form-lanzamiento").addEventListener("submit", manejarFormulario);

    // 2. Ocultamos el boton "Cancelar edicion" (solo aparece en modo edicion)
    document.getElementById("btn-cancelar-edicion").style.display = "none";

    // 3. Conectamos el boton "Cancelar edicion" para restaurar el formulario
    document.getElementById("btn-cancelar-edicion").addEventListener("click", function() {
        salirModoEdicion();
    });

    // 4. Conectamos los botones de filtro
    let botonesFiltro = document.querySelectorAll("#grupo-filtros [data-filter]");
    botonesFiltro.forEach(function(btn) {
        btn.addEventListener("click", function() {
        aplicarFiltro(btn.getAttribute("data-filter"));
        });
    });

    // 5. Primer renderizado inicial (lista vacia)
    renderizarTarjetas();

    // 6. Llamada inmediata para que el reloj no empiece mostrando "--:--:--Z"
    actualizarReloj();
    monitorearLanzamientos();

    // 7. Iniciamos el intervalo: cada 1 segundo actualizamos el reloj y el monitor
    setInterval(function() {
        actualizarReloj();
        monitorearLanzamientos();
    }, 1000);

    console.log("Sistema SpaceX iniciado correctamente.");

    });