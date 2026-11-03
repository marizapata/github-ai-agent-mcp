
import { describe, it, expect } from "vitest";
import { createRepositorySchema } from "../src/schemas/repository.schema.js";

describe("createRepositorySchema", () => {
  it("debe aceptar un nombre válido y rechazar uno inválido", () => {
    const valid = createRepositorySchema.safeParse({
      name: "mi-repositorio",
      description: "Mi primer repositorio",
    });

    const invalid = createRepositorySchema.safeParse({
      name: "mi--repositorio",
    });

    expect(valid.success).toBe(true);
    expect(invalid.success).toBe(false);
  });
});