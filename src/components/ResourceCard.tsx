import {
  IonCard,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
} from "@ionic/react";
import { documentTextOutline, peopleCircle } from "ionicons/icons";

interface ResourceCardProps {
  title: string;
  content: string;
  moderator: string;
  bookClubId: string;
  resourceId: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  content,
  bookClubId,
  resourceId,
}: ResourceCardProps) => {
  return (
    <IonCard>
      <IonGrid>
        <IonRow>
          <IonCol size="1">
            <IonIcon icon={documentTextOutline}></IonIcon>
          </IonCol>

          <IonCol size="4">{title}</IonCol>

          <IonCol size="4">
            {title}
            <br></br>
            content: {content}
          </IonCol>

          <IonCol size="3">
            <IonButton routerLink={"/clubs/" + bookClubId + "/resources/" + resourceId + "/edit/"}>Edit</IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};
