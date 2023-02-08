import {
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonRow,
} from "@ionic/react";
import "./ClubCard.css";
import { book, people } from "ionicons/icons";
import {getAuthorsArrayToString} from "../helpers/openLibraryHelpers";

interface ClubCardProps {
  name: string;
  maxMember: number;
  member: number;
  image: string;
  bookTitle: string;
  authors: string[];
  id: string;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  name,
  maxMember,
  member,
  image,
  bookTitle,
  authors,
  id,
}: ClubCardProps) => {

  return (
    <IonItem button routerLink={`/tabs/clubs/${id}/view`} detail={false}>
      <IonGrid className="ion-padding-horizontal">
        <IonRow className="ion-align-items-center">
          <IonCol sizeMd="10" size="9" className="columnClubCard">
            <div className="clubName">{name}</div>
            <div className="verticalSpacing"></div>
            <div className="flexStartClubCard">
              <IonIcon
                className="flexIcon"
                icon={book}
                size="large"
                color="medium"
              />
              <IonLabel className="flexbox ion-text-wrap">
                <h2>{bookTitle}</h2>
                <p>{getAuthorsArrayToString(authors)}</p>
              </IonLabel>
            </div>
            <div className="verticalSpacing"></div>
            <div className="flexStartClubCard">
              <IonIcon
                className="flexIcon"
                icon={people}
                color="medium"
                size="large"
              />
              <IonLabel className="flexbox">
                <p>{member + " of " + maxMember}</p>
              </IonLabel>
            </div>
          </IonCol>
          <IonCol sizeMd="2" size="3" className="img-column">
            <IonImg
              className="clubCardBookCover"
              alt="assets/images/default_book_cover.jpg"
              src={image}
            />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};
