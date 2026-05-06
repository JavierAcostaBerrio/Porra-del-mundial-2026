const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=444190468";

const COL_INICIO = 1; // Columna B
const COL_FIN = 6;    // Columna F (slice no incluye el final)

function pintarTabla(datos) {
  const tabla = document.getElementById("tabla");
  tabla.innerHTML = "";

  const rows = datos.table.rows;

  rows.forEach((row, index) => {
    const tr = document.createElement("tr");

    const celdas = row.c.slice(COL_INICIO, COL_FIN);

    celdas.forEach(celda => {
      const valor = celda ? celda.v : "";
      const el = index === 0 ? document.createElement("th") : document.createElement("td");
      el.textContent = valor;
      tr.appendChild(el);
    });

    tabla.appendChild(tr);
  });
}

fetch(SHEET_URL)
  .then(res => res.text())
  .then(texto => {
    const json = JSON.parse(texto.substring(47, texto.length - 2));
    pintarTabla(json);
  })
  .catch(err => console.error("Error cargando datos:", err));



