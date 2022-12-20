import {
  IonButton,
  IonCard,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonLabel,
  IonRow,
} from "@ionic/react";
import {
  chatbox,
  chevronDownOutline,
  chevronUpOutline,
  clipboard,
  pencil,
  people,
  peopleOutline,
  personAdd,
  personRemove,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./DiscussionCard.css";
import {
  addDiscussionParticipant,
  getDiscussionDocument,
  removeDiscussionParticipant,
} from "../firebase/firebaseDiscussions";
import { format, utcToZonedTime } from "date-fns-tz";

interface DiscussionCardProps {
  bookClubId: string;
  discussionId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  agenda: string;
  isModerator: boolean;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  bookClubId,
  discussionId,
  title,
  startTime,
  endTime,
  location,
  agenda,
  date,
  isModerator,
}: DiscussionCardProps) => {
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const user = useSelector((state:any) => state.user.user)
  const [discussionParticipants, setDiscussionParticipants] =
    useState<string[]>();

  useEffect(() => {
    getDiscussionParticipants();
  }, []);

  const isParticipant = () => {
    return discussionParticipants?.includes(user.uid);
  };

  async function getDiscussionParticipants() {
    let data = await getDiscussionDocument(bookClubId, discussionId);
    setDiscussionParticipants(data?.participants);
  }

  async function joinDiscussion() {
    if (discussionParticipants != null) {
      await addDiscussionParticipant(
        bookClubId,
        discussionId,
        user.uid
      );
      getDiscussionParticipants();
    }
  }

  async function leaveDiscussion() {
    if (discussionParticipants != null && isParticipant()) {
      await removeDiscussionParticipant(
        bookClubId,
        discussionId,
        user.uid
      );
      getDiscussionParticipants();
    }
  }

  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  function formatDate() {
    const dateTz = utcToZonedTime(date, timezone);
    return format(dateTz, "dd.MM.yyyy", { timeZone: timezone });
  }

  function formatStartTime() {
    const startTz = utcToZonedTime(startTime, timezone);
    return format(startTz, "HH:mm", { timeZone: timezone });
  }

  function formatEndTime() {
    const endTz = utcToZonedTime(endTime, timezone);
    return format(endTz, "HH:mm", { timeZone: timezone });
  }

  return (
    <IonCard>
      <IonGrid>
        <IonRow
          className="ion-align-items-center"
          onClick={() => setShowButtons(!showButtons)}
        >
          <IonCol className="ion-text-left">{formatDate()}</IonCol>
          <IonCol className="ion-text-center">
            <div className="flex">
              {!isParticipant() && (
                <IonIcon
                  className="participants-icon"
                  icon={peopleOutline}
                  size="small"
                ></IonIcon>
              )}
              {isParticipant() && (
                <IonIcon
                  className="participants-icon"
                  icon={people}
                  size="small"
                ></IonIcon>
              )}
              {discussionParticipants && (
                <IonLabel className="participants">
                  {discussionParticipants.length}
                </IonLabel>
              )}
            </div>
          </IonCol>
          <IonCol className="ion-text-right">
            {formatStartTime() + " - " + formatEndTime()}
          </IonCol>
        </IonRow>
        <IonRow
          className="ion-align-items-center"
          onClick={() => setShowButtons(!showButtons)}
        >
          <IonCol className="ion-text-left">
            <IonCardSubtitle>{title}</IonCardSubtitle>
          </IonCol>
          <IonCol className="ion-text-center">
            {showButtons && (
              <IonIcon icon={chevronDownOutline} size="large"></IonIcon>
            )}
            {!showButtons && (
              <IonIcon icon={chevronUpOutline} size="large"></IonIcon>
            )}
          </IonCol>
          <IonCol className="ion-text-right">
            <IonCardSubtitle>{location}</IonCardSubtitle>
          </IonCol>
        </IonRow>
        {showButtons && (
          <IonRow className="ion-align-items-center">
            <IonCol className="ion-text-center">
              <IonButton routerLink="/agenda">
                <IonIcon slot="icon-only" icon={clipboard}></IonIcon>
              </IonButton>
              <br></br>
              <IonLabel>Agenda</IonLabel>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonButton
                routerLink={
                  "/clubs/" +
                  bookClubId +
                  "/discussions/" +
                  discussionId +
                  "/comments"
                }
              >
                <IonIcon slot="icon-only" icon={chatbox}></IonIcon>
              </IonButton>
              <br></br>
              <IonLabel>Comments</IonLabel>
            </IonCol>
            {isModerator && (
              <IonCol className="ion-text-center">
                <IonButton
                  routerLink={
                    "/clubs/" +
                    bookClubId +
                    "/discussions/" +
                    discussionId +
                    "/edit"
                  }
                >
                  <IonIcon slot="icon-only" icon={pencil}></IonIcon>
                </IonButton>
                <br></br>
                <IonLabel>Edit</IonLabel>
              </IonCol>
            )}
            {!isModerator && (
              <IonCol className="ion-text-center">
                {discussionParticipants != null && !isParticipant() && (
                  <>
                    <IonButton onClick={joinDiscussion}>
                      <IonIcon slot="icon-only" icon={personAdd}></IonIcon>
                    </IonButton>
                    <br></br>
                    <IonLabel>Join</IonLabel>
                  </>
                )}
                {discussionParticipants != null && isParticipant() && (
                  <>
                    <IonButton onClick={leaveDiscussion}>
                      <IonIcon slot="icon-only" icon={personRemove}></IonIcon>
                    </IonButton>
                    <br></br>
                    <IonLabel>Leave</IonLabel>
                  </>
                )}
              </IonCol>
            )}
          </IonRow>
        )}
      </IonGrid>
    </IonCard>
  );
};
