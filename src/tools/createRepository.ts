
// Definición de la herramienta MCP para crear repositorios
import { createRepositorySchema } from "../schemas/repository.schema.js";
import { createRepository } from "../clients/github/operations.js";

// Información y comportamiento de la herramienta
export const createRepositoryTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "create_repository",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description:
    "Crea un nuevo repositorio en GitHub con un nombre y una descripción opcional.",

  // Función que recibe los datos y ejecuta la operación
  execute: async (input: unknown) => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    const data = createRepositorySchema.parse(input);

    // Creamos el repositorio real en GitHub
    const repository = await createRepository(
      data.name,
      data.description
    );

    // Identificamos si el repositorio es público o privado
    const visibility = repository.private ? "Privado" : "Público";

    // Devolvemos la información del repositorio creado
    return {
      message: `Repositorio creado correctamente.

Nombre: ${repository.full_name}
Visibilidad: ${visibility}
Descripción: ${repository.description ?? "Sin descripción"}
URL: ${repository.html_url}`,
    };
  },
};