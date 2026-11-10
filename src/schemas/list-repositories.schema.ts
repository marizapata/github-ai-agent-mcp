import { z } from "zod";

// Definimos el esquema para listar los repositorios del usuario autenticado
export const listRepositoriesSchema = z.object({
  type: z
    .enum(["all", "public", "private"])
    .default("all")
    .describe("Qué repositorios listar"),

  sort: z
    .enum(["created", "updated", "pushed", "full_name"])
    .default("updated")
    .describe("Orden de los repositorios"),

  per_page: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(30)
    .describe("Cantidad de repositorios por página"),
});

// Tipo de los parámetros validados
export type ListRepositoriesInput = z.infer<
  typeof listRepositoriesSchema
>;