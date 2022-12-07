import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonFabButton,
  IonIcon
} from "@ionic/react";
import { add } from "ionicons/icons";
import "./ClubsTab.css";
import { useEffect, useState } from "react";
import { ClubCard } from "../../components/ClubCard";
import { searchBookClubs, BookClub } from "../../firebase/firebaseBookClub";

const ClubsTab: React.FC = () => {
  const [data, setData] = useState<BookClub[]>([]);

  useEffect(() => {
    getBookClubs();
    console.log("page loaded");
  }, []);

  async function getBookClubs() {
    let bookClubs = await searchBookClubs(10);
    setData(bookClubs);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Clubs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Clubs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar></IonSearchbar>

        <IonSegment value="trending">
          <IonSegmentButton value="trending">
            <IonLabel>Trending</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="your">
            <IonLabel>Your</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="new">
            <IonLabel>New</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonList lines="none">
          {data.map((bookClub, index) => {
            return (
              <IonItem key={bookClub.id}>
                <ClubCard
                  id={bookClub.id}
                  name={bookClub.name}
                  member={bookClub.participants.length}
                  image={bookClub.book.imageUrl}
                  date={""}
                  time={""}
                  location={""}
                />
              </IonItem>
            );
          })}
        </IonList>

        <IonInfiniteScroll onIonInfinite={() => {}}>
          <IonInfiniteScrollContent loadingSpinner="bubbles"></IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton routerLink="/create_club">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ClubsTab;
