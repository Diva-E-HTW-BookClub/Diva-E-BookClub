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
  IonThumbnail,
  IonToolbar,
  useIonActionSheet,
} from "@ionic/react";
import {
  chevronDownOutline, chevronUpOutline,
  ellipsisVertical,
  pencil,
  personCircleOutline,
  trashOutline,
} from "ionicons/icons";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { deleteCommentDocument } from "../../firebase/firebaseComments";
import { EditCommentModal, ModalHandle } from "./EditCommentModal";
import "./CommentCard.css"

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
  const [showFullPassage, setShowFullPassage] = useState(false);
  const [presentDelete] = useIonActionSheet();
  const editModal = useRef<ModalHandle>(null);

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  async function deleteComment() {
    await deleteCommentDocument(bookClubId, discussionId, commentId).then(updatePage);
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

  const passageDiv = () => {
    return (
    <div className="passageDiv" onClick={() => setShowFullPassage(!showFullPassage)}>
      {showFullPassage &&
            <IonGrid>
              <IonRow>
                <IonCol size="1" className="iconColumn">
                  <IonIcon icon={chevronUpOutline}></IonIcon>
                </IonCol>
                <IonCol size="11">
                  <IonLabel className="ion-text-wrap">
                    <div className="passage">{passage}</div>
                  </IonLabel>
                </IonCol>
              </IonRow>
            </IonGrid>
      }
      {!showFullPassage &&
          <IonGrid>
            <IonRow>
              <IonCol size="1" className="iconColumn">
                <IonIcon icon={chevronDownOutline}></IonIcon>
              </IonCol>
              <IonCol size="11">
                <IonLabel className="hidePassage">
                  <div className="passageHidden">{passage}</div>
                </IonLabel>
              </IonCol>
            </IonRow>
          </IonGrid>
      }
    </div>
    )
  }

  return (
    <IonItem class="ion-no-padding">
      <IonGrid fixed>
        <IonRow className="ion-align-items-start">
          <IonCol size="auto" className="columnComment">
            <IonIcon size="large" icon={personCircleOutline}></IonIcon>
          </IonCol>
          <IonCol className="ion-grid-column">
            <IonItem lines="none">
              <IonLabel class="ion-text-wrap">
                <div className="username">
                  <b>{username}</b>
                </div>
                <div className="ion-text-wrap">
                  <p>{text}</p>
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
            {passage && passageDiv()}
            <div className="verticalSpacing"></div>
            {photo && (
                <IonItem lines="none">
                  <IonThumbnail slot="start" onClick={() => setIsOpen(true)}>
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
                </IonItem>
            )}
          </IonCol>
        </IonRow>
          <EditCommentModal
            bookClubId={bookClubId}
            discussionId={discussionId}
            commentId={commentId}
            onDismiss={updatePage}
            ref={editModal}
          />
      </IonGrid>
    </IonItem>
  );
};
