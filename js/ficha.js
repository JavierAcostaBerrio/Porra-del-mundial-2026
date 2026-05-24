/// Actualiza el nombre del jugador en la ficha
function cargarFichaJugador(nombreJugador) {

    // Nombre en la cabecera (si existe)
    const nombreCabecera = document.getElementById("ficha-nombre");
    if (nombreCabecera) nombreCabecera.textContent = nombreJugador;

    // Nombre encima del gráfico
    const tituloEvolucion = document.getElementById("titulo-evolucion");
    if (tituloEvolucion) tituloEvolucion.textContent = nombreJugador;
}

// Evento del selector (fuera de la función)
document.getElementById("jugadorSelect").addEventListener("change", function() {
    cargarFichaJugador(this.value);
});

async function cargarAlineacion(usuarioSeleccionado) {
    const sheetID = "1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I";
    const gid = "1503492419";

    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&gid=${gid}`;

    try {
        const res = await fetch(url);
        const text = await res.text();

        // Extraer JSON de forma segura
        const jsonText = text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1);
        const json = JSON.parse(jsonText);

        const rows = json.table.rows;

        // Buscar la fila del usuario seleccionado
        const fila = rows.find(r => {
            const nombre = r.c[0]?.v;
            return nombre && nombre.trim() === usuarioSeleccionado;
        });

        if (!fila) {
            document.querySelector("#tablaAlineacion tbody").innerHTML = "";
            return;
        }

        const celdas = fila.c;

        // FORZAR 11 JUGADORES (1 portero, 3 defensas, 4 medios, 3 delanteros)
        const jugadores = [];
        for (let i = 1; i <= 11; i++) {
            jugadores.push(celdas[i]?.v || "-");
        }

        // ============================
        // RELLENAR TABLA
        // ============================
        const tbody = document.querySelector("#tablaAlineacion tbody");
        tbody.innerHTML = "";

        jugadores.forEach((jug, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${jug}</td>
            `;
            tbody.appendChild(tr);
        });

        

    } catch (error) {
        console.error("Error cargando alineación:", error);
    }
}


/* ============================
   CONFIGURACIÓN DE TUS DATOS
   ============================ */
const SHEET_ID = "1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I";

/* Pestañas reales */
const GID_PUNTOS = "52755414";       // Puntuación_dia
const GID_PRONOS = "1517179668";     // Pronósticos
const GID_HISTORICO = "1308917815";  // <-- cuando me lo pases lo conecto

