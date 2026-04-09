// ===============================
//   Porra Mundial 2026 - main.js
// ===============================

console.log("Porra Mundial 2026 iniciada correctamente");

// Función para cargar CSV desde Google Sheets o /data/
async function cargarCSV(url) {
    const respuesta = await fetch(url);
    const texto = await respuesta.text();
    return texto
        .trim()
        .split("\n")
        .map(fila => fila.split(","));
}

// Ejemplo de uso (lo activaremos más adelante)
// cargarCSV("data/clasificacion.csv").then(data => {
//     console.log("Datos cargados:", data);
// });

