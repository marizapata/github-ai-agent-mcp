
// Definición de la herramienta MCP para listar incidencias
import { listIssuesSchema } from "../schemas/list-issues.schema.js";
import { listIssues } from "../clients/github/operations.js";
import type { ToolResponseDTO } from "../types.js";

// Información y comportamiento de la herramienta
export const listIssuesTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "list_issues",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description:
  "Consulta y devuelve las incidencias abiertas de un repositorio específico de GitHub. Requiere el nombre del propietario (owner) y del repositorio (repo). Excluye los Pull Requests y muestra el número, título, estado, etiquetas y URL de cada incidencia.",

  // Función que recibe los datos y ejecuta la operación
  execute: async (input: unknown): Promise<ToolResponseDTO> => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = listIssuesSchema.parse(input);

    // Consultamos las incidencias reales del repositorio en GitHub
    const issues = await listIssues(data.owner, data.repo);

    // Comprobamos si existen incidencias abiertas
    if (issues.length === 0) {
      return {
        message: `No se encontraron incidencias abiertas en ${data.owner}/${data.repo}.`,
      };
    }

    // Organizamos la información de las incidencias
    const issueList = issues
      .map((issue) => {
        const labels =
          issue.labels.length > 0
            ? issue.labels.join(", ")
            : "Sin etiquetas";

        return `- #${issue.number}: ${issue.title}
  Estado: ${issue.state}
  Etiquetas: ${labels}
  URL: ${issue.html_url}`;
      })
      .join("\n\n");

    // Devolvemos las incidencias encontradas
    return {
      message: `Se encontraron ${issues.length} incidencias abiertas en ${data.owner}/${data.repo}:\n\n${issueList}`,
    };
  },
};
