import {
  IonCard,
  IonCol,
  IonGrid,
  IonImg,
  IonLabel,
  IonRow,
} from "@ionic/react";

import "./BookCard.css";
import {getAuthorsArrayToString} from "../../helpers/openLibraryHelpers";

interface BookCardProps {
  image: string;
  title: string;
  authors?: string[];
}

export const BookCard: React.FC<BookCardProps> = ({
  image,
  title,
  authors,
}: BookCardProps) => {
  return (
    <IonCard className="bookCard">
      <IonGrid className="ion-padding-horizontal">
        <IonRow className="ion-align-items-center bookCardRow">
          <IonCol size="9" sizeMd="10">
            <IonLabel>
              <h2>{title}</h2>
              {authors && <p>{getAuthorsArrayToString(authors, 3)}</p>}
            </IonLabel>
          </IonCol>
          <IonCol size="3" sizeMd="2">
            <IonImg alt={title} src={image} className="bookCardBookCover" />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};
