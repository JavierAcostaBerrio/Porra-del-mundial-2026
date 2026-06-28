document.addEventListener("DOMContentLoaded", async () => {

    const GID_EXTRAS = "311091473";
    const tabla = document.getElementById("tabla_extras");

    // Obtener datos reales del feed HTML
    const datos = await fetchSheetHTML(GID_EXTRAS);

    if (!datos || datos.length === 0) {
        tabla.innerHTML = "<tr><td>No hay datos disponibles</td></tr>";
        return;
    }

    // Cabeceras reales de la hoja (fila 0)
    const headers = datos[0];

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

    // TBODY (solo filas de datos)
    const tbody = document.createElement("tbody");

    datos.slice(1).forEach(row => {
        const tr = document.createElement("tr");

        row.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });

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

    tabla.querySelectorAll("th").forEach((th, index) => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => ordenarTablaPorColumna(tabla, index));
    });

});
