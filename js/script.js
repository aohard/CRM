document.addEventListener("DOMContentLoaded", function() {
    openTab(null, 'PorCliente'); // Asegúrate de que esta función esté definida
    ocultarSecciones(); // Ocultar las secciones de cuenta corriente e historial al inicio
});

function mostrarCargando() {
    document.getElementById('cargando').style.display = 'flex';
}

function ocultarCargando() {
    document.getElementById('cargando').style.display = 'none';
}

async function cargarDatosCSV(ruta) {
    try {
        const response = await fetch(ruta);
        if (!response.ok) throw new Error('No se pudo cargar el archivo CSV');
        
        const data = await response.text();
        const rows = data.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        return rows.slice(1);
    } catch (error) {
        console.error('Error al cargar el CSV:', error);
        alert('Hubo un problema al cargar los datos del cliente.');
        return [];
    }
}

async function buscarCliente() {
    mostrarCargando();
    var searchInput = document.getElementById('searchInput').value;
    if (searchInput.trim() === "") {
        document.getElementById('popup').style.display = 'flex';
        openTab(null, 'Cliente'); // Asegúrate de que la pestaña Cliente esté activa
        ocultarCargando();
    } else {
        const numeroCliente = document.getElementById('searchInput').value.trim().toLowerCase(); // Eliminar espacios y convertir a minúsculas
        if (!numeroCliente) {
            document.getElementById('popup').style.display = 'flex';
            openTab(null, 'Cliente'); // Asegúrate de que la pestaña Cliente esté activa
            ocultarCargando();
            return;
        }

        const datosCliente = await cargarDatosCSV('csv/datos_cliente.csv');
        const formasContacto = await cargarDatosCSV('csv/formas_contacto.csv');
        const zona = await cargarDatosCSV('csv/zona.csv');
        const estadoCliente = await cargarDatosCSV('csv/estado_cliente.csv');
        const situacionCliente = await cargarDatosCSV('csv/situacion_cliente.csv');
        const productosInsumos = await cargarDatosCSV('csv/productos_insumos.csv');
        const cuentaCorriente = await cargarDatosCSV('csv/cuenta_corriente.csv');
        const historial = await cargarDatosCSV('csv/historial.csv');

        const cliente = datosCliente.find(row => row[0].toLowerCase() === numeroCliente);
        if (cliente) {
            mostrarResultados(cliente, formasContacto, zona, estadoCliente, situacionCliente, productosInsumos, cuentaCorriente, historial);
        } else {
            alert('No se encontraron resultados para el número de cliente ingresado.');
            ocultarSecciones();
        }
        ocultarCargando();
    }
}

async function buscarPorCliente() {
    mostrarCargando();
    const dni = document.getElementById('dniPopup').value.trim().toLowerCase();
    const datos = await cargarDatosCSV('csv/data1.csv');
    const cliente = datos.find(row => row[1].toLowerCase() === dni);
    if (cliente) {
        mostrarResultados(cliente);
        document.getElementById('popup').style.display = 'none';
    } else {
        alert('No se encontraron resultados para el DNI ingresado.');
    }
    ocultarCargando();
}

async function buscarPorDireccion() {
    mostrarCargando();
    const calle = document.getElementById('calle').value.trim().toLowerCase();
    const numero = document.getElementById('numero').value.trim().toLowerCase();
    const datos = await cargarDatosCSV('csv/data1.csv');
    const cliente = datos.find(row => row[4].toLowerCase() === `${calle} ${numero}`);
    if (cliente) {
        mostrarResultados(cliente);
        document.getElementById('popup').style.display = 'none';
    } else {
        alert('No se encontraron resultados para la dirección ingresada.');
    }
    ocultarCargando();
}

async function buscarPorTelefono() {
    mostrarCargando();
    const telefono = document.getElementById('telefonoPopup').value.trim().toLowerCase();
    const datos = await cargarDatosCSV('csv/data1.csv');
    const cliente = datos.find(row => row[7].toLowerCase() === telefono);
    if (cliente) {
        mostrarResultados(cliente);
        document.getElementById('popup').style.display = 'none';
    } else {
        alert('No se encontraron resultados para el número de teléfono ingresado.');
    }
    ocultarCargando();
}

