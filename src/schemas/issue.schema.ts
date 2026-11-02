import { z } from "zod";

// Validamos los datos necesarios para crear una incidencia en GitHub
export const createIssueSchema = z.object({
  // Usuario u organización propietaria del repositorio
  owner: z
    .string()
    .trim()
    .min(1, "El propietario del repositorio es obligatorio"),

  // Nombre del repositorio donde se creará la incidencia
  repo: z
    .string()
    .trim()
    .min(1, "El nombre del repositorio es obligatorio"),

  // El título es obligatorio y no puede estar vacío o contener solo espacios
  title: z
    .string()
    .trim()
    .min(1, "El título de la incidencia es obligatorio"),

  // La descripción es opcional
  body: z
    .string()
    .optional(),
});