console.log("tabla_extras.js SE EJECUTA");

document.addEventListener("DOMContentLoaded", function () {

    const SHEET_URL =
        "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?gid=311091473";

    const COL_INICIO = 0;
    const COL_FIN = 6;

    const tabla = document.getElementById("tabla-extras");

    fetch(SHEET_URL)
        .then(res => res.text())
        .then(texto => {

            const json = JSON.parse(texto.substring(47, texto.length - 2));

            const cols = json.table.cols;   // 👈 CABECERAS REALES
            const rows = json.table.rows;

            tabla.innerHTML = "";
            const thead = document.createElement("thead");
            const tbody = document.createElement("tbody");

            /* ============================
               CABECERAS DESDE json.table.cols
               ============================ */
            const trHead = document.createElement("tr");
            const cabeceras = cols.slice(COL_INICIO, COL_FIN);

            cabeceras.forEach(col => {
                const th = document.createElement("th");
                th.textContent = col.label || "";   // nombre de la columna
                trHead.appendChild(th);
            });

            thead.appendChild(trHead);

            /* ============================
               CUERPO DE LA TABLA
               ============================ */
            rows.forEach(row => {
                const tr = document.createElement("tr");
                const celdas = row.c.slice(COL_INICIO, COL_FIN);

                celdas.forEach(celda => {
                    const td = document.createElement("td");
                    td.textContent = celda ? celda.v : "";
                    tr.appendChild(td);
                });

                tbody.appendChild(tr);
            });

            tabla.appendChild(thead);
            tabla.appendChild(tbody);
        })
        .catch(err => console.error("Error cargando datos:", err));
});
