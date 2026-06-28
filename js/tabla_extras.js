document.addEventListener("DOMContentLoaded", async () => {

    const GID_EXTRAS = "311091473"; // Resumen_extras
    const tabla = document.getElementById("tabla_extras");

    // Obtener datos de Google Sheets
    const datos = await fetchSheet(GID_EXTRAS);

    if (!datos || datos.length === 0) {
        tabla.innerHTML = "<tr><td>No hay datos disponibles</td></tr>";
        return;
    }

    // Cabeceras (A–F)
    const headers = [
        "Usuario",
        "Goles 1ª fase",
        "Máx. goleador español",
        "Goles pichichi España",
        "Primera amarilla España",
        "Total"
    ];

    // THEAD
    const thead = document.createElement("thead");
    const trHead = document.createElement("tr");

    headers.forEach(h => {
        const th = document.createElement("th");
        th.textContent = h;
        trHead.appendChild(th);
    });

    thead.appendChild(trHead);
    tabla.appendChild(thead);

    // TBODY
    const tbody = document.createElement("tbody");

    datos.forEach(row => {
        const tr = document.createElement("tr");

        for (let i = 0; i < 6; i++) {
            const td = document.createElement("td");
            td.textContent = row[i] || "0";
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    });

    tabla.appendChild(tbody);

    // --- ORDENACIÓN POR COLUMNAS ---
    function ordenarTablaPorColumna(tabla, columnaIndex) {
        const tbody = tabla.querySelector("tbody");
        const filas = Array.from(tbody.querySelectorAll("tr"));

        const th = tabla.querySelectorAll("th")[columnaIndex];
        const asc = !th.classList.contains("asc");

        tabla.querySelectorAll("th").forEach(th => th.classList.remove("asc", "desc"));
        th.classList.add(asc ? "asc" : "desc");

        filas.sort((a, b) => {
            const A = a.children[columnaIndex].textContent.trim();
            const B = b.children[columnaIndex].textContent.trim();

            const numA = parseFloat(A.replace(",", "."));
            const numB = parseFloat(B.replace(",", "."));

            if (!isNaN(numA) && !isNaN(numB)) {
                return asc ? numA - numB : numB - numA;
            }

            return asc ? A.localeCompare(B) : B.localeCompare(A);
        });

        filas.forEach(f => tbody.appendChild(f));
    }

    // Activar ordenación al hacer click en las cabeceras
    tabla.querySelectorAll("th").forEach((th, index) => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => ordenarTablaPorColumna(tabla, index));
    });

});
