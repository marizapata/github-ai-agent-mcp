// Configuración y creación del servidor MCP
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export function createMcpServer() {
  const server = new McpServer({
    name: "github-ai-agent",
    version: "1.0.0",
  });

  return server;
}

// Inicio del servidor y conexión mediante stdio
export async function start() {
  const server = createMcpServer();

  const transport = new StdioServerTransport();

  await server.connect(transport);
}