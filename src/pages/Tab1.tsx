import {
  IonContent,
 
  IonPage,
 
  IonFab,
  IonFabButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonText,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  useIonToast,
} from '@ionic/react';
import {
  addOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { collection, query,  orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ReportData } from '../pages/ReportIncident/schema';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Tab1.css';

// Configure Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibmRpZXN1cGVyIiwiYSI6ImNtaGt5Y3NtbjF4YWwybXExNTNhZ3o5aWwifQ.80LbeDqjawZsb6jwBG0ksg';

const Tab1: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();

  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    loadUserReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Aguardar um pequeno delay para garantir que o container está renderizado
    const timeoutId = setTimeout(() => {
      if (!mapContainer.current) return;

      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-43.60066971402758, -22.898591281286024], // Natal, RN
          zoom: 5,
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Esperar o mapa carregar completamente
        map.current.on('load', () => {
          console.log('Mapa carregado e pronto para marcadores');
          setMapLoaded(true);
        });

        console.log('Mapa inicializado com sucesso');
      } catch (error) {
        console.error('Erro ao inicializar mapa:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (map.current) {
        map.current.remove();
        map.current = null;
        setMapLoaded(false);
      }
    };
  }, []);

  // Update markers when reports change
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      console.log('Aguardando mapa carregar...');
      return;
    }

    // Remove existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (reports.length === 0) {
      console.log('Nenhuma ocorrência para mostrar');
      return;
    }

    console.log(`Adicionando ${reports.length} marcadores ao mapa`);
    console.log(reports)
    // Add new markers
    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoordinates = false;
    let markersAdded = 0;

    reports.forEach((report) => {
      if (report.latitude && report.longitude) {
        console.log(`📍 Ocorrência: ${report.title}`);
        console.log(`   Latitude (raw): ${report.latitude} (tipo: ${typeof report.latitude})`);
        console.log(`   Longitude (raw): ${report.longitude} (tipo: ${typeof report.longitude})`);

        // Converter para número se necessário
        const lat = typeof report.latitude === 'number' ? report.latitude : parseFloat(String(report.latitude));
        const lng = typeof report.longitude === 'number' ? report.longitude : parseFloat(String(report.longitude));

     

        // Validar que não é NaN
        if (isNaN(lat) || isNaN(lng)) {
          console.error(`❌ Coordenadas NaN para: ${report.title}`);
          return;
        }

        // Validar range válido
        const isValidLat = lat >= -90 && lat <= 90;
        const isValidLng = lng >= -180 && lng <= 180;
        
        if (!isValidLat || !isValidLng) {
          console.warn(`⚠️ Coordenadas fora do range para: ${report.title}`);
          console.warn(`   Lat válido: ${isValidLat}, Lng válido: ${isValidLng}`);
          return;
        }

        hasValidCoordinates = true;
        markersAdded++;

        console.log(`✅ Adicionando marcador em [lng: ${lng}, lat: ${lat}]`);

        // Verificar se as coordenadas são válidas
        if (lng === 0 && lat === 0) {
          console.error(`⚠️ ATENÇÃO: Coordenadas (0, 0) - isso coloca no canto superior esquerdo!`);
        }

        // TESTE: Usar marcador padrão do Mapbox (mais simples)
        const marker = new mapboxgl.Marker({
          color: getMarkerColor(report.status)
        })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">${report.title}</h3>
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}</p>
                <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                  <span style="background: #3880ff; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${report.category}</span>
                  <span style="background: ${getStatusBgColor(report.status)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${getStatusLabel(report.status)}</span>
                </div>
                <button 
                  onclick="window.location.href='/report/${report.id}'" 
                  style="width: 100%; padding: 6px; background: #3880ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
                >
                  Ver Detalhes
                </button>
              </div>
              `
            )
          );
        
        console.log(`   Marcador criado com anchor 'bottom', coordenadas:`, marker.getLngLat());
        
        marker.addTo(map.current!);

        markersRef.current.push(marker);
        bounds.extend([lng, lat]);
        
        console.log(`✅ Marcador adicionado ao mapa para: ${report.title}`);
      } else {
        console.log(`Ocorrência sem coordenadas: ${report.title}`);
      }
    });

    console.log(`${markersAdded} marcadores adicionados com sucesso`);

    // Fit map to bounds if there are valid coordinates
    if (hasValidCoordinates && map.current) {
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      });
      console.log('Mapa ajustado para mostrar todos os marcadores');
    }
  }, [reports, mapLoaded]);

  const convertToDate = (timestamp: Date | Timestamp | unknown): Date => {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return new Date();
  };

  const loadUserReports = async () => {
    setLoading(true);
    try {
      // Buscar todas as ocorrências (sem filtro de usuário)
      try {
        const reportsQuery = query(
          collection(db, 'reports'),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(reportsQuery);
        const reportsData: ReportData[] = [];

        querySnapshot.forEach((doc) => {
          reportsData.push({
            id: doc.id,
            ...doc.data(),
          } as ReportData);
        });

        setReports(reportsData);
      } catch (orderError) {
        // Se falhar (ex: índice não criado), buscar sem ordenação
        console.warn('Buscando sem ordenação:', orderError);
        const reportsQuery = query(
          collection(db, 'reports')
        );

        const querySnapshot = await getDocs(reportsQuery);
        const reportsData: ReportData[] = [];

        querySnapshot.forEach((doc) => {
          reportsData.push({
            id: doc.id,
            ...doc.data(),
          } as ReportData);
        });

        // Ordenar manualmente
        reportsData.sort((a, b) => {
          const dateA = convertToDate(a.createdAt);
          const dateB = convertToDate(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });

        setReports(reportsData);
      }
    } catch (error) {
      console.error('Erro ao carregar ocorrências:', error);
      present({
        message: 'Erro ao carregar ocorrências',
        duration: 2000,
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    await loadUserReports();
    event.detail.complete();
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

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ffc409'; // warning
      case 'in_progress':
        return '#3880ff'; // primary
      case 'resolved':
        return '#2dd36f'; // success
      default:
        return '#92949c'; // medium
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#ffc409';
      case 'in_progress':
        return '#3880ff';
      case 'resolved':
        return '#2dd36f';
      default:
        return '#92949c';
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="map-fullscreen-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Map View */}
        <div ref={mapContainer} className="map-container" />
        
        {loading && (
          <div className="loading-overlay">
            <IonSpinner name="crescent" />
            <IonText color="medium">
              <p>Carregando mapa...</p>
            </IonText>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="map-empty-state">
            <IonCard>
              <IonCardHeader>
                <div className="card-header-with-icon">
                  <IonIcon icon={alertCircleOutline} color="primary" />
                  <IonCardTitle>Nenhuma Ocorrência</IonCardTitle>
                </div>
              </IonCardHeader>
              <IonCardContent>
                <IonText color="medium">
                  <p>
                    Nenhuma ocorrência encontrada. Seja o primeiro a relatar um problema
                    na sua cidade!
                  </p>
                </IonText>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        {!loading && reports.length > 0 && (
          <div className="map-legend">
            <div className="legend-item">
              <div className="legend-marker" style={{ backgroundColor: '#ffc409' }}></div>
              <span style={{ color: '#000000' }}>Pendente ({reports.filter((r) => r.status === 'pending').length})</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker" style={{ backgroundColor: '#3880ff' }}></div>
              <span style={{ color: '#000000' }}>Em Andamento ({reports.filter((r) => r.status === 'in_progress').length})</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker" style={{ backgroundColor: '#2dd36f' }}></div>
              <span style={{ color: '#000000' }}>Resolvido ({reports.filter((r) => r.status === 'resolved').length})</span>
            </div>
          </div>
        )}

        {/* Botão flutuante para adicionar ocorrência */}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => history.push('/report-incident')}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
