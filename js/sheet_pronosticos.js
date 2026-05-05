fetch("https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=444190468&tqx=out:json")
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47, text.length - 2));
    const table = document.getElementById("tabla");

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // CABECERA: fila 1, columnas desde B en adelante
    const headerRow = json.table.rows[0].c.slice(1);
    const trHead = document.createElement("tr");

    headerRow.forEach(col => {
      const th = document.createElement("th");
      th.textContent = col && col.v ? col.v : "";
      trHead.appendChild(th);
    });

    thead.appendChild(trHead);

    // DATOS: filas desde la 2, columnas desde B
    json.table.rows.slice(1).forEach(row => {
      const tr = document.createElement("tr");

      row.c.slice(1).forEach(cell => {
        const td = document.createElement("td");
        td.textContent = cell && cell.v ? cell.v : "";
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
  });


