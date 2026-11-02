// Definición de la herramienta MCP para listar repositorios
import { listRepositoriesSchema } from "../schemas/list-repositories.schema.js";

// Información y comportamiento de la herramienta
export const listRepositoriesTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "list_repositories",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description: "Lista los repositorios del usuario autenticado en GitHub.",

  // Función que recibe los datos y valida que sean correctos
  execute: async (input: unknown) => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = listRepositoriesSchema.parse(input);

    // Devolvemos una respuesta temporal mientras construimos la herramienta
    // La consulta real a GitHub se implementará en el Hito 4
    return {
      message: "Los datos para listar los repositorios son válidos.",
    };
  },
};