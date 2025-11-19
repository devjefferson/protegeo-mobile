import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonPage,
  IonText,
  IonRouterLink,
  useIonToast,
} from "@ionic/react"
import { useEffect } from "react"
import { useHistory } from "react-router-dom"
import { useLoginViewModel } from "./viewModel"
import { useAuth } from "../../context/AuthContext"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, type TLoginForm } from "./schema"
import { shieldOutline } from "ionicons/icons"
import "./login.css"

const Login: React.FC = () => {
  const vm = useLoginViewModel()
  const { isAuthenticated } = useAuth()
  const history = useHistory()
  const [present] = useIonToast()

  useEffect(() => {
    if (isAuthenticated) {
      history.replace("/tab1")
    }
  }, [isAuthenticated, history])

  const { control, handleSubmit, formState } = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (data: TLoginForm) => {
    const session = await vm.submit(data.email, data.password)
    if (session) {
      present({ message: "Login realizado!", duration: 1500, color: "success" })
      history.replace("/tab1")
    } else if (vm.state.error) {
      present({ message: vm.state.error, duration: 2000, color: "danger" })
    }
  }

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="login-container">
          <div className="login-header">
            <div className="login-logo">
              <IonIcon icon={shieldOutline} />
            </div>
            <IonText>
              <h1>ProtegeOC</h1>
            </IonText>
            <IonText color="medium">
              <p>Acesse sua conta</p>
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

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <IonItem className={`ion-margin-top ${formState.errors.password ? "ion-invalid" : ""}`}>
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

            <div className="ion-text-end ion-margin-top">
              <IonRouterLink routerLink="/forgot-password" color="primary">
                Esqueceu a senha?
              </IonRouterLink>
            </div>

            <IonButton
              type="submit"
              expand="block"
              className="ion-margin-top"
              disabled={vm.state.loading || !formState.isValid}
            >
              {vm.state.loading ? "Entrando..." : "Entrar"}
            </IonButton>

            <div className="ion-text-center ion-margin-top ion-margin-bottom">
              <IonText color="medium">
                <small>ou</small>
              </IonText>
            </div>

            <IonButton expand="block" fill="outline" color="primary" routerLink="/register">
              Criar nova conta
            </IonButton>
          </form>
        </div>
      </IonContent>
    </IonPage>
  )
}

export default Login
