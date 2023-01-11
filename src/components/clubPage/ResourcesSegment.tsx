import {
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel, IonList,
  IonSpinner,
} from "@ionic/react";
import { BookClub } from "../../firebase/firebaseBookClub";
import { ResourceCard } from "../resources/ResourceCard";

interface ResourcesSegmentProps {
  bookClubId: string;
  bookClubData?: BookClub;
  updatePage: () => void;
}

export const ResourcesSegment: React.FC<ResourcesSegmentProps> = ({
  bookClubId,
  bookClubData,
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
