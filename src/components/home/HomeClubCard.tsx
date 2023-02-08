import {
  IonCard,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonLabel,
  IonRow,
} from "@ionic/react";
import "./HomeClubCard.css";
import { book, people } from "ionicons/icons";
import {getAuthorsArrayToString} from "../../helpers/openLibraryHelpers";

interface HomeClubCardProps {
  name: string;
  maxMember: number;
  member: number;
  image: string;
  bookTitle: string;
  authors: string[];
  id: string;
}

export const HomeClubCard: React.FC<HomeClubCardProps> = ({
  name,
  maxMember,
  member,
  image,
  bookTitle,
  authors,
  id,
}: HomeClubCardProps) => {

  return (
    <IonCard routerLink={`/tabs/home/${id}/view`} className="card">
      <IonGrid className="ion-padding-horizontal">
        <IonRow className="ion-align-items-center">
          <IonCol sizeMd="10" size="9" className="columnClubCardHome">
            <div className="clubNameHome">{name}</div>
            <div className="verticalSpacing"></div>
            <div className="flexStartClubCard">
              <IonIcon
                className="flexIcon"
                icon={book}
                size="large"
                color="medium"
              />
              <IonLabel className="flexbox ion-text-wrap">
                <h2 className="bookTitleHome">{bookTitle}</h2>
                <p>{getAuthorsArrayToString(authors, 3)}</p>
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
          <IonCol sizeMd="2" size="3" className="img-columnHome">
            <IonImg
              className="clubCardBookCover"
              alt="assets/images/default_book_cover.jpg"
              src={image}
            ></IonImg>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};
