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

        html += `<td><span class="badge badge-azul">${posicionActual}</span></td>`;
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

// -------------------------------
// Grafico goles
// -------------------------------
async function dibujarGraficoGoles() {
    const datos = await cargarEstadisticas();

    const labels = datos.map(f => f.colA);
    const values = datos.map(f => Number(f.colB));

    const ctx = document.getElementById("golesChart").getContext("2d");

    // Crear degradado dorado metálico
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "#F7E7A1");
    gradient.addColorStop(0.5, "#D4AF37");
    gradient.addColorStop(1, "#B8860B");

    // Plugin correcto: dibuja encima sin interferir con los ejes
    const roundedBars = {
        id: "roundedBars",
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            const meta = chart.getDatasetMeta(0);

            meta.data.forEach(bar => {
                const { x, y, base } = bar;
                const width = bar.width;
                const radius = 8;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x - width / 2, base);
                ctx.lineTo(x - width / 2, y + radius);
                ctx.quadraticCurveTo(x - width / 2, y, x - width / 2 + radius, y);
                ctx.lineTo(x + width / 2 - radius, y);
                ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + radius);
                ctx.lineTo(x + width / 2, base);
                ctx.closePath();
                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();
            });
        }
    };

    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: "#D4AF37", // Chart.js dibuja barras base
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#D4AF37",
                        font: { size: 14 },
                        padding: 10
                    },
                    grid: { display: false },
                    border: { display: false }
                },
                y: {
                    ticks: {
                        color: "#D4AF37",
                        font: { size: 14 },
                        padding: 10
                    },
                    grid: { display: false },
                    border: { display: false }
                }
            }
        },
        plugins: [roundedBars]
    });
}



// -------------------------------
// Grafico campeon
// -------------------------------
async function dibujarGraficoCampeon() {
    const datos = await cargarGoles();

    const labels = datos.map(f => f.colC);
    const values = datos.map(f => Number(f.colD));

    const ctx = document.getElementById("campeonChart").getContext("2d");
    
    // Crear degradado dorado metálico
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "#F7E7A1");
    gradient.addColorStop(0.5, "#D4AF37");
    gradient.addColorStop(1, "#B8860B");

    // Plugin para esquinas redondeadas
    const roundedBars = {
        id: "roundedBars2",
        beforeDraw(chart) {
            const { ctx } = chart;

            chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                meta.data.forEach(bar => {
                    const { x, y, base } = bar;

                    const width = bar.width;
                    const height = base - y;
                    const radius = 8;

                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x - width / 2, base);
                    ctx.lineTo(x - width / 2, y + radius);
                    ctx.quadraticCurveTo(x - width / 2, y, x - width / 2 + radius, y);
                    ctx.lineTo(x + width / 2 - radius, y);
                    ctx.quadraticCurveTo(x + width / 2, y, x + width / 2, y + radius);
                    ctx.lineTo(x + width / 2, base);
                    ctx.closePath();
                    ctx.fillStyle = gradient;
                    ctx.fill();
                    ctx.restore();
                });
            });

            return false;
        }
    };
    
    
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: gradient,
                borderColor: "#D4AF37",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: { color: "#D4AF37" },
                    grid: { display: false },
                    border:{ color: "#D4AF37" }
                },
                y: {
                    ticks: { color: "#D4AF37" },
                    grid: { display: false },
                    border:{ color: "#D4AF37" }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        },
        plugins: [roundedBars]
    });
}

dibujarGraficoGoles();
dibujarGraficoCampeon();