async function buscarPorGestion() {
    mostrarCargando();
    const tipoGestion = document.getElementById('tipoGestion').value.toLowerCase();
    const numeroGestion = document.getElementById('numeroGestion').value.trim().toLowerCase();
    const datos = await cargarDatosCSV('csv/data1.csv');
    const cliente = datos.find(row => row[41].toLowerCase() === tipoGestion && row[33].toLowerCase() === numeroGestion);
    if (cliente) {
        mostrarResultados(cliente);
        document.getElementById('popup').style.display = 'none';
    } else {
        alert('No se encontraron resultados para la gestión ingresada.');
    }
    ocultarCargando();
}

function mostrarResultados(cliente, formasContacto, zona, estadoCliente, situacionCliente, productosInsumos, cuentaCorriente, historial) {
    // Mostrar el mensaje de advertencia
    document.getElementById('mensajeAdvertencia').style.display = 'block';

   // Mostrar las secciones de Cuenta Corriente, Historial y Carga de Reclamos
    document.getElementById('cuentaCorriente').style.display = 'block';
    document.getElementById('historialCliente').style.display = 'block';
    document.getElementById('cargaReclamos').style.display = 'block';

    // Mostrar el número y nombre del cliente en la barra de búsqueda
    document.getElementById('clienteInfoDisplay').innerText = `${cliente[0]} - ${cliente[2]} ${cliente[3]}`;

    // Actualizar el título de la sección Cuenta Corriente con el número de cliente
    document.getElementById('cuentaCorrienteTitulo').innerText = `Cuenta Corriente - Cliente Nro: ${cliente[0]}`;

    // Datos del Cliente
    document.getElementById('dni').innerText = cliente[1];
    document.getElementById('domicilio').innerText = cliente[4];
    document.getElementById('entreCalles').innerText = cliente[5];
    document.getElementById('localidad').innerText = cliente[6];
    document.getElementById('edificio').innerText = "Edificio: " + (cliente[30] || "No especificado");

    // Formas de Contacto
    const contacto = formasContacto.find(row => row[0].toLowerCase() === cliente[0].toLowerCase());
    document.getElementById('telefono').innerText = contacto[1];
    document.getElementById('email').innerText = contacto[2];
    document.getElementById('sucVirtual').innerText = contacto[3];
    document.getElementById('notificaciones').innerText = contacto[4] || "Sin notificaciones";

    // Zona
    const zonaInfo = zona.find(row => row[0].toLowerCase() === cliente[0].toLowerCase());
    document.getElementById('zonaFTTH').innerText = zonaInfo[1];
    document.getElementById('zonaTecnica').innerText = zonaInfo[2];
    document.getElementById('comercial').innerText = zonaInfo[3];
    document.getElementById('ubicacion').innerText = zonaInfo[4];

    // Estado del Cliente
    const estado = estadoCliente.find(row => row[0].toLowerCase() === cliente[0].toLowerCase());
    document.getElementById('estado').innerText = estado[1] || "Desconocido";
    document.getElementById('categoria').innerText = estado[2];
    document.getElementById('tipoFactura').innerText = estado[3];
    document.getElementById('formaPago').innerText = estado[4];
    document.getElementById('clavePago').innerText = estado[5];
    document.getElementById('condicionIIBB').innerText = estado[6];
    document.getElementById('condicionIVA').innerText = estado[7];

    // Función para verificar si el valor indica una condición positiva
    function esPositivo(valor) {
        if (!valor) return false;
        const valorNormalizado = valor.toString().trim().toLowerCase();
        console.log(`Valor recibido para evaluación: "${valorNormalizado}"`); // Para depuración
        return ["si", "sí", "1", "cumplido", "verdadero", "activo", "✓", "check"].includes(valorNormalizado);
    }
    
    // Situación del Cliente con íconos de "check" y mensajes de depuración
    const situacion = situacionCliente.find(row => row[0].toLowerCase() === cliente[0].toLowerCase());
    document.getElementById('recAdm').innerHTML = esPositivo(situacion[1]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('visitasTecnicas').innerHTML = esPositivo(situacion[2]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('instalaciones').innerHTML = esPositivo(situacion[3]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('bajas').innerHTML = esPositivo(situacion[4]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('deuda').innerHTML = esPositivo(situacion[5]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('bloqueos').innerHTML = esPositivo(situacion[6]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('propensionBaja').innerHTML = esPositivo(situacion[7]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('reclamoFormal').innerHTML = esPositivo(situacion[8]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';

    // Productos e Insumos
    const productos = productosInsumos.find(row => row[0].toLowerCase() === cliente[0].toLowerCase());
    document.getElementById('internet').innerText = productos[1] || "Sin datos";
    document.getElementById('telecentroWifi').innerText = productos[2];
    document.getElementById('credito').innerText = productos[3];

    // Cargar Cuenta Corriente
    const cuentaCorrienteCliente = cuentaCorriente.filter(row => row[0].toLowerCase() === cliente[0].toLowerCase());
    const cuentaCorrienteHTML = cuentaCorrienteCliente.map(row => `
        <tr>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
            <td>${row[5]}</td>
            <td>${row[6]}</td>
            <td>${row[7]}</td>
            <td>${row[8]}</td>
        </tr>
    `).join('');
    document.getElementById('tablaCuentaCorriente').innerHTML = cuentaCorrienteHTML;

    // Cargar Historial del Cliente
    const historialCliente = historial.filter(row => row[0].toLowerCase() === cliente[0].toLowerCase());
    const historialHTML = historialCliente.map(row => `
        <tr>
            <td>${row[1]}</td>
            <td>${row[2]}</td>
            <td>${row[3]}</td>
            <td>${row[4]}</td>
            <td>${row[5]}</td>
        </tr>
    `).join('');
    document.getElementById('tablaHistorial').innerHTML = historialHTML;
}

function ocultarSecciones() {
    // Ocultar secciones de Cuenta Corriente e Historial si no se encuentra un cliente
    document.getElementById('cuentaCorriente').style.display = 'none';
    document.getElementById('historialCliente').style.display = 'none';
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    if (evt) {
        evt.currentTarget.className += " active";
    }
}

function cerrarPopup() {
    document.getElementById('popup').style.display = 'none';
}

function cargarReclamo() {
    const selectReclamo1 = document.getElementById('selectReclamo1').value;
    const selectReclamo2 = document.getElementById('selectReclamo2').value;
    const selectReclamo3 = document.getElementById('selectReclamo3').value;
    const observaciones = document.getElementById('observaciones').value.trim();

    if (!selectReclamo1 && !selectReclamo2 && !selectReclamo3 && !observaciones) {
        alert('Por favor, complete al menos un campo para cargar el reclamo.');
        return;
    }

    const fechaActual = new Date().toLocaleDateString();
    let tipo = 'Reclamo';
    let estado = 'Pendiente';
    let historia = 'Reclamo';

    if (selectReclamo1 === 'Sugerencia') {
        tipo = selectReclamo3;
        estado = 'Cerrada';
        historia = 'Sugerencia';
    } else if (selectReclamo1 === 'RA') {
        tipo = selectReclamo3;
        estado = 'Pendiente';
        historia = 'RA';
    }

    const nuevoReclamoHTML = `
        <tr>
            <td>${fechaActual}</td>
            <td>${Math.floor(Math.random() * 1000000000)}</td>
            <td>${historia}</td>
            <td>${tipo}</td>
            <td>${estado}</td>
        </tr>
    `;

    document.getElementById('tablaHistorial').innerHTML += nuevoReclamoHTML;
    alert('Reclamo cargado exitosamente.');
    document.getElementById('selectReclamo1').value = '';
    document.getElementById('selectReclamo2').value = '';
    document.getElementById('selectReclamo3').value = '';
    document.getElementById('observaciones').value = '';
}

function cargarOpciones() {
    const selectReclamo1 = document.getElementById('selectReclamo1').value;
    const selectReclamo2 = document.getElementById('selectReclamo2');
    const opciones = {
        "Sugerencia": [
            "ATC 0 - Información Factura",
            "ATC 0 - Gestión sobre Factura",
            "ATC 1 - Baja/Downgrade",
            "ATC 1 - Consulta Productos Uso/Downgrade/Upgrade",
            "ATC 2 - Contención Residencial",
            "ATC 3 - Gestión Cobranza",
            "ATC 3 - Información Cobranza",
            "ATC 4 - Gestión Instalaciones",
            "ATC 4 - Información Sobre Instalaciones",
            "ATC 5 - Información General",
            "ATC 6 - Información Devoluciones",
            "ATC 6 - Gestión Devoluciones al Cliente",
            "ATC 7 - Registros de Incidencia Masiva",
            "ATC 7 - Backoffice Administración - Pedidos Especiales",
            "ATC 8 - Gestión Seguimiento CCADM",
            "ATC 9 - Consulta Post Baja",
            "ATC 10 - Recambio Deco Cisco",
            "ATC 11 - Venta Inicial"
        ],
        "RA": [
            "Administración de Ventas",
            "ATC - Backoffice Comercial Residencial",
            "Mesa de Ayuda - Sistemas",
            "Ajustes",
            "ATC - Analizar Renovación Bonif. Encargado",
            "Backoffice Retención",
            "Cambio a Factura A/B",
            "Cobranzas Residencial",
            "Telefonía Residencial - Reclamo Consumos",
            "Prevención de Fraudes - Gestión Administrativa",
            "Televisión",
            "Reclamo por Instalación",
            "Reclamo por Service",
            "Reclamos Formales",
            "Escalamiento N3",
            "Logística Inversa - Retiro de Equipos",
            "Logística Inversa - Delivery Control Remoto",
            "Logística Inversa - Recambio Deco Cisco",
            "Agendas Service",
            "Agendas Instalación"
        ]
    };

    selectReclamo2.innerHTML = '<option value="">- Seleccionar -</option>';
    if (opciones[selectReclamo1]) {
        opciones[selectReclamo1].forEach(opcion => {
            const optionElement = document.createElement('option');
            optionElement.value = opcion;
            optionElement.textContent = opcion;
            selectReclamo2.appendChild(optionElement);
        });
    }
}

document.getElementById('selectReclamo2').addEventListener('change', function() {
    const selectReclamo3 = document.getElementById('selectReclamo3');
    const tituloSeleccionado = this.value;
    
    const opciones = {
        "Administración de Ventas": [
            "Contactos Ventas Sitio Web",
            "Gestionar Permiso",
            "Levantar Anulación/Incumplimiento",
            "App-Validación-Modificar Domicilio",
            "App-Validación-Modificar Titular/DNI",
            "App-Validación-Modificar Pack",
            "Retención Persona Duplicada",
            "Incidencia en Edificio (Cliente Nuevo)"
        ],
        "ATC - Backoffice Comercial Residencial": [
            "Anular Reintegro",
            "Cambio Número de Línea Telefónica",
            "Cambio Estado de Producto",
            "Cierre de Visitas Técnicas (Instalación)",
            "GA CCD - No se Pueden Crear Más Viviendas en Domicilio",
            "Liberar Reintegro en Estado Cancelado a Confirmar",
            "Llamado Erróneo de IVR por Morosidad",
            "Cliente Cumplido Difiere Hasta 3 Caracteres DNI/Nom/Ape",
            "ND Reposición Equipo Cliente en Baja",
            "Reclama Reintegro por Error en DNI",
            "Solicita Reintegro con Transferencia",
            "Solicitud de Portabilidad",
            "Titular Erróneo en Info Técnica",
            "UHF - Cambio de Domicilio"
        ],
        "Mesa de Ayuda - Sistemas": [
            "ATC - Agenda",
            "ATC - Cambio de Velocidad",
            "ATC - Telefonía",
            "CRM - Otros",
            "Bajas"
        ],
        "Ajustes": [
            "Devolución Días Sin Servicio"
        ],
        "ATC - Analizar Renovación Bonif. Encargado": [
            "ATC - Fin de Bonificación"
        ],
        "Backoffice Retención": [
            "ATC - Confirmación de Clientes",
            "ATC - Desiste de Baja",
            "Ventas Baja por Nueva Venta en Domicilio",
            "CD Baja Sin Procesar en CRM",
            "CD Reclamo por Visitas Técnicas",
            "Cliente No Factura por Abono Duplicado",
            "Contacto por CCDD de Zona HFC/FTTH a UHF Duplicado"
        ],
        "Cambio a Factura A/B": [
            "Pedido de Cambio a Factura A/B"
        ],
        "Cobranzas Residencial": [
            "Bloqueo en Error",
            "Quitar de Veraz"
        ],
        "Telefonía Residencial - Reclamo Consumos": [
            "Facturación Consumos Propios",
            "Facturación por Cuenta y Orden (CPP, etc.)"
        ],
        "Prevención de Fraudes - Gestión Administrativa": [
            "Informa Pago OP",
            "Reclama Bloqueo Preventivo"
        ],
        "Televisión": [
            "CNOC Televisión - ID121 Sin Solución de Soporte Online"
        ],
        "Reclamo por Instalación": [
            "Daño a la Propiedad",
            "Daño Equipo Electrónico",
            "Desempeño del Instalador",
            "Faltante de Pertenencias",
            "Olvido de Herramienta"
        ],
        "Reclamo por Service": [
            "Daño a la Propiedad",
            "Daño Equipo Electrónico",
            "Desempeño del Instalador",
            "Faltante de Pertenencias",
            "Olvido de Herramienta"
        ],
        "Reclamos Formales": [
            "Pedido de Contacto Ejecutivo RF Adm-Tec"
        ],
        "Escalamiento N3": [
            "Inconvenientes con Insumos",
            "Solicita WiFi Mesh",
            "Reposición de Equipos CM/DD"
        ],
        "Logística Inversa - Retiro de Equipos": [
            "ATC - Retiro por Baja Parcial de Serv/Ins",
            "ATC - Cambio de Datos de Retiro",
            "ATC - Reclama Retiro"
        ],
        "Logística Inversa - Delivery Control Remoto": [
            "ATC - Cancela Envío",
            "Delivery Control Remoto - Control Erróneo",
            "Delivery Control Remoto - Demora en la Entrega",
            "Delivery Control Remoto - TC Cerrado Sin Entrega"
        ],
        "Logística Inversa - Recambio Deco Cisco": [
            "ATC - Cisco ID121 Agendar Visita",
            "ATC - Solicita RCA"
        ],
        "Agendas Service": [
            "Cambio de Domicilio - Sin Disponibilidad de Agenda",
            "Reparación - Sin Disponibilidad de Agenda",
            "Solicitud Técnica - Sin Disponibilidad de Agenda"
        ],
        "Agendas Instalación": [
            "Instalación - Sin Disponibilidad de Agenda"
        ],
        "ATC 0 - Información Factura": [
            "Consulta Nota de Débito",
            "Consulta Cambios en Tipo de Factura",
            "Explicación 1ª Factura",
            "Explicación de Factura General",
            "Explicación de Factura con Aumento",
            "Explicación Fin Promo/Bonificación"
        ],
        "ATC 0 - Gestión sobre Factura": [
            "Se Procesa Nota de Débito",
            "Solicita Envío Factura",
            "Pase a Factura Papel"
        ],
        "ATC 1 - Baja/Downgrade": [
            "Baja Plataforma - Combo+",
            "Baja Plataforma - Disney+"
        ],

        "ATC 1 - Consulta Productos Uso/Downgrade/Upgrade": [
                "Consulta Deco VSB con Alexa",
                "Consulta HD a 4K / 4K a HD",
                "Consulta Internet - Downgrade/Upgrade",
                "Consulta Migración a FTTH",
                "Consulta Pack HD",
                "Consulta Pack 4K",
                "Consulta Plataforma - Combo+",
                "Consulta Plataforma - Disney+",
                "Consulta Plataforma - Prime Video",
                "Consulta Plataforma - Star+",
                "Consulta Plataforma - Tinder",
                "Consulta Producto TLC - T Play",
                "Consulta Producto TLC - T WiFi",
                "Consulta Producto TLC - Control Remoto",
                "Consulta Producto TLC - T Phone",
                "Consulta Pack - HBO",
                "Consulta Pack - Universal",
                "Consulta Pack - Fútbol",
                "Consulta Pack - Hot Pack",
                "Consulta Downgrade Plata a Oro / Oro a Plata",
                "Consulta PPV",
                "Consulta SD a HD / HD a SD",
                "Consulta Telefonía",
                "Consulta Producto TLC - Decos",
                "Consulta Plataforma - Netflix / YouTube",
                "Consulta WiFi Mesh",
                "Consulta Deco Android"
            ],
            "ATC 2 - Contención Residencial": [
                "Activación Promo HD Contención",
                "Activación Promo HBO Contención",
                "Se Induce a WhatsApp Fuera de Horario",
                "Activación Promo T-WiFi",
                "Se Carga Promo por Aumento",
                "Activación Promo Contención Mesh",
                "Activación Promo Universal Contención"
            ],
            "ATC 3 - Gestión Cobranza": [
                "Alta o Modificación de Débito",
                "Desactiva Débito",
                "Gestión Desbloqueo",
                "Pago con Tarjeta",
                "Se Envía OP a Pedido del Cliente"
            ],
            "ATC 3 - Información Cobranza": [
                "Consulta Bloqueo",
                "Formas de Pago",
                "Informa Cobranza Terceros",
                "Pago no Imputado",
                "Problemas para Tomar Pago",
                "Se Informa Rechazo de Débito"
            ],
            "ATC 4 - Gestión Instalaciones": [
                "Anulación de GA Cambio de Domicilio",
                "Desiste Instalación",
                "Se Carga Cambio de Domicilio",
                "Se Agenda/Reagenda a Pedido del Cliente",
                "Se Reagenda por Incumplimiento",
                "Solicita Modificación de Instalación"
            ],
            "ATC 4 - Información Sobre Instalaciones": [
                "Certifica Venta",
                "Consulta Cambio de Domicilio",
                "Gestión RA Administración de Ventas Aún No Realizada",
                "Informa Agenda Instalación",
                "Relevamiento / Armado / Auditoría / Permiso"
            ],
            "ATC 5 - Información General": [
                "Cambio de Titularidad",
                "Cliente Cumplido con Error en Domicilio/DNI/Titularidad",
                "Consulta WiCRED",
                "Horario/ Teléfonos/ Dirección Legal",
                "Marketing/Concursos/Beneficios S/C",
                "Portabilidad",
                "Programación",
                "Sucursal Virtual/Registro",
                "Modificación de Entre Calles"
            ],
            "ATC 6 - Información Devoluciones": [
                "Consulta Nota de Crédito",
                "Consulta por Ajuste",
                "Consulta Reintegro"
            ],
            "ATC 6 - Gestión Devoluciones al Cliente": [
                "Se Procesa Nota de Crédito",
                "Se Procesa Ajuste",
                "Se Procesa Reintegro"
            ],
            "ATC 7 - Registros de Incidencia Masiva": [
                "No Visualizo PPV",
                "Plataforma Disney/Prime/Star en Baja y Facturando"
            ],
            "ATC 7 - Backoffice Administración - Pedidos Especiales": [
                "BOC Downgrade Oro a Plata"
            ],
            "ATC 8 - Gestión Seguimiento CCADM": [
                "Se Contacta Tercero",
                "Se Corta Comunicación con Cliente",
                "Se Pasa Pedido Team ACC",
                "Se Pasa Pedido Team Atento",
                "Se Pasa Pedido Team Konecta",
                "Seguimientos de Casos Team",
                "Recontacto",
                "Llamado por Pedido de Supervisor"
            ],
            "ATC 9 - Consulta Post Baja": [
                "Consulta Retiro/Recupero de Equipos",
                "Consulta por Estado de Baja"
            ],
            "ATC 10 - Recambio Deco Cisco": [
                "Consulta por Llamado de Agendamiento de VT",
                "Consulta por Mail Enviado",
                "Consulta Activación Nuevo Deco Sagemcom",
                "Se Informa Agenda Recambio Deco Cisco"
            ],
            "ATC 11 - Venta Inicial": [
                "Promo de Venta No Aplicada",
                "Promo de Bienvenida"
            ]
        
        
    };

    selectReclamo3.innerHTML = '<option value="">- Seleccionar -</option>';
    if (opciones[tituloSeleccionado]) {
        opciones[tituloSeleccionado].forEach(opcion => {
            const optionElement = document.createElement('option');
            optionElement.value = opcion;
            optionElement.textContent = opcion;
            selectReclamo3.appendChild(optionElement);
        });
    }
});

document.addEventListener("DOMContentLoaded", function() {
    openTab(null, 'PorCliente');
    ocultarSecciones(); // Ocultar las secciones de cuenta corriente e historial al inicio
});

