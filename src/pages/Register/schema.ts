import { z } from "zod"

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(100, "Nome muito longo"),
    email: z.string().email("E-mail inválido"),
    phone: z
      .string()
      .min(10, "Telefone inválido")
      .regex(/^[\d\s()+-]+$/, "Telefone deve conter apenas números e símbolos válidos"),
    password: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres")
      .max(50, "Senha muito longa"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

export type TRegisterForm = z.infer<typeof registerSchema>

