import { IonButton, IonCard, IonCardSubtitle, IonCardTitle, IonIcon } from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import { useSelector } from "react-redux";




interface CommentCardProps {
  userName: string;
  passage: string;
  text: string;
  commentId: string;
  bookClubId: string,
  discussionId: string,
  moderator: string,
}

export const CommentCard: React.FC<CommentCardProps> = ({
  userName,
  passage,
  text,
  commentId,
  bookClubId,
  discussionId,
  moderator,

}) => {
  const user = useSelector((state:any) => state.user.user)
  return (
    <IonCard>
      <IonCardTitle>
        <IonIcon size="large" icon={personCircleOutline}></IonIcon>
        {userName}
      </IonCardTitle>
      <IonCardSubtitle>{passage}</IonCardSubtitle>
      <p>{text}</p>
      {moderator === user.uid &&
        <IonButton routerLink={"/clubs/" + bookClubId + "/discussions/" + discussionId + "/comments/" + commentId + "/edit"} > Edit </IonButton>
      }
    </IonCard>
  );
};
