import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from "@ionic/react";
import "./Comments.css";
import React, { useEffect, useState } from "react";
import { CommentCard } from "../../components/CommentCard";

import { add, camera, document } from "ionicons/icons";
import { createCommentDocument, getDiscussionComments } from "../../firebase/firebaseComments";
import { useParams } from "react-router";

const Comments: React.FC = () => {
  let {bookClubId}: {bookClubId: string} = useParams();
  let {discussionId}: {discussionId: string} = useParams();
  
  const [commentData, setCommentData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const [commentText, setCommentText] = useState<string>("")
  const [commentPassage, setCommentPassage] = useState<string>("")
  const [commentQuote, setCommentQuote] = useState<string>("")

  useEffect(() => {
    getCommentData()
  }, []);

  async function getCommentData() {
    var commentData = await getDiscussionComments(bookClubId, discussionId)
    setCommentData(commentData)
  }
  async function createComment() {
      createCommentDocument(bookClubId, discussionId, {
          text: commentText,
          passage: commentPassage,
          quote: commentQuote
      })
      setIsOpen(false)
  }
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
              commentId = {item.commentId}
              discussionId = {discussionId}
              bookClubId = {bookClubId}
              key={index}
              userName="PLACEHOLDER NAME"
              passage={item.passage}
              quote={item.quote}
              text={item.text}
            />
            
          );
        })}
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setIsOpen(true)}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonModal isOpen={isOpen}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Add Comment</IonTitle>
              <IonButtons slot="start">
                <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem lines="none">
              <h1>Write a Comment</h1>
            </IonItem>
            <IonItem lines="none">
              <div>
                <IonButton size="default">
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
            <IonItem lines="none">
              <IonLabel>Text Passage</IonLabel>
            </IonItem>
            <IonItem>
              <IonInput placeholder="Enter the passage you are talking about" onIonInput={(e: any) => setCommentPassage(e.target.value)}></IonInput>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Quote</IonLabel>
            </IonItem>
            <IonItem>
              <IonTextarea cols={5} required placeholder="Enter a quote" onIonChange={(e:any) => setCommentQuote(e.target.value) }></IonTextarea>
            </IonItem>
            <IonItem lines="none">
              <IonLabel>Comment</IonLabel>
            </IonItem>
            <IonItem>
              <IonTextarea cols={5} required placeholder="Enter your comment!" onIonChange={(e:any) => setCommentText(e.target.value) }></IonTextarea>
            </IonItem>
            <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
            <IonButton routerLink={"/clubs/" + bookClubId + "/discussions/" + discussionId + "/comments"} color="primary" onClick={createComment}>Create</IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Comments;
