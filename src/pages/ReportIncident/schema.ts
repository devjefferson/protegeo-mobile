import { z } from "zod"

export const categories = [
  "Alagamento",
  "Buraco na rua",
  "Poste caído",
  "Iluminação pública",
  "Lixo acumulado",
  "Árvore caída",
  "Esgoto",
  "Calçada danificada",
  "Semáforo com defeito",
  "Outros",
] as const

export type Category = (typeof categories)[number]

export const reportSchema = z.object({
  title: z
    .string()
    .min(5, "Título deve ter pelo menos 5 caracteres")
    .max(100, "Título muito longo"),
  description: z
    .string()
    .min(10, "Descrição deve ter pelo menos 10 caracteres")
    .max(700, "Descrição muito longa"),
  category: z.enum(categories, {
    message: "Selecione uma categoria",
  }),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
})

export type TReportForm = z.infer<typeof reportSchema>

export interface ReportData extends TReportForm {
  id?: string
  userId: string
  userName: string
  userEmail: string
  photos: string[] // URLs das fotos no Firebase Storage
  status: "pending" | "in_progress" | "resolved"
  createdAt: Date
  updatedAt: Date
}

