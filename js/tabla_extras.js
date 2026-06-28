console.log("tabla_extras.js SE EJECUTA");

// Lee la tabla publicada en HTML
async function fetchSheetHTML(gid) {
    const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTyE_EmllyYW1HTSoqqYfX1Porlca7ONGjK5uBLl45v4dGPtcRxuvihtZHW5uPoNyOlF9gqOYWRgYW-/pubhtml?gid=${gid}&single=true`;

    const respuesta = await fetch(url);
    const html = await respuesta.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Google coloca la tabla dentro de #sheets-viewport
    const tablaReal = doc.querySelector("#sheets-viewport table");

    if (!tablaReal) {
        console.warn("No se encontró la tabla dentro de #sheets-viewport");
        return [];
    }

    const filas = [];
    tablaReal.querySelectorAll("tr").forEach(tr => {
        const celdas = Array.from(tr.querySelectorAll("td, th"))
            .map(td => td.textContent.trim());
        filas.push(celdas);
    });

    return filas;
}

// Pinta la tabla en el HTML
async function pintarTablaExtras() {
    const datos = await fetchSheetHTML(311091473);
    console.log("DATOS:", datos);

    const tabla = document.getElementById("tabla_extras");

    datos.forEach(fila => {
        const tr = document.createElement("tr");
        fila.forEach(celda => {
            const td = document.createElement("td");
            td.textContent = celda;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });
}

pintarTablaExtras();

