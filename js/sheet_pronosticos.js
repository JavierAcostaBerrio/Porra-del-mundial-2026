fetch("https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=444190468&tqx=out:json")
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47, text.length - 2));
    const table = document.getElementById("tabla");

    // 1. Obtener la primera fila (cabecera real)
    const headerRow = json.table.rows[0].c;

    // 2. Crear cabecera automática
    const header = document.createElement("tr");

    // Primera columna: "Encuentro"
    const thEncuentro = document.createElement("th");
    thEncuentro.textContent = "Encuentro";
    header.appendChild(thEncuentro);

    // Resto de columnas: nombres de jugadores
    headerRow.slice(2).forEach(col => {
      const th = document.createElement("th");
      th.textContent = col ? col.v : "";
      header.appendChild(th);
    });

    table.appendChild(header);

    // 3. Pintar filas (saltamos la primera fila)
    json.table.rows.slice(1).forEach(row => {
      const tr = document.createElement("tr");

      // Columna 1 → Encuentro
      const tdEncuentro = document.createElement("td");
      tdEncuentro.textContent = row.c[1] ? row.c[1].v : "";
      tr.appendChild(tdEncuentro);

      // Columnas 2 en adelante → pronósticos
      row.c.slice(2).forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell ? cell.v : "";
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  });


