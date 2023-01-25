import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Comments.css";
import React, { useEffect, useRef, useState } from "react";
import { CommentCard } from "../../components/comments/CommentCard";

import { add } from "ionicons/icons";
import { getDiscussionComments } from "../../firebase/firebaseComments";
import { useParams } from "react-router";
import { ModalHandle } from "../../components/resources/EditResourceModal";
import { CreateCommentModal } from "../../components/comments/CreateCommentModal";

const Comments: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();
  const [commentData, setCommentData] = useState<any[]>([]);
  const createModal = useRef<ModalHandle>(null);

  useEffect(() => {
    getCommentData();
  }, []);

  async function getCommentData() {
    let commentData = await getDiscussionComments(bookClubId, discussionId);
    setCommentData(commentData);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={"/tabs/home/" + bookClubId + "/view"} />
          </IonButtons>
          <IonTitle>Comments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
                  updatePage={getCommentData}
                />
              </IonItem>
            );
          })}
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => createModal.current?.open()}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        <CreateCommentModal
          bookClubId={bookClubId}
          discussionId={discussionId}
          onDismiss={getCommentData}
          ref={createModal}
        />
      </IonContent>
    </IonPage>
  );
};

export default Comments;
