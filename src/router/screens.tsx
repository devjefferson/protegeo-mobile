import { Redirect, Route } from 'react-router-dom';
import Tab1 from '../pages/Tab1';
import Tab2 from '../pages/Tab2';
import Tab3 from '../pages/Tab3';
import Profile from '../pages/Profile';
import ReportIncident from '../pages/ReportIncident';
import ReportDetail from '../pages/ReportDetail';

// Componente com as rotas renderizadas
export const AppRoutes = () => (
  <>
    <Route exact path="/tab1" component={Tab1} />
    <Route exact path="/tab2" component={Tab2} />
    <Route path="/tab3" component={Tab3} />
    <Route exact path="/profile" component={Profile} />
    <Route exact path="/report-incident" component={ReportIncident} />
    <Route exact path="/report/:id" component={ReportDetail} />
    <Route exact path="/" render={() => <Redirect to="/tab1" />} />
  </>
);
