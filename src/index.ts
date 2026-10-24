/*
 * Punto de entrada de nuestra aplicación.
 * Importamos la función que inicia el servidor MCP
 * y la ejecutamos para poner en marcha el proyecto.
 */

import { start } from "./server.js";

// Función principal que inicia el servidor
async function main() {
  await start();
}

// Ejecutamos la función principal y manejamos posibles errores
main().catch((error) => {
  console.error("Error al iniciar el servidor MCP:", error);
  process.exit(1);
});
