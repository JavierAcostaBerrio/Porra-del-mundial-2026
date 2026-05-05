fetch("https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=444190468&tqx=out:json")
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47, text.length - 2));
    const table = document.getElementById("tabla");

    // 1. Cabecera automática desde Google Sheets (desde columna B)
    const headerRow = json.table.rows[0].c;
    const header = document.createElement("tr");

    headerRow.slice(1).forEach(col => {
      const th = document.createElement("th");
      th.textContent = col && col.v ? col.v : "";
      header.appendChild(th);
    });

    table.appendChild(header);

    // 2. Pintar filas (saltamos la primera fila)
    json.table.rows.slice(1).forEach(row => {
      const tr = document.createElement("tr");

      // Pintar columnas desde la B en adelante
      row.c.slice(1).forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell && cell.v ? cell.v : "";
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  });


