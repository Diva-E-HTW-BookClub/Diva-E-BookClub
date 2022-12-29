import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonSegment,
  IonSegmentButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import "./ClubPage.css";
import { calendar, documents, add } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { DiscussionCard } from "../../components/DiscussionCard";
import { ResourceCard } from "../../components/ResourceCard";
import {
  BookClub,
  getBookClubDocument,
  addParticipant,
  removeParticipant,
} from "../../firebase/firebaseBookClub";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

const ClubPage: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();

  const user = useSelector((state:any) => state.user.user)
  const [bookClubData, setBookClubData] = useState<BookClub>()
  const [selectedSegment, setSelectedSegment] = useState<string>("calendar");
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const [isParticipant, setIsParticipant] = useState<boolean>(false);

  useEffect(() => {
    getBookClub();
  }, []);

  async function getBookClub() {
    let bookClub = await getBookClubDocument(bookClubId);
    // check if the current user is moderator of the club
    setIsModerator(bookClub?.moderator.includes(user.uid));
    setIsParticipant(bookClub?.participants.includes(user.uid))
    setBookClubData(bookClub)
  }

  async function joinClub() {
    if(bookClubData != null
      && bookClubData.participants.length < bookClubData.maxParticipantsNumber){
      await addParticipant(bookClubId, user.uid);
      getBookClub();
    }
  }

  async function leaveClub() {
    if(bookClubData != null
      && bookClubData.participants.includes(user.uid)){
      await removeParticipant(bookClubId, user.uid);
      getBookClub();
    }
  }

  let clubName = bookClubData?.name;
  let bookTitle = bookClubData?.book.title;
  let bookAuthor = bookClubData?.book.authors;
  let bookCoverImg = bookClubData?.book.imageUrl;
  let bookCurrentChapter = "?";
  let clubParticipants = bookClubData?.participants?.length;
  let clubParticipantsMax = bookClubData?.maxParticipantsNumber;
  // console.log(bookClubId)
  // console.log(getBookClubDiscussions(bookClubId))
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clubs" />
          </IonButtons>
          <IonTitle>{clubName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{clubName}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonCard class="hidden-border">
          <IonGrid>
            <IonRow>
              <IonCol size="4">
                <IonImg alt={bookTitle} src={bookCoverImg} />
              </IonCol>
              <IonCol size="6">
                <IonCardHeader>
                  <IonCardTitle>{bookTitle}</IonCardTitle>
                  <IonCardSubtitle>{bookAuthor}</IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <h3>{bookCurrentChapter}</h3>
                  <h3>
                    {clubParticipants}/{clubParticipantsMax}
                  </h3>
                  {isModerator &&
                  <IonButton routerLink={"/clubs/" + bookClubId + "/edit"}>Edit</IonButton>
                  }
                  {!isModerator && bookClubData != null && !bookClubData.participants.includes(user.uid) &&
                    <IonButton onClick={joinClub}>Join</IonButton>
                  }
                  {!isModerator && bookClubData != null && bookClubData.participants.includes(user.uid) &&
                    <IonButton onClick={leaveClub} color="danger">Leave</IonButton>
                  }
                </IonCardContent>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>

        <IonSegment value={selectedSegment}>
          <IonSegmentButton
            value="calendar"
            onClick={() => setSelectedSegment("calendar")}
          >
            <IonIcon icon={calendar}></IonIcon>
          </IonSegmentButton>
          <IonSegmentButton
            value="resources"
            onClick={() => setSelectedSegment("resources")}
          >
            <IonIcon icon={documents}></IonIcon>
          </IonSegmentButton>
        </IonSegment>
      
        {bookClubData?.discussions.map((discussion, index) => {
          return (
            <div key={index}>
              {selectedSegment === "calendar" &&
                <DiscussionCard
                  bookClubId={bookClubId}
                  discussionId={discussion.id}
                  title={discussion.title}
                  date={discussion.date}
                  startTime={discussion.startTime}
                  endTime={discussion.endTime}
                  location={discussion.location}
                  isModerator={isModerator}
                />
              } 
            </div>
          );
        })}
        {bookClubData?.resources.map((resource, index) => {
          return (
            <div key={index}>
              {selectedSegment === "resources" &&
                <ResourceCard
                  resourceId={resource.id}
                  title={resource.title}
                  content={resource.content}
                  moderator={resource.moderator}
                  bookClubId={bookClubId}
                />
              } 
            </div>
          );
        })}
        {isModerator && selectedSegment === "calendar" &&
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton routerLink={"/clubs/" + bookClubId + "/discussions/add"}>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        }
        {isParticipant && selectedSegment === "resources" &&
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton routerLink={"/clubs/" + bookClubId + "/resources/add"}>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        }    
        
        
      </IonContent>
    </IonPage>
  );
};

export default ClubPage;
