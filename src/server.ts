// Configuración y creación del servidor MCP
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Importamos nuestra herramienta de saludo
import { helloWorldTool } from "./tools/helloWorld.js";

export function createMcpServer() {
  const server = new McpServer({
    name: "github-ai-agent",
    version: "1.0.0",
  });
    // Registramos nuestra herramienta de saludo en el servidor MCP
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

  return server;
}

// Inicio del servidor y conexión mediante stdio
export async function start() {
  const server = createMcpServer();

  const transport = new StdioServerTransport();

  await server.connect(transport);
}
