
import { z } from "zod";

// Validamos los datos necesarios para crear una incidencia en GitHub
export const createIssueSchema = z.object({
  // Usuario u organización propietaria del repositorio
  owner: z
    .string()
    .trim()
    .min(1, "El propietario del repositorio es obligatorio")
    .describe("Nombre del usuario u organización propietaria del repositorio"),

  // Nombre del repositorio donde se creará la incidencia
  repo: z
    .string()
    .trim()
    .min(1, "El nombre del repositorio es obligatorio")
    .describe("Nombre del repositorio donde se creará la incidencia"),

  // Título obligatorio de la incidencia
  title: z
    .string()
    .trim()
    .min(1, "El título de la incidencia es obligatorio")
    .describe("Título breve que identifica el problema o tarea"),

  // Descripción opcional
  body: z
    .string()
    .optional()
    .describe("Descripción detallada de la incidencia (opcional)"),
});