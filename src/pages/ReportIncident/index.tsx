import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonText,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  useIonToast,
  IonList,
  IonActionSheet,
} from "@ionic/react"
import {
  cameraOutline,
  imagesOutline,
  locationOutline,
  trashOutline,
  addOutline,
  checkmarkOutline,
} from "ionicons/icons"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { reportSchema, type TReportForm, categories, type ReportData } from "./schema"
import { useState, useEffect, useRef } from "react"
import { useHistory } from "react-router-dom"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { PageHeader } from "../../components/PageHeader"
import { useAuth } from "../../context/AuthContext"
import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore"
import { db } from "../../config/firebase"
import { serviceUploadsImage, type ImageState } from "../../services/uploads"
import "./report.css"

// Configure Mapbox token
mapboxgl.accessToken = 'pk.eyJ1IjoibmRpZXN1cGVyIiwiYSI6ImNtaGt5Y3NtbjF4YWwybXExNTNhZ3o5aWwifQ.80LbeDqjawZsb6jwBG0ksg';

const ReportIncident: React.FC = () => {
  const [present] = useIonToast()
  const history = useHistory()
  const { user, userData } = useAuth()
  const [loading, setLoading] = useState(false)
  const [photos, setPhotos] = useState<File[]>([])
  const [photoPreview, setPhotoPreview] = useState<string[]>([])
  const [showActionSheet, setShowActionSheet] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [loadingLocation, setLoadingLocation] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Refs e estados para o mapa
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  const { control, handleSubmit, formState, setValue } = useForm<TReportForm>({
    resolver: zodResolver(reportSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
      latitude: undefined,
      longitude: undefined,
    },
  })

  // Inicializar mapa com localização atual do usuário
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    let timeoutId: NodeJS.Timeout | null = null
    let isMounted = true

    // Função para inicializar o mapa com coordenadas
    const initializeMap = (center: [number, number]) => {
      if (!mapContainer.current || !isMounted) return

      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: center, // [lng, lat]
          zoom: 15,
        })

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

        map.current.on('load', () => {
          if (isMounted) {
            setMapLoaded(true)
          }
        })

        // Listener para clique no mapa
        map.current.on('click', (e) => {
          const { lng, lat } = e.lngLat
          setLocation({ lat, lng })
          setValue("latitude", lat)
          setValue("longitude", lng)
          present({
            message: "Localização definida no mapa!",
            duration: 1500,
            color: "success",
          })
        })

        // Mudar cursor ao passar sobre o mapa
        map.current.on('mouseenter', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = 'crosshair'
          }
        })

        map.current.on('mouseleave', () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = ''
          }
        })
      } catch (error) {
        console.error('Erro ao inicializar mapa:', error)
      }
    }

    // Tentar obter localização GPS primeiro
    if (navigator.geolocation) {
      setLoadingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!isMounted) return
          
          const { latitude, longitude } = position.coords
          const userLocation: [number, number] = [longitude, latitude] // [lng, lat]
          
          // Definir localização inicial
          setLocation({ lat: latitude, lng: longitude })
          setValue("latitude", latitude)
          setValue("longitude", longitude)
          
          // Inicializar mapa com localização do usuário
          timeoutId = setTimeout(() => {
            if (isMounted) {
              initializeMap(userLocation)
              setLoadingLocation(false)
            }
          }, 100)
        },
        (error) => {
          if (!isMounted) return
          
          console.warn('Erro ao obter localização GPS, usando coordenadas padrão:', error)
          // Fallback: usar coordenadas padrão (Natal, RN)
          const defaultLocation: [number, number] = [-35.2094, -5.7945] // [lng, lat]
          timeoutId = setTimeout(() => {
            if (isMounted) {
              initializeMap(defaultLocation)
              setLoadingLocation(false)
            }
          }, 100)
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      )
    } else {
      // Se geolocalização não estiver disponível, usar coordenadas padrão
      const defaultLocation: [number, number] = [-35.2094, -5.7945] // [lng, lat]
      timeoutId = setTimeout(() => {
        if (isMounted) {
          initializeMap(defaultLocation)
        }
      }, 100)
    }

    return () => {
      isMounted = false
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      if (map.current) {
        map.current.remove()
        map.current = null
        setMapLoaded(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Atualizar marcador quando localização mudar
  useEffect(() => {
    if (!map.current || !mapLoaded || !location) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }

    // Remover marcador anterior
    if (markerRef.current) {
      markerRef.current.remove()
    }

    // Criar novo marcador usando o mesmo modelo da Tab1 (marcador padrão do Mapbox)
    // Usando cor primary (azul) para novas ocorrências
    markerRef.current = new mapboxgl.Marker({
      color: '#3880ff' // Cor primary (azul) - mesma cor usada para "in_progress" na Tab1
    })
      .setLngLat([location.lng, location.lat])
      .addTo(map.current)

    // Centralizar mapa na localização
    map.current.flyTo({
      center: [location.lng, location.lat],
      zoom: 15,
      duration: 1000,
    })
  }, [location, mapLoaded])

  // Obter localização atual via GPS
  const getCurrentLocation = () => {
    setLoadingLocation(true)
    
    if (!navigator.geolocation) {
      present({
        message: "Geolocalização não suportada pelo navegador",
        duration: 2000,
        color: "warning",
      })
      setLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })
        setValue("latitude", latitude)
        setValue("longitude", longitude)
        present({
          message: "Localização capturada com sucesso!",
          duration: 1500,
          color: "success",
        })
        setLoadingLocation(false)
      },
      (error) => {
        console.error("Erro ao obter localização:", error)
        present({
          message: "Erro ao obter localização. Verifique as permissões.",
          duration: 2000,
          color: "danger",
        })
        setLoadingLocation(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  // Adicionar foto da câmera ou galeria
  const handleAddPhoto = (fromCamera: boolean) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = !fromCamera
    
    if (fromCamera) {
      input.capture = "environment"
    }

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = Array.from(target.files || []) as File[]
      
      if (files.length === 0) return

      // Limitar a 5 fotos
      if (photos.length + files.length > 5) {
        present({
          message: "Máximo de 5 fotos permitidas",
          duration: 2000,
          color: "warning",
        })
        return
      }

      setPhotos([...photos, ...files])

      // Criar preview
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPhotoPreview((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }

    input.click()
    setShowActionSheet(false)
  }

  // Remover foto
  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
    setPhotoPreview(photoPreview.filter((_, i) => i !== index))
  }

  // Obter endereço a partir de coordenadas (geocoding reverso)
  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string | null> => {
    try {
      const mapboxToken = mapboxgl.accessToken
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxToken}&language=pt`
      
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Erro na API do Mapbox: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.features && data.features.length > 0) {
        // Pegar o endereço mais relevante (geralmente o primeiro)
        const place = data.features[0]
        return place.place_name || null
      }
      
      return null
    } catch (error) {
      console.error("Erro ao obter endereço:", error)
      return null
    }
  }

  // Upload de fotos para o Supabase Storage
  const uploadPhotos = async (userId: string): Promise<string[]> => {
    setUploadingPhotos(true)
    setUploadProgress(0)
    
    const photoUrls: string[] = []
    const totalPhotos = photos.length
    
    try {
      // Fazer upload de cada foto sequencialmente para melhor controle
      for (let index = 0; index < photos.length; index++) {
        const photo = photos[index]
        
        try {
          // Validar arquivo antes do upload
          if (!photo || photo.size === 0) {
            throw new Error(`Foto ${index + 1} está vazia ou inválida`)
          }
          
          if (photo.size > 10 * 1024 * 1024) { // 10MB
            throw new Error(`Foto ${index + 1} é muito grande (máximo 10MB)`)
          }
          
          const timestamp = Date.now()
          const fileName = `${timestamp}_${index}_${photo.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
          const path = `reports/${userId}`
          
       
          
          // Converter File para ImageState (adicionar preview se necessário)
          const imageWithPreview: ImageState = Object.assign(photo, {
            preview: photoPreview[index] || '',
          })
          
          // Fazer upload usando o serviço do Supabase
          const imageUrl = await serviceUploadsImage({
            image: imageWithPreview,
            name: fileName,
            path: path,
          })
          
          
          // Validar URL retornada
          if (!imageUrl || typeof imageUrl !== 'string') {
            throw new Error(`URL inválida retornada para a foto ${index + 1}`)
          }
          
          photoUrls.push(imageUrl)
          
          // Atualizar progresso
          const progress = ((index + 1) / totalPhotos) * 100
          setUploadProgress(progress)
          
        } catch (error) {
          console.error(`Erro ao fazer upload da foto ${index + 1}:`, error)
          const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
          console.error('Detalhes do erro:', {
            error,
            photoName: photo.name,
            photoSize: photo.size,
            photoType: photo.type,
            photoIndex: index,
          })
          throw new Error(`Erro ao fazer upload da foto ${index + 1}: ${errorMessage}`)
        }
      }
      
      // Validar que todas as fotos foram enviadas
      if (photoUrls.length !== photos.length) {
        throw new Error(`Apenas ${photoUrls.length} de ${photos.length} fotos foram enviadas com sucesso`)
      }
      
      return photoUrls
    } finally {
      setUploadingPhotos(false)
      setUploadProgress(0)
    }
  }

  const onSubmit = async (data: TReportForm) => {
    if (!user || !userData) {
      present({
        message: "Você precisa estar logado para registrar uma ocorrência",
        duration: 2000,
        color: "danger",
      })
      return
    }

    if (photos.length === 0) {
      present({
        message: "Adicione pelo menos uma foto da ocorrência",
        duration: 2000,
        color: "warning",
      })
      return
    }

    if (!location) {
      present({
        message: "Adicione a localização da ocorrência",
        duration: 2000,
        color: "warning",
      })
      return
    }

    setLoading(true)
    try {
      // PASSO 1: Fazer upload das fotos primeiro no Supabase Storage
      present({
        message: "Fazendo upload das fotos...",
        duration: 2000,
        color: "primary",
      })
      
      const photoUrls = await uploadPhotos(user.uid)
      
      // Validar que temos URLs válidas
      if (!photoUrls || photoUrls.length === 0) {
        throw new Error("Nenhuma foto foi enviada com sucesso")
      }
      
      // PASSO 2: Obter endereço a partir das coordenadas
      present({
        message: "Obtendo endereço...",
        duration: 1500,
        color: "primary",
      })
      
      let address = null
      try {
        address = await getAddressFromCoordinates(location.lat, location.lng)
      } catch (error) {
        console.error("Erro ao obter endereço:", error)
        // Continuar mesmo se não conseguir obter o endereço
      }
      
      // Adicionar endereço na descrição se obtido com sucesso
      let finalDescription = data.description
      if (address) {
        finalDescription = `${data.description}\n\n📍 Localização: ${address}`
      }

      // PASSO 3: Salvar os links das fotos no Firestore
      present({
        message: "Salvando ocorrência...",
        duration: 1500,
        color: "primary",
      })

      const reportData: Omit<ReportData, "id"> = {
        ...data,
        description: finalDescription,
        userId: user.uid,
        userName: userData.name,
        userEmail: user.email || "",
        photos: photoUrls, // URLs das fotos já fazem upload no Supabase
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        latitude: location.lat,
        longitude: location.lng,
      }

      const reportRef = await addDoc(collection(db, "reports"), {
        ...reportData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Inicializar documento de interações
      await setDoc(doc(db, "report_interactions", reportRef.id), {
        favorites: [],
        resolvedVotes: [],
        commentsCount: 0,
      })

      present({
        message: "Ocorrência registrada com sucesso!",
        duration: 2000,
        color: "success",
      })

      // Redirecionar para lista de ocorrências ou home
      history.replace("/tab1")
    } catch (error) {
      console.error("Erro ao registrar ocorrência:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      present({
        message: `Erro ao registrar ocorrência: ${errorMessage}`,
        duration: 3000,
        color: "danger",
      })
    } finally {
      setLoading(false)
      setUploadingPhotos(false)
      setUploadProgress(0)
    }
  }

  return (
    <IonPage>
      <PageHeader title="Registrar Ocorrência" backHref="/tab1" />
      <IonContent className="ion-padding" fullscreen>
        <div className="report-container">
          <IonText color="medium" className="ion-padding-bottom">
            <p className="report-subtitle">
              Relate problemas na sua cidade e ajude a melhorar a comunidade
            </p>
          </IonText>

          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList>
              {/* Categoria */}
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <IonItem className={formState.errors.category ? "ion-invalid" : ""}>
                    <IonSelect
                      label="Categoria"
                      labelPlacement="floating"
                      placeholder="Selecione a categoria"
                      value={field.value}
                      onIonChange={(e) => field.onChange(e.detail.value)}
                    >
                      {categories.map((cat) => (
                        <IonSelectOption key={cat} value={cat}>
                          {cat}
                        </IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                )}
              />
              {formState.errors.category?.message && (
                <IonText color="danger" className="ion-padding-start">
                  <small>{formState.errors.category.message}</small>
                </IonText>
              )}

              {/* Título */}
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <IonItem className={formState.errors.title ? "ion-invalid" : ""}>
                    <IonInput
                      label="Título"
                      labelPlacement="floating"
                      placeholder="Ex: Buraco grande na Rua A"
                      value={field.value ?? ""}
                      onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                    />
                  </IonItem>
                )}
              />
              {formState.errors.title?.message && (
                <IonText color="danger" className="ion-padding-start">
                  <small>{formState.errors.title.message}</small>
                </IonText>
              )}

              {/* Descrição */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <IonItem className={formState.errors.description ? "ion-invalid" : ""}>
                    <IonTextarea
                      label="Descrição"
                      labelPlacement="floating"
                      placeholder="Descreva o problema em detalhes..."
                      rows={4}
                      value={field.value ?? ""}
                      onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                    />
                  </IonItem>
                )}
              />
              {formState.errors.description?.message && (
                <IonText color="danger" className="ion-padding-start">
                  <small>{formState.errors.description.message}</small>
                </IonText>
              )}
            </IonList>

            {/* Fotos */}
            <div className="report-section">
              <IonText>
                <h3 className="section-title">Fotos</h3>
                <p className="section-subtitle">Adicione até 5 fotos do problema</p>
              </IonText>

              <div className="photos-grid">
                {photoPreview.map((preview, index) => (
                  <div key={index} className="photo-item">
                    <img src={preview} alt={`Foto ${index + 1}`} />
                    <IonButton
                      className="remove-photo-btn"
                      fill="clear"
                      size="small"
                      color="danger"
                      onClick={() => removePhoto(index)}
                    >
                      <IonIcon icon={trashOutline} />
                    </IonButton>
                  </div>
                ))}

                {photos.length < 5 && (
                  <div className="add-photo-btn" onClick={() => setShowActionSheet(true)}>
                    <IonIcon icon={addOutline} />
                    <span>Adicionar foto</span>
                  </div>
                )}
              </div>
            </div>

            {/* Localização */}
            <div className="report-section">
              <IonText>
                <h3 className="section-title">Localização</h3>
                <p className="section-subtitle">Clique no mapa ou use o GPS para definir a localização</p>
              </IonText>

              {/* Mapa interativo */}
              <div ref={mapContainer} className="location-map" />

              {/* Botão GPS */}
              <IonButton
                expand="block"
                fill={location ? "solid" : "outline"}
                color={location ? "success" : "primary"}
                onClick={getCurrentLocation}
                disabled={loadingLocation}
                className="gps-button"
              >
                <IonIcon slot="start" icon={locationOutline} />
                {loadingLocation
                  ? "Obtendo localização..."
                  : location
                  ? "Localização capturada ✓"
                  : "Usar GPS para localização atual"}
              </IonButton>

              {location && (
                <IonText color="medium" className="ion-padding-top">
                  <small>
                    Coordenadas: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </small>
                </IonText>
              )}
            </div>

            {/* Botão de envio */}
            <IonButton
              type="submit"
              expand="block"
              className="submit-button"
              disabled={loading || uploadingPhotos || !formState.isValid || photos.length === 0 || !location}
            >
              <IonIcon slot="start" icon={checkmarkOutline} />
              {uploadingPhotos 
                ? `Enviando fotos... ${Math.round(uploadProgress)}%`
                : loading 
                ? "Salvando ocorrência..." 
                : "Registrar Ocorrência"}
            </IonButton>
            
            {uploadingPhotos && (
              <IonText color="medium" className="ion-padding-top">
                <small>Fazendo upload das fotos para o servidor...</small>
              </IonText>
            )}
          </form>
        </div>

        {/* Action Sheet para escolher foto */}
        <IonActionSheet
          isOpen={showActionSheet}
          onDidDismiss={() => setShowActionSheet(false)}
          header="Adicionar Foto"
          buttons={[
            {
              text: "Tirar Foto",
              icon: cameraOutline,
              handler: () => handleAddPhoto(true),
            },
            {
              text: "Escolher da Galeria",
              icon: imagesOutline,
              handler: () => handleAddPhoto(false),
            },
            {
              text: "Cancelar",
              role: "cancel",
            },
          ]}
        />
      </IonContent>
    </IonPage>
  )
}

export default ReportIncident

