import { IonItem, IonLabel, IonSpinner } from "@ionic/react";
import React from "react";
import { BookClub } from "../../firebase/firebaseBookClub";
import { ResourceCard } from "../ResourceCard";

interface ResourcesSegmentProps {
  bookClubId: string;
  bookClubData?: BookClub;
  isModerator: boolean;
  isMember: boolean;
  updatePage: () => void;
}

export const ResourcesSegment: React.FC<ResourcesSegmentProps> = ({
  bookClubId,
  bookClubData,
  isModerator,
  isMember,
  updatePage,
}: ResourcesSegmentProps) => {
  if (!bookClubData) {
    return <IonSpinner></IonSpinner>;
  }

  let resources = bookClubData?.resources;
  return (
    <>
      {resources.length === 0 && (
        <div className="ion-padding-horizontal">
          <IonItem lines="none">
            <IonLabel>
              <p>There are no resources</p>
            </IonLabel>
          </IonItem>
        </div>
      )}
      {resources.map((resource, index) => {
        return (
          <div className="ion-padding-horizontal" key={index}>
            <ResourceCard
              resourceId={resource.id}
              title={resource.title}
              content={resource.content}
              moderator={resource.moderator}
              bookClubId={bookClubId}
            />
          </div>
        );
      })}
    </>
  );
};
