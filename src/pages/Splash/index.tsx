import { IonContent, IonIcon, IonPage, IonProgressBar, IonText } from "@ionic/react"
import { shieldOutline } from "ionicons/icons"
import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import "./splash.css"

const Splash: React.FC = () => {
  const history = useHistory()

  useEffect(() => {
    const t = setTimeout(() => {
      history.replace("/login")
    }, 1200)
    return () => clearTimeout(t)
  }, [history])

  return (
    <IonPage>
      <IonContent fullscreen className="splash-content">
        <div className="splash-container">
          <div className="splash-logo">
            <IonIcon icon={shieldOutline} />
          </div>
          <IonText>
            <h1 className="splash-title">ProtegeOC</h1>
          </IonText>
          <IonProgressBar type="indeterminate" color="primary" className="splash-progress" />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Splash