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
  bookClubId: string,
  discussionId: string,
  chapter: string;
  participants: number;
  startTime: string;
  endTime: string;
  location: string;
  agenda: string;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  bookClubId,
  discussionId,
  chapter,
  participants,
  startTime,
  endTime,
  location,
  agenda,
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
            {startTime}
            <br></br>
            {endTime}
          </IonCol>

          <IonCol>
            <IonIcon icon={peopleCircle} class="large-icon"></IonIcon>
            {participants}
          </IonCol>

          <IonCol>
            {location}
          </IonCol>
        </IonRow>

        {showButtons && (
          <IonRow>
            <IonCol>
              <IonButton routerLink="/agenda">Outline </IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink={"/clubs/" + bookClubId + "/discussions/" + discussionId + "/comments"}>Comments</IonButton>
            </IonCol>
            <IonCol>
              <IonButton routerLink={"/clubs/" + bookClubId + "/discussions/" + discussionId + "/edit"}>Edit</IonButton>
            </IonCol>
            <IonCol>
              {/* {isModerator ? (
                <IonButton>Edit</IonButton>
              ) : (
                <IonButton>Join</IonButton>
              )} */}
            </IonCol>
          </IonRow>
        )}
      </IonGrid>
    </IonCard>
  );
};
