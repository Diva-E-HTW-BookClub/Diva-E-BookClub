import {
  IonCard,
  IonIcon,
  IonCol,
  IonGrid,
  IonRow,
  IonButton,
} from "@ionic/react";
import { peopleCircle } from "ionicons/icons";
import { useState } from "react";

interface DiscussionCardProps {
  chapter: string;
  member: number;
  date: string;
  time: string;
  location: string;
  isModerator: boolean;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  chapter,
  member,
  date,
  time,
  location,
  isModerator,
}: DiscussionCardProps) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);

  return (
    // show/hide buttons by clicking on the discussion card
    <IonCard onClick={() => setShowButtons(!showButtons)}>
      <IonGrid>
        <IonRow>
          <IonCol>
            {chapter}
            <br></br>
            {date}
          </IonCol>

          <IonCol>
            <IonIcon icon={peopleCircle} class="large-icon"></IonIcon>
            {member}
          </IonCol>

          <IonCol>
            {time} <br></br>
            {location}
          </IonCol>
        </IonRow>

        {showButtons &&
          <IonRow>
            <IonCol>
              <IonButton routerLink="/agenda">Outline</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink="/comments">Comments</IonButton>
            </IonCol>
            <IonCol>
              {isModerator ? (
                <IonButton>Edit</IonButton>
              ) : (
                <IonButton>Join</IonButton>
              )}
            </IonCol>
          </IonRow>}
      </IonGrid>
    </IonCard>
  );
};
