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
import { getCurrentUserId } from "../../firebase/firebaseAuth";

const ClubPage: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();

  const [bookClubData, setBookClubData] = useState<BookClub>();
  const [selectedSegment, setSelectedSegment] = useState<string>("calendar");
  const [isModerator, setIsModerator] = useState<boolean>(true);

  useEffect(() => {
    getBookClub();
  }, []);

  async function getBookClub() {
    let bookClub = await getBookClubDocument(bookClubId);
    // check if the current user is moderator of the club
    setIsModerator(bookClub?.moderator === getCurrentUserId());
    setBookClubData(bookClub);
  }

  async function joinClub() {
    if (
      bookClubData != null &&
      bookClubData.participants.length < bookClubData.maxParticipantsNumber
    ) {
      await addParticipant(bookClubId, getCurrentUserId());
      getBookClub();
    }
  }

  async function leaveClub() {
    if (
      bookClubData != null &&
      bookClubData.participants.includes(getCurrentUserId())
    ) {
      await removeParticipant(bookClubId, getCurrentUserId());
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
                  {isModerator && (
                    <IonButton routerLink={"/clubs/" + bookClubId + "/edit"}>
                      Edit
                    </IonButton>
                  )}
                  {!isModerator &&
                    bookClubData != null &&
                    !bookClubData.participants.includes(getCurrentUserId()) && (
                      <IonButton onClick={joinClub}>Join</IonButton>
                    )}
                  {!isModerator &&
                    bookClubData != null &&
                    bookClubData.participants.includes(getCurrentUserId()) && (
                      <IonButton onClick={leaveClub} color="danger">
                        Leave
                      </IonButton>
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

        {bookClubData?.discussions.map((discussion, index) => {
          return (
            <div key={index}>
              {selectedSegment === "calendar" ? (
                <DiscussionCard
                  bookClubId={bookClubId}
                  discussionId={discussion.id}
                  title={discussion.title}
                  date={"15.12.2022"}
                  startTime={discussion.startTime}
                  endTime={discussion.endTime}
                  location={discussion.location}
                  agenda={discussion.agenda}
                  isModerator={isModerator}
                />
              ) : (
                <ResourceCard
                  title={"Diva-E's Resource"}
                  date={"12.12.2022"}
                  type={"Link"}
                />
              )}
            </div>
          );
        })}
        {isModerator && (
          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton
              routerLink={
                selectedSegment === "calendar"
                  ? "/clubs/" + bookClubId + "/discussions/add"
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
