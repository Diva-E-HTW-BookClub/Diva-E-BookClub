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
  useIonActionSheet,
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
  deleteDiscussionDocument,
  getDiscussionDocument,
  removeDiscussionParticipant,
} from "../firebase/firebaseDiscussions";
import EditDiscussionModal, { ModalHandle } from "./EditDiscussionModal";

interface NewDiscussionCardProps {
  bookClubId: string;
  discussionId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  discussionLocation: string;
  isModerator: boolean;
  updatePage?: () => void;
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
  updatePage,
  isMember,
  isDone,
}: NewDiscussionCardProps) => {
  const user = useSelector((state: any) => state.user.user);
  const [discussionParticipants, setDiscussionParticipants] =
    useState<string[]>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const editModal = useRef<ModalHandle>(null);
  const [present] = useIonActionSheet();

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

  async function deleteDiscussion() {
    await deleteDiscussionDocument(bookClubId, discussionId).then(updatePage);
  }

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const actionSheet = () =>
    present({
      header: "Delete Discussion",
      subHeader: title,
      backdropDismiss: false,
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          data: {
            action: "delete",
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        if (detail.data.action === "delete") {
          deleteDiscussion();
        }
      },
    });

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
            onClick={() => editModal.current?.open()}
          >
            <IonLabel class="ion-padding-start">Edit</IonLabel>
            <IonIcon class="ion-padding-end" slot="end" icon={pencil}></IonIcon>
          </IonItem>
          <IonItem button detail={false} onClick={actionSheet} lines="none">
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
                {updatePage && (
                  <EditDiscussionModal
                    bookClubId={bookClubId}
                    discussionId={discussionId}
                    onDismiss={updatePage}
                    ref={editModal}
                  />
                )}
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
                "/tabs/clubs/" +
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
                "/tabs/clubs/" +
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
                "/tabs/clubs/" +
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
