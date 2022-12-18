import {
  IonCard,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonProgressBar
} from "@ionic/react";
import { pause, play } from "ionicons/icons";
import { useState } from "react";

interface AgendaPartProps {
  id: string,
  title: string
  elapsedTime: number,
  maxTime: number
}

export const AgendaPartCard: React.FC<AgendaPartProps> = ({
  id,
  title,
  elapsedTime,
  maxTime
}: AgendaPartProps) => {
  const [isStarted, setIsStarted] = useState<boolean>(false);

  return (
    <IonCard>
      <IonCardHeader>
        <IonButton fill="outline" onClick={() => setIsStarted(!isStarted)}>
          {!isStarted &&
            <IonIcon className="button-icon" icon={play}></IonIcon>
          }
          {isStarted &&
            <IonIcon className="button-icon" icon={pause}></IonIcon>
          }
        </IonButton>
        <IonCardTitle>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonRow>
          <IonCol size="8.5">
            <IonProgressBar value={elapsedTime / maxTime}></IonProgressBar>
          </IonCol>
          <IonCol size="3.5">
            {elapsedTime} / {maxTime}
          </IonCol>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
}; 
