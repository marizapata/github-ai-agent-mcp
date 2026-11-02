// Definición de la herramienta MCP para crear repositorios
import { createRepositorySchema } from "../schemas/repository.schema.js";

// Información y comportamiento de la herramienta
export const createRepositoryTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "create_repository",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description:
    "Crea un nuevo repositorio en GitHub con un nombre y una descripción opcional.",

  // Función que recibe los datos y valida que sean correctos
  execute: async (input: unknown) => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = createRepositorySchema.parse(input);

    // Devolvemos los datos validados mientras construimos la herramienta
    // La operación real de GitHub se implementará en el Hito 4
    return {
      message: `Los datos para crear el repositorio "${data.name}" son válidos.`,
    };
  },
};