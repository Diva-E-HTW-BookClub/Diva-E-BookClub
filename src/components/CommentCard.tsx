import { IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";


interface CommentCardProps {
  userName: string;
  passage: string;
  quote: string;
  text: string;
  commentId: string;
  bookClubId: string,
  discussionId: string,
}

export const CommentCard: React.FC<CommentCardProps> = ({
  userName,
  passage,
  quote,
  text,
  commentId,
  bookClubId,
  discussionId,

}) => {
  return (
    <IonCard>
      <IonCardTitle>
        <IonIcon size="large" icon={personCircleOutline}></IonIcon>
        {userName}
      </IonCardTitle>
      <IonCardSubtitle>{passage}</IonCardSubtitle>
      <p>{quote}</p>
      <p>{text}</p>
      <IonButton routerLink={"/clubs/" + bookClubId + "/discussions/" + discussionId + "/comments/" + commentId + "/edit"} > Edit </IonButton>
    </IonCard>
  );
};