/* FETCH GENÉRICO */
async function fetchSheet(gid) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${gid}`;
  const res = await fetch(url);
  const text = await res.text();
  const json = JSON.parse(text.substr(47).slice(0, -2));
  return json.table.rows.map(r => r.c.map(c => c ? c.v : null));
}

/* ESTADO */
let puntos = [];
let pronos = [];
let historico = [];

let puntosByUser = new Map();
let pronosByUser = new Map();
let historicoByUser = new Map();

/* INICIO */
document.addEventListener("DOMContentLoaded", async () => {
  [puntos, pronos, historico] = await Promise.all([
    fetchSheet(GID_PUNTOS),
    fetchSheet(GID_PRONOS),
    fetchSheet(GID_HISTORICO)
  ]);

  // USUARIO = columna B = índice 1
  puntosByUser = groupBy(puntos, 1);
  pronosByUser = groupBy(pronos, 1);
  historicoByUser = groupBy(historico, 0);

  fillJugadorSelect(puntos);

  initChart();
});

/* AGRUPAR */
function groupBy(arr, col) {
  const map = new Map();
  arr.forEach(r => {
    const key = r[col];
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r);
  });
  return map;
}

/* SELECTOR DE JUGADOR */
function fillJugadorSelect(puntos) {
  const select = document.getElementById("jugadorSelect");

  // USUARIO = columna 1
  const usuarios = [...new Set(puntos.map(r => r[1]))]
    .filter(u => u !== null && u !== "")
    .sort();

  usuarios.forEach(u => {
    const opt = document.createElement("option");
    opt.value = u;
    opt.textContent = u;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => {
    const usuario = select.value;
    renderFicha(usuario);
    cargarAlineacion(usuario);
});

}

/* CHART */
let evolChart = null;
function initChart() {
  const ctx = document.getElementById("evolChart").getContext("2d");
  evolChart = new Chart(ctx, {
    type: "line",
    data: { labels: [], datasets: [{ label: "Puntos", data: [], borderColor: "#f5c451" }] },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });
}

/* RENDER FICHA */
function renderFicha(usuario) {

  // Obtener datos del usuario
  const row = puntosByUser.get(usuario)?.[0] || [];

  const puntosTotales = row[3] || 0;
  const posicion = row[0] || "—";

  // Determinar medalla
  let medalla = "";
  if (posicion === 1) medalla = "🥇 ";
  else if (posicion === 2) medalla = "🥈 ";
  else if (posicion === 3) medalla = "🥉 ";

  // Construir texto del título
  const titulo = `${medalla}${usuario} — ${puntosTotales} pts — ${posicion}º puesto`;

  // Mostrarlo encima del gráfico
  document.getElementById("titulo-evolucion").textContent = titulo;

  // Resto de renderizados
  renderExtras(usuario);
  renderEvolucion(usuario);
  renderPronosticos(usuario);
}




/* ============================
   EXTRAS (desde Puntuación_dia)
   ============================ */
function renderExtras(usuario) {
  const row = puntosByUser.get(usuario)?.[0] || [];

  // Columnas reales:
  // 0 = posición
  // 1 = usuario
  // 3 = puntos acumulados
  // 11 = Max. Goleador Mundial
  // 12 = MVP Mundial
  // 13 = Equipo Campeón Mundo

  document.getElementById("extraCampeon").textContent = row[13] || "—";
  document.getElementById("extraSubcampeon").textContent = row[12] || "—"; 
  document.getElementById("extraGoleador").textContent = row[11] || "—";
  document.getElementById("extraGoleadorEspana").textContent = row[6] || "—";
  document.getElementById("extraGoles1fase").textContent = row[7] || "—";  

  
}

/* ============================
   EVOLUCIÓN (desde Calculo_puntos)
   ============================ */

const HIST_COL_START = 60; // BH
const HIST_COL_END   = 81; // CC

/* ============================
   EVOLUCIÓN DEL RANKING
   ============================ */

const RANK_START = 60; // BH
const RANK_END   = 81; // CC

function renderEvolucion(usuario) {
   
    const rows = historicoByUser.get(usuario) || [];
  if (!rows.length) return;

  // Solo hay una fila por usuario en Calculo_puntos
  const row = rows[0];

  const labels = [];
  const data = [];

  for (let i = RANK_START; i <= RANK_END; i++) {
    const value = row[i];

    // Si la celda está vacía, paramos
    if (value === null || value === "") break;

    labels.push("Día " + (i - RANK_START + 1));
    data.push(Number(value));
  }

  // Invertimos el eje Y para que 1º sea arriba
  evolChart.options.scales.y.reverse = true;

  evolChart.data.labels = labels;
  evolChart.data.datasets[0].data = data;
  evolChart.update();

  evolChart.options.scales.y.ticks = {
    stepSize: 1,
    callback: function(value) {
        return Number.isInteger(value) ? value : null;
    }
};
}


/* ============================
   PRONÓSTICOS (desde pestaña Pronósticos)
   ============================ */
function renderPronosticos(usuario) {
  const tbody = document.getElementById("tablaPronosticos");
  tbody.innerHTML = "";

  const rows = pronosByUser.get(usuario) || [];

  if (!rows.length) {
    tbody.innerHTML = "<tr><td colspan='4'>Sin pronósticos</td></tr>";
    return;
  }

  rows.forEach(r => {
    const equipoLocal = r[3] || "";
    const golesLocal = r[4] ?? "";
    const golesVisitante = r[5] ?? "";
    const equipoVisitante = r[6] || "";
    const puntos = Number(r[18] ?? 0);

    const partido = `${equipoLocal} - ${equipoVisitante}`;
    const pronostico = `${golesLocal} - ${golesVisitante}`;

    const tr = document.createElement("tr");

    // ⭐ Pleno → verde
    if (puntos === 10 || puntos === 20) {
      tr.style.backgroundColor = "#1f7a1f";   // verde elegante
      tr.style.color = "white";
      tr.style.fontWeight = "600";
    }

    // ⭐ Acierto de signo → amarillo
    else if (puntos === 4 || puntos === 5 || puntos === 8) {
      tr.style.backgroundColor = "#e6c229";   // amarillo cálido
      tr.style.color = "black";
      tr.style.fontWeight = "600";
    }

    tr.innerHTML = `
      <td>${partido}</td>
      <td>${pronostico}</td>
      <td>${puntos}</td>
      `;

    tbody.appendChild(tr);
  });
}
