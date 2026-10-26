// Definición de nuestra primera herramienta MCP
export const helloWorldTool = {
  name: "hello_world",
  description: "Devuelve un saludo desde nuestro servidor MCP",

  execute: async () => {
    return {
      message: "¡Hola! Soy tu servidor MCP de GitHub.",
    };
  },
};
