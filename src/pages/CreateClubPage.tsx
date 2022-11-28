import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonInput,
  IonItem,
  IonSearchbar,
  IonList,
  IonButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonButtons,
  useIonViewWillEnter,
  IonBackButton,
} from "@ionic/react";
import "./CreateClubPage.css";
import React, { useState } from "react";
import { BookCard } from "../components/BookCard";

const CreateClubPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>();

  const loadData = (event: any) => {
    setTimeout(() => {
      fetch(
        "https://openlibrary.org/search.json?q=Clean Code&fields=title,author_name,cover_i&limit=20&offset=" +
          data.length
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setData([...data, ...result.docs]);
            if (event != null) {
              // needed to make the infinite scroll work
              event.target.complete();
            }
          },
          // catch errors for both fetch and res.json()
          (error) => {}
        );
    }, 500);
  };

  useIonViewWillEnter(() => {
    // load data without calling event.target.complete()
    loadData(null);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clubs" />
          </IonButtons>
          <IonTitle>New Club</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/clubs/clubId" color="primary">
              Create
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">New Club</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
          <IonLabel position="stacked">
            <h1>Club name</h1>
          </IonLabel>
          <IonInput placeholder="Enter book club name"></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">
            <h1>Max number of participants</h1>
          </IonLabel>
          <IonInput placeholder="Enter a number (max 50)"></IonInput>
        </IonItem>
        <IonSearchbar placeholder="Find a book"></IonSearchbar>

        <IonList lines="none">
          {data.map((item, index) => {
            return (
              <IonItem key={index} onClick={() => setSelectedBookIndex(index)}>
                <BookCard
                  image={
                    "https://covers.openlibrary.org/b/id/" +
                    String(item.cover_i) +
                    "-M.jpg"
                  }
                  title={item.title}
                  author={item.author_name ? item.author_name[0] : ""}
                  selected={selectedBookIndex === index}
                />
              </IonItem>
            );
          })}
        </IonList>

        <IonInfiniteScroll onIonInfinite={loadData}>
          <IonInfiniteScrollContent loadingSpinner="bubbles"></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default CreateClubPage;
