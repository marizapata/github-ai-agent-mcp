
/*
 * Cliente de GitHub.
 * Centralizamos la creación de Octokit para reutilizar
 * la misma configuración en las herramientas del proyecto.
 */
import { Octokit } from "@octokit/rest";
import { env } from "../../config/env.js";

// Creamos un cliente autenticado con nuestro token.
export function createOctokit() {
  return new Octokit({
    auth: env.GITHUB_TOKEN,
    userAgent: "github-ai-agent-mcp/1.0",
  });
}
