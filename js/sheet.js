// ===============================
//   Porra Mundial 2026 - sheet.js
// ===============================

// Medallas
function obtenerMedalla(pos) {
    if (pos === 1) return "🥇";
    if (pos === 2) return "🥈";
    if (pos === 3) return "🥉";
    return "";
}

// Columnas que quieres mostrar en la tabla
const columnas = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

// URL de Google Sheets (clasificación)
const URL_CLASIFICACION =
  "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=52755414&tqx=out:json";

fetch(URL_CLASIFICACION)
  .then(res => res.text())
  .then(text => {

    // Google devuelve basura antes y después del JSON → limpiamos
    const json = JSON.parse(text.substring(47, text.length - 2));

    const table = document.getElementById("tabla");

    // ===============================
    // CABECERA
    // ===============================
    const header = document.createElement("tr");
    columnas.forEach(i => {
      const th = document.createElement("th");
      th.textContent = json.table.cols[i].label;
      header.appendChild(th);
    });
    table.appendChild(header);

    // ===============================
    // FILAS
    // ===============================
    json.table.rows.forEach(row => {
      const tr = document.createElement("tr");

      columnas.forEach(i => {
        const td = document.createElement("td");

        if (i === 0) {
          // Posición + medalla
          const pos = Number(row.c[i]?.v ?? "");
          const medalla = obtenerMedalla(pos);
          td.textContent = pos + " " + medalla;
        } else {
          td.textContent = row.c[i] ? row.c[i].v : "";
        }

        tr.appendChild(td);
      });

      table.appendChild(tr);
    });

    // ===============================
    // FECHA REAL DE ACTUALIZACIÓN
    // ===============================
    let fechaActualizacion = null;

    json.table.rows.forEach(row => {
      const celda = row.c[24]; // Columna Y
      if (celda && celda.f) {
        fechaActualizacion = celda.f; // Ej: "29/05/2026 0:20:03"
      }
    });

    if (fechaActualizacion) {
      document.getElementById("fecha-actualizacion").textContent =
        `Datos actualizados: ${fechaActualizacion}`;
    } else {
      console.warn("No se encontró fecha en la columna Y");
    }
  });


// ===============================
// Cargar estadísticas (Top 5, etc.)
// ===============================
async function cargarEstadisticas() {
    const url =
      "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?tqx=out:json&gid=1371661770";

    const respuesta = await fetch(url);
    const texto = await respuesta.text();

    const json = JSON.parse(texto.substring(47, texto.length - 2));

    const filas = json.table.rows.map(fila => ({
        colA: fila.c[0]?.v ?? "",
        colB: fila.c[1]?.v ?? 0,
        colC: fila.c[2]?.v ?? "",
        colD: fila.c[3]?.v ?? 0,
        colE: fila.c[4]?.v ?? "",
        colF: fila.c[5]?.v ?? 0,
        colG: fila.c[6]?.v ?? "",
        colH: fila.c[7]?.v ?? 0,
        colI: fila.c[8]?.v ?? "",
        colJ: fila.c[9]?.v ?? 0,
        colK: fila.c[10]?.v ?? "",
        colL: fila.c[11]?.v ?? 0,
        colM: fila.c[12]?.v ?? "",
        colN: fila.c[13]?.v ?? 0,
        colO: fila.c[14]?.v ?? "",
        colP: fila.c[15]?.v ?? 0
    }));

    return filas;
}
