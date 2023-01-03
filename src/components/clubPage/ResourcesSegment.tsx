import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import React from "react";
import { BookClub } from "../../firebase/firebaseBookClub";
import { add } from "ionicons/icons";
import { ResourceCard } from "../ResourceCard";

interface ResourcesSegmentProps {
  bookClubId: string;
  bookClubData?: BookClub;
  isModerator: boolean;
  isMember: boolean;
}

export const ResourcesSegment: React.FC<ResourcesSegmentProps> = ({
  bookClubId,
  bookClubData,
  isModerator,
  isMember,
}: ResourcesSegmentProps) => {
  const content = () => {
    let resources = bookClubData?.resources;
    if (resources) {
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
    }
  };

  return (
    <>
      <div className="ion-padding-horizontal">
        <IonItem lines="none">
          <IonLabel>Resources</IonLabel>
          {(isMember || isModerator) && (
            <IonButton
              fill="clear"
              slot="end"
              routerLink={"/clubs/" + bookClubId + "/resources/add"}
            >
              <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
          )}
        </IonItem>
      </div>
      {!bookClubData && <IonSpinner></IonSpinner>}
      {bookClubData && content()}
    </>
  );
};
