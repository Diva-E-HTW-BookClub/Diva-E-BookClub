import {
  IonCard,
  IonCol,
  IonGrid,
  IonImg, IonLabel,
  IonRow,
} from "@ionic/react";

import "./BookCard.css";

interface BookCardProps {
  image: string;
  title: string;
  author: string;
}

export const BookCard: React.FC<BookCardProps> = ({
  image,
  title,
  author,
}: BookCardProps) => {
  return (
    <IonCard className="bookCard">
      <IonGrid className="ion-padding-horizontal">
        <IonRow className="ion-align-items-center bookCardRow">
          <IonCol size="9" sizeMd="10">
            <IonLabel>
              <h2>{title}</h2>
              <p>{author}</p>
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
