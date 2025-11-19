import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth } from "../config/firebase"
import { FirebaseAuthService, UserData } from "../services/FirebaseAuthService"
import type { TAuthSession } from "../models/Auth"

type AuthContextValue = {
  session: TAuthSession | null
  user: User | null
  userData: UserData | null
  isAuthenticated: boolean
  loading: boolean
  login: (session: TAuthSession) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<TAuthSession | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Observar mudanças no estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true)
      
      if (firebaseUser) {
        setUser(firebaseUser)
        
        // Buscar dados adicionais do usuário no Firestore
        const userDataFromDb = await FirebaseAuthService.getUserData(firebaseUser.uid)
        setUserData(userDataFromDb)
        
        // Criar sessão
        const authSession: TAuthSession = {
          user: {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: userDataFromDb?.name || firebaseUser.displayName || "",
          },
          token: await firebaseUser.getIdToken(),
        }
        
        setSession(authSession)
      } else {
        setUser(null)
        setUserData(null)
        setSession(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = (newSession: TAuthSession) => {
    setSession(newSession)
  }

  const logout = async () => {
    try {
      await FirebaseAuthService.logout()
      setSession(null)
      setUser(null)
      setUserData(null)
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const value = useMemo(
    () => ({
      session,
      user,
      userData,
      isAuthenticated: !!session,
      loading,
      login,
      logout,
    }),
    [session, user, userData, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return ctx
}
