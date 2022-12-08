import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonImg,
  IonRow,
} from "@ionic/react";

interface ClubCardProps {
  name: string;
  member: number;
  image: string;
  date: string;
  time: string;
  location: string;
  id: string,
}

export const ClubCard: React.FC<ClubCardProps> = ({
  name,
  member,
  image,
  date,
  time,
  location,
  id,
}: ClubCardProps) => {
  return (
    <IonCard routerLink={"/clubs/" + id + "/view" }>
      <IonGrid>
        <IonRow>
          <IonCol size="4">
            <IonImg
              alt="assets/images/default_book_cover.jpg"
              src={image}
            />
          </IonCol>
          <IonCol size="8">
            <IonCardHeader>
              <IonCardTitle>{name}</IonCardTitle>
              <IonCardSubtitle>{member} people</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              Next discussion
              <br />
              {time}
              <br />
              {date}
              <br />
              {location}
              {id}
            </IonCardContent>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};
