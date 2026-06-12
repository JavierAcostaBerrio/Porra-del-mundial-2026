// ===============================
//   Porra Mundial 2026 - main.js
// ===============================

// 🔵 Obtener fecha REAL de actualización de la pestaña concreta
async function cargarFechaActualizacionPestana(nombrePestana) {
    const sheetId = "1d0k7uB8xq3t9xq0xJp0m0k8x8t0Qw3p9"; // tu ID real

    const url = `https://spreadsheets.google.com/feeds/worksheets/${sheetId}/public/basic?alt=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Buscar la pestaña concreta por nombre exacto
        const entry = data.feed.entry.find(e => e.title.$t === nombrePestana);

        if (!entry) {
            document.getElementById("fecha-actualizacion").textContent =
                "Pestaña no encontrada";
            return;
        }

        // Fecha REAL de modificación de esa pestaña
        const fechaISO = entry["gs$modified"]["$t"];
        const fecha = new Date(fechaISO);

        const opciones = { 
            day: "2-digit", month: "2-digit", year: "2-digit",
            hour: "2-digit", minute: "2-digit"
        };

        document.getElementById("fecha-actualizacion").textContent =
            "Datos actualizados: " + fecha.toLocaleString("es-ES", opciones);

    } catch (error) {
        console.error("Error obteniendo fecha real:", error);
        document.getElementById("fecha-actualizacion").textContent =
            "No se pudo obtener la fecha de actualización";
    }
}



// ===============================
//   Pintar clasificación
// ===============================

function pintarClasificacion(datos) {

    const encabezados = datos[0];
    const filas = datos.slice(1);

    // Ordenar por puntos
    filas.sort((a, b) => Number(b[1]) - Number(a[1]));

    // Puntos máximos para barra de progreso
    const maxPuntos = Number(filas[0][1]);

    let html = "<table>";

    // Encabezado
    html += "<tr><th>#</th>";
    encabezados.forEach(col => html += `<th>${col}</th>`);
    html += "<th>Progreso</th></tr>";

    // Filas
    filas.forEach((fila, index) => {
        const jugador = fila[0];
        const puntos = Number(fila[1]);
        const porcentaje = (puntos / maxPuntos) * 100;

        const posicion = index + 1;

        html += "<tr>";
        html += `<td><span class="badge badge-azul">${posicion}</span></td>`;
        html += `<td>${jugador}</td>`;
        html += `<td>${puntos}</td>`;

        html += `
            <td>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${porcentaje}%"></div>
                </div>
            </td>
        `;

        html += "</tr>";
    });

    html += "</table>";

    // Pintar tabla en el ID correcto
    document.getElementById("tabla").innerHTML = html;

    // 🔵 Mostrar fecha REAL de la pestaña "Puntuacion_dia"
    cargarFechaActualizacionPestana("Puntuacion_dia");
}
