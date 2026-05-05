// URL publicada de tu hoja como CSV (cambia SPREADSHEET_ID por el tuyo real)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/export?format=csv&gid=444190468";

// Columnas A–E → 5 columnas
const COLUMNA_INICIO = 1; // Saltar columna A
const COLUMNA_FIN = 6;    // Pintar hasta la E (sin incluir la 5)

// ID del <table> donde se pintará
const TABLE_ID = "tabla";

function parseCSV(texto) {
  return texto
    .split("\n")
    .map(fila => fila.trim())
    .filter(fila => fila.length > 0)
    .map(fila =>
      fila
        .split(",")
        .map(celda => celda.replace(/^"|"$/g, "")) // quitar comillas externas
    );
}

function pintarTablaDesdeCSV(csvTexto) {
  const filas = parseCSV(csvTexto);
  const tabla = document.getElementById(TABLE_ID);

  if (!tabla) {
    console.error(`No existe una tabla con id="${TABLE_ID}"`);
    return;
  }

  tabla.innerHTML = ""; // limpiar antes de pintar

  filas.forEach((fila, index) => {
    const tr = document.createElement("tr");

    fila.slice(0, NUM_COLUMNAS).forEach(valor => {
      const celda = index === 0 ? document.createElement("th") : document.createElement("td");
      celda.textContent = valor;
      tr.appendChild(celda);
    });

    tabla.appendChild(tr);
  });
}

fetch(SHEET_URL)
  .then(res => res.text())
  .then(csv => pintarTablaDesdeCSV(csv))
  .catch(err => console.error("Error cargando la hoja:", err));


