
 // Evitamos mostrar credenciales en los registros
function sanitizeMessage(message: string): string {
  return message
    .replace(/github_pat_[A-Za-z0-9_]+/gi, "[TOKEN OCULTO]")
    .replace(/\bgh[pousr]_[A-Za-z0-9_]+\b/gi, "[TOKEN OCULTO]")
    .replace(/Bearer\s+\S+/gi, "Bearer [TOKEN OCULTO]");
}

// Registramos los errores del proyecto sin exponer información sensible
export function logError(operation: string, error: unknown): void {
  const name = error instanceof Error ? error.name : "UnknownError";

  const message =
    error instanceof Error
      ? sanitizeMessage(error.message)
      : "Ocurrió un error desconocido.";

  // Utilizamos console.error para escribir en stderr y no interferir con STDIO
  console.error(
    JSON.stringify({
      level: "error",
      timestamp: new Date().toISOString(),
      operation,
      error: {
        name,
        message,
      },
    })
  );
}

// Registramos los reintentos de las operaciones
export function logRetry(
  operation: string,
  attempt: number,
  delayMs: number,
  error: unknown
): void {
  const message =
    error instanceof Error
      ? sanitizeMessage(error.message)
      : "Error desconocido";

  console.error(
    JSON.stringify({
      level: "warn",
      timestamp: new Date().toISOString(),
      operation,
      attempt,
      delayMs,
      message,
    })
  );
}
