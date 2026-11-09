
// Definición de la herramienta MCP para crear commits
import { createCommitSchema } from "../schemas/create-commit.schema.js";
import { createCommit } from "../clients/github/operations.js";
import type { ToolResponseDTO } from "../types.js";

// Información y comportamiento de la herramienta
export const createCommitTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "create_commit",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description:
    "Crea un commit para agregar o modificar un archivo en un repositorio de GitHub.",

  // Función que recibe los datos y ejecuta la operación
  execute: async (input: unknown): Promise<ToolResponseDTO> => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = createCommitSchema.parse(input);

    // Creamos el commit real en GitHub
    const commit = await createCommit(
      data.owner,
      data.repo,
      data.message,
      data.path,
      data.content
    );

    // Devolvemos la información principal del commit
    return {
      message: `Commit creado correctamente.

Archivo: ${commit.path}
SHA: ${commit.sha}
URL: ${commit.url}`,
    };
  },
};