
import { z } from "zod";

// Validamos los datos necesarios para listar incidencias abiertas
export const listIssuesSchema = z.object({
  // Usuario u organización propietaria del repositorio
  owner: z
    .string()
    .trim()
    .min(1, "El propietario del repositorio es obligatorio"),

  // Nombre del repositorio cuyas incidencias queremos consultar
  repo: z
    .string()
    .trim()
    .min(1, "El nombre del repositorio es obligatorio"),
});
