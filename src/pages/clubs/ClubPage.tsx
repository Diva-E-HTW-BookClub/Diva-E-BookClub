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
  IonList,
  IonItem,
  IonBackButton,
  IonButtons,
  IonFab,
  IonFabButton,
  useIonViewWillEnter,
} from "@ionic/react";
import "./ClubPage.css";
import { calendar, documents, add } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { DiscussionCard } from "../../components/DiscussionCard";
import { ResourceCard } from "../../components/ResourceCard";
import { BookClub, Discussion, getBookClubDiscussions, getBookClubDocument, searchBookClubs,  } from "../../firebase/firebaseBookClub";
import { useParams } from "react-router";

const ClubPage: React.FC = () => {
  let {bookClubId}: {bookClubId: string} = useParams();

  let clubName = "Diva-e's Reading Club";
  let bookTitle = "Clean Code";
  let bookAuthor = "Robert C. Martin";
  let bookCoverImg =
    "https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg";
  let bookCurrentChapter = "Chapter 1";
  let clubParticipants = "6";
  let clubParticipantsMax = "12";

  const [discussionData, setDiscussionData] = useState<Discussion[]>([]);
  const [bookClubData, setBookClubData] = useState<BookClub>()
  const [selectedSegment, setSelectedSegment] = useState<string>("calendar");
  //replace isModerator by an API call for a users roll
  const [isModerator, setIsModerator] = useState<boolean>(true);

  useEffect(() => {
    getDiscussions();
    getBookClub();
    console.log(bookClubData)
    console.log("page loaded");
  }, []);

  async function getBookClub() {
    let bookClub = await getBookClubDocument(bookClubId)
    console.log(bookClub)
    setBookClubData(bookClub)
  }

  async function getDiscussions() {
    let discussions = await getBookClubDiscussions(bookClubId);
    setDiscussionData(discussions);
  }

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
                  {isModerator ? (
                    <IonButton>Edit</IonButton>
                  ) : (
                    <IonButton>Join</IonButton>
                  )}
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

        <IonList lines="none">
          {discussionData.map((discussion, index) => {
            return (
              <IonItem key={index}>
                {selectedSegment === "calendar" ? (
                  <DiscussionCard
                    chapter={discussion.chapter}
                    member={0}
                    date={"NEED TO ADD"}
                    time={"NEED TO ADD"}
                    location={discussion.location}
                    isModerator={isModerator}
                  />
                ) : (
                  <ResourceCard
                    title={"Diva-E's Resource"}
                    date={"12.12.2022"}
                    type={"Link"}
                  />
                )}
              </IonItem>
            );
          })}
        </IonList>

        {isModerator && (
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton
              routerLink={
                selectedSegment === "calendar"
                  ? "/discussions/add"
                  : "/resources/add"
              }
            >
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ClubPage;
