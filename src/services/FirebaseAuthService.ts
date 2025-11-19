import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "../config/firebase"

export interface UserData {
  uid: string
  name: string
  email: string
  phone?: string
  createdAt: Date
}

export class FirebaseAuthService {
  /**
   * Login com email e senha
   */
  static async login(email: string, password: string): Promise<UserCredential> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential
    } catch (error: any) {
      console.error("Erro no login:", error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Registrar novo usuário
   */
  static async register(
    email: string,
    password: string,
    name: string,
    phone?: string
  ): Promise<UserCredential> {
    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Salvar dados adicionais no Firestore
      const userData: UserData = {
        uid: user.uid,
        name,
        email,
        phone,
        createdAt: new Date(),
      }

      await setDoc(doc(db, "users", user.uid), userData)

      return userCredential
    } catch (error: any) {
      console.error("Erro no registro:", error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error: any) {
      console.error("Erro no logout:", error)
      throw new Error("Erro ao fazer logout")
    }
  }

  /**
   * Recuperar senha
   */
  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error("Erro ao recuperar senha:", error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Obter dados do usuário do Firestore
   */
  static async getUserData(uid: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        return userDoc.data() as UserData
      }
      return null
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error)
      return null
    }
  }

  /**
   * Obter usuário atual
   */
  static getCurrentUser(): User | null {
    return auth.currentUser
  }

  /**
   * Tratar erros do Firebase Auth
   */
  private static handleAuthError(error: any): Error {
    const errorCode = error.code

    switch (errorCode) {
      case "auth/invalid-email":
        return new Error("E-mail inválido")
      case "auth/user-disabled":
        return new Error("Usuário desabilitado")
      case "auth/user-not-found":
        return new Error("Usuário não encontrado")
      case "auth/wrong-password":
        return new Error("Senha incorreta")
      case "auth/email-already-in-use":
        return new Error("E-mail já está em uso")
      case "auth/weak-password":
        return new Error("Senha muito fraca")
      case "auth/network-request-failed":
        return new Error("Erro de conexão. Verifique sua internet")
      case "auth/too-many-requests":
        return new Error("Muitas tentativas. Tente novamente mais tarde")
      case "auth/invalid-credential":
        return new Error("Credenciais inválidas")
      default:
        return new Error("Erro ao autenticar. Tente novamente")
    }
  }
}







