// Definición de la herramienta MCP para crear incidencias
import { createIssueSchema } from "../schemas/issue.schema.js";

// Información y comportamiento de la herramienta
export const createIssueTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "create_issue",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description:
    "Crea una incidencia en un repositorio de GitHub con un título y una descripción opcional.",

  // Función que recibe los datos y valida que sean correctos
  execute: async (input: unknown) => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = createIssueSchema.parse(input);

    // Devolvemos los datos validados mientras construimos la herramienta
    // La operación real de GitHub se implementará en el Hito 4
    return {
      message: `Los datos para crear el issue "${data.title}" son válidos.`,
    };
  },
};