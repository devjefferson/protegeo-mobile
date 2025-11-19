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
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, type TRegisterForm } from "./schema"
import { useHistory } from "react-router-dom"
import { useState } from "react"
import { PageHeader } from "../../components/PageHeader"
import { FirebaseAuthService } from "../../services/FirebaseAuthService"
import "./register.css"

const Register: React.FC = () => {
  const [present] = useIonToast()
  const history = useHistory()
  const [loading, setLoading] = useState(false)

  const { control, handleSubmit, formState } = useForm<TRegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: TRegisterForm) => {
    setLoading(true)
    try {
      // Registrar usuário no Firebase
      await FirebaseAuthService.register(
        data.email,
        data.password,
        data.name,
        data.phone
      )
      
      present({
        message: "Cadastro realizado com sucesso!",
        duration: 2000,
        color: "success",
      })
      
      // Redirecionar para a área autenticada (o AuthContext vai detectar o login)
      history.replace("/tab1")
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao realizar cadastro"
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
      <PageHeader title="Criar conta" backHref="/login" />
      <IonContent className="ion-padding" fullscreen>
        <div className="register-container">
          <div className="register-header">
            <IonText>
              <h2>Crie sua conta</h2>
            </IonText>
            <IonText color="medium">
              <p>Preencha os dados abaixo para se cadastrar</p>
            </IonText>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <IonItem className={formState.errors.name ? "ion-invalid" : ""}>
                  <IonInput
                    type="text"
                    label="Nome completo"
                    labelPlacement="floating"
                    placeholder="Digite seu nome"
                    value={field.value ?? ""}
                    onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
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
              name="email"
              control={control}
              render={({ field }) => (
                <IonItem
                  className={`ion-margin-top ${formState.errors.email ? "ion-invalid" : ""}`}
                >
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

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <IonItem
                  className={`ion-margin-top ${formState.errors.phone ? "ion-invalid" : ""}`}
                >
                  <IonInput
                    type="tel"
                    label="Telefone"
                    labelPlacement="floating"
                    placeholder="(00) 00000-0000"
                    value={field.value ?? ""}
                    onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                  />
                </IonItem>
              )}
            />
            {formState.errors.phone?.message && (
              <IonText color="danger" className="ion-padding-start">
                <small>{formState.errors.phone.message}</small>
              </IonText>
            )}

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <IonItem
                  className={`ion-margin-top ${formState.errors.password ? "ion-invalid" : ""}`}
                >
                  <IonInput
                    type="password"
                    label="Senha"
                    labelPlacement="floating"
                    placeholder="Digite sua senha"
                    value={field.value ?? ""}
                    onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                  />
                </IonItem>
              )}
            />
            {formState.errors.password?.message && (
              <IonText color="danger" className="ion-padding-start">
                <small>{formState.errors.password.message}</small>
              </IonText>
            )}

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <IonItem
                  className={`ion-margin-top ${formState.errors.confirmPassword ? "ion-invalid" : ""}`}
                >
                  <IonInput
                    type="password"
                    label="Confirmar senha"
                    labelPlacement="floating"
                    placeholder="Digite sua senha novamente"
                    value={field.value ?? ""}
                    onIonInput={(e) => field.onChange(String(e.detail.value ?? ""))}
                  />
                </IonItem>
              )}
            />
            {formState.errors.confirmPassword?.message && (
              <IonText color="danger" className="ion-padding-start">
                <small>{formState.errors.confirmPassword.message}</small>
              </IonText>
            )}

            <IonButton
              type="submit"
              expand="block"
              className="ion-margin-top"
              disabled={loading || !formState.isValid}
            >
              {loading ? "Criando conta..." : "Criar conta"}
            </IonButton>

            <div className="ion-text-center ion-margin-top">
              <IonText color="medium">
                <small>
                  Ao criar uma conta, você concorda com nossos{" "}
                  <a href="#" className="link-primary">
                    Termos de Uso
                  </a>
                </small>
              </IonText>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Register

