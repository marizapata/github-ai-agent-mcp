
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
import { listIssuesSchema } from "./schemas/list-issues.schema.js";
import { createRepositorySchema } from "./schemas/repository.schema.js";
import { createIssueSchema } from "./schemas/issue.schema.js";
import { createCommitSchema } from "./schemas/create-commit.schema.js";

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
    async () => {
      const result = await helloWorldTool.execute();

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
        ],
      };
    }
  );

  // Registramos la herramienta para listar repositorios
  server.registerTool(
    listRepositoriesTool.name,
    {
      description: listRepositoriesTool.description,
      inputSchema: {},
    },
    async (args) => {
      const result = await listRepositoriesTool.execute(args);

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
        ],
      };
    }
  );


  // Registramos la herramienta para listar incidencias
  server.registerTool(
    listIssuesTool.name,
    {
      description: listIssuesTool.description,
      inputSchema: listIssuesSchema.shape,
    },
    async (args) => {
      const result = await listIssuesTool.execute(args);

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
        ],
      };
    }
  );

  // Registramos la herramienta para crear repositorios
  server.registerTool(
    createRepositoryTool.name,
    {
      description: createRepositoryTool.description,
      inputSchema: createRepositorySchema.shape,
    },
    async (args) => {
      const result = await createRepositoryTool.execute(args);

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
        ],
      };
    }
  );

    // Registramos la herramienta para crear incidencias
  server.registerTool(
    createIssueTool.name,
    {
      description: createIssueTool.description,
      inputSchema: createIssueSchema.shape,
    },
    async (args) => {
      const result = await createIssueTool.execute(args);

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
        ],
      };
    }
  );

    // Registramos la herramienta para crear commits
  server.registerTool(
    createCommitTool.name,
    {
      description: createCommitTool.description,
      inputSchema: createCommitSchema.shape,
    },
    async (args) => {
      const result = await createCommitTool.execute(args);

      return {
        content: [
          {
            type: "text",
            text: result.message,
          },
        ],
      };
    }
  );

  return server;
}

// Inicio del servidor y conexión mediante stdio
export async function start() {
  const server = createMcpServer();

  const transport = new StdioServerTransport();

  await server.connect(transport);
}
