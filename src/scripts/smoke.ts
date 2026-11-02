
/*
 * Prueba de conexión con GitHub.
 * Consultamos la identidad del usuario autenticado
 * para verificar que el token funciona correctamente.
 */
import { createOctokit } from "../clients/github/octokit.js";

async function main() {
  const octokit = createOctokit();

  const { data: user } =
    await octokit.rest.users.getAuthenticated();

  console.log(`Conectado a GitHub como: ${user.login}`);
}

// Informamos el error sin mostrar credenciales.
main().catch((error: unknown) => {
  console.error(
    "Error al comprobar la conexión con GitHub:",
    error instanceof Error ? error.message : "Error desconocido"
  );

  process.exitCode = 1;
});
