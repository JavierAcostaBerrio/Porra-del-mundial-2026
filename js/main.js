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
    // datos = array de arrays
    // Primera fila = encabezados
    const encabezados = datos[0];
    const filas = datos.slice(1);

    // Ordenar por puntos (columna 2)
    filas.sort((a, b) => Number(b[1]) - Number(a[1]));

    // Crear tabla HTML
    let html = "<table>";
    html += "<tr><th>#</th>";

    encabezados.forEach(col => {
        html += `<th>${col}</th>`;
    });
    html += "</tr>";

    filas.forEach((fila, index) => {
        html += "<tr>";
        html += `<td><strong>${index + 1}</strong></td>`;
        fila.forEach(col => {
            html += `<td>${col}</td>`;
        });
        html += "</tr>";
    });

    html += "</table>";

    // Insertar en la web
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
