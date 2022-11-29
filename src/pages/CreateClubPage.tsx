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
  IonBackButton
} from "@ionic/react";
import "./CreateClubPage.css";
import React, { useState } from "react";
import { BookCard } from "../components/BookCard";

const CreateClubPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>();
  const [query, setQuery] = useState<string>("");

  // calls HTTP API of OpenLibrary to search books by the given query and offset
  async function searchBooks(q: string, offset: number) {
    console.log(q);
    if (q === "") {
      return [];
    }
    const api = "https://openlibrary.org/search.json";
    const result = await fetch(`${api}?q=${q}&fields=title,author_name,cover_i&limit=20&offset=${offset}`);
    const json = await result.json();
    return json.docs.map(cleanBookData);
  }

  // handle missing book cover and author
  function cleanBookData(doc: any){
    if (doc.cover_i == undefined) {
      doc.image = "assets/images/default_book_cover.jpg";
    } else {
      doc.image = `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`;
    }
    if (doc.author_name == undefined) {
      doc.author = "Unknown author";
    } else {
      doc.author = doc.author_name[0];
    }
    return doc;
  }

  // called when user scrolls all the way down
  async function scroll(event: any) {
    try {
      let books = await searchBooks(query, data.length);
      setData([...data, ...books]);
      // needed to make the infinite scroll work
      event.target.complete();
    } catch (error) {
      // catch errors for both fetch and result.json()
      console.log(error);
    }
  }

  // called when user types in the search bar
  async function search(event: any) {
    let newQuery = event.target.value;
    setQuery(newQuery);
    try {
      let books = await searchBooks(newQuery, 0);
      setData(books);
    } catch (error) {
      // catch errors for both fetch and result.json()
      console.log(error);
    }
  }

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
        <IonSearchbar placeholder="Find a book" onIonInput={search}></IonSearchbar>

        <IonList lines="none">
          {data.map((item, index) => {
            return (
              <IonItem key={index} onClick={() => setSelectedBookIndex(index)}>
                <BookCard
                  image={item.image}
                  title={item.title}
                  author={item.author}
                  selected={selectedBookIndex === index}
                />
              </IonItem>
            );
          })}
        </IonList>

        <IonInfiniteScroll onIonInfinite={scroll}>
          <IonInfiniteScrollContent loadingSpinner="bubbles"></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default CreateClubPage;
