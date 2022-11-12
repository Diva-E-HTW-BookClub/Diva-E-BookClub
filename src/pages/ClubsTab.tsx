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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonFab,
  IonFabButton,
  IonIcon,
  useIonViewWillEnter
} from '@ionic/react';
import { add } from 'ionicons/icons';
import './ClubsTab.css';
import { useState } from 'react';

const ClubsTab: React.FC = () => {
  const [data, setData] = useState<string[]>([]);

  const pushData = () => {
    const max = data.length + 20;
    const min = max - 20;
    const newData = [];
    for (let i = min; i < max; i++) {
      newData.push('' + i);
    }

    setData([
      ...data,
      ...newData
    ]);
  }

  const loadData = (ev: any) => {
    setTimeout(() => {
      pushData();
      ev.target.complete();
    }, 500);
  }

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
                <IonCard>
                  <IonGrid>
                    <IonRow>
                      <IonCol size="4">
                        <IonImg alt="Clean Code" src="https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg" />
                      </IonCol>
                      <IonCol size="8">
                        <IonCardHeader>
                          <IonCardTitle>Diva-e's Reading Club</IonCardTitle>
                          <IonCardSubtitle>{item} people</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                          Next discussion<br />
                          14:00 - 18:00<br />
                          31.10.2022<br />
                          Raum Gute Stube
                        </IonCardContent>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCard>
              </IonItem>
            )
          })}
        </IonList>

        <IonInfiniteScroll onIonInfinite={loadData}>
          <IonInfiniteScrollContent loadingSpinner="bubbles">
          </IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ClubsTab;
