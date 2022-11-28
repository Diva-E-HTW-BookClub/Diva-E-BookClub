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
  IonIcon,
  useIonViewWillEnter,
  IonButton,
} from "@ionic/react";
import { add, book } from "ionicons/icons";
import "./ClubsTab.css";
import { useEffect, useState } from "react";
import { ClubCard } from "../components/ClubCard";
import { searchBookClubs } from "../firebase/firebaseBookClub";

const ClubsTab: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getBookClubs();
    console.log("page loaded");
  }, []);

  async function getBookClubs() {
    var res = searchBookClubs(10);
    var bookClubArray = await res;

    setData(bookClubArray);
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
          {data.map((object, index) => {
            return (
              <IonItem key={object.id}>
                <ClubCard
                  name={object.data.title}
                  member={object.data.memberCount}
                  date={object.data.date}
                  time={object.data.time}
                  location={object.data.location}
                />
              </IonItem>
            );
          })}
        </IonList>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton href="/clubs/create">
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ClubsTab;
