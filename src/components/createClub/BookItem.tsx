import {
  IonCol,
  IonGrid,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
} from "@ionic/react";

import "./BookItem.css";
import {getAuthorsArrayToString} from "../../helpers/openLibraryHelpers";

interface BookItemProps {
  image: string;
  title: string;
  authors?: string[];
  selected?: boolean;
}

export const BookItem: React.FC<BookItemProps> = ({
  image,
  title,
  authors,
  selected,
}: BookItemProps) => {
  return (
    <IonItem color={selected ? "favorite" : ""} className="bookItem">
      <IonGrid className="ion-padding-horizontal">
        <IonRow className="ion-align-items-center bookItemRow">
          <IonCol size="9" sizeMd="10">
            <IonLabel className="ion-text-wrap">
              <h2>{title}</h2>
              {authors && <p>{getAuthorsArrayToString(authors, 3)}</p>}
            </IonLabel>
          </IonCol>
          <IonCol size="3" sizeMd="2">
            <IonImg alt={title} src={image} className="bookItemBookCover" />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};
