import { useState } from "react"
import { FirebaseAuthService } from "../../services/FirebaseAuthService"
import { useAuth } from "../../context/AuthContext"
import type { TAuthSession } from "../../models/Auth"

export type TLoginState = {
  loading: boolean
  error?: string
}

export const useLoginViewModel = () => {
  const { login } = useAuth()
  const [state, setState] = useState<TLoginState>({ loading: false })

  const submit = async (
    email: string,
    password: string
  ): Promise<TAuthSession | null> => {
    setState((s) => ({ ...s, loading: true, error: undefined }))
    try {
      const userCredential = await FirebaseAuthService.login(email, password)
      const user = userCredential.user
      
      // Buscar dados adicionais do usuário
      const userData = await FirebaseAuthService.getUserData(user.uid)
      
      // Criar sessão
      const session: TAuthSession = {
        user: {
          id: user.uid,
          email: user.email || "",
          name: userData?.name || user.displayName || "",
        },
        token: await user.getIdToken(),
      }
      
      login(session)
      return session
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao logar"
      setState((s) => ({ ...s, error: message }))
      return null
    } finally {
      setState((s) => ({ ...s, loading: false }))
    }
  }

  return { state, submit }
}
