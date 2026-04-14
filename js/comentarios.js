async function cargarComentarios() {
    const url = "https://sheets.googleapis.com/v4/spreadsheets/1jsO5-D11KrtCsL8PRP7-iUuDbTDrt_V7mO8Upogea7I/values/Comentarios?alt=json&key=AIzaSyDxeb9BOxBZaavHHYXZGIZz2CP2WMIapyk";

    const res = await fetch(url);
    const data = await res.json();

    const filas = data.values.slice(1); // saltamos encabezados

    const lista = document.getElementById("listaComentarios");
    lista.innerHTML = "";

    filas.forEach(f => {
        const fecha = f[0];
        const comentario = f[1];

        const div = document.createElement("div");
        div.className = "comentario-item";
        div.innerHTML = `
            <h3>${fecha}</h3>
            <p>${comentario.replace(/\n/g, "<br>")}</p>
        `;
        lista.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", cargarComentarios);
