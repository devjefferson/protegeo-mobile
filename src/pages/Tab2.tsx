import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonChip,
  IonIcon,
  IonText,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonBadge,
  IonSkeletonText,
} from '@ionic/react';
import {
  locationOutline,
  timeOutline,
  personOutline,
  checkmarkCircleOutline,
  ellipseOutline,
  hourglassOutline,
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ReportData } from './ReportIncident/schema';
import './Tab2.css';

type FilterType = 'all' | 'pending' | 'in_progress' | 'resolved';

const Tab2: React.FC = () => {
  const history = useHistory();
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const reportsData: ReportData[] = [];
      
      // Tentar fazer query com filtro no Firestore
      if (filter !== 'all') {
        try {
          // Query com filtro de status
          const q = query(
            collection(db, 'reports'),
            where('status', '==', filter),
            orderBy('createdAt', 'desc')
          );
          
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            reportsData.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
              updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
            } as ReportData);
          });
        } catch (firestoreError: unknown) {
          // Se falhar (provavelmente falta índice composto), fazer fallback
          console.warn('Erro na query com filtro, usando fallback:', firestoreError);
          
          // Buscar todos os reports e filtrar no cliente
          const allQuery = query(
            collection(db, 'reports'),
            orderBy('createdAt', 'desc')
          );
          
          const allSnapshot = await getDocs(allQuery);
          allSnapshot.forEach((doc) => {
            const docData = doc.data();
            const data = {
              id: doc.id,
              ...docData,
              createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate() : docData.createdAt,
              updatedAt: docData.updatedAt?.toDate ? docData.updatedAt.toDate() : docData.updatedAt,
            } as ReportData;
            
            // Filtrar no lado do cliente - garantir que o status corresponda exatamente
            if (data.status && data.status === filter) {
              reportsData.push(data);
            }
          });
        }
      } else {
        // Sem filtro, buscar todos
        const q = query(
          collection(db, 'reports'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          reportsData.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
          } as ReportData);
        });
      }

      setReports(reportsData);
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
      // Em caso de erro geral, garantir que o estado seja limpo
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadReports();
    event.detail.complete();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_progress':
        return 'primary';
      case 'resolved':
        return 'success';
      default:
        return 'medium';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return ellipseOutline;
      case 'in_progress':
        return hourglassOutline;
      case 'resolved':
        return checkmarkCircleOutline;
      default:
        return ellipseOutline;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_progress':
        return 'Em Andamento';
      case 'resolved':
        return 'Resolvido';
      default:
        return status;
    }
  };

  const formatDate = (date: Date | { toDate: () => Date } | undefined) => {
    if (!date) return '';
    
    const d = typeof date === 'object' && 'toDate' in date ? date.toDate() : new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Hoje';
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      return `${diffDays} dias atrás`;
    } else {
      return d.toLocaleDateString('pt-BR');
    }
  };

  const filteredCount = reports.length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ocorrências</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSegment 
            value={filter} 
            onIonChange={(e) => {
              const newFilter = e.detail.value as FilterType;
              if (newFilter && newFilter !== filter) {
                setFilter(newFilter);
              }
            }}
          >
            <IonSegmentButton value="all">
              <IonLabel>Todas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pending">
              <IonLabel>Pendentes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="in_progress">
              <IonLabel>Em Andamento</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="resolved">
              <IonLabel>Resolvidas</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="ion-padding">
          {/* Contador de ocorrências */}
          <div className="reports-counter">
            <IonText color="medium">
              <small>
                {loading ? (
                  'Carregando...'
                ) : filteredCount === 0 ? (
                  'Nenhuma ocorrência encontrada'
                ) : (
                  `${filteredCount} ocorrência${filteredCount !== 1 ? 's' : ''} encontrada${
                    filteredCount !== 1 ? 's' : ''
                  }`
                )}
              </small>
            </IonText>
          </div>

          {/* Loading skeleton */}
          {loading ? (
            <>
              {[1, 2, 3].map((i) => (
                <IonCard key={i}>
                  <IonCardHeader>
                    <IonSkeletonText animated style={{ width: '60%' }} />
                    <IonSkeletonText animated style={{ width: '40%' }} />
                  </IonCardHeader>
                  <IonCardContent>
                    <IonSkeletonText animated style={{ width: '100%' }} />
                    <IonSkeletonText animated style={{ width: '80%' }} />
                  </IonCardContent>
                </IonCard>
              ))}
            </>
          ) : reports.length === 0 ? (
            /* Mensagem vazia */
            <div className="empty-state">
              <IonIcon icon={ellipseOutline} className="empty-icon" />
              <IonText>
                <h3>Nenhuma ocorrência</h3>
                <p>
                  {filter === 'all'
                    ? 'Não há ocorrências registradas ainda.'
                    : `Não há ocorrências com status "${getStatusLabel(filter)}".`}
                </p>
              </IonText>
            </div>
          ) : (
            /* Lista de ocorrências */
            reports.map((report) => (
              <IonCard 
                key={report.id} 
                className="report-card" 
                button
                onClick={() => history.push(`/report/${report.id}`)}
              >
                {/* Foto de capa */}
                {report.photos && report.photos.length > 0 && (
                  <div className="report-image-container">
                    <img
                      src={report.photos[0]}
                      alt={report.title}
                      className="report-image"
                    />
                  </div>
                )}

                <IonCardHeader>
                  <div className="card-header-row">
                    <IonCardTitle className="report-title">{report.title}</IonCardTitle>
                    <IonChip color={getStatusColor(report.status)} className="status-chip">
                      <IonIcon icon={getStatusIcon(report.status)} />
                      <IonLabel>{getStatusLabel(report.status)}</IonLabel>
                    </IonChip>
                  </div>
                  <IonCardSubtitle>
                    <IonBadge color="primary" className="category-badge">
                      {report.category}
                    </IonBadge>
                  </IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent>
                  <IonText color="medium">
                    <p className="report-description">{report.description}</p>
                  </IonText>

                  <div className="report-meta">
                    <div className="meta-item">
                      <IonIcon icon={personOutline} />
                      <IonText color="medium">
                        <small>{report.userName}</small>
                      </IonText>
                    </div>

                    <div className="meta-item">
                      <IonIcon icon={timeOutline} />
                      <IonText color="medium">
                        <small>{formatDate(report.createdAt)}</small>
                      </IonText>
                    </div>

                    {report.latitude && report.longitude && (
                      <div className="meta-item">
                        <IonIcon icon={locationOutline} />
                        <IonText color="medium">
                          <small>
                            {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                          </small>
                        </IonText>
                      </div>
                    )}
                  </div>

                  {/* Badge de fotos */}
                  {report.photos && report.photos.length > 1 && (
                    <div className="photos-badge">
                      <IonBadge color="dark">
                        {report.photos.length} foto{report.photos.length !== 1 ? 's' : ''}
                      </IonBadge>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
