import { z } from "zod"

export interface Comment {
  id: string
  reportId: string
  userId: string
  userName: string
  userEmail: string
  text: string
  createdAt: Date
}

export interface ResolvedVote {
  userId: string
  userName: string
  votedAt: Date
}

export const commentSchema = z.object({
  text: z
    .string()
    .min(3, "Comentário deve ter pelo menos 3 caracteres")
    .max(500, "Comentário muito longo"),
})

export type TCommentForm = z.infer<typeof commentSchema>

export interface ReportInteractions {
  favorites: string[] // Array de userIds que favoritaram
  resolvedVotes: ResolvedVote[] // Votos para marcar como resolvido
  commentsCount: number
}







