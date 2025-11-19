import { IonBackButton, IonButtons, IonHeader, IonTitle, IonToolbar } from "@ionic/react"
import "./page-header.css"

interface PageHeaderProps {
  title: string
  backHref?: string
  showBackButton?: boolean
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  backHref = "/",
  showBackButton = true,
}) => {
  return (
    <IonHeader className="page-header">
      <IonToolbar>
        {showBackButton && (
          <IonButtons slot="start">
            <IonBackButton defaultHref={backHref} text="" />
          </IonButtons>
        )}
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  )
}

