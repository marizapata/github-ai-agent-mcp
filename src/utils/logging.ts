
// Logger estructurado: todos los registros se envían a STDERR.

// Niveles de registro disponibles
type Level = "debug" | "info" | "warn" | "error";

const ORDER: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

// Evitamos mostrar credenciales en los registros
function sanitizeMessage(message: string): string {
  return message
    .replace(/github_pat_[A-Za-z0-9_]+/gi, "[TOKEN OCULTO]")
    .replace(/\bgh[pousr]_[A-Za-z0-9_]+\b/gi, "[TOKEN OCULTO]")
    .replace(/Bearer\s+\S+/gi, "Bearer [TOKEN OCULTO]");
}

// Escribimos los registros aplicando el nivel configurado
function write(
  level: Level,
  msg: string,
  context: Record<string, unknown> = {}
): void {
  const min = process.env.LOG_LEVEL ?? "info";

  if (min === "silent") return;

  const minLevel = min in ORDER ? (min as Level) : "info";

  if (ORDER[level] < ORDER[minLevel]) return;

  const line = {
    ts: new Date().toISOString(),
    level,
    msg,
    ...context,
  };

  // Sanitizamos todo el registro antes de escribirlo
  const safeLine = sanitizeMessage(JSON.stringify(line));

  process.stderr.write(safeLine + "\n");
}

// Logger principal del proyecto
export const logger = {
  debug: (msg: string, context?: Record<string, unknown>) =>
    write("debug", msg, context),

  info: (msg: string, context?: Record<string, unknown>) =>
    write("info", msg, context),

  warn: (msg: string, context?: Record<string, unknown>) =>
    write("warn", msg, context),

  error: (msg: string, context?: Record<string, unknown>) =>
    write("error", msg, context),
};

// Registramos errores sin exponer credenciales
export function logError(operation: string, error: unknown): void {
  const name = error instanceof Error ? error.name : "UnknownError";

  const message =
    error instanceof Error
      ? sanitizeMessage(error.message)
      : "Ocurrió un error desconocido.";

  logger.error(message, {
    operation,
    error: {
      name,
      message,
    },
  });
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

  logger.warn(message, {
    operation,
    attempt,
    delayMs,
  });
}
