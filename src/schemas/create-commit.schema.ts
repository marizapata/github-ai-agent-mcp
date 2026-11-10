
import { z } from "zod";

// Validamos los datos necesarios para crear un commit en GitHub
export const createCommitSchema = z.object({
  // Usuario u organización propietaria del repositorio
  owner: z
    .string()
    .trim()
    .min(1, "El propietario del repositorio es obligatorio")
    .describe("Nombre del usuario u organización propietaria del repositorio"),

  // Nombre del repositorio donde registraremos los cambios
  repo: z
    .string()
    .trim()
    .min(1, "El nombre del repositorio es obligatorio")
    .describe("Nombre del repositorio donde se creará o actualizará el archivo"),

  // Mensaje que explica los cambios realizados
  message: z
    .string()
    .trim()
    .min(1, "El mensaje del commit es obligatorio")
    .describe("Mensaje que describe los cambios registrados en el commit"),

  // Ruta del archivo que queremos crear o actualizar
  path: z
    .string()
    .trim()
    .min(1, "La ruta del archivo es obligatoria")
    .describe("Ruta y nombre del archivo que se creará o actualizará en el repositorio"),

  // Contenido que guardaremos en el archivo
  content: z
    .string()
    .describe("Contenido de texto que se guardará dentro del archivo"),
});
