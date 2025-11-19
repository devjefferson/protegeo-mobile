import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
  useIonToast,
  IonAvatar,
  IonList,
  IonItemDivider,
} from "@ionic/react"
import { personCircleOutline, logOutOutline, saveOutline, pencilOutline,  } from "ionicons/icons"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, type TProfileForm } from "./schema"
import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { PageHeader } from "../../components/PageHeader"
import { useAuth } from "../../context/AuthContext"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../../config/firebase"
import "./profile.css"

const Profile: React.FC = () => {
  const [present] = useIonToast()
  const history = useHistory()
  const { user, userData, logout } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { control, handleSubmit, formState, reset } = useForm<TProfileForm>({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
    },
  })

  // Carregar dados do usuário quando o componente montar
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || "",
        phone: userData.phone || "",
      })
    }
  }, [userData, reset])

  const onSubmit = async (data: TProfileForm) => {
    if (!user) return

    setLoading(true)
    try {
      // Atualizar dados no Firestore
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        name: data.name,
        phone: data.phone || null,
      })

      present({
        message: "Perfil atualizado com sucesso!",
        duration: 2000,
        color: "success",
      })

      setIsEditing(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar perfil"
      present({
        message,
        duration: 2000,
        color: "danger",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      present({
        message: "Logout realizado com sucesso!",
        duration: 1500,
        color: "success",
      })
      history.replace("/login")
    } catch {
      present({
        message: "Erro ao fazer logout",
        duration: 2000,
        color: "danger",
      })
    }
  }

  const handleCancelEdit = () => {
    reset({
      name: userData?.name || "",
      phone: userData?.phone || "",
    })
    setIsEditing(false)
  }

  return (
    <IonPage>
      <PageHeader title="Perfil" showBackButton={false} />
      <IonContent className="ion-padding" fullscreen>
        <div className="profile-container">
          {/* Avatar e Email */}
          <div className="profile-header">
            <IonAvatar className="profile-avatar">
              <IonIcon icon={personCircleOutline} />
            </IonAvatar>
            <IonText>
              <h2 className="profile-name">{userData?.name || "Usuário"}</h2>
            </IonText>
            <IonText color="medium">
              <p className="profile-email">{user?.email}</p>
            </IonText>
          </div>

          {/* Formulário de Edição */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonList className="profile-form">
              <IonItemDivider>
                <IonLabel>Informações Pessoais</IonLabel>
              </IonItemDivider>

              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <IonItem className={formState.errors.name ? "ion-invalid" : ""}>
                    <IonInput
                      label="Nome completo"
                      labelPlacement="floating"
                      placeholder="Digite seu nome"
                      value={field.value ?? ""}
                      onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                      disabled={!isEditing}
                    />
                  </IonItem>
                )}
              />
              {formState.errors.name?.message && (
                <IonText color="danger" className="ion-padding-start">
                  <small>{formState.errors.name.message}</small>
                </IonText>
              )}

              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <IonItem className={formState.errors.phone ? "ion-invalid" : ""}>
                    <IonInput
                      type="tel"
                      label="Telefone"
                      labelPlacement="floating"
                      placeholder="(00) 00000-0000"
                      value={field.value ?? ""}
                      onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                      disabled={!isEditing}
                    />
                  </IonItem>
                )}
              />
              {formState.errors.phone?.message && (
                <IonText color="danger" className="ion-padding-start">
                  <small>{formState.errors.phone.message}</small>
                </IonText>
              )}

              <IonItem lines="none">
                <IonLabel>Email</IonLabel>
                <IonText slot="end" color="medium">
                  <small>{user?.email}</small>
                </IonText>
              </IonItem>
            </IonList>

      
            {/* Botões de Ação */}
            {isEditing ? (
              <div className="profile-actions">
                <IonButton
                  expand="block"
                  color="primary"
                  type="submit"
                  disabled={loading || !formState.isValid}
                >
                  <IonIcon slot="start" icon={saveOutline} />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </IonButton>
                <IonButton
                  expand="block"
                  fill="outline"
                  color="medium"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancelar
                </IonButton>
              </div>
            ) : (
              <div className="profile-actions">
                <IonButton
                  expand="block"
                  color="primary"
                  onClick={() => setIsEditing(true)}
                >
                  <IonIcon slot="start" icon={pencilOutline} />
                  Editar Perfil
                </IonButton>
              </div>
            )}
          </form>

          {/* Botão de Logout */}
          <div className="profile-logout">
            <IonButton
              expand="block"
              color="danger"
              fill="outline"
              onClick={handleLogout}
            >
              <IonIcon slot="start" icon={logOutOutline} />
              Sair da conta
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Profile




