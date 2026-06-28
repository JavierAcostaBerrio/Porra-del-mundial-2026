console.log("sheet_html.js SE EJECUTA");
async function fetchSheetHTML(gid) {
    const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vTyE_EmllyYW1HTSoqqYfX1Porlca7ONGjK5uBLl45v4dGPtcRxuvihtZHW5uPoNyOlF9gqOYWRgYW-/pubhtml?gid=${gid}&single=true`;

    const respuesta = await fetch(url);
    const html = await respuesta.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Google publica varias tablas → elegimos la más grande
    const tablas = Array.from(doc.querySelectorAll("table"));

    if (tablas.length === 0) return [];

    let tablaReal = tablas[0];
    let maxFilas = 0;

    tablas.forEach(t => {
        const filas = t.querySelectorAll("tr").length;
        if (filas > maxFilas) {
            maxFilas = filas;
            tablaReal = t;
        }
    });

    const filas = [];
    tablaReal.querySelectorAll("tr").forEach(tr => {
        const celdas = Array.from(tr.querySelectorAll("td, th"))
            .map(td => td.textContent.trim());
        filas.push(celdas);
    });

    return filas;
}

