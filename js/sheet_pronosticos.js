fetch("https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=444190468&tqx=out:json")
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47, text.length - 2));
    const table = document.getElementById("tabla");

    // --- CABECERA: fila 1, desde columna B en adelante ---
    const headerRow = json.table.rows[0].c;   // Fila 1 completa
    const headerTr = document.createElement("tr");

    // Recorremos desde índice 1 (columna B) hasta el final
    for (let i = 1; i < headerRow.length; i++) {
      const cell = headerRow[i];
      const th = document.createElement("th");
      th.textContent = cell && cell.v ? cell.v : "";
      headerTr.appendChild(th);
    }

    table.appendChild(headerTr);

    // --- FILAS DE DATOS: desde fila 2, columnas desde B ---
    json.table.rows.slice(1).forEach(row => {
      const tr = document.createElement("tr");
      const cells = row.c;

      for (let i = 1; i < cells.length; i++) {
        const cell = cells[i];
        const td = document.createElement("td");
        td.textContent = cell && cell.v ? cell.v : "";
        tr.appendChild(td);
      }

      table.appendChild(tr);
    });
  });


