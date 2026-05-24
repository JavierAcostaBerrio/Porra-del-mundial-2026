/// Actualiza el nombre del jugador en la ficha
function cargarFichaJugador(nombreJugador) {

    // Nombre en la cabecera (si existe)
    const nombreCabecera = document.getElementById("ficha-nombre");
    if (nombreCabecera) nombreCabecera.textContent = nombreJugador;

    // Nombre encima del gráfico
    const tituloEvolucion = document.getElementById("titulo-evolucion");
    if (tituloEvolucion) tituloEvolucion.textContent = nombreJugador;
}

// Evento del selector (fuera de la función)
document.getElementById("jugadorSelect").addEventListener("change", function() {
    cargarFichaJugador(this.value);
});

async function cargarAlineacion() {
    const sheetID = "1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I";
    const gid = "1503492419";

    const url = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?tqx=out:json&gid=${gid}`;

    try {
        const res = await fetch(url);
        const text = await res.text();
        const json = JSON.parse(text.substring(47, text.length - 2));

        const rows = json.table.rows;

        // Tomamos SOLO la fila del usuario actual
        // (si quieres filtrar por usuario logueado, dímelo)
        const fila = rows[0].c;

        const usuario = fila[0]?.v || "Usuario";
        const jugadores = fila.slice(1).map(c => c?.v || "-");

        // Mostrar usuario
        document.getElementById("alineacionUsuario").textContent =
            `Usuario: ${usuario}`;

        // Rellenar tabla
        const tbody = document.querySelector("#tablaAlineacion tbody");
        tbody.innerHTML = "";

        jugadores.forEach((jug, i) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${jug}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error cargando alineación:", error);
    }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", cargarAlineacion);
