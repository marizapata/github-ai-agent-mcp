
/*
 * Punto de entrada de nuestra aplicación.
 * Importamos la función que inicia el servidor MCP
 * y la ejecutamos para poner en marcha el proyecto.
 */

import { start } from "./server.js";
import { logger } from "./utils/logging.js";

// Función principal que inicia el servidor
async function main() {
  logger.info("Iniciando servidor MCP");

  await start();

  logger.info("Servidor MCP iniciado correctamente");
}

// Ejecutamos la función principal y manejamos posibles errores
main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : "Ocurrió un error desconocido al iniciar el servidor.";

  logger.error("Error al iniciar el servidor MCP", {
    message,
  });

  process.exit(1);
});
