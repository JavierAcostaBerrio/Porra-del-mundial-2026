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
document.getElementById("selector-jugador").addEventListener("change", function() {
    cargarFichaJugador(this.value);
});
