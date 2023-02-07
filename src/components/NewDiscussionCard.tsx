import React, { useEffect, useRef, useState } from "react";
import {
  IonChip,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonRow,
  IonSpinner,
  IonText,
  useIonActionSheet,
  useIonToast,
} from "@ionic/react";
import {
  getDayValue,
  getMonthName,
  getTimeSlotString,
} from "../helpers/datetimeFormatter";
import {
  ellipsisVertical,
  people,
  locationOutline,
  pencil,
  trashOutline,
  chatbubbleOutline,
  addOutline,
  removeOutline,
  alertCircleOutline,
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
import { useHistory, useLocation } from "react-router-dom";

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
  isArchived?: boolean;
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
  isArchived,
}: NewDiscussionCardProps) => {
  const user = useSelector((state: any) => state.user.user);
  const [discussionParticipants, setDiscussionParticipants] =
    useState<string[]>();
  const [isJoiningLeaving, setIsJoiningLeaving] = useState<boolean>(false);
  const [moderatorPopoverOpen, setModeratorPopoverOpen] = useState(false);
  const popoverModeratorRef = useRef<HTMLIonPopoverElement>(null);
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const popoverLocationRef = useRef<HTMLIonPopoverElement>(null);
  const editModal = useRef<ModalHandle>(null);
  const [presentActionSheet] = useIonActionSheet();
  const [presentToast] = useIonToast();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    getDiscussionParticipants();
  }, []);

  const isParticipant = () => {
    return discussionParticipants?.includes(user.uid);
  };

  async function getDiscussionParticipants() {
    await getDiscussionDocument(bookClubId, discussionId).then((data) => {
      setDiscussionParticipants(data?.participants);
      setIsJoiningLeaving(false);
    });
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
      setIsJoiningLeaving(true);
      await addDiscussionParticipant(bookClubId, discussionId, user.uid).then(
        () => {
          setTimeout(() => getDiscussionParticipants(), 200);
        }
      );
    }
  }

  async function leaveDiscussion() {
    if (discussionParticipants != null && isParticipant()) {
      setIsJoiningLeaving(true);
      await removeDiscussionParticipant(
        bookClubId,
        discussionId,
        user.uid
      ).then(() => {
        setTimeout(() => getDiscussionParticipants(), 200);
      });
    }
  }

  async function deleteDiscussion() {
    await deleteDiscussionDocument(bookClubId, discussionId).then(updatePage);
  }

  const actionSheet = () =>
    presentActionSheet({
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

  const openModeratorPopover = (e: any) => {
    popoverModeratorRef.current!.event = e;
    setModeratorPopoverOpen(true);
  };

  const openLocationPopover = (e: any) => {
    popoverLocationRef.current!.event = e;
    setLocationPopoverOpen(true);
  };

  const presentJoinToast = () => {
    presentToast({
      message: "Please join to access this Book Club and its Discussions",
      duration: 2500,
      icon: alertCircleOutline,
      color: "danger",
    });
  };

  const locationPopover = () => {
    return (
      <IonPopover
        ref={popoverLocationRef}
        isOpen={locationPopoverOpen}
        dismissOnSelect={true}
        onDidDismiss={() => setLocationPopoverOpen(false)}
      >
        <div className="ion-padding-horizontal">
          <IonItem lines="none">
            <IonLabel className="ion-text-wrap">{discussionLocation}</IonLabel>
          </IonItem>
        </div>
      </IonPopover>
    );
  };

  const moderatorPopover = () => {
    return (
      <IonPopover
        ref={popoverModeratorRef}
        isOpen={moderatorPopoverOpen}
        dismissOnSelect={true}
        onDidDismiss={() => setModeratorPopoverOpen(false)}
      >
        <IonList lines="full">
          <IonItem
            button
            detail={false}
            onClick={(e) => {
              e.stopPropagation();
              editModal.current?.open();
            }}
          >
            <IonLabel class="ion-padding-start">Edit</IonLabel>
            <IonIcon class="ion-padding-end" slot="end" icon={pencil}></IonIcon>
          </IonItem>
          <IonItem
            button
            detail={false}
            onClick={(e) => {
              e.stopPropagation();
              actionSheet();
            }}
            lines="none"
          >
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
      <div className={isMember ? "calendarDate" : "calendarDateDisabled"}>
        <IonLabel color={!isMember ? "medium" : ""}>
          <p>{getMonthName(date)}</p>
          <IonText className="date">{getDayValue(date)}</IonText>
        </IonLabel>
      </div>
    );
  };

  const getCurrentTab = () => {
    if (location.pathname.includes("/tabs/home")) {
      return "home";
    }
    if (location.pathname.includes("/tabs/clubs")) {
      return "clubs";
    }
  };

  const privateRoutingTo = (destination: string, event?: any) => {
    if (isMember) {
      switch (destination) {
        case "agenda": {
          if (isArchived) {
            history.push(
              "/tabs/" +
                getCurrentTab() +
                "/" +
                bookClubId +
                "/discussions/" +
                discussionId +
                "/archived"
            );
          } else {
            history.push(
              "/tabs/" +
                getCurrentTab() +
                "/" +
                bookClubId +
                "/discussions/" +
                discussionId +
                "/agenda"
            );
          }
          return;
        }
        case "comments": {
          history.push(
            "/tabs/" +
              getCurrentTab() +
              "/" +
              bookClubId +
              "/discussions/" +
              discussionId +
              "/comments"
          );
          return;
        }
        case "location": {
          if (event) {
            openLocationPopover(event);
          }
          return;
        }
      }
    } else {
      presentJoinToast();
    }
  };

  const joinLeaveChip = () => {
    return (
      <IonChip
        slot="end"
        disabled={isArchived === true || !isMember}
        onClick={(e) => {
          handleJoinLeave();
          e.stopPropagation();
        }}
        className={
          isParticipant() ? "chipIsParticipant" : "chipIsNotParticipant"
        }
      >
        {isJoiningLeaving ? (
          <div className="discussionMembersSpacing">
            <IonSpinner name="dots" className="chipSpinner"></IonSpinner>
          </div>
        ) : (
          <>
            {!isParticipant() ? (
              <IonIcon icon={addOutline}></IonIcon>
            ) : (
              <IonIcon color="white" icon={removeOutline}></IonIcon>
            )}
            <IonIcon
              color={isParticipant() ? "white" : ""}
              icon={people}
            ></IonIcon>
            <div className="discussionMembersSpacing">
              <IonText>
                {discussionParticipants ? discussionParticipants.length : "0"}
              </IonText>
            </div>
          </>
        )}
      </IonChip>
    );
  };

  return (
    <>
      <IonItem
        button
        detail={false}
        onClick={() =>
          !isMember ? presentJoinToast() : privateRoutingTo("agenda")
        }
      >
        <IonGrid fixed className="ion-padding-horizontal">
          <IonRow>
            <IonCol className="ion-grid-column">
              <IonItem color="none" lines="none">
                {calendarDate(date)}
                <div className="spacing"></div>
                <IonLabel color={!isMember ? "medium" : ""}>
                  <div className="title">{title}</div>
                  <div className={isMember ? "time" : "timeDisabled"}>
                    {getTimeSlotString(startTime, endTime)}
                  </div>
                </IonLabel>
                {isModerator && (
                  <>
                    <IonIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        openModeratorPopover(e);
                      }}
                      slot="end"
                      icon={ellipsisVertical}
                    ></IonIcon>
                    {moderatorPopover()}
                  </>
                )}
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol className="ion-grid-column">
              <IonItem color="none" lines="none">
                <IonIcon
                  color={!isMember ? "medium" : ""}
                  slot="start"
                  onClick={(e) => {
                    e.stopPropagation();
                    privateRoutingTo("location", e);
                  }}
                  icon={locationOutline}
                ></IonIcon>
                {locationPopover()}
                <IonIcon
                  color={!isMember ? "medium" : ""}
                  slot="start"
                  onClick={(e) => {
                    e.stopPropagation();
                    privateRoutingTo("comments");
                  }}
                  icon={chatbubbleOutline}
                ></IonIcon>
                {joinLeaveChip()}
              </IonItem>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
      {updatePage && (
        <EditDiscussionModal
          bookClubId={bookClubId}
          discussionId={discussionId}
          onDismiss={updatePage}
          ref={editModal}
        />
      )}
    </>
  );
};
