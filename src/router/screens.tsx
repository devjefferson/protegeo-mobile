import { lazy, Suspense } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonPage, IonContent, IonSpinner } from '@ionic/react';

// Lazy loading das páginas para code splitting
const Tab1 = lazy(() => import('../pages/Tab1'));
const Tab2 = lazy(() => import('../pages/Tab2'));
const Tab3 = lazy(() => import('../pages/Tab3'));
const Profile = lazy(() => import('../pages/Profile'));
const ReportIncident = lazy(() => import('../pages/ReportIncident'));
const ReportDetail = lazy(() => import('../pages/ReportDetail'));

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
);

// Componente com as rotas renderizadas
export const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Route exact path="/tab1" component={Tab1} />
    <Route exact path="/tab2" component={Tab2} />
    <Route path="/tab3" component={Tab3} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/report-incident" component={ReportIncident} />
    <Route exact path="/report/:id" component={ReportDetail} />
    <Route exact path="/" render={() => <Redirect to="/tab1" />} />
  </Suspense>
);
