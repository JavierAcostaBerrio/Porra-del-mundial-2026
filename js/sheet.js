const columnas = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

fetch("https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=52755414&tqx=out:json")
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47, text.length - 2));
    const table = document.getElementById("tabla");

    // Cabecera
    const header = document.createElement("tr");
    columnas.forEach(i => {
      const th = document.createElement("th");
      th.textContent = json.table.cols[i].label;
      header.appendChild(th);
    });
    table.appendChild(header);

    // Filas
    json.table.rows.forEach(row => {
      const tr = document.createElement("tr");
      columnas.forEach(i => {
        const td = document.createElement("td");
        td.textContent = row.c[i] ? row.c[i].v : "";
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  });

// -------------------------------
// Crea grafico goles primera fase
// -------------------------------
async function cargarGoles() {
    const url = "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?tqx=out:json&gid=1371661770";

    const respuesta = await fetch(url);
    const texto = await respuesta.text();

    // Google devuelve basura antes y después del JSON → limpiamos
    const json = JSON.parse(texto.substring(47, texto.length - 2));

    // Convertimos filas en objetos {colA, colB}
    const filas = json.table.rows.map(fila => ({
        colA: fila.c[0]?.v ?? "",
        colB: fila.c[1]?.v ?? 0
    }));

    return filas;
}
// -------------------------------
// Crea grafico campeon
// -------------------------------

async function cargarGoles() {
    const url = "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?tqx=out:json&gid=1371661770";

    const respuesta = await fetch(url);
    const texto = await respuesta.text();

    // Google devuelve basura antes y después del JSON → limpiamos
    const json = JSON.parse(texto.substring(47, texto.length - 2));

    // Convertimos filas en objetos {colC, colD}
    const filas = json.table.rows.map(fila => ({
        colC: fila.c[2]?.v ?? "",
        colD: fila.c[3]?.v ?? 0
    }));

    return filas;
}
