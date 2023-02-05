import {
  IonBackButton,
  IonButtons, IonCol,
  IonContent,
  IonFab,
  IonFabButton, IonGrid,
  IonHeader,
  IonIcon, IonImg, IonLabel,
  IonList,
  IonPage, IonRefresher, IonRefresherContent, IonRow, IonSpinner,
  IonTitle,
  IonToolbar, RefresherEventDetail,
} from "@ionic/react";
import "./Comments.css";
import React, { useEffect, useRef, useState } from "react";
import { CommentCard } from "../../components/comments/CommentCard";

import { add } from "ionicons/icons";
import {getCommentDocument, getDiscussionComments} from "../../firebase/firebaseComments";
import { useParams } from "react-router";
import { ModalHandle } from "../../components/resources/EditResourceModal";
import { CreateCommentModal } from "../../components/comments/CreateCommentModal";
import {BookClub, Discussion, getBookClubDocument} from "../../firebase/firebaseBookClub";
import {getDiscussionDocument} from "../../firebase/firebaseDiscussions";
import {getTimezonedDate} from "../../helpers/datetimeFormatter";

const Comments: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();
  const [bookClubData, setBookClubData] = useState<BookClub>();
  const [discussionData, setDiscussionData] = useState<Discussion>()
  const [commentData, setCommentData] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const createModal = useRef<ModalHandle>(null);

  useEffect(() => {
    getCommentData().then((commentData) => setCommentData(commentData));
    getBookClubData();
    getDiscussionData();
  }, []);

  const updateComments = () => {
    setIsLoadingComments(true);
    setTimeout(() => {
      getCommentData().then((commentData) => {
        setCommentData(commentData);
        setIsLoadingComments(false)
      })
    }, 500)
  }

  async function getBookClubData() {
    let bookClubData = await getBookClubDocument(bookClubId);
    setBookClubData(bookClubData);
  }

  async function getDiscussionData() {
    let discussionData = await getDiscussionDocument(bookClubId, discussionId);
    setDiscussionData(discussionData);
  }

  async function getCommentData() {
    let commentData = await getDiscussionComments(bookClubId, discussionId);
    return commentData;
  }

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    await getCommentData().then((data) => {
      setCommentData(data);
      event.detail.complete();
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={"/tabs/home/" + bookClubId + "/view"} />
          </IonButtons>
          {isLoadingComments &&<IonSpinner slot="end"></IonSpinner>}
          <IonTitle>Comments</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonGrid className="ion-padding-horizontal">
          <IonRow className="ion-align-items-center rowHeight">
            <IonCol sizeMd="10" size="9" className="flexVertical">
              <IonLabel>
                <div>{bookClubData?.book.title}</div>
                <p>{bookClubData?.book.authors}</p>
              </IonLabel>
              <IonLabel>
                <div>{discussionData?.title}</div>
                {discussionData?.date && <div>{getTimezonedDate(discussionData.date)}</div>}
              </IonLabel>
            </IonCol>
            <IonCol sizeMd="2" size="3">
              <IonImg className="commentImage" src={bookClubData?.book.imageUrl}/>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonList className="ion-padding-horizontal">
          {commentData.map((item, index) => {
            return (
                <CommentCard
                  commentId={item.commentId}
                  discussionId={discussionId}
                  bookClubId={bookClubId}
                  key={index}
                  username={item.username}
                  passage={item.passage}
                  text={item.text}
                  moderator={item.moderator}
                  photo={item.photo}
                  updatePage={updateComments}
                />
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
          onDismiss={updateComments}
          ref={createModal}
        />
      </IonContent>
    </IonPage>
  );
};

export default Comments;
