document.addEventListener("DOMContentLoaded", function() {
    openTab(null, 'PorCliente'); // Asegúrate de que esta función esté definida
    ocultarSecciones(); // Ocultar las secciones de cuenta corriente e historial al inicio
});

async function cargarDatosCSV() {
    try {
        const response = await fetch('csv/data.csv'); // Asegúrate de que esta ruta sea correcta
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
    const numeroCliente = document.getElementById('searchInput').value.trim(); // Eliminar espacios al buscar
    if (!numeroCliente) {
        alert('Por favor, ingresa un número de cliente.');
        return;
    }

    const datos = await cargarDatosCSV();

    // Filtrar el cliente por el número de cliente ingresado
    const cliente = datos.find(row => row[0] === numeroCliente);
    if (cliente) {
        mostrarResultados(cliente);
    } else {
        alert('No se encontraron resultados para el número de cliente ingresado.');
        ocultarSecciones();
    }
}

function mostrarResultados(cliente) {
    // Mostrar el mensaje de advertencia
    document.getElementById('mensajeAdvertencia').style.display = 'block';

    // Mostrar secciones de Cuenta Corriente e Historial
    document.getElementById('cuentaCorriente').style.display = 'block';
    document.getElementById('historialCliente').style.display = 'block';

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
    document.getElementById('estado').innerText = cliente[33] || "Desconocido";
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
            <td>${cliente[30]}</td>
            <td>${cliente[31]}</td>
            <td>${cliente[32]}</td>
            <td>${cliente[33]}</td>
            <td>${cliente[34]}</td>
            <td>${cliente[35]}</td>
            <td>${cliente[36]}</td>
            <td>${cliente[37]}</td>
        </tr>
    `;
    document.getElementById('tablaCuentaCorriente').innerHTML = cuentaCorrienteHTML;

    // Cargar Historial del Cliente
    const historialHTML = `
        <tr>
            <td>${cliente[38]}</td>
            <td>${cliente[39]}</td>
            <td>${cliente[40]}</td>
            <td>${cliente[41]}</td>
            <td>${cliente[42]}</td>
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
    // Ocultar todas las pestañas
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Eliminar la clase "active" de todos los botones de pestañas
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Mostrar la pestaña actual y agregar la clase "active" al botón que abrió la pestaña
    document.getElementById(tabName).style.display = "block";
    if (evt) {
        evt.currentTarget.className += " active";
    }
}

// Llama a la función openTab solo si es necesario
document.addEventListener("DOMContentLoaded", function() {
    openTab(null, 'PorCliente');
    ocultarSecciones(); // Ocultar las secciones de cuenta corriente e historial al inicio
});
