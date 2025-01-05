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

async function cargarDatosCSV() {
    try {
        const response = await fetch('csv/data1.csv'); // Asegúrate de que esta ruta sea correcta
        if (!response.ok) throw new Error('No se pudo cargar el archivo CSV');
        
        const data = await response.text();
        const rows = data.split('\n').map(row => row.split(',').map(cell => cell.trim())); // Dividir en filas y limpiar espacios
        return rows.slice(1); // Quitar la primera fila si es encabezado
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

        const datos = await cargarDatosCSV();

        // Filtrar el cliente por el número de cliente ingresado
        const cliente = datos.find(row => row[0].toLowerCase() === numeroCliente);
        if (cliente) {
            mostrarResultados(cliente);
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
    const datos = await cargarDatosCSV();
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
    const datos = await cargarDatosCSV();
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
    const datos = await cargarDatosCSV();
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
    const datos = await cargarDatosCSV();
    const cliente = datos.find(row => row[41].toLowerCase() === tipoGestion && row[33].toLowerCase() === numeroGestion);
    if (cliente) {
        mostrarResultados(cliente);
        document.getElementById('popup').style.display = 'none';
    } else {
        alert('No se encontraron resultados para la gestión ingresada.');
    }
    ocultarCargando();
}

function mostrarResultados(cliente) {
    // Mostrar el mensaje de advertencia
    document.getElementById('mensajeAdvertencia').style.display = 'block';

    // Mostrar secciones de Cuenta Corriente e Historial
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
    document.getElementById('telefono').innerText = cliente[7];
    document.getElementById('email').innerText = cliente[8];
    document.getElementById('sucVirtual').innerText = cliente[9];
    document.getElementById('notificaciones').innerText = cliente[31] || "Sin notificaciones";
    document.getElementById('cuentaRRSS').innerText = cliente[32] || "No asignada";

    // Zona
    document.getElementById('zonaFTTH').innerText = cliente[10];
    document.getElementById('zonaTecnica').innerText = cliente[11];
    document.getElementById('comercial').innerText = cliente[12];
    document.getElementById('ubicacion').innerText = cliente[13];

    // Estado del Cliente
    document.getElementById('estado').innerText = cliente[43] || "Desconocido";
    document.getElementById('categoria').innerText = cliente[14];
    document.getElementById('tipoFactura').innerText = cliente[15];
    document.getElementById('formaPago').innerText = cliente[16];
    document.getElementById('clavePago').innerText = cliente[17];
    document.getElementById('condicionIIBB').innerText = cliente[18];
    document.getElementById('condicionIVA').innerText = cliente[19];

    // Función para verificar si el valor indica una condición positiva
    function esPositivo(valor) {
        if (!valor) return false;
        const valorNormalizado = valor.toString().trim().toLowerCase();
        console.log(`Valor recibido para evaluación: "${valorNormalizado}"`); // Para depuración
        return ["si", "sí", "1", "cumplido", "verdadero", "activo", "✓", "check"].includes(valorNormalizado);
    }
    
    // Situación del Cliente con íconos de "check" y mensajes de depuración
    document.getElementById('recAdm').innerHTML = esPositivo(cliente[20]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('visitasTecnicas').innerHTML = esPositivo(cliente[21]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('instalaciones').innerHTML = esPositivo(cliente[22]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('bajas').innerHTML = esPositivo(cliente[23]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('deuda').innerHTML = esPositivo(cliente[24]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('bloqueos').innerHTML = esPositivo(cliente[25]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('propensionBaja').innerHTML = esPositivo(cliente[26]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';
    document.getElementById('reclamoFormal').innerHTML = esPositivo(cliente[27]) ? `<i class="fas fa-check-circle check-icon"></i>` : '';

    // Productos e Insumos
    document.getElementById('internet').innerText = cliente[28] || "Sin datos";
    document.getElementById('telecentroWifi').innerText = cliente[29];
    document.getElementById('credito').innerText = cliente[29];

    // Cargar Cuenta Corriente
    const cuentaCorrienteHTML = `
    
        <tr>
            <td>02/02/2025</td>
            <td>03/02/2025</td>
            <td>FACTURA B</td>
            <td>44556678</td>
            <td>15000.00</td>
            <td>0.00</td>
            <td>15000.00</td>
            <td>Pendiente</td>
        </tr>
        <tr>
            <td>05/03/2025</td>
            <td>06/03/2025</td>
            <td>FACTURA C</td>
            <td>55667788</td>
            <td>20000.00</td>
            <td>0.00</td>
            <td>20000.00</td>
            <td>Pendiente</td>
        </tr>
    `;
    document.getElementById('tablaCuentaCorriente').innerHTML = cuentaCorrienteHTML;

    // Cargar Historial del Cliente
    const historialHTML = `
     
        <tr>
            <td>15/02/2025</td>
            <td>987654321</td>
            <td>Reclamo de Servicio</td>
            <td>Reclamo</td>
            <td>Resuelto</td>
        </tr>
        <tr>
            <td>20/03/2025</td>
            <td>123456789</td>
            <td>Consulta Técnica</td>
            <td>Consulta</td>
            <td>En Proceso</td>
        </tr>
    `;
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
    const nuevoReclamoHTML = `
        <tr>
            <td>${fechaActual}</td>
            <td>${Math.floor(Math.random() * 1000000000)}</td>
            <td>${observaciones || 'Sin observaciones'}</td>
            <td>Reclamo</td>
            <td>Pendiente</td>
        </tr>
    `;

    document.getElementById('tablaHistorial').innerHTML += nuevoReclamoHTML;
    alert('Reclamo cargado exitosamente.');
    document.getElementById('selectReclamo1').value = '';
    document.getElementById('selectReclamo2').value = '';
    document.getElementById('selectReclamo3').value = '';
    document.getElementById('observaciones').value = '';
}

document.addEventListener("DOMContentLoaded", function() {
    openTab(null, 'PorCliente');
    ocultarSecciones(); // Ocultar las secciones de cuenta corriente e historial al inicio
});