document.addEventListener("DOMContentLoaded", function () {
    const url = "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/export?format=csv&gid=444190468";

    fetch(url)
        .then(response => response.text())
        .then(csv => {
            const rows = csv.split("\n").map(r => r.split(","));
            
            // Crear tabla
            const table = document.getElementById("tabla");
            table.innerHTML = "";

            rows.forEach((row, index) => {
                const tr = document.createElement("tr");

                // Columnas B–F → índices 1 a 5
                const cols = row.slice(1, 6);

                cols.forEach(cell => {
                    const td = document.createElement(index === 0 ? "th" : "td");
                    td.textContent = cell.trim();
                    tr.appendChild(td);
                });

                table.appendChild(tr);
            });
        })
        .catch(err => console.error("Error cargando CSV:", err));
});


