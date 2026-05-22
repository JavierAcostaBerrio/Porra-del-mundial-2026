async function cargarJugadores() {
    const url = "https://docs.google.com/spreadsheets/d/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/gviz/tq?tqx=out:json&gid=1371661770";

    const resp = await fetch(url);
    const text = await resp.text();
    const json = JSON.parse(text.substring(47, text.length - 2));

    const jugadores = json.table.rows.map(r => r.c[0]?.v).filter(Boolean);

    const select = document.getElementById("selector-jugador");
    select.innerHTML = jugadores.map(j => `<option value="${j}">${j}</option>`).join("");

    // Cargar ficha del primer jugador
    cargarFichaJugador(jugadores[0]);

    // Cambiar jugador
    select.addEventListener("change", e => {
        cargarFichaJugador(e.target.value);
    });
}
