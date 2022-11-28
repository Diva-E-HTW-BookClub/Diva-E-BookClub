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
  date: string;
  time: string;
  location: string;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  name,
  member,
  date,
  time,
  location,
}: ClubCardProps) => {
  return (
    <IonCard>
      <IonGrid>
        <IonRow>
          <IonCol size="4">
            <IonImg
              alt="Clean Code"
              src="https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg"
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
            </IonCardContent>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCard>
  );
};
