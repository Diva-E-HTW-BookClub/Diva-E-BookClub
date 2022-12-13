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
  IonSelect,
  IonSelectOption
} from "@ionic/react";
import { add } from "ionicons/icons";
import "./ClubsTab.css";
import { useEffect, useState } from "react";
import { ClubCard } from "../../components/ClubCard";
import { searchBookClubs, BookClub } from "../../firebase/firebaseBookClub";
import { getCurrentUserId } from "../../firebase/firebaseAuth";

const ClubsTab: React.FC = () => {
  const [bookClubs, setBookClubs] = useState<BookClub[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [selectedSegment, setSelectedSegment] = useState<string>("your");
  const [selectedFilter, setSelectedFilter] = useState<string>("name");

  // displays book clubs when the tab loads
  // using default values of selected input text, filter, and segment
  useEffect(() => {
    getBookClubs(inputText, selectedFilter, selectedSegment);
  }, []);

  // displays book clubs when user types in search bar
  // using entered text
  async function search(event: any) {
    let inputTextValue = event.target.value;
    setInputText(inputTextValue);
    getBookClubs(inputTextValue, selectedFilter, selectedSegment);
  }

  // displays book clubs when user selects the filter (name or book title)
  // using new filter value
  async function selectFilter(event: any) {
    let filterValue = event.detail.value;
    setSelectedFilter(filterValue);
    getBookClubs(inputText, filterValue, selectedSegment);
  }

  // displays book clubs when user selects the segment (your or new)
  // using new segment value
  async function selectSegment(event: any) {
    let segmentValue = event.detail.value;
    setSelectedSegment(segmentValue);
    getBookClubs(inputText, selectedFilter, segmentValue);
  }

  // called when user scrolls all the way down
  // displays next 10 clubs adding them to the book clubs list
  async function scroll(event: any) {
    let newBookClubs = await searchBookClubs(selectedFilter, inputText, getCurrentUserId(), selectedSegment === "your", 10, bookClubs[bookClubs.length - 1].id);
    // adds new values to the book clubs state
    setBookClubs([...bookClubs, ...newBookClubs]);
    // needed to make the infinite scroll work
    event.target.complete();
  }

  // finds first 10 book clubs in firestore based on input text, filter and segment parameters
  async function getBookClubs(text: string, filter: string, segment: string) {
    let bookClubs = await searchBookClubs(filter, text, getCurrentUserId(), segment === "your", 10);
    // rewrites book clubs state with new values
    setBookClubs(bookClubs);
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
        <IonSearchbar placeholder={`Enter club ${selectedFilter}`} debounce={1000} onIonInput={search}></IonSearchbar>
        <IonItem>
          <IonLabel>Search by</IonLabel>
          <IonSelect interface="popover" value={selectedFilter} onIonChange={selectFilter}>
            <IonSelectOption value="name">name</IonSelectOption>
            <IonSelectOption value="book">book</IonSelectOption>
          </IonSelect>
        </IonItem>
        <IonSegment value={selectedSegment} onIonChange={selectSegment}>
          <IonSegmentButton value="your">
            <IonLabel>Your</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="new">
            <IonLabel>New</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        <IonList lines="none">
          {bookClubs.map(bookClub => {
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

        <IonInfiniteScroll onIonInfinite={scroll}>
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
