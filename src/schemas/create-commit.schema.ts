
import { z } from "zod";

// Validamos los datos necesarios para crear un commit en GitHub
export const createCommitSchema = z.object({
  // Usuario u organización propietaria del repositorio
  owner: z
    .string()
    .trim()
    .min(1, "El propietario del repositorio es obligatorio"),

  // Nombre del repositorio donde registraremos los cambios
  repo: z
    .string()
    .trim()
    .min(1, "El nombre del repositorio es obligatorio"),

  // Mensaje que explica los cambios realizados
  message: z
    .string()
    .trim()
    .min(1, "El mensaje del commit es obligatorio"),

  // Ruta del archivo que queremos crear o actualizar
  path: z
    .string()
    .trim()
    .min(1, "La ruta del archivo es obligatoria"),

  // Contenido que guardaremos en el archivo
  content: z.string(),
});
