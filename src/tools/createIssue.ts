
// Definición de la herramienta MCP para crear incidencias
import { createIssueSchema } from "../schemas/issue.schema.js";
import { createIssue } from "../clients/github/operations.js";

// Información y comportamiento de la herramienta
export const createIssueTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "create_issue",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description:
    "Crea una incidencia en un repositorio de GitHub con un título y una descripción opcional.",

  // Función que recibe los datos y ejecuta la operación
  execute: async (input: unknown) => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = createIssueSchema.parse(input);

    // Creamos la incidencia real en GitHub
    const issue = await createIssue(
      data.owner,
      data.repo,
      data.title,
      data.body
    );

    // Devolvemos la información de la incidencia creada
    return {
      message: `Incidencia creada correctamente.

Número: #${issue.number}
Título: ${issue.title}
Estado: ${issue.state}
URL: ${issue.html_url}`,
    };
  },
};