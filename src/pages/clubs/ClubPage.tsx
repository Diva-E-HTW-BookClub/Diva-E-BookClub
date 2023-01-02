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
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonLabel,
  IonItem,
  IonChip,
  IonSpinner,
} from "@ionic/react";
import "./ClubPage.css";
import { calendar, documents, fileTray, people } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import {
  BookClub,
  getBookClubDocument,
  addParticipant,
  removeParticipant,
} from "../../firebase/firebaseBookClub";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { ArchiveSegment } from "../../components/clubPage/ArchiveSegment";
import { UpcomingDiscussionsSegment } from "../../components/clubPage/UpcomingDiscussionsSegment";
import { ResourcesSegment } from "../../components/clubPage/ResourcesSegment";

const ClubPage: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();

  const user = useSelector((state: any) => state.user.user);
  const [bookClubData, setBookClubData] = useState<BookClub>();
  const [selectedSegment, setSelectedSegment] = useState<string>("calendar");
  const [isModerator, setIsModerator] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(false);

  useEffect(() => {
    getBookClub();
  }, []);

  async function getBookClub() {
    let bookClub = await getBookClubDocument(bookClubId);
    // check if the current user is moderator of the club
    setIsModerator(bookClub?.moderator.includes(user.uid));
    setIsMember(bookClub?.participants.includes(user.uid));
    setBookClubData(bookClub);
  }

  const handleJoinLeave = async () => {
    if (bookClubData != null && !isModerator) {
      if (
        bookClubData.participants.length < bookClubData.maxParticipantsNumber
      ) {
        await addParticipant(bookClubId, user.uid);
        getBookClub();
      }
      if (bookClubData.participants.includes(user.uid)) {
        await removeParticipant(bookClubId, user.uid);
        getBookClub();
      }
    }
  };

  let clubName = bookClubData?.name;
  let bookTitle = bookClubData?.book.title;
  let bookAuthor = bookClubData?.book.authors;
  let bookCoverImg = bookClubData?.book.imageUrl;
  let clubParticipants = bookClubData?.participants?.length;
  let clubParticipantsMax = bookClubData?.maxParticipantsNumber;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clubs" />
          </IonButtons>
          <IonTitle>{clubName}</IonTitle>
          {isModerator && (
            <IonButtons slot="end">
              <IonButton routerLink={"/clubs/" + bookClubId + "/edit"}>
                Edit
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-no-padding ion-padding-vertical">
        <div className="ion-padding-horizontal">
          <IonGrid>
            <IonRow class="ion-align-items-center ion-padding-bottom">
              <IonCol sizeMd="10" size="9" className="column">
                <IonLabel>
                  <IonCardTitle>{bookTitle}</IonCardTitle>
                  <IonCardSubtitle>{bookAuthor}</IonCardSubtitle>
                </IonLabel>
                <IonItem lines="none">
                  <IonChip
                    onClick={() => handleJoinLeave()}
                    className={isMember || isModerator ? "chipIsMember" : ""}
                  >
                    <IonIcon
                      color={isMember || isModerator ? "white" : ""}
                      icon={people}
                    ></IonIcon>
                    {!clubParticipants || !clubParticipantsMax ? (
                      <IonSpinner name="dots"></IonSpinner>
                    ) : (
                      <p className="clubMembersSpacing">
                        {clubParticipants + " / " + clubParticipantsMax}
                      </p>
                    )}
                  </IonChip>
                </IonItem>
              </IonCol>
              <IonCol sizeMd="2" size="3" className="img-column">
                <IonImg
                  className="bookCover"
                  alt={bookTitle}
                  src={bookCoverImg}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
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
            <IonSegmentButton
              value="archive"
              onClick={() => setSelectedSegment("archive")}
            >
              <IonIcon icon={fileTray}></IonIcon>
            </IonSegmentButton>
          </IonSegment>
        </div>
        {selectedSegment === "calendar" && (
          <UpcomingDiscussionsSegment
            bookClubId={bookClubId}
            isModerator={isModerator}
            isMember={isMember}
            bookClubData={bookClubData}
          />
        )}
        {selectedSegment === "resources" && (
          <ResourcesSegment
            bookClubId={bookClubId}
            isModerator={isModerator}
            isMember={isMember}
            bookClubData={bookClubData}
          />
        )}
        {selectedSegment === "archive" && (
          <ArchiveSegment
            bookClubId={bookClubId}
            isModerator={isModerator}
            bookClubData={bookClubData}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default ClubPage;
