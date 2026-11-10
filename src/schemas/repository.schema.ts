
import { z } from "zod";

// Validamos los datos necesarios para crear un repositorio
export const createRepositorySchema = z.object({
  name: z
    .string()
    .min(3, "El nombre debe tener mínimo 3 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres")
    .regex(
      /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/,
      "El nombre solo puede contener letras, números y guiones, sin guiones al inicio, al final ni consecutivos"
    )
    .describe("Nombre del nuevo repositorio de GitHub"),

  description: z
    .string()
    .max(500, "La descripción no puede superar los 500 caracteres")
    .optional()
    .describe("Descripción del propósito del repositorio (opcional)"),
});
