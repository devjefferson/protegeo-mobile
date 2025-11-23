import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonText,
  IonCard,
  IonCardContent,
  IonChip,
  IonLabel,
  IonBadge,
  IonItem,
  IonTextarea,
  IonList,
  IonAvatar,
  IonSpinner,
  useIonToast,
  IonAlert,
} from "@ionic/react"
import {
  locationOutline,
  timeOutline,
  personOutline,
  heartOutline,
  heart,
  chatbubbleOutline,
  checkmarkDoneOutline,
  shareOutline,
  sendOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons"
import { useState, useEffect, useRef } from "react"
import { useParams, useHistory } from "react-router-dom"
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  increment,
} from "firebase/firestore"
import { db } from "../../config/firebase"
import { useAuth } from "../../context/AuthContext"
import { PageHeader } from "../../components/PageHeader"
import type { ReportData } from "../ReportIncident/schema"
import type { Comment, ReportInteractions } from "./schema"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { commentSchema, type TCommentForm } from "./schema"
import "./report-detail.css"

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const history = useHistory()
  const { user, userData } = useAuth()
  const [present] = useIonToast()

  const [report, setReport] = useState<ReportData | null>(null)
  const [interactions, setInteractions] = useState<ReportInteractions>({
    favorites: [],
    resolvedVotes: [],
    commentsCount: 0,
  })
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [showResolveAlert, setShowResolveAlert] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const { control, handleSubmit, formState, reset } = useForm<TCommentForm>({
    resolver: zodResolver(commentSchema),
    mode: "onChange",
    defaultValues: { text: "" },
  })

  useEffect(() => {
    loadReportData()
    setCurrentPhotoIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadReportData = async () => {
    setLoading(true)
    try {
      // Buscar dados da ocorrência
      const reportDoc = await getDoc(doc(db, "reports", id))

      if (!reportDoc.exists()) {
        present({
          message: "Ocorrência não encontrada",
          duration: 2000,
          color: "danger",
        })
        history.replace("/tab2")
        return
      }

      const reportData = {
        id: reportDoc.id,
        ...reportDoc.data(),
      } as ReportData

      setReport(reportData)

      // Buscar interações - criar se não existir
      const interactionsRef = doc(db, "report_interactions", id)
      const interactionsDoc = await getDoc(interactionsRef)
      
      if (interactionsDoc.exists()) {
        setInteractions(interactionsDoc.data() as ReportInteractions)
      } else {
        // Criar documento de interações se não existir
        const initialInteractions: ReportInteractions = {
          favorites: [],
          resolvedVotes: [],
          commentsCount: 0,
        }
        await setDoc(interactionsRef, initialInteractions)
        setInteractions(initialInteractions)
      }

      // Buscar comentários
      try {
        const commentsQuery = query(
          collection(db, "comments"),
          where("reportId", "==", id),
          orderBy("createdAt", "desc")
        )
        const commentsSnapshot = await getDocs(commentsQuery)
        const commentsData: Comment[] = []
        commentsSnapshot.forEach((doc) => {
          commentsData.push({
            id: doc.id,
            ...doc.data(),
          } as Comment)
        })
        setComments(commentsData)
      } catch (commentError) {
        // Se der erro (ex: índice não criado), buscar sem ordenação
        console.error("Erro ao buscar comentários ordenados, tentando sem ordenação:", commentError)
        try {
          const commentsQuery = query(
            collection(db, "comments"),
            where("reportId", "==", id)
          )
          const commentsSnapshot = await getDocs(commentsQuery)
          const commentsData: Comment[] = []
          commentsSnapshot.forEach((doc) => {
            commentsData.push({
              id: doc.id,
              ...doc.data(),
            } as Comment)
          })
          // Ordenar manualmente
          commentsData.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date()
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date()
            return dateB.getTime() - dateA.getTime()
          })
          setComments(commentsData)
        } catch (err) {
          console.error("Erro ao buscar comentários:", err)
          setComments([])
        }
      }
    } catch (error) {
      console.error("Erro ao carregar ocorrência:", error)
      present({
        message: "Erro ao carregar dados",
        duration: 2000,
        color: "danger",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFavorite = async () => {
    if (!user || !report) return

    const isFavorited = interactions.favorites.includes(user.uid)
    const interactionRef = doc(db, "report_interactions", id)

    try {
      // Usar setDoc com merge para criar se não existir
      await setDoc(
        interactionRef,
        {
          favorites: isFavorited ? arrayRemove(user.uid) : arrayUnion(user.uid),
        },
        { merge: true }
      )

      setInteractions((prev) => ({
        ...prev,
        favorites: isFavorited
          ? prev.favorites.filter((uid) => uid !== user.uid)
          : [...prev.favorites, user.uid],
      }))

      present({
        message: isFavorited ? "Removido dos favoritos" : "Adicionado aos favoritos",
        duration: 1500,
        color: "success",
      })
    } catch (error) {
      console.error("Erro ao favoritar:", error)
      present({
        message: "Erro ao processar ação",
        duration: 2000,
        color: "danger",
      })
    }
  }

  // Função para o dono da ocorrência aprovar a resolução
  const handleOwnerApproveResolution = async () => {
    if (!user || !report) return

    // Verificar se o usuário é o dono da ocorrência
    if (report.userId !== user.uid) {
      present({
        message: "Apenas o dono da ocorrência pode aprovar a resolução",
        duration: 2000,
        color: "warning",
      })
      return
    }

    try {
      const reportRef = doc(db, "reports", id)
      await updateDoc(reportRef, {
        status: "resolved",
        updatedAt: serverTimestamp(),
      })

      setReport((prev) => (prev ? { ...prev, status: "resolved" } : null))

      present({
        message: "Ocorrência marcada como resolvida! 🎉",
        duration: 2000,
        color: "success",
      })
    } catch (error) {
      console.error("Erro ao aprovar resolução:", error)
      present({
        message: "Erro ao aprovar resolução",
        duration: 2000,
        color: "danger",
      })
    }
  }

  // Função para outros usuários indicarem que acham que foi resolvido
  const handleResolveVote = async () => {
    if (!user || !userData || !report) return

    // Se for o dono, não pode votar (deve usar o botão de aprovar)
    if (report.userId === user.uid) {
      present({
        message: "Como dono da ocorrência, use o botão 'Aprovar Resolução'",
        duration: 2000,
        color: "info",
      })
      return
    }

    const hasVoted = interactions.resolvedVotes.some((vote) => vote.userId === user.uid)

    if (hasVoted) {
      present({
        message: "Você já indicou que esta ocorrência foi resolvida",
        duration: 2000,
        color: "warning",
      })
      return
    }

    try {
      const interactionRef = doc(db, "report_interactions", id)
      const newVote = {
        userId: user.uid,
        userName: userData.name,
        votedAt: new Date(),
      }

      // Usar setDoc com merge para criar se não existir
      await setDoc(
        interactionRef,
        {
          resolvedVotes: arrayUnion(newVote),
        },
        { merge: true }
      )

      const updatedVotes = [...interactions.resolvedVotes, newVote]

      present({
        message: "Sua indicação foi registrada! O dono da ocorrência precisa aprovar.",
        duration: 2000,
        color: "success",
      })

      setInteractions((prev) => ({
        ...prev,
        resolvedVotes: updatedVotes,
      }))
    } catch (error) {
      console.error("Erro ao registrar indicação:", error)
      present({
        message: "Erro ao registrar indicação",
        duration: 2000,
        color: "danger",
      })
    }
  }

  const onSubmitComment = async (data: TCommentForm) => {
    if (!user || !userData) return

    setSubmittingComment(true)
    try {
      // Adicionar comentário
      const commentData = {
        reportId: id,
        userId: user.uid,
        userName: userData.name,
        userEmail: user.email || "",
        text: data.text,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, "comments"), commentData)


      // Atualizar contador de comentários - usar setDoc com merge
      const interactionRef = doc(db, "report_interactions", id)
      await setDoc(
        interactionRef,
        {
          commentsCount: increment(1),
        },
        { merge: true }
      )

      present({
        message: "Comentário adicionado!",
        duration: 1500,
        color: "success",
      })

      reset()
      
      // Recarregar dados
      await loadReportData()
    } catch (error) {
      console.error("Erro ao adicionar comentário:", error)
      present({
        message: "Erro ao adicionar comentário",
        duration: 2000,
        color: "danger",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatDate = (date: Date | { toDate: () => Date } | undefined) => {
    if (!date) return ""

    const d = typeof date === "object" && "toDate" in date ? date.toDate() : new Date(date)
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "in_progress":
        return "primary"
      case "resolved":
        return "success"
      default:
        return "medium"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente"
      case "in_progress":
        return "Em Andamento"
      case "resolved":
        return "Resolvido"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <IonPage>
        <PageHeader title="Carregando..." backHref="/tab2" />
        <IonContent className="ion-padding">
          <div className="loading-container">
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
      </IonPage>
    )
  }

  if (!report) {
    return (
      <IonPage>
        <PageHeader title="Erro" backHref="/tab2" />
        <IonContent className="ion-padding">
          <IonText>
            <p>Ocorrência não encontrada</p>
          </IonText>
        </IonContent>
      </IonPage>
    )
  }

  const isFavorited = user ? interactions.favorites.includes(user.uid) : false
  const hasVoted = user
    ? interactions.resolvedVotes.some((vote) => vote.userId === user.uid)
    : false
  const votesCount = interactions.resolvedVotes.length
  const isOwner = user && report ? report.userId === user.uid : false

  return (
    <IonPage>
      <PageHeader title="Detalhes" backHref="/tab2" />
      <IonContent fullscreen>
        <div className="detail-container">
          {/* Galeria de Fotos - Carrossel */}
          {report.photos && report.photos.length > 0 && (
            <div className="photo-carousel-container">
              <div 
                ref={carouselRef}
                className="photo-carousel"
                onScroll={(e) => {
                  const container = e.currentTarget
                  const scrollLeft = container.scrollLeft
                  const itemWidth = container.clientWidth
                  const newIndex = Math.round(scrollLeft / itemWidth)
                  if (newIndex !== currentPhotoIndex) {
                    setCurrentPhotoIndex(newIndex)
                  }
                }}
              >
                {report.photos.map((photo, index) => (
                  <div key={index} className="photo-carousel-item">
                    <img src={photo} alt={`Foto ${index + 1}`} />
                  </div>
                ))}
              </div>
              
              {/* Botões de navegação */}
              {report.photos.length > 1 && (
                <>
                  {currentPhotoIndex > 0 && (
                    <button
                      className="carousel-nav-button carousel-nav-prev"
                      onClick={() => {
                        if (carouselRef.current) {
                          const itemWidth = carouselRef.current.clientWidth
                          carouselRef.current.scrollTo({
                            left: (currentPhotoIndex - 1) * itemWidth,
                            behavior: 'smooth'
                          })
                        }
                      }}
                    >
                      <IonIcon icon={chevronBackOutline} />
                    </button>
                  )}
                  
                  {currentPhotoIndex < report.photos.length - 1 && (
                    <button
                      className="carousel-nav-button carousel-nav-next"
                      onClick={() => {
                        if (carouselRef.current) {
                          const itemWidth = carouselRef.current.clientWidth
                          carouselRef.current.scrollTo({
                            left: (currentPhotoIndex + 1) * itemWidth,
                            behavior: 'smooth'
                          })
                        }
                      }}
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </button>
                  )}
                  
                  {/* Indicadores */}
                  <div className="carousel-indicators">
                    {report.photos.map((_, index) => (
                      <button
                        key={index}
                        className={`carousel-indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                        onClick={() => {
                          if (carouselRef.current) {
                            const itemWidth = carouselRef.current.clientWidth
                            carouselRef.current.scrollTo({
                              left: index * itemWidth,
                              behavior: 'smooth'
                            })
                          }
                        }}
                        aria-label={`Ir para foto ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  {/* Contador */}
                  <div className="carousel-counter">
                    {currentPhotoIndex + 1} / {report.photos.length}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Informações principais */}
          <div className="detail-content ion-padding">
            <div className="detail-header">
              <div>
                <h1 className="detail-title">{report.title}</h1>
                <IonBadge color="primary" className="category-badge">
                  {report.category}
                </IonBadge>
              </div>
              <IonChip color={getStatusColor(report.status)}>
                <IonLabel>{getStatusLabel(report.status)}</IonLabel>
              </IonChip>
            </div>

            <IonText color="medium">
              <p className="detail-description">{report.description}</p>
            </IonText>

            {/* Metadados */}
            <div className="detail-meta">
              <div className="meta-item">
                <IonIcon icon={personOutline} />
                <IonText>
                  <small>{report.userName}</small>
                </IonText>
              </div>
              <div className="meta-item">
                <IonIcon icon={timeOutline} />
                <IonText>
                  <small>{formatDate(report.createdAt)}</small>
                </IonText>
              </div>
              {report.latitude && report.longitude && (
                <div className="meta-item">
                  <IonIcon icon={locationOutline} />
                  <IonText>
                    <small>
                      {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                    </small>
                  </IonText>
                </div>
              )}
            </div>

            {/* Botões de ação */}
            <div className="action-buttons">
              <IonButton
                expand="block"
                fill={isFavorited ? "solid" : "outline"}
                color={isFavorited ? "danger" : "medium"}
                onClick={handleFavorite}
              >
                <IonIcon slot="start" icon={isFavorited ? heart : heartOutline} />
                {isFavorited ? "Favoritado" : "Favoritar"}
                {interactions.favorites.length > 0 && (
                  <IonBadge color="light" style={{ marginLeft: "8px" }}>
                    {interactions.favorites.length}
                  </IonBadge>
                )}
              </IonButton>

              {report.status !== "resolved" && user && (
                isOwner ? (
                  // Botão para o dono aprovar a resolução
                  <IonButton
                    expand="block"
                    fill="solid"
                    color="success"
                    onClick={() => setShowResolveAlert(true)}
                  >
                    <IonIcon slot="start" icon={checkmarkDoneOutline} />
                    Aprovar Resolução
                    {votesCount > 0 && (
                      <IonBadge color="light" style={{ marginLeft: "8px" }}>
                        {votesCount} indicação{votesCount !== 1 ? "ões" : ""}
                      </IonBadge>
                    )}
                  </IonButton>
                ) : (
                  // Botão para outros usuários indicarem que foi resolvido
                  <IonButton
                    expand="block"
                    fill={hasVoted ? "solid" : "outline"}
                    color={hasVoted ? "success" : "primary"}
                    onClick={() => setShowResolveAlert(true)}
                    disabled={hasVoted}
                  >
                    <IonIcon slot="start" icon={checkmarkDoneOutline} />
                    {hasVoted ? "Você já indicou" : "Indicar como Resolvida"}
                    {votesCount > 0 && (
                      <IonBadge color="light" style={{ marginLeft: "8px" }}>
                        {votesCount}
                      </IonBadge>
                    )}
                  </IonButton>
                )
              )}

              <IonButton expand="block" fill="clear" color="medium">
                <IonIcon slot="start" icon={shareOutline} />
                Compartilhar
              </IonButton>
            </div>

            {/* Indicações de resolução */}
            {votesCount > 0 && report.status !== "resolved" && (
              <IonCard className="votes-card">
                <IonCardContent>
                  <IonText>
                    <h3 className="votes-title">
                      {isOwner 
                        ? `Indicações de Resolução (${votesCount})`
                        : `Pessoas que indicaram como resolvida (${votesCount})`
                      }
                    </h3>
                    {isOwner && (
                      <IonText color="medium">
                        <p style={{ fontSize: "14px", marginTop: "8px" }}>
                          {votesCount === 1 
                            ? "1 pessoa indicou que sua ocorrência foi resolvida. Você pode aprovar a resolução."
                            : `${votesCount} pessoas indicaram que sua ocorrência foi resolvida. Você pode aprovar a resolução.`
                          }
                        </p>
                      </IonText>
                    )}
                  </IonText>
                  <div className="voters-list">
                    {interactions.resolvedVotes.map((vote, index) => (
                      <IonChip key={index} color="success">
                        <IonLabel>{vote.userName}</IonLabel>
                      </IonChip>
                    ))}
                  </div>
                </IonCardContent>
              </IonCard>
            )}

            {/* Seção de Comentários */}
            <div className="comments-section">
              <div className="comments-header">
                <h2>
                  <IonIcon icon={chatbubbleOutline} /> Comentários
                </h2>
                <IonBadge color="primary">{comments.length}</IonBadge>
              </div>

              {/* Formulário de novo comentário */}
              <form onSubmit={handleSubmit(onSubmitComment)} className="comment-form">
                <Controller
                  name="text"
                  control={control}
                  render={({ field }) => (
                    <IonTextarea
                      className="comment-textarea"
                      placeholder="Adicione um comentário..."
                      rows={3}
                      value={field.value ?? ""}
                      onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                    />
                  )}
                />
                {formState.errors.text?.message && (
                  <IonText color="danger">
                    <small>{formState.errors.text.message}</small>
                  </IonText>
                )}
                <IonButton
                  type="submit"
                  expand="block"
                  disabled={submittingComment || !formState.isValid}
                >
                  <IonIcon slot="start" icon={sendOutline} />
                  {submittingComment ? "Enviando..." : "Enviar Comentário"}
                </IonButton>
              </form>

              {/* Lista de comentários */}
              <IonList className="comments-list">
                {loading ? (
                  <IonText color="medium" className="ion-text-center">
                    <p>Carregando comentários...</p>
                  </IonText>
                ) : comments.length === 0 ? (
                  <div className="ion-text-center ion-padding">
                    <IonText color="medium">
                      <p>Nenhum comentário ainda.</p>
                      <p>Seja o primeiro a comentar!</p>
                    </IonText>
                  </div>
                ) : (
                  <>
                    {comments.map((comment) => (
                      <IonItem key={comment.id} lines="none" className="comment-item">
                        <IonAvatar slot="start">
                          <IonIcon icon={personOutline} />
                        </IonAvatar>
                        <IonLabel className="comment-label">
                          <h3>{comment.userName || "Usuário"}</h3>
                          <p>{comment.text}</p>
                          <IonText color="medium">
                            <small>{formatDate(comment.createdAt)}</small>
                          </IonText>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </>
                )}
              </IonList>
            </div>
          </div>
        </div>

        {/* Alert de confirmação de resolução */}
        <IonAlert
          isOpen={showResolveAlert}
          onDidDismiss={() => setShowResolveAlert(false)}
          header={isOwner ? "Aprovar Resolução" : "Indicar como Resolvida"}
          message={
            isOwner
              ? `Você confirma que este problema foi resolvido? ${votesCount > 0 ? `${votesCount} pessoa${votesCount !== 1 ? "s" : ""} já ${votesCount === 1 ? "indicou" : "indicaram"} que foi resolvido.` : ""} Ao aprovar, a ocorrência será marcada como resolvida.`
              : `Você indica que este problema foi resolvido? Sua indicação será registrada e o dono da ocorrência precisará aprovar para marcar como resolvida.`
          }
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
            },
            {
              text: isOwner ? "Aprovar" : "Indicar",
              handler: isOwner ? handleOwnerApproveResolution : handleResolveVote,
            },
          ]}
        />
      </IonContent>
    </IonPage>
  )
}

export default ReportDetail

