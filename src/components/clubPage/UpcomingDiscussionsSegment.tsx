import { BookClub } from "../../firebase/firebaseBookClub";
import React from "react";
import {
  getDiscussionsByYear,
  getUpcomingDiscussions,
  getYearArrayOfDiscussions,
} from "../../helpers/discussionSort";
import {
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import { NewDiscussionCard } from "../NewDiscussionCard";

interface UpcomingDiscussionsSegmentProps {
  bookClubId: string;
  bookClubData?: BookClub;
  isModerator: boolean;
  isMember: boolean;
}

export const UpcomingDiscussionsSegment: React.FC<
  UpcomingDiscussionsSegmentProps
> = ({
  bookClubId,
  bookClubData,
  isModerator,
  isMember,
}: UpcomingDiscussionsSegmentProps) => {
  if (!bookClubData) {
    return <IonSpinner></IonSpinner>;
  }

  let discussions = bookClubData?.discussions;

  let upcomingDiscussions = getUpcomingDiscussions(discussions);
  let discussionYears = getYearArrayOfDiscussions(upcomingDiscussions);

  return (
    <>
      {upcomingDiscussions.length === 0 && (
        <div className="ion-padding-horizontal">
          <IonItem lines="none">
            <IonLabel>
              <p>There are no discussions planned</p>
            </IonLabel>
          </IonItem>
        </div>
      )}
      {discussionYears.map((year, index) => {
        return (
          <IonItemGroup key={index}>
            <IonItemDivider>{year}</IonItemDivider>
            {getDiscussionsByYear(year, upcomingDiscussions).map(
              (discussion, index) => {
                return (
                  <IonItem class="ion-no-padding" key={index}>
                    <NewDiscussionCard
                      bookClubId={bookClubId}
                      discussionId={discussion.id}
                      title={discussion.title}
                      date={discussion.date}
                      startTime={discussion.startTime}
                      endTime={discussion.endTime}
                      discussionLocation={discussion.location}
                      isMember={isMember}
                      isModerator={isModerator}
                    />
                  </IonItem>
                );
              }
            )}
          </IonItemGroup>
        );
      })}
    </>
  );
};
