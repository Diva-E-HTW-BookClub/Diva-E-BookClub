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
} from "@ionic/react";
import { add } from "ionicons/icons";
import "./ClubsTab.css";
import { useState } from "react";
import { ClubCard } from "../components/ClubCard";

const ClubsTab: React.FC = () => {
  const [data, setData] = useState<string[]>([]);

  const pushData = () => {
    const max = data.length + 20;
    const min = max - 20;
    const newData = [];
    for (let i = min; i < max; i++) {
      newData.push("" + i);
    }

    setData([...data, ...newData]);
  };

  const loadData = (ev: any) => {
    setTimeout(() => {
      pushData();
      ev.target.complete();
    }, 500);
  };

  useIonViewWillEnter(() => {
    pushData();
  });

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
          {data.map((item, index) => {
            return (
              <IonItem key={index}>
                <ClubCard
                  name={"Diva-E's BookClub"}
                  member={3}
                  date={"20.10.2022"}
                  time={"13:00 - 14:00"}
                  location={"Raum Gute Stube"}
                />
              </IonItem>
            );
          })}
        </IonList>

        <IonInfiniteScroll onIonInfinite={loadData}>
          <IonInfiniteScrollContent loadingSpinner="bubbles"></IonInfiniteScrollContent>
        </IonInfiniteScroll>

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
