import React, { useEffect, useState } from "react";
import {
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
  IonSpinner,
  IonText,
} from "@ionic/react";
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
  isArchived?: boolean;
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
  isArchived,
}: HomeDiscussionCardProps) => {
  const user = useSelector((state: any) => state.user.user);
  const history = useHistory();
  const [discussionParticipants, setDiscussionParticipants] =
    useState<string[]>();
  const [isJoiningLeaving, setIsJoiningLeaving] = useState<boolean>(false);

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
      <IonLabel
        onClick={() => history.push("/tabs/home/" + bookClubId + "/view")}
      >
        <div className="title">{bookClubName}</div>
        <div className="time">{getTimeSlotString(startTime, endTime)}</div>
      </IonLabel>
      <div className="ion-padding-end">
        <IonChip
          slot="end"
          disabled={isArchived === true || !isMember}
          onClick={() => handleJoinLeave()}
          className={isParticipant() ? "chipIsParticipant" : ""}
        >
          <IonIcon
            color={isParticipant() ? "white" : ""}
            icon={people}
          ></IonIcon>
          {isJoiningLeaving ? (
            <div className="discussionMembersSpacing">
              <IonSpinner className="chipSpinner"></IonSpinner>
            </div>
          ) : (
            <p className="discussionMembersSpacing">
              {discussionParticipants ? discussionParticipants.length : "0"}
            </p>
          )}
        </IonChip>
      </div>
    </IonItem>
  );
};
