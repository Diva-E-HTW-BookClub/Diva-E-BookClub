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
import { BookCard } from "../../components/BookCard";
import { createBookClubDocument } from "../../firebase/firebaseBookClub";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateClubPage: React.FC = () => {
  const history = useHistory();
  const [books, setBooks] = useState<any[]>([]);
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [clubName, setClubName] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<number>(0);
  const user = useSelector((state:any) => state.user.user)

  // calls HTTP API of OpenLibrary to search books by the given query and offset
  async function searchBooks(q: string, offset: number) {
    if (q === "") {
      return [];
    }
    const api = "https://openlibrary.org/search.json";
    const result = await fetch(`${api}?q=${q}&fields=title,author_name,cover_i&limit=20&offset=${offset}`);
    const json = await result.json();
    return json.docs.map(cleanBookData);
  }

  // handle missing book cover and author
  function cleanBookData(doc: any) {
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
      let newBooks = await searchBooks(query, books.length);
      setBooks([...books, ...newBooks]);
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
      setBooks(books);
    } catch (error) {
      // catch errors for both fetch and result.json()
      console.log(error);
    }
  }

  async function createClub() {
    let book = books[selectedBookIndex];
    // for now if user is not logged in use test-user as user id
    // later only logged in users should create book clubs
    let userId = user.uid;
    let bookClubId = await createBookClubDocument({
      id: "",
      name: clubName,
      moderator: [userId],
      participants: [userId],
      maxParticipantsNumber: maxParticipants,
      book: {
        title: book.title,
        authors: book.author_name,
        imageUrl: book.image
      },
      discussions: [],
      owner: userId,
    });
    history.push(`/clubs/${bookClubId}/view`);
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
            <IonButton color="primary" onClick={createClub}>
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
          <IonInput required placeholder="Enter book club name" onIonInput={(e: any) => setClubName(e.target.value)}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">
            <h1>Max number of participants</h1>
          </IonLabel>
          <IonInput required placeholder="Enter a number (max 50)" onIonInput={(e: any) => setMaxParticipants(e.target.value)}></IonInput>
        </IonItem>
        <IonSearchbar placeholder="Find a book" debounce={1000} onIonInput={search}></IonSearchbar>

        <IonList lines="none">
          {books.map((book, index) => {
            return (
              <IonItem key={index} onClick={() => setSelectedBookIndex(index)}>
                <BookCard
                  image={book.image}
                  title={book.title}
                  author={book.author}
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
