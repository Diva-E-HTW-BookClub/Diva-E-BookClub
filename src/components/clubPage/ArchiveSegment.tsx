import {
  getDiscussionsByYear,
  getPastDiscussions,
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
import React from "react";
import { BookClub } from "../../firebase/firebaseBookClub";

interface ArchiveSegmentProps {
  bookClubId: string;
  bookClubData?: BookClub;
  isModerator: boolean;
  updatePage: () => void;
}

export const ArchiveSegment: React.FC<ArchiveSegmentProps> = ({
  bookClubId,
  bookClubData,
  isModerator,
  updatePage,
}: ArchiveSegmentProps) => {
  if (!bookClubData) {
    return <IonSpinner></IonSpinner>;
  }

  let discussions = bookClubData.discussions;
  let pastDiscussions = getPastDiscussions(discussions);
  let discussionYears = getYearArrayOfDiscussions(pastDiscussions);

  return (
    <>
      {pastDiscussions.length === 0 && (
        <div className="ion-padding-horizontal">
          <IonItem lines="none">
            <IonLabel>
              <p>There are no past discussions</p>
            </IonLabel>
          </IonItem>
        </div>
      )}
      {discussionYears.map((year, index) => {
        return (
          <IonItemGroup key={index}>
            <IonItemDivider>{year}</IonItemDivider>
            {getDiscussionsByYear(year, pastDiscussions).map(
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
                      updatePage={updatePage}
                      isModerator={isModerator}
                      isArchived={true}
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
