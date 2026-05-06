document.addEventListener("DOMContentLoaded", function () {

    // URL del JSON de Google Sheets (gviz/tq)
    const SHEET_URL =
        "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=444190468";

    // Columnas A–F → índices 0 a 5 (slice no incluye el final)
    const COL_INICIO = 1;
    const COL_FIN = 6;

    // Tabla donde se pintarán los datos
    const tabla = document.getElementById("tabla-pronosticos");

    fetch(SHEET_URL)
        .then(res => res.text())
        .then(texto => {

            // Google envuelve el JSON, hay que limpiarlo
            const json = JSON.parse(texto.substring(47, texto.length - 2));

            const rows = json.table.rows;

            // Crear thead y tbody
            tabla.innerHTML = "";
            const thead = document.createElement("thead");
            const tbody = document.createElement("tbody");

            rows.forEach((row, index) => {
                const tr = document.createElement("tr");

                // Extraer columnas A–F
                const celdas = row.c.slice(COL_INICIO, COL_FIN);

                celdas.forEach(celda => {
                    const valor = celda ? celda.v : "";
                    const el = document.createElement(index === 0 ? "th" : "td");
                    el.textContent = valor;
                    tr.appendChild(el);
                });

                if (index === 0) {
                    thead.appendChild(tr);   // Primera fila → cabecera real
                } else {
                    tbody.appendChild(tr);   // Resto → cuerpo
                }
            });

            tabla.appendChild(thead);
            tabla.appendChild(tbody);
        })
        .catch(err => console.error("Error cargando datos:", err));
});
