import { z } from "zod"

export const profileSchema = z.object({
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome muito longo"),
  phone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(/^[\d\s()+-]+$/, "Telefone deve conter apenas números e símbolos válidos")
    .optional()
    .or(z.literal("")),
})

export type TProfileForm = z.infer<typeof profileSchema>







