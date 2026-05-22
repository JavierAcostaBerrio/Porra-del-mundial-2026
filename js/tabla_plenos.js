async function cargarTablaPlenos() {

  const url = "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?tqx=out:json&gid=149097168";

  const resp = await fetch(url);
  const texto = await resp.text();

  // Limpiar el JSON gviz
  const json = JSON.parse(texto.substring(texto.indexOf("{"), texto.lastIndexOf("}") + 1));

  const filas = json.table.rows;

  // Convertir filas a matriz limpia
  const datos = filas.map(r =>
    r.c.map(c => (c ? c.v : ""))
  );

  // Construir tabla HTML
  let html = `
    <table class="tabla-plenos">
      <thead>
        <tr>
          <th>Jugador</th>
          <th>Plenos</th>
        </tr>
      </thead>
      <tbody>
  `;

  datos.forEach(fila => {
    const jugador = fila[0];
    const plenos = fila[1];

    html += `
      <tr>
        <td>${jugador}</td>
        <td>${plenos}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  // Insertar en el div
  document.getElementById("tablaPlenos").innerHTML = html;
}

cargarTablaPlenos();
