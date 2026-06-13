// ===============================
//   Porra Mundial 2026 - main.js
// ===============================


// ======================================================
//   🔵 Obtener fecha REAL desde Puntuacion_dia!Y2
// ======================================================
async function cargarFechaDesdePuntuacionDia() {
    const sheetId = "1d0k7uB8xq3t9xq0xJp0m0k8x8t0Qw3p9";
    const gid = "52755414"; // gid real de la pestaña Puntuacion_dia

    const url = `https://spreadsheets.google.com/feeds/cells/${sheetId}/${gid}/public/basic?alt=json`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Buscar la celda Y2
        const celdaY2 = data.feed.entry.find(e => e.title.$t === "Y2");

        if (!celdaY2) {
            document.getElementById("fecha-actualizacion").textContent =
                "No se encontró Y2";
            return;
        }

        const fechaTexto = celdaY2.content.$t;

        document.getElementById("fecha-actualizacion").textContent =
            "Datos actualizados: " + fechaTexto;

    } catch (error) {
        console.error("Error leyendo Puntuacion_dia!Y2:", error);
        document.getElementById("fecha-actualizacion").textContent =
            "No se pudo obtener la fecha";
    }
}



// ======================================================
//   🟦 Pintar clasificación
// ======================================================
function pintarClasificacion(datos) {

    const encabezados = datos[0];
    const filas = datos.slice(1);

    // Ordenar por puntos (columna 1)
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

    // 🔵 Mostrar fecha REAL desde Y2
    cargarFechaDesdePuntuacionDia();
}



// ======================================================
//   🟢 Cargar datos desde tu JSON publicado
// ======================================================
async function cargarDatos() {
    const url = "https://docs.google.com/spreadsheets/d/1d0k7uB8xq3t9xq0xJp0m0k8x8t0Qw3p9/gviz/tq?tqx=out:json&gid=52755414";

    try {
        const response = await fetch(url);
        const text = await response.text();

        // El JSON de gviz viene con basura delante: "/*O_o*/\ngoogle.visualization.Query.setResponse(...)"
        const json = JSON.parse(text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1));

        const rows = json.table.rows.map(r => r.c.map(c => c ? c.v : ""));

        pintarClasificacion(rows);

    } catch (error) {
        console.error("Error cargando datos:", error);
        document.getElementById("tabla").innerHTML =
            "<p>No se pudieron cargar los datos.</p>";
    }
}


// Ejecutar al cargar la página
cargarDatos();
