import { lazy, Suspense } from "react"
import { IonReactRouter } from "@ionic/react-router"
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonPage,
  IonContent,
  IonSpinner,
} from "@ionic/react"
import { Redirect, Route } from "react-router-dom"
import { listOutline, personCircleOutline, homeOutline } from "ionicons/icons"
import { AppRoutes } from "./screens"
import { useAuth } from "../context/AuthContext"

// Lazy loading das páginas de autenticação
const Splash = lazy(() => import("../pages/Splash"))
const Login = lazy(() => import("../pages/Login"))
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"))
const Register = lazy(() => import("../pages/Register"))

// Componente de loading para Suspense
const PageLoader = () => (
  <IonPage>
    <IonContent className="ion-padding">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100%' 
      }}>
        <IonSpinner name="crescent" />
      </div>
    </IonContent>
  </IonPage>
)

export const AppRouter: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    )
  }

  return (
    <IonReactRouter>
      {isAuthenticated ? (
        <IonTabs>
          <IonRouterOutlet>
            {/* Se autenticado, garantir que /login e /splash redirecionem para /tab1 */}
            <Route exact path="/login" render={() => <Redirect to="/tab1" />} />
            <Route exact path="/splash" render={() => <Redirect to="/tab1" />} />
            <Route exact path="/forgot-password" render={() => <Redirect to="/tab1" />} />
            <Route exact path="/register" render={() => <Redirect to="/tab1" />} />
            <AppRoutes />
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/tab1">
              <IonIcon aria-hidden="true" icon={homeOutline} />
              <IonLabel>Início</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/tab2">
              <IonIcon aria-hidden="true" icon={listOutline} />
              <IonLabel>Ocorrências</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/tab3">
              <IonIcon aria-hidden="true" icon={personCircleOutline} />
              <IonLabel>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      ) : (
        <Suspense fallback={<PageLoader />}>
          <IonRouterOutlet>
            <Route exact path="/splash" component={Splash} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/" render={() => <Redirect to="/splash" />} />
          </IonRouterOutlet>
        </Suspense>
      )}
    </IonReactRouter>
  )
}
