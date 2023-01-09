import { IonButton, IonButtons, IonCard, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonModal, IonPopover, IonRow, IonText, IonThumbnail, IonToolbar } from "@ionic/react";
import { ellipsisVertical, pencil, personCircleOutline, trashOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { deleteCommentDocument, getCommentDocument, updateCommentDocument } from "../firebase/firebaseComments";

interface CommentCardProps {
  userName: string;
  passage: string;
  text: string;
  commentId: string;
  bookClubId: string,
  discussionId: string,
  moderator: string,
  photo: string
}

export const CommentCard: React.FC<CommentCardProps> = ({
  userName,
  passage,
  text,
  commentId,
  bookClubId,
  discussionId,
  moderator,
  photo
}) => {
  const user = useSelector((state: any) => state.user.user);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };
  
  async function deleteComment() {
    deleteCommentDocument(bookClubId, discussionId, commentId)
  }

  return (
    <IonGrid fixed className="ion-padding-horizontal">
      <IonRow>
        <IonCol className="ion-grid-column">
          <IonItem lines="none">
            <IonIcon size="large" icon={personCircleOutline}></IonIcon>
            <div className="spacing"></div>
            <IonLabel>
              <div className="username">{userName}</div>
              <div className="passage">
                {passage}
              </div>
            </IonLabel>
            {user.uid === moderator && (
              <>
                <IonButton onClick={openPopover} slot="end" fill="clear">
                  <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                </IonButton>
                <IonPopover
                  ref={popover}
                  isOpen={popoverOpen}
                  dismissOnSelect={true}
                  onDidDismiss={() => setPopoverOpen(false)}
                >
                  <IonList lines="full">
                    <IonItem
                      button
                      detail={false}
                      routerLink={`/clubs/${bookClubId}/discussions/${discussionId}/comments/${commentId}/edit`}
                    >
                      <IonLabel class="ion-padding-start">Edit</IonLabel>
                      <IonIcon class="ion-padding-end" slot="end" icon={pencil}></IonIcon>
                    </IonItem>
                    <IonItem button detail={false} lines="none" onClick={() => deleteComment()}>
                      <IonLabel class="ion-padding-start" color="danger">
                        Delete
                      </IonLabel>
                      <IonIcon
                        class="ion-padding-end"
                        color="danger"
                        slot="end"
                        icon={trashOutline}
                      ></IonIcon>
                    </IonItem>
                  </IonList>
                </IonPopover>
              </>
            )}
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem lines="none">
            {photo && (
              <>
                <IonThumbnail slot="end" onClick={() => setIsOpen(true)}>
                  <IonImg src={photo} />
                </IonThumbnail>
                <IonModal isOpen={isOpen}>
                  <IonHeader>
                    <IonToolbar>
                      <IonButtons slot="end">
                        <IonButton onClick={() => setIsOpen(false)}>Close</IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent className="ion-padding">
                    <IonImg src={photo} />
                  </IonContent>
                </IonModal>
              </>
            )}
            <IonText>{text}</IonText>
          </IonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
