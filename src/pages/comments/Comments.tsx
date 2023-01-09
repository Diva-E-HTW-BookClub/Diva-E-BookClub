import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonTextarea,
  IonTitle,
  IonToolbar, useIonActionSheet,
} from "@ionic/react";
import "./Comments.css";
import React, { useEffect, useState } from "react";
import { CommentCard } from "../../components/CommentCard";

import { add, camera, document, trashOutline } from "ionicons/icons";
import {
  createCommentDocument,
  getDiscussionComments,
} from "../../firebase/firebaseComments";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { OverlayEventDetail } from "@ionic/react/dist/types/components/react-component-lib/interfaces";
import { usePhotoGallery, base64FromPath } from '../../hooks/usePhotoGallery';

type CommentValues = {
  passage: string;
  text: string;
};

const Comments: React.FC = () => {
  const { takePhoto } = usePhotoGallery();
  const [photo, setPhoto] = useState<string>();
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();
  const user = useSelector((state: any) => state.user.user)
  const [commentData, setCommentData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [present] = useIonActionSheet();
  const [result, setResult] = useState<OverlayEventDetail>();

  const { register, handleSubmit, reset } = useForm<CommentValues>({
    mode: "onChange",
    defaultValues: {
      passage: "",
      text: "",
    },
  });


  useEffect(() => {
    getCommentData();
  }, []);


  async function getCommentData() {
    var commentData = await getDiscussionComments(bookClubId, discussionId);
    setCommentData(commentData);
  }

  async function createComment(data: any) {
    let userId = user.uid;
    if (photo != null && photo !== "") {
      data.photo = await base64FromPath(photo);
    }
    createCommentDocument(bookClubId, discussionId, Object.assign(data, { moderator: userId }));
    setIsOpen(false);
  }

  const cancelModal = () => {
    reset({
      passage: "",
      text: "",
    });
    setIsOpen(false);
  };

  async function makePhoto() {
    let newPhoto = await takePhoto();
    setPhoto(newPhoto);
  }

  async function deletePhoto() {
    setPhoto("");
  }

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
              {!photo && (
                <div>
                  <IonButton onClick={() => makePhoto()} size="default">
                    <IonIcon slot="icon-only" icon={camera}></IonIcon>
                  </IonButton>
                  <IonLabel>Add Photo</IonLabel>
                </div>
              )}
              {photo && (
                <div className="wrapPhoto">
                  <IonImg src={photo} />
                  <IonButton onClick={() => deletePhoto()} color="light" class="deletePhoto">
                    <IonIcon slot="icon-only" color="danger" icon={trashOutline}></IonIcon>
                  </IonButton>
                </div>
              )}
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
          {photo && (
            <IonImg src={photo} />
          )}
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
        <IonList>
          {commentData.map((item, index) => {
            return (
              <IonItem class="ion-no-padding" key={index}>
                <CommentCard
                  commentId={item.commentId}
                  discussionId={discussionId}
                  bookClubId={bookClubId}
                  key={index}
                  userName="username"
                  passage={item.passage}
                  text={item.text}
                  moderator={item.moderator}
                  photo={item.photo}
                />
              </IonItem>
            );
          })}
        </IonList>
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
