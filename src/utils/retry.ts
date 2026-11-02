
import { logRetry } from "./logging.js";

// Configuración de los reintentos
interface RetryOptions {
  maxAttempts?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
}

// Identificamos el estado y los datos de un error HTTP
function getErrorData(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return {};
  }

  const data = error as {
    status?: unknown;
    response?: {
      status?: unknown;
      headers?: Record<string, unknown>;
    };
    message?: unknown;
  };

  return data;
}

// Obtenemos las cabeceras de la respuesta
function getHeader(error: unknown, name: string): string | undefined {
  const headers = getErrorData(error).response?.headers;

  if (!headers) return undefined;

  const key = Object.keys(headers).find(
    (header) => header.toLowerCase() === name.toLowerCase()
  );

  const value = key ? headers[key] : undefined;

  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : undefined;
}

// Determinamos si el error permite un reintento
function shouldRetry(error: unknown): boolean {
  const data = getErrorData(error);

  const status =
    typeof data.status === "number"
      ? data.status
      : data.response?.status;

  const message =
    typeof data.message === "string" ? data.message : "";

  // Errores HTTP temporales
  if ([429, 500, 502, 503, 504].includes(Number(status))) {
    return true;
  }

  // Error 403 únicamente cuando corresponde a rate limiting
  if (
    status === 403 &&
    (getHeader(error, "retry-after") !== undefined ||
      getHeader(error, "x-ratelimit-remaining") === "0" ||
      /rate limit/i.test(message))
  ) {
    return true;
  }

  // Errores temporales de conexión
  return /fetch failed|ECONNRESET|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|ECONNREFUSED|socket hang up/i.test(
    message
  );
}

// Calculamos el tiempo de espera antes del siguiente intento
function getRetryDelay(
  error: unknown,
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number
): number | null {
  const retryAfter = getHeader(error, "retry-after");

  if (retryAfter) {
    const seconds = Number(retryAfter);

    const delay = Number.isFinite(seconds)
      ? seconds * 1000
      : Date.parse(retryAfter) - Date.now();

    if (!Number.isFinite(delay) || delay < 0 || delay > maxDelayMs) {
      return null;
    }

    return delay;
  }

  const reset = getHeader(error, "x-ratelimit-reset");

  if (reset) {
    const delay = Number(reset) * 1000 - Date.now();

    if (!Number.isFinite(delay) || delay < 0 || delay > maxDelayMs) {
      return null;
    }

    return delay;
  }

  return Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
}

// Ejecutamos una operación con reintentos controlados
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelayMs = 500,
    maxDelayMs = 10000,
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      if (attempt === maxAttempts || !shouldRetry(error)) {
        throw error;
      }

      const delay = getRetryDelay(
        error,
        attempt,
        baseDelayMs,
        maxDelayMs
      );

      // Si GitHub solicita esperar demasiado, no reintentamos automáticamente
      if (delay === null) {
        throw error;
      }

      logRetry("github_operation", attempt, delay, error);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("No fue posible completar la operación.");
}