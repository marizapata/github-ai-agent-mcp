
import { ZodError } from "zod";

// Error cuando los datos recibidos no cumplen las validaciones
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Error cuando la autenticación o los permisos son incorrectos
export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

// Error cuando GitHub devuelve un error en su API
export class GitHubAPIError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GitHubAPIError";
    this.status = status;
  }
}

// Error cuando falla la conexión con GitHub
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

// Identificamos y clasificamos los errores del proyecto
export function normalizeError(error: unknown): Error {
  // Si el error ya está clasificado, lo conservamos
  if (
    error instanceof ValidationError ||
    error instanceof AuthenticationError ||
    error instanceof GitHubAPIError ||
    error instanceof NetworkError
  ) {
    return error;
  }

  // Identificamos los errores de validación de Zod
  if (error instanceof ZodError) {
    const details = error.issues
      .map((issue) => issue.message)
      .join("; ");

    return new ValidationError(
      `Los datos enviados no son válidos: ${details}`
    );
  }

  // Obtenemos el mensaje original del error
  const message = error instanceof Error ? error.message : "";

  // Identificamos el código HTTP devuelto por GitHub
  let status: number | undefined;

  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof error.status === "number"
  ) {
    status = error.status;
  }

  // Identificamos los errores de autenticación
  if (status === 401) {
    return new AuthenticationError(
      "El token de GitHub no es válido o ha expirado. Verifica tus credenciales."
    );
  }

  // Identificamos los problemas de permisos y límites de solicitudes
  if (status === 403 || status === 429) {
    if (/rate limit/i.test(message) || status === 429) {
      return new GitHubAPIError(
        "Se alcanzó el límite de solicitudes de GitHub. Espera un momento antes de intentarlo nuevamente.",
        status
      );
    }

    return new AuthenticationError(
      "No tienes permisos suficientes para realizar esta operación en GitHub."
    );
  }

  // Identificamos los recursos que no existen
  if (status === 404) {
    return new GitHubAPIError(
      "No se encontró el recurso solicitado en GitHub. Verifica el propietario y el nombre del repositorio.",
      status
    );
  }

  // Identificamos los datos que GitHub no puede procesar
  if (status === 422) {
    return new GitHubAPIError(
      "GitHub no pudo procesar la solicitud. Verifica los datos enviados.",
      status
    );
  }

  // Identificamos los problemas de conexión
  if (
    /fetch failed|network|ECONNRESET|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|ECONNREFUSED|socket hang up/i.test(
      message
    )
  ) {
    return new NetworkError(
      "No fue posible conectar con GitHub. Verifica tu conexión a internet e intenta nuevamente."
    );
  }

  // Identificamos otros errores HTTP
  if (status !== undefined) {
    return new GitHubAPIError(
      `GitHub respondió con un error HTTP ${status}.`,
      status
    );
  }

  // Error inesperado
  return new GitHubAPIError(
    "Ocurrió un error inesperado al comunicarse con GitHub."
  );
}