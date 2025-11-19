import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonText,
  useIonToast,
} from "@ionic/react"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { PageHeader } from "../../components/PageHeader"
import { FirebaseAuthService } from "../../services/FirebaseAuthService"
import { useState } from "react"
import "./forgot.css"

const schema = z.object({ email: z.string().email("E-mail inválido") })

type TForgot = z.infer<typeof schema>

const ForgotPassword: React.FC = () => {
  const [present] = useIonToast()
  const [loading, setLoading] = useState(false)
  
  const { control, handleSubmit, formState } = useForm<TForgot>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "" },
  })

  const onSubmit = async ({ email }: TForgot) => {
    setLoading(true)
    try {
      await FirebaseAuthService.resetPassword(email)
      present({
        message: `Link de recuperação enviado para ${email}`,
        duration: 2000,
        color: "success",
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao enviar link"
      present({
        message,
        duration: 2000,
        color: "danger",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <IonPage>
      <PageHeader title="Recuperar senha" backHref="/login" />
      <IonContent className="ion-padding" fullscreen>
        <div className="forgot-container">
          <div className="forgot-header">
            <IonText>
              <h2>Esqueceu sua senha?</h2>
            </IonText>
            <IonText color="medium">
              <p>
                Insira seu e-mail abaixo e enviaremos um link para redefinir sua senha.
              </p>
            </IonText>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <IonItem className={formState.errors.email ? "ion-invalid" : ""}>
                  <IonInput
                    type="email"
                    label="E-mail"
                    labelPlacement="floating"
                    placeholder="Digite seu e-mail"
                    value={field.value ?? ""}
                    onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                  />
                </IonItem>
              )}
            />
            {formState.errors.email?.message && (
              <IonText color="danger" className="ion-padding-start">
                <small>{formState.errors.email.message}</small>
              </IonText>
            )}

            <IonButton
              type="submit"
              expand="block"
              color="primary"
              className="ion-margin-top"
              disabled={loading || !formState.isValid}
            >
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default ForgotPassword