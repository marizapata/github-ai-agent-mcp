// Definición de la herramienta MCP para crear un commit
import { createCommitSchema } from "../schemas/create-commit.schema.js";

// Información y comportamiento de la herramienta
export const createCommitTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "create_commit",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description:
    "Crea un commit para agregar o modificar un archivo en un repositorio de GitHub.",

  // Función que recibe los datos y valida que sean correctos
  execute: async (input: unknown) => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = createCommitSchema.parse(input);

    // Devolvemos los datos validados mientras construimos la herramienta
    // La operación real de GitHub se implementará en el Hito 4
    return {
      message: `Los datos para crear el commit "${data.message}" son válidos.`,
    };
  },
};