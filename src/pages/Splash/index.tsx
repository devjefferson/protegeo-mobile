import { IonContent, IonIcon, IonPage, IonProgressBar, IonText } from "@ionic/react"
import { shieldOutline } from "ionicons/icons"
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { SplashScreen } from "@capacitor/splash-screen"
import "./splash.css"

const Splash: React.FC = () => {
  const history = useHistory()
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Esconder o splash nativo do Capacitor quando a tela React carregar
    const hideNativeSplash = async () => {
      try {
        await SplashScreen.hide()
      } catch {
        // Ignorar erro se não estiver rodando em plataforma nativa
      }
    }
    
    hideNativeSplash()

    // Animação de fade out antes de redirecionar
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 1000)

    const redirectTimer = setTimeout(() => {
      history.replace("/login")
    }, 1500)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(redirectTimer)
    }
  }, [history])

  return (
    <IonPage>
      <IonContent fullscreen className="splash-content">
        <div className={`splash-container ${fadeOut ? 'fade-out' : ''}`}>
          <div className="splash-logo">
            <IonIcon icon={shieldOutline} />
          </div>
          <IonText>
            <h1 className="splash-title">ProtegeOC</h1>
            <p className="splash-subtitle">Protegendo nossa cidade</p>
          </IonText>
          <IonProgressBar type="indeterminate" color="primary" className="splash-progress" />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Splash