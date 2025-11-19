import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDTmxk7WxXh90VJPSd8VpCDW1kp5-7f-Pc",
  authDomain: "protegeo.firebaseapp.com",
  projectId: "protegeo",
  storageBucket: "protegeo.firebasestorage.app",
  messagingSenderId: "950469561649",
  appId: "1:950469561649:web:bda7344dd9ef03782b3410",
  measurementId: "G-BX5GF7HE27",
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)

// Exportar serviços
export const auth = getAuth(app)
export const db = getFirestore(app)

export default app



