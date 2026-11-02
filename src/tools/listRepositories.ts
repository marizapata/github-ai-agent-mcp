
// Definición de la herramienta MCP para listar repositorios
import { listRepositoriesSchema } from "../schemas/list-repositories.schema.js";
import { listRepositories } from "../clients/github/operations.js";

// Información y comportamiento de la herramienta
export const listRepositoriesTool = {
  // Nombre con el que identificaremos la herramienta en MCP
  name: "list_repositories",

  // Descripción que ayuda al LLM a identificar cuándo utilizarla
  description: "Lista los repositorios del usuario autenticado en GitHub.",

  // Función que recibe los datos y ejecuta la operación
  execute: async (input: unknown) => {
    // Validamos los datos recibidos utilizando el esquema de Zod
    listRepositoriesSchema.parse(input);

    // Consultamos los repositorios reales de GitHub
    const repositories = await listRepositories();

    // Comprobamos si el usuario tiene repositorios disponibles
    if (repositories.length === 0) {
      return {
        message: "No se encontraron repositorios en la cuenta de GitHub.",
      };
    }

    // Organizamos la información de los repositorios
    const repositoryList = repositories
      .map((repository) => {
        const visibility = repository.private ? "Privado" : "Público";
        const description = repository.description ?? "Sin descripción";

        return `- ${repository.full_name}
  Visibilidad: ${visibility}
  Descripción: ${description}
  URL: ${repository.html_url}`;
      })
      .join("\n\n");

    // Devolvemos los repositorios encontrados
    return {
      message: `Se encontraron ${repositories.length} repositorios:\n\n${repositoryList}`,
    };
  },
};
