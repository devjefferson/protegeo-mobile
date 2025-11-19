import type { TAuthSession, TUser } from "../models/Auth"

const API_URL = import.meta.env.VITE_API_URL as string | undefined

export class AuthService {
  async login(email: string, password: string): Promise<TAuthSession> {
    if (API_URL) {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || "Falha no login")
        }
        const data = await res.json()
        // Expecting { token, user }
        return data as TAuthSession
      } catch (err) {
        throw err instanceof Error ? err : new Error("Erro de rede")
      }
    }

    // Fallback mock (sem backend configurado)
    const mockUser: TUser = {
      id: "1",
      name: "Usuário Demo",
      email,
    }
    return Promise.resolve({ token: "demo-token", user: mockUser })
  }

  logout(): Promise<void> {
    return Promise.resolve()
  }
}

export const authService = new AuthService()
