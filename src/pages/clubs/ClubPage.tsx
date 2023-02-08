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
} from "@ionic/react";
import "./ClubPage.css";
import {
  calendar,
  documents,
  fileTray,
  people,
  shareOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
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
import { ModalHandle, ShareModal } from "../../components/clubPage/ShareModal";
import { CreateDiscussionModal } from "../../components/clubPage/CreateDiscussionModal";
import { CreateResourceModal } from "../../components/resources/CreateResourceModal";
import { Share } from "@capacitor/share";
import {useLocation} from "react-router-dom";
import {getAuthorsArrayToString} from "../../helpers/openLibraryHelpers";

const ClubPage: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();
  const user = useSelector((state: any) => state.user.user);
  const [bookClubData, setBookClubData] = useState<BookClub>();
  const [isJoiningLeaving, setIsJoiningLeaving] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<string>("calendar");
  const shareModal = useRef<ModalHandle>(null);
  const location = useLocation();

  useEffect(() => {
    getBookClub();
  }, [bookClubId]);

  async function getBookClub() {
    await getBookClubDocument(bookClubId).then((bookClub) => {
      setBookClubData(bookClub);
      setIsJoiningLeaving(false);
    });
  }

  const isMember = () => {
    return bookClubData?.members.includes(user.uid);
  };

  const handleJoinLeave = async () => {
    if (bookClubData != null && !isModerator) {
      setIsJoiningLeaving(true);
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

  const shareClub = async () => {
    let text = 'Check out Blubble and join my Club: "' + clubName + '"';
    let url = "/clubs/" + bookClubId + "/view";
    await Share.canShare().then(async (result) => {
      if (result.value) {
        await Share.share({
          title: "Visit My Book Club on Blubble!",
          text: text,
          url: url,
          dialogTitle: "Invite others to your Club",
        });
      } else {
        if (navigator && navigator.share) {
          const shareData = {
            title: "Visit My Book Club on Blubble!",
            text: text,
            url: url,
          };
          try {
            await navigator.share(shareData);
            console.log("successfully shared");
          } catch (error) {
            console.log("Error: " + error);
          }
        } else {
          shareModal.current?.open();
        }
      }
    });
  };

  const membersChip = () => {
    return (
      <IonChip
        className={
          isMember() || isModerator ? "chipIsMember" : "chipIsNotMember"
        }
      >
        {isJoiningLeaving || !clubMembers || !clubMemberMax ? (
          <div className="discussionMembersSpacing">
            <IonSpinner name="dots" className="chipSpinnerClubs"></IonSpinner>
          </div>
        ) : (
          <>
            <IonIcon
              color={isMember() || isModerator ? "white" : ""}
              icon={people}
            ></IonIcon>
            <IonLabel className="clubMembersSpacing">
              {clubMembers + " of " + clubMemberMax}
            </IonLabel>
          </>
        )}
      </IonChip>
    );
  };

  const getCurrentTab = () => {
    if (location.pathname.includes("/tabs/home")) {
      return "home";
    } else if (location.pathname.includes("/tabs/clubs")) {
      return "clubs";
    } else {
      return "";
    }
  };

  const getBackButtonName = (name: string) => {
    if(name && name !== "") {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }else{
      return "Back";
    }
  }

  let clubName = bookClubData?.name;
  let bookTitle = bookClubData?.book.title;
  let bookAuthor = bookClubData?.book.authors;
  let bookCoverImg = bookClubData?.book.imageUrl;
  let clubMembers = bookClubData?.members?.length;
  let clubMemberMax = bookClubData?.maxMemberNumber;
  let isModerator = bookClubData?.moderator.includes(user.uid) || false;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/home" text={getBackButtonName(getCurrentTab())}></IonBackButton>
          </IonButtons>
          <IonTitle>{clubName}</IonTitle>
          {isModerator && (
            <IonButtons slot="end">
              <EditClubModal
                bookClubId={bookClubId}
                bookClubData={bookClubData!}
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
                  <IonCardTitle className="BookTitleOnClub">{bookTitle}</IonCardTitle>
                  {bookAuthor && <IonCardSubtitle>{getAuthorsArrayToString(bookAuthor)}</IonCardSubtitle>}
                </IonLabel>
                <IonItem lines="none">
                  {membersChip()}
                  {bookClubData && !isModerator && (
                    <IonChip
                      outline
                      color={isMember() ? "danger" : ""}
                      onClick={() => handleJoinLeave()}
                    >
                      {!isMember() ? "Join" : "Leave"}
                    </IonChip>
                  )}
                  <IonIcon
                    color="primary"
                    onClick={shareClub}
                    slot="end"
                    icon={shareOutline}
                  />
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
          <IonSegment swipeGesture={false} value={selectedSegment}>
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
              isMember={isMember()}
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
                {(isMember() || isModerator) && (
                  <CreateResourceModal
                    bookClubId={bookClubId}
                    onDismiss={getBookClub}
                  />
                )}
              </IonItem>
            </div>
            <ResourcesSegment
              bookClubId={bookClubId}
              bookClubData={bookClubData}
              isModerator={isModerator}
              isMember={isMember()}
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
              isMember={isMember()}
              bookClubData={bookClubData}
              updatePage={getBookClub}
            />
          </>
        )}
        <ShareModal bookClubId={bookClubId} ref={shareModal} />
      </IonContent>
    </IonPage>
  );
};

export default ClubPage;
