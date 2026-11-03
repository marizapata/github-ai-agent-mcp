
import { describe, it, expect } from "vitest";
import { createRepositorySchema } from "../src/schemas/repository.schema.js";

import {
  ValidationError,
  AuthenticationError,
  GitHubAPIError,
  NetworkError,
  normalizeError,
} from "../src/errors/index.js";

describe("normalizeError", () => {
  it("debe clasificar correctamente los errores de validación, autenticación, API y conexión", () => {
    // Error de validación de Zod.
    const validation = createRepositorySchema.safeParse({
      name: "ab",
    });

    if (validation.success) {
      throw new Error("La validación debía fallar");
    }

    expect(normalizeError(validation.error))
      .toBeInstanceOf(ValidationError);

    // Error de autenticación 401.
    const authenticationError = Object.assign(
      new Error("Unauthorized"),
      { status: 401 }
    );

    expect(normalizeError(authenticationError))
      .toBeInstanceOf(AuthenticationError);

    // Error de API 404.
    const apiError = Object.assign(
      new Error("Not Found"),
      { status: 404 }
    );

    expect(normalizeError(apiError))
      .toBeInstanceOf(GitHubAPIError);

    // Error de conexión.
    const networkError = new Error("fetch failed");

    expect(normalizeError(networkError))
      .toBeInstanceOf(NetworkError);
  });
});