
// Configuración y creación del servidor MCP
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Importamos nuestras herramientas
import { helloWorldTool } from "./tools/helloWorld.js";
import { listRepositoriesTool } from "./tools/listRepositories.js";
import { listIssuesTool } from "./tools/listIssues.js";
import { createRepositoryTool } from "./tools/createRepository.js";
import { createIssueTool } from "./tools/createIssue.js";
import { createCommitTool } from "./tools/createCommit.js";

// Importamos los esquemas para validar los datos
import {
  listRepositoriesSchema,
  listIssuesSchema,
  createRepositorySchema,
  createIssueSchema,
  createCommitSchema,
} from "./schemas/index.js";

// Importamos las funciones para manejar los errores
import { normalizeError } from "./errors/index.js";
import { logError } from "./utils/logging.js";

// Importamos los tipos de datos
import type { ToolResponseDTO } from "./types.js";

// Ejecutamos las herramientas y manejamos sus posibles errores
async function executeTool(
  toolName: string,
  operation: () => Promise<ToolResponseDTO>
) {
  try {
    // Ejecutamos la operación de la herramienta
    const result = await operation();

    // Devolvemos el resultado exitoso
    return {
      content: [
        {
          type: "text" as const,
          text: result.message,
        },
      ],
    };
  } catch (error: unknown) {
    // Identificamos y clasificamos el error
    const normalizedError = normalizeError(error);

    // Registramos el error sin exponer credenciales
    logError(toolName, normalizedError);

    // Devolvemos un mensaje comprensible al cliente MCP
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: normalizedError.message,
        },
      ],
    };
  }
}

// Creamos el servidor MCP
export function createMcpServer() {
  const server = new McpServer({
    name: "github-ai-agent",
    version: "1.0.0",
  });

  // Registramos la herramienta de saludo
  server.registerTool(
    helloWorldTool.name,
    {
      description: helloWorldTool.description,
    },
    async () =>
      executeTool(
        helloWorldTool.name,
        () => helloWorldTool.execute()
      )
  );

  // Registramos la herramienta para listar repositorios
  server.registerTool(
    listRepositoriesTool.name,
    {
      description: listRepositoriesTool.description,
      inputSchema: listRepositoriesSchema.shape,
    },
    async (args) =>
      executeTool(
        listRepositoriesTool.name,
        () => listRepositoriesTool.execute(args)
      )
  );

  // Registramos la herramienta para listar incidencias
  server.registerTool(
    listIssuesTool.name,
    {
      description: listIssuesTool.description,
      inputSchema: listIssuesSchema.shape,
    },
    async (args) =>
      executeTool(
        listIssuesTool.name,
        () => listIssuesTool.execute(args)
      )
  );

  // Registramos la herramienta para crear repositorios
  server.registerTool(
    createRepositoryTool.name,
    {
      description: createRepositoryTool.description,
      inputSchema: createRepositorySchema.shape,
    },
    async (args) =>
      executeTool(
        createRepositoryTool.name,
        () => createRepositoryTool.execute(args)
      )
  );

  // Registramos la herramienta para crear incidencias
  server.registerTool(
    createIssueTool.name,
    {
      description: createIssueTool.description,
      inputSchema: createIssueSchema.shape,
    },
    async (args) =>
      executeTool(
        createIssueTool.name,
        () => createIssueTool.execute(args)
      )
  );

  // Registramos la herramienta para crear commits
  server.registerTool(
    createCommitTool.name,
    {
      description: createCommitTool.description,
      inputSchema: createCommitSchema.shape,
    },
    async (args) =>
      executeTool(
        createCommitTool.name,
        () => createCommitTool.execute(args)
      )
  );

  return server;
}

// Inicio del servidor y conexión mediante stdio
export async function start() {
  const server = createMcpServer();

  const transport = new StdioServerTransport();

  await server.connect(transport);
}
