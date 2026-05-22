async function cargarEvolucionTop5() {

  const url = "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?tqx=out:json&gid=1478160189";

  const resp = await fetch(url);
  const texto = await resp.text();

  // El JSON gviz viene envuelto en basura → lo limpiamos
  const json = JSON.parse(texto.substring(texto.indexOf("{"), texto.lastIndexOf("}") + 1));

  const filas = json.table.rows;

  // Convertir filas a matriz limpia
  const datos = filas.map(r =>
    r.c.map(c => (c ? c.v : "")) // c.v = valor real
  );

  // Primera columna = jugadores
  const jugadores = datos.map(f => f[0]).filter(v => v !== "");

  // Resto de columnas = posiciones
  const posiciones = datos.map(f =>
    f.slice(1).map(v => Number(v))
  );

  // Unir jugadores + posiciones
  const lista = jugadores.map((j, i) => ({
    jugador: j,
    posiciones: posiciones[i]
  }));

  // Ordenar por la última jornada
  const top5 = lista
    .sort((a, b) => a.posiciones.at(-1) - b.posiciones.at(-1))
    .slice(0, 5);

  // Labels de jornadas
  const jornadas = top5[0].posiciones.length;
  // Labels reales desde Google Sheets (columnas B → W)
const labels = json.table.cols
  .slice(1)              // quitamos la columna A (jugadores)
  .map(col => col.label); // usamos "Día 1", "Día 2", etc.


  // Colores estilo Mundial 2026
  const colores = ["#FFD700", "#00BFFF", "#FF4500", "#32CD32", "#BA55D3"];

  // Datasets
  const datasets = top5.map((obj, k) => ({
    label: obj.jugador,
    data: obj.posiciones,
    borderColor: colores[k],
    borderWidth: 3,
    tension: 0.3,
    pointRadius: 5,
    pointHoverRadius: 8,
    pointBackgroundColor: "#fff",
    pointBorderWidth: 2
  }));

  // Pintar gráfico
  new Chart(document.getElementById("evolucionTop5"), {
    type: "line",
    data: { labels, datasets },
    options: {
      responsive: true,
      scales: {
        y: { 
          reverse: true, 
          ticks: { stepSize: 1 } 
        }
      },
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            label: function(context) {
              const jugador = context.dataset.label;
              const valor = context.parsed.y;
              return jugador + ": posición " + valor;
            }
          }
        }
      }
    }
  });
}

cargarEvolucionTop5();
