// ===============================
//   Porra Mundial 2026 - main.js
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    dibujarGraficoGoles();
    dibujarGraficoCampeon();
    dibujarGraficoMVP();
    dibujarGraficoPichichi();
    dibujarGraficoPichichiEspana();
    dibujarGraficoGolesPichichiEspana();
    dibujarGraficoTarjeta();
    dibujarGraficoCapitanEspana();
    dibujarGraficoEstrategiaEspana();
    
});

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

function obtenerMedalla(pos) {
    if (pos === 1) return "🥇"; // Oro
    if (pos === 2) return "🥈"; // Plata
    if (pos === 3) return "🥉"; // Bronce
    return "";
}
// -------------------------------
// Crear tabla de clasificación
// -------------------------------
async function generarTablaClasificacion(datos) {
    const encabezados = datos[0];
    const filas = datos.slice(1);

    // Ordenar por puntos
    filas.sort((a, b) => Number(b[1]) - Number(a[1]));

    // Cargar posiciones anteriores
    let posicionesPrevias = {};
    try {
        const res = await fetch("data/posiciones.json");
        posicionesPrevias = await res.json();
    } catch (e) {
        posicionesPrevias = {};
    }

    // Guardar nuevas posiciones
    const nuevasPosiciones = {};

    // Puntos máximos para barra de progreso
    const maxPuntos = Number(filas[0][1]);

    let html = "<table>";

    // Encabezado
    html += "<tr><th>#</th>";
    encabezados.forEach(col => html += `<th>${col}</th>`);
    html += "<th>Progreso</th><th>Tendencia</th></tr>";

    // Filas
    filas.forEach((fila, index) => {
        const jugador = fila[0];
        const puntos = Number(fila[1]);
        const porcentaje = (puntos / maxPuntos) * 100;

        // Tendencia
        const posicionActual = index + 1;
        const posicionAnterior = posicionesPrevias[jugador] ?? posicionActual;

        let icono = "➖";
        let clase = "igual";

        if (posicionActual < posicionAnterior) {
            icono = "🔼";
            clase = "sube";
        } else if (posicionActual > posicionAnterior) {
            icono = "🔽";
            clase = "baja";
        }

        nuevasPosiciones[jugador] = posicionActual;

        html += "<tr>";

        const medalla = obtenerMedalla(posicionActual);
        html += `<td><span class="badge badge-azul">${posicionActual} ${medalla}</span></td>`;
        html += `<td>${jugador}</td>`;
        html += `<td>${puntos}</td>`;

        html += `
            <td>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${porcentaje}%"></div>
                </div>
            </td>
        `;

        html += `<td><span class="tendencia ${clase}">${icono}</span></td>`;

        html += "</tr>";
    });

    html += "</table>";

    document.getElementById("tabla-clasificacion").innerHTML = html;

    // Guardar nuevas posiciones
    fetch("data/posiciones.json", {
        method: "PUT",
        body: JSON.stringify(nuevasPosiciones),
        headers: { "Content-Type": "application/json" }
    }).catch(() => {});
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



async function cargarEstadisticas() {
}
// -------------------------------
// Grafico goles
// -------------------------------
async function dibujarGraficoGoles() {
}


// -------------------------------
// Grafico campeon
// -------------------------------
async function dibujarGraficoCampeon() {
}

// -------------------------------
// Grafico MVP
// -------------------------------
async function dibujarGraficoMVP() {
}
// -------------------------------
// Grafico Pichichi
// -------------------------------
async function dibujarGraficoPichichi() {
}
// -------------------------------
// Grafico Pichichi España
// -------------------------------
async function dibujarGraficoPichichiEspana() {
}

// -------------------------------
// Grafico Goles Pichichi España
// -------------------------------
async function dibujarGraficoGolesPichichiEspana() {
}

// -------------------------------
// Grafico Primera Tarjeta España
// -------------------------------
async function dibujarGraficoTarjeta() {
}

// -------------------------------
// Grafico Capitan España
// -------------------------------
async function dibujarGraficoCapitanEspana() {
}
// -------------------------------
// Grafico Estrategia España
// -------------------------------
async function dibujarGraficoEstrategiaEspana() {
}
