import React, { useEffect, useRef, useState } from "react";
import {
  IonButton,
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonRow,
  IonText,
} from "@ionic/react";
import {
  getDayValue,
  getMonthName,
  getTimeSlotString,
} from "../helpers/datetimeFormatter";
import {
  chatbox,
  clipboard,
  ellipsisVertical,
  people,
  locationOutline,
  pencil,
  trashOutline,
} from "ionicons/icons";
import "./NewDiscussionCard.css";
import { useSelector } from "react-redux";
import {
  addDiscussionParticipant,
  getDiscussionDocument,
  removeDiscussionParticipant,
} from "../firebase/firebaseDiscussions";

interface NewDiscussionCardProps {
  bookClubId: string;
  discussionId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  discussionLocation: string;
  isModerator: boolean;
  isMember?: boolean;
  isDone?: boolean;
}

export const NewDiscussionCard: React.FC<NewDiscussionCardProps> = ({
  bookClubId,
  discussionId,
  title,
  startTime,
  endTime,
  discussionLocation,
  date,
  isModerator,
  isMember,
  isDone,
}: NewDiscussionCardProps) => {
  const user = useSelector((state: any) => state.user.user);
  const [discussionParticipants, setDiscussionParticipants] =
    useState<string[]>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popover = useRef<HTMLIonPopoverElement>(null);

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

  const handleJoinLeave = () => {
    if (!isParticipant()) {
      joinDiscussion();
    } else {
      leaveDiscussion();
    }
  };

  async function joinDiscussion() {
    if (discussionParticipants != null) {
      await addDiscussionParticipant(bookClubId, discussionId, user.uid);
      getDiscussionParticipants();
    }
  }

  async function leaveDiscussion() {
    if (discussionParticipants != null && isParticipant()) {
      await removeDiscussionParticipant(bookClubId, discussionId, user.uid);
      getDiscussionParticipants();
    }
  }

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const moderatorPopover = () => {
    return (
      <IonPopover
        ref={popover}
        isOpen={popoverOpen}
        dismissOnSelect={true}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <IonList lines="full">
          <IonItem
            button
            detail={false}
            routerLink={
              "/clubs/" + bookClubId + "/discussions/" + discussionId + "/edit"
            }
          >
            <IonLabel class="ion-padding-start">Edit</IonLabel>
            <IonIcon class="ion-padding-end" slot="end" icon={pencil}></IonIcon>
          </IonItem>
          {/*The Delete Button here does not work yet. Use the Button on the EditDiscussionPage*/}
          <IonItem button detail={false} lines="none">
            <IonLabel class="ion-padding-start" color="danger">
              Delete
            </IonLabel>
            <IonIcon
              class="ion-padding-end"
              color="danger"
              slot="end"
              icon={trashOutline}
            ></IonIcon>
          </IonItem>
        </IonList>
      </IonPopover>
    );
  };

  const calendarDate = (date: string) => {
    return (
      <div className="calendarDate">
        <IonLabel>
          <p>{getMonthName(date)}</p>
          <IonText className="date">{getDayValue(date)}</IonText>
        </IonLabel>
      </div>
    );
  };

  return (
    <IonGrid fixed className="ion-padding-horizontal">
      <IonRow>
        <IonCol className="ion-grid-column">
          <IonItem lines="none">
            {calendarDate(date)}
            <div className="spacing"></div>
            <IonLabel>
              <div className="title">{title}</div>
              <div className="time">
                {getTimeSlotString(startTime, endTime)}
              </div>
            </IonLabel>
            {isModerator && (
              <>
                <IonButton onClick={openPopover} slot="end" fill="clear">
                  <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                </IonButton>
                {moderatorPopover()}
              </>
            )}
          </IonItem>
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol>
          <IonItem lines="none">
            <IonIcon size="small" icon={locationOutline}></IonIcon>
            <div className="spacing"></div>
            <IonLabel>
              <div className="locationBox">{discussionLocation}</div>
            </IonLabel>
            
            <IonButton
              fill="clear"
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
            {isDone &&
            <IonButton
              fill="clear"
              routerLink={
                "/clubs/" +
                bookClubId +
                "/discussions/" +
                discussionId +
                "/archived"
              }
            >
              <IonIcon slot="icon-only" icon={clipboard}></IonIcon>
            </IonButton>
            }
             {!isDone &&
            <IonButton
              fill="clear"
              routerLink={
                "/clubs/" +
                bookClubId +
                "/discussions/" +
                discussionId +
                "/agenda"
              }
            >
              <IonIcon slot="icon-only" icon={clipboard}></IonIcon>
            </IonButton>
            }
            <IonChip
              disabled={isDone || !isMember}
              onClick={() => handleJoinLeave()}
              className={isParticipant() ? "chipIsParticipant" : ""}
            >
              <IonIcon
                color={isParticipant() ? "white" : ""}
                icon={people}
              ></IonIcon>
              <p className="discussionMembersSpacing">
                {discussionParticipants ? discussionParticipants.length : "0"}
              </p>
            </IonChip>
          </IonItem>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
