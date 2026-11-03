
import { describe, it, expect } from "vitest";
import { createIssueSchema } from "../src/schemas/issue.schema.js";

describe("createIssueSchema", () => {
  it("debe aceptar una incidencia válida y rechazar un título vacío", () => {
    const valid = createIssueSchema.safeParse({
      owner: "marizapata",
      repo: "github-ai-agent-mcp",
      title: "Error de prueba",
      body: "Descripción del problema",
    });

    const invalid = createIssueSchema.safeParse({
      owner: "marizapata",
      repo: "github-ai-agent-mcp",
      title: "   ",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});