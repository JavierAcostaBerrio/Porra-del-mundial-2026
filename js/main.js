// ===============================
//   Porra Mundial 2026 - main.js
// ===============================

console.log("Porra Mundial 2026 iniciada correctamente");

// -------------------------------
// Cargar CSV desde /data/
// -------------------------------
async function cargarCSV(url) {
    const respuesta = await fetch(url);
    const texto = await respuesta.text();
    return texto
        .trim()
        .split("\n")
        .map(fila => fila.split(","));
}

// -------------------------------
// Crear tabla de clasificación
// -------------------------------
function generarTablaClasificacion(datos) {
    const encabezados = datos[0];
    const filas = datos.slice(1);

    // Ordenar por puntos (columna 2)
    filas.sort((a, b) => Number(b[1]) - Number(a[1]));

    // Puntos máximos (para calcular porcentaje)
    const maxPuntos = Number(filas[0][1]);

    // Crear tabla HTML
    let html = "<table>";

    // Encabezado
    html += "<tr><th>#</th>";
    encabezados.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += "<th>Progreso</th></tr>";

    // Filas
    filas.forEach((fila, index) => {
        const jugador = fila[0];
        const puntos = Number(fila[1]);
        const porcentaje = (puntos / maxPuntos) * 100;

        html += "<tr>";

        // Posición
        html += `<td><span class="badge badge-azul">${index + 1}</span></td>`;

        // Jugador
        html += `<td>${jugador}</td>`;

        // Puntos
        html += `<td>${puntos}</td>`;

        // Barra de progreso
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

    document.getElementById("tabla-clasificacion").innerHTML = html;
}



// -------------------------------
// Inicializar clasificación
// -------------------------------
async function iniciarClasificacion() {
    const datos = await cargarCSV("data/clasificacion.csv");
    generarTablaClasificacion(datos);
}

// Ejecutar
iniciarClasificacion();
