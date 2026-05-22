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

  // Obtener el máximo de plenos para escalar las barras
  const maxPlenos = Math.max(...datos.map(f => Number(f[1])));

  // Construir tabla HTML con barras
  let html = `
    <table class="tabla-plenos">
      <thead>
        <tr>
          <th>Participante</th>
          <th>Plenos</th>
        </tr>
      </thead>
      <tbody>
  `;

  datos.forEach(fila => {
    const jugador = fila[0];
    const plenos = Number(fila[1]);
    const ancho = (plenos / maxPlenos) * 100; // porcentaje

    html += `
      <tr>
        <td>${jugador}</td>
        <td>
          <div class="barra-contenedor">
            <div class="barra" style="width:${ancho}%"></div>
            <span class="barra-num">${plenos}</span>
          </div>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  document.getElementById("tablaPlenos").innerHTML = html;
}

cargarTablaPlenos();
