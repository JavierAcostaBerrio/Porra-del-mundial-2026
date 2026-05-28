// ===============================
//   Porra Mundial 2026 - main.js
// ===============================

// Esta función la llama sheet.js cuando recibe los datos de Google Sheets
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

    // Mostrar fecha de actualización
    const ahora = new Date();
    const fechaFormateada = ahora.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    document.getElementById("fecha-actualizacion").textContent =
        `Datos actualizados: ${fechaFormateada}`;
}
