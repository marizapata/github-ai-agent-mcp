// Definición de la herramienta MCP para listar incidencias
import { listIssuesSchema } from "../schemas/list-issues.schema.js";

// Información y comportamiento de la herramienta
export const listIssuesTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "list_issues",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description:
    "Lista las incidencias abiertas de un repositorio de GitHub.",

  // Función que recibe los datos y valida que sean correctos
  execute: async (input: unknown) => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = listIssuesSchema.parse(input);

    // Devolvemos los datos validados mientras construimos la herramienta
    // La consulta real a GitHub se implementará en el Hito 4
    return {
      message: `Los datos para listar las incidencias de ${data.owner}/${data.repo} son válidos.`,
    };
  },
};