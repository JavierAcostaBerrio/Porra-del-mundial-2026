// Esta función se llamará cuando cambies el jugador en el selector
function cargarFichaJugador(nombreJugador) {

    // Actualizar el nombre en la cabecera (si lo usas)
    const nombreCabecera = document.getElementById("ficha-nombre");
    if (nombreCabecera) nombreCabecera.textContent = nombreJugador;

    // Actualizar el nombre encima del gráfico
    const tituloEvolucion = document.getElementById("titulo-evolucion");
    if (tituloEvolucion) tituloEvolucion.textContent = nombreJugador;

    document.getElementById("selector-jugador").addEventListener("change", function() {
    cargarFichaJugador(this.value);
}
