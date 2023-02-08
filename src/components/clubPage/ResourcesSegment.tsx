import {
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonList, IonProgressBar,
} from "@ionic/react";
import { BookClub } from "../../firebase/firebaseBookClub";
import { ResourceCard } from "../resources/ResourceCard";
import React from "react";

interface ResourcesSegmentProps {
  bookClubId: string;
  bookClubData?: BookClub;
  isMember?: boolean;
  isModerator?: boolean;
  updatePage: () => void;
}

export const ResourcesSegment: React.FC<ResourcesSegmentProps> = ({
  bookClubId,
  bookClubData,
  isMember,
  isModerator,
  updatePage,
}: ResourcesSegmentProps) => {
  if (!bookClubData) {
    return <IonProgressBar type="indeterminate"></IonProgressBar>;
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
      {resources.length > 0 && (
        <IonItemGroup>
          <IonItemDivider>Links</IonItemDivider>
          <IonList>
            {resources.map((resource, index) => {
              return (
                <ResourceCard
                  key={index}
                  resourceId={resource.id}
                  title={resource.title}
                  content={resource.content}
                  moderator={resource.moderator}
                  isBookClubModerator={isModerator}
                  isMember={isMember}
                  bookClubId={bookClubId}
                  updatePage={updatePage}
                />
              );
            })}
          </IonList>
        </IonItemGroup>
      )}
    </>
  );
};
