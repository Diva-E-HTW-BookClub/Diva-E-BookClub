import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar, useIonActionSheet,
} from "@ionic/react";
import "./Comments.css";
import React, { useEffect, useState } from "react";
import { CommentCard } from "../../components/CommentCard";

import { add, camera, document } from "ionicons/icons";
import {
  createCommentDocument,
  getDiscussionComments,
} from "../../firebase/firebaseComments";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import {OverlayEventDetail} from "@ionic/react/dist/types/components/react-component-lib/interfaces";

type CommentValues = {
  passage: string;
  text: string;
};

const Comments: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();

  const [commentData, setCommentData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [present] = useIonActionSheet();
  const [result, setResult] = useState<OverlayEventDetail>();

  useEffect(() => {
    getCommentData();
  }, []);

  async function getCommentData() {
    var commentData = await getDiscussionComments(bookClubId, discussionId);
    setCommentData(commentData);
  }
  async function createComment(data: any) {
    createCommentDocument(bookClubId, discussionId, data);
    setIsOpen(false);
  }

  const cancelModal = () => {
    reset({
      passage: "",
      text: "",
    });
    setIsOpen(false);
  };

  const actionSheet = () => {
    present({
      buttons: [
        {
          text: 'Take Photo',
          data: {
            action: 'take photo',
          },
        },
        {
          text: 'Choose Photo from Gallery',
          data: {
            action: 'choose photo',
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          data: {
            action: 'cancel',
          },
        },
      ],
      onDidDismiss: ({ detail }) => setResult(detail),
    })
  }

  const { register, handleSubmit, reset } = useForm<CommentValues>({
    mode: "onChange",
    defaultValues: {
      passage: "",
      text: "",
    },
  });

  const addCommentModal = () => {
    return (
      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Add Comment</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form onSubmit={handleSubmit(createComment)}>
            <IonItem lines="none">
              <h1>Write a Comment</h1>
            </IonItem>
            <IonItem lines="none">
              <div>
                <IonButton onClick={actionSheet} size="default">
                  <IonIcon slot="icon-only" icon={camera}></IonIcon>
                </IonButton>
                <IonLabel>Add Photo</IonLabel>
              </div>
              <div>
                <IonButton size="default">
                  <IonIcon slot="icon-only" icon={document}></IonIcon>
                </IonButton>
                <IonLabel>Add Document</IonLabel>
              </div>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Text Passage</IonLabel>
              <IonTextarea
                {...register("passage")}
                autoGrow
                placeholder="Enter the passage you are talking about"
              ></IonTextarea>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Comment</IonLabel>
              <IonTextarea
                {...register("text")}
                autoGrow
                placeholder="Enter your comment"
              ></IonTextarea>
            </IonItem>
            <IonButton onClick={cancelModal}>Cancel</IonButton>
            <IonButton type="submit" color="primary">
              Create
            </IonButton>
          </form>
        </IonContent>
      </IonModal>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clubs" />
          </IonButtons>
          <IonTitle>Comments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Comments</IonTitle>
          </IonToolbar>
        </IonHeader>
        {commentData.map((item, index) => {
          return (
            <CommentCard
              commentId={item.commentId}
              discussionId={discussionId}
              bookClubId={bookClubId}
              key={index}
              userName="PLACEHOLDER NAME"
              passage={item.passage}
              text={item.text}
            />
          );
        })}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setIsOpen(true)}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        {addCommentModal()}
      </IonContent>
    </IonPage>
  );
};

export default Comments;
