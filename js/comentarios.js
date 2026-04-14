async function cargarClasificacion() {
    const res = await fetch("data/clasificacion.csv");
    const texto = await res.text();
    const filas = texto.trim().split("\n").map(f => f.split(","));
    const datos = filas.slice(1);

    return datos.map(f => ({
        jugador: f[0],
        puntos: Number(f[1])
    }));
}

async function cargarPosicionesPrevias() {
    try {
        const res = await fetch("data/posiciones.json");
        return await res.json();
    } catch {
        return {};
    }
}

function detectarEventos(actual, previas) {
    const subidas = [];
    const bajadas = [];
    const igualados = [];

    actual.forEach((fila, i) => {
        const posActual = i + 1;
        const posPrev = previas[fila.jugador] ?? posActual;

        if (posActual < posPrev) subidas.push(fila.jugador);
        else if (posActual > posPrev) bajadas.push(fila.jugador);
        else igualados.push(fila.jugador);
    });

    return {
        lider: actual[0].jugador,
        puntosLider: actual[0].puntos,
        subidas,
        bajadas,
        igualados
    };
}

function estiloCronica(eventos) {
    const { lider, puntosLider, subidas, bajadas } = eventos;

    return `
Nueva jornada completada y ${lider} sigue al frente con ${puntosLider} puntos. 
${subidas.length ? `Jornada brillante para ${subidas.join(", ")}, que escalan posiciones.` : ""}
${bajadas.length ? `Mal día para ${bajadas.join(", ")}, que pierden terreno.` : ""}
La emoción sigue creciendo en la porra del Mundial 2026.
`;
}

function estiloTheOffice(eventos) {
    const { lider, subidas, bajadas } = eventos;

    return `
Michael Scott entraría en la oficina gritando: “¡Atención todos! ${lider} es el nuevo Regional Manager de la clasificación”.
${subidas.length ? `${subidas.join(", ")} han tenido un día tan bueno que Dwight sospecha que han hecho trampas.` : ""}
${bajadas.length ? `${bajadas.join(", ")} han caído más que Stanley cuando oye la palabra 'trabajo extra'.` : ""}
Pam lo dibujaría todo en una pizarra adorable.
`;
}

function estiloStarWars(eventos) {
    const { lider, subidas, bajadas } = eventos;

    return `
En una galaxia no tan lejana, ${lider} se alza como Maestro Jedi de la clasificación.
${subidas.length ? `La Fuerza ha sido poderosa en ${subidas.join(", ")}, que ascienden como auténticos padawan.` : ""}
${bajadas.length ? `${bajadas.join(", ")} sienten una perturbación en la Fuerza mientras descienden.` : ""}
El equilibrio de la porra aún no está decidido.
`;
}

function estiloEpico(eventos) {
    const { lider, subidas, bajadas } = eventos;

    return `
Los vientos del destino soplan a favor de ${lider}, que domina la tabla como un héroe legendario.
${subidas.length ? `${subidas.join(", ")} cabalgan hacia la gloria.` : ""}
${bajadas.length ? `${bajadas.join(", ")} caen en la batalla de esta jornada.` : ""}
La epopeya continúa.
`;
}

function estiloMusical(eventos) {
    const { lider, subidas, bajadas } = eventos;

    return `
Si esta jornada fuera una canción, ${lider} estaría en el estribillo, brillando con fuerza.
${subidas.length ? `${subidas.join(", ")} han encontrado el ritmo perfecto.` : ""}
${bajadas.length ? `${bajadas.join(", ")} desafinan un poco esta semana.` : ""}
Pero la melodía de la porra sigue sonando.
`;
}

function estiloMarvel(eventos) {
    const { lider, subidas, bajadas } = eventos;

    return `
${lider} lidera la clasificación como si llevara el Guantelete del Infinito.
${subidas.length ? `${subidas.join(", ")} han activado su modo superhéroe.` : ""}
${bajadas.length ? `${bajadas.join(", ")} han sufrido un snap estadístico.` : ""}
El multiverso de la porra sigue expandiéndose.
`;
}

function estiloMedieval(eventos) {
    const { lider, subidas, bajadas } = eventos;

    return `
En los reinos de la Porra del Mundial, ${lider} se sienta en el trono de hierro de la clasificación.
${subidas.length ? `${subidas.join(", ")} ascienden como caballeros victoriosos.` : ""}
${bajadas.length ? `${bajadas.join(", ")} caen en desgracia ante la corte.` : ""}
La guerra por la corona continúa.
`;
}

function estiloF1(eventos) {
    const { lider, subidas, bajadas } = eventos;

    return `
Semáforo en verde y ${lider} mantiene la pole position una jornada más.
${subidas.length ? `${subidas.join(", ")} adelantan con DRS activado.` : ""}
${bajadas.length ? `${bajadas.join(", ")} pierden ritmo en este stint.` : ""}
La carrera por el título sigue abierta.
`;
}

function estiloComedia(eventos) {
    const { lider, subidas, bajadas } = eventos;

    return `
${lider} sigue arriba. No sabemos cómo, pero ahí está.
${subidas.length ? `${subidas.join(", ")} han tenido un día tan bueno que deberían jugar a la lotería.` : ""}
${bajadas.length ? `${bajadas.join(", ")} han tenido peor jornada que un lunes sin café.` : ""}
Y aún queda mucha porra por delante.
`;
}

function generarComentario(eventos) {
    const estilos = [
        estiloCronica,
        estiloTheOffice,
        estiloStarWars,
        estiloEpico,
        estiloMusical,
        estiloMarvel,
        estiloMedieval,
        estiloF1,
        estiloComedia
    ];

    const elegido = estilos[Math.floor(Math.random() * estilos.length)];
    return elegido(eventos);
}

document.addEventListener("DOMContentLoaded", async () => {
    const actual = await cargarClasificacion();
    const previas = await cargarPosicionesPrevias();
    const eventos = detectarEventos(actual, previas);

    const comentario = generarComentario(eventos);

    document.getElementById("comentarioJornada").textContent = comentario;
});
