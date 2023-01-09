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
  IonIcon,
  IonBackButton,
  IonButtons,
  IonLabel,
  IonItem,
  IonChip,
  IonSpinner,
  IonButton,
} from "@ionic/react";
import "./ClubPage.css";
import { add, calendar, documents, fileTray, people } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import {
  BookClub,
  getBookClubDocument,
  addMember,
  removeMember,
} from "../../firebase/firebaseBookClub";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import { ArchiveSegment } from "../../components/clubPage/ArchiveSegment";
import { UpcomingDiscussionsSegment } from "../../components/clubPage/UpcomingDiscussionsSegment";
import { ResourcesSegment } from "../../components/clubPage/ResourcesSegment";
import { EditClubModal } from "../../components/clubPage/EditClubModal";
import { useHistory } from "react-router-dom";
import { CreateDiscussionModal } from "../../components/clubPage/CreateDiscussionModal";

const ClubPage: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();

  const user = useSelector((state: any) => state.user.user);
  const history = useHistory();
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
    setIsMember(bookClub?.members.includes(user.uid));
    setBookClubData(bookClub);
  }

  const handleJoinLeave = async () => {
    if (bookClubData != null && !isModerator) {
      if (bookClubData.members.length < bookClubData.maxMemberNumber) {
        await addMember(bookClubId, user.uid);
        getBookClub();
      }
      if (bookClubData.members.includes(user.uid)) {
        await removeMember(bookClubId, user.uid);
        getBookClub();
      }
    }
  };

  let clubName = bookClubData?.name;
  let bookTitle = bookClubData?.book.title;
  let bookAuthor = bookClubData?.book.authors;
  let bookCoverImg = bookClubData?.book.imageUrl;
  let clubMembers = bookClubData?.members?.length;
  let clubMemberMax = bookClubData?.maxMemberNumber;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons onClick={() => history.push("/clubs")} slot="start">
            <IonBackButton defaultHref="/clubs" text="Clubs"></IonBackButton>
          </IonButtons>
          <IonTitle>{clubName}</IonTitle>
          {isModerator && (
            <IonButtons slot="end">
              <EditClubModal
                bookClubId={bookClubId}
                bookClubData={bookClubData}
                onDismiss={getBookClub}
              />
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
                    className={isMember || isModerator ? "chipIsMember" : ""}
                  >
                    <IonIcon
                      color={isMember || isModerator ? "white" : ""}
                      icon={people}
                    ></IonIcon>
                    {!clubMembers || !clubMemberMax ? (
                      <IonSpinner name="dots"></IonSpinner>
                    ) : (
                      <IonLabel className="clubMembersSpacing">
                        {clubMembers + " of " + clubMemberMax}
                      </IonLabel>
                    )}
                  </IonChip>
                  {bookClubData && !isModerator && (
                    <IonChip
                      outline
                      color={isMember ? "danger" : ""}
                      onClick={() => handleJoinLeave()}
                    >
                      {!isMember ? "Join" : "Leave"}
                    </IonChip>
                  )}
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
          <>
            <div className="ion-padding-horizontal">
              <IonItem lines="none">
                <IonLabel>Upcoming Discussions</IonLabel>
                {isModerator && (
                  <CreateDiscussionModal
                    bookClubId={bookClubId}
                    onDismiss={getBookClub}
                  />
                )}
              </IonItem>
            </div>
            <UpcomingDiscussionsSegment
              bookClubId={bookClubId}
              isModerator={isModerator}
              isMember={isMember}
              bookClubData={bookClubData}
              updatePage={getBookClub}
            />
          </>
        )}
        {selectedSegment === "resources" && (
          <>
            <div className="ion-padding-horizontal">
              <IonItem lines="none">
                <IonLabel>Resources</IonLabel>
                {(isMember || isModerator) && (
                  <IonButton
                    fill="clear"
                    slot="end"
                    routerLink={"/clubs/" + bookClubId + "/resources/add"}
                  >
                    <IonIcon slot="icon-only" icon={add}></IonIcon>
                  </IonButton>
                )}
              </IonItem>
            </div>
            <ResourcesSegment
              bookClubId={bookClubId}
              isModerator={isModerator}
              isMember={isMember}
              bookClubData={bookClubData}
              updatePage={getBookClub}
            />
          </>
        )}
        {selectedSegment === "archive" && (
          <>
            <div className="ion-padding-horizontal">
              <IonItem lines="none">Past Discussions</IonItem>
            </div>
            <ArchiveSegment
              bookClubId={bookClubId}
              isModerator={isModerator}
              bookClubData={bookClubData}
              updatePage={getBookClub}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ClubPage;
