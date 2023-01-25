import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonRow,
  IonText,
  IonThumbnail,
  IonToolbar,
  useIonActionSheet,
} from "@ionic/react";
import {
  ellipsisVertical,
  pencil,
  personCircleOutline,
  trashOutline,
} from "ionicons/icons";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { deleteCommentDocument } from "../../firebase/firebaseComments";
import { EditCommentModal, ModalHandle } from "./EditCommentModal";

interface CommentCardProps {
  username: string;
  passage: string;
  text: string;
  commentId: string;
  bookClubId: string;
  discussionId: string;
  moderator: string;
  photo: string;
  updatePage: () => void;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  username,
  passage,
  text,
  commentId,
  bookClubId,
  discussionId,
  moderator,
  photo,
  updatePage,
}) => {
  const user = useSelector((state: any) => state.user.user);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [presentDelete] = useIonActionSheet();
  const editModal = useRef<ModalHandle>(null);

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  async function deleteComment() {
    deleteCommentDocument(bookClubId, discussionId, commentId).then(updatePage);
  }

  const actionSheet = () =>
    presentDelete({
      header: "Delete Comment",
      subHeader: "by " + username,
      backdropDismiss: false,
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          data: {
            action: "delete",
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        if (detail.data.action === "delete") {
          deleteComment();
        }
      },
    });

  return (
    <IonGrid fixed>
      <IonRow>
        <IonCol className="ion-grid-column">
          <IonItem lines="none">
            <IonIcon size="large" icon={personCircleOutline}></IonIcon>
            <div className="spacing"></div>
            <IonLabel>
              <div className="username">{username}</div>
              <div className="passage">{passage}</div>
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
                      onClick={() => editModal.current?.open()}
                    >
                      <IonLabel class="ion-padding-start">Edit</IonLabel>
                      <IonIcon
                        class="ion-padding-end"
                        slot="end"
                        icon={pencil}
                      ></IonIcon>
                    </IonItem>
                    <IonItem
                      button
                      detail={false}
                      lines="none"
                      onClick={actionSheet}
                    >
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
                        <IonButton onClick={() => setIsOpen(false)}>
                          Close
                        </IonButton>
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
      {updatePage && (
        <EditCommentModal
          bookClubId={bookClubId}
          discussionId={discussionId}
          commentId={commentId}
          onDismiss={updatePage}
          ref={editModal}
        />
      )}
    </IonGrid>
  );
};
