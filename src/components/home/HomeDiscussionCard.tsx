import React, { useEffect, useState } from "react";
import { IonChip, IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";
import {
  getDayValue,
  getMonthName,
  getTimeSlotString,
} from "../../helpers/datetimeFormatter";
import { people } from "ionicons/icons";
import { useSelector } from "react-redux";
import {
  addDiscussionParticipant,
  getDiscussionDocument,
  removeDiscussionParticipant,
} from "../../firebase/firebaseDiscussions";
import { useHistory } from "react-router-dom";

interface HomeDiscussionCardProps {
  bookClubId: string;
  bookClubName: string;
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

export const HomeDiscussionCard: React.FC<HomeDiscussionCardProps> = ({
  bookClubId,
  bookClubName,
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
}: HomeDiscussionCardProps) => {
  const user = useSelector((state: any) => state.user.user);
  const history = useHistory();
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

  const calendarDate = (date: string) => {
    return (
      <div
        className="calendarDate"
        onClick={() => history.push("/tabs/home/" + bookClubId + "/view")}
      >
        <IonLabel>
          <p>{getMonthName(date)}</p>
          <IonText className="date">{getDayValue(date)}</IonText>
        </IonLabel>
      </div>
    );
  };

  return (
    <IonItem button detail={false}>
      <div className="ion-padding-start">{calendarDate(date)}</div>
      <div className="spacing"></div>
      <IonLabel onClick={() => history.push("/tabs/home/" + bookClubId + "/view")}>
        <div className="title">{bookClubName}</div>
        <div className="time">{getTimeSlotString(startTime, endTime)}</div>
      </IonLabel>
      <div className="ion-padding-end">
        <IonChip
          slot="end"
          disabled={isDone === true || !isMember}
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
      </div>
    </IonItem>
  );
};
