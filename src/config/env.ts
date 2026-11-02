
/*
 * Configuración de variables de entorno.
 * Cargamos el archivo .env y verificamos que las variables
 * necesarias estén disponibles antes de usarlas.
 */
import "dotenv/config";

// Comprueba que una variable exista y tenga un valor.
function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta configurar la variable de entorno: ${name}`);
  }

  return value;
}

// Centralizamos las variables que necesita nuestra aplicación.
export const env = {
  GITHUB_TOKEN: required("GITHUB_TOKEN"),
};
