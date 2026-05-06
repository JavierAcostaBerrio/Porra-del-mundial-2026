
fetch("https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=444190468&tqx=out:json")
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

  .catch(err => console.error("Error cargando datos:", err));
