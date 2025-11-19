import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonAvatar,
  IonText,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { personCircleOutline, personOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Tab3.css';

const Tab3: React.FC = () => {
  const history = useHistory();
  const { user, userData, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configurações</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Configurações</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Card de Perfil */}
        <IonCard>
          <IonCardHeader>
            <div className="profile-card-header">
              <IonAvatar className="profile-card-avatar">
                <IonIcon icon={personCircleOutline} />
              </IonAvatar>
              <div>
                <IonCardTitle>{userData?.name || 'Usuário'}</IonCardTitle>
                <IonText color="medium">
                  <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{user?.email}</p>
                </IonText>
              </div>
            </div>
          </IonCardHeader>
          <IonCardContent>
            <IonButton expand="block" onClick={() => history.push('/profile')}>
              <IonIcon slot="start" icon={personOutline} />
              Ver Perfil Completo
            </IonButton>
          </IonCardContent>
        </IonCard>

        {/* Lista de Opções */}
        <IonList>
          <IonItem button onClick={() => history.push('/profile')}>
            <IonIcon slot="start" icon={settingsOutline} color="primary" />
            <IonLabel>Editar Perfil</IonLabel>
          </IonItem>

          <IonItem button onClick={handleLogout} lines="none">
            <IonIcon slot="start" icon={logOutOutline} color="danger" />
            <IonLabel color="danger">Sair da Conta</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
