import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { add } from "ionicons/icons";
import "./ClubsTab.css";
import { useEffect, useRef, useState } from "react";
import { ClubCard } from "../../components/ClubCard";
import { searchBookClubs, BookClub } from "../../firebase/firebaseBookClub";
import { useSelector } from "react-redux";
import { ModalHandle } from "../../components/resources/EditResourceModal";
import CreateClubModal from "../../components/createClub/CreateClubModal";

const ClubsTab: React.FC = () => {
  const [bookClubs, setBookClubs] = useState<BookClub[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const user = useSelector((state: any) => state.user.user);
  const createModal = useRef<ModalHandle>(null);

  function getCurrentUserId() {
    if (user) {
      return user.uid;
    }
    return null;
  }

  // displays book clubs when the tab loads
  // using default values of selected input text, filter, and segment
  useEffect(() => {
    getBookClubs(inputText);
  }, []);

  // displays book clubs when user types in search bar
  // using entered text
  async function search(event: any) {
    let inputTextValue = event.target.value;
    setInputText(inputTextValue);
    getBookClubs(inputTextValue);
  }

  // called when user scrolls all the way down
  // displays next 10 clubs adding them to the book clubs list
  async function scroll(event: any) {
    let newBookClubs = await searchBookClubs(
      inputText,
      getCurrentUserId(),
      10,
      bookClubs[bookClubs.length - 1].id
    );
    // adds new values to the book clubs state
    setBookClubs([...bookClubs, ...newBookClubs]);
    // needed to make the infinite scroll work
    event.target.complete();
  }

  // finds first 10 book clubs in firestore based on input text, filter and segment parameters
  async function getBookClubs(text: string) {
    let bookClubs = await searchBookClubs(
      text,
      getCurrentUserId(),
      10
    );
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
      <IonContent className="ion-no-padding">
        <IonHeader className="ion-padding-horizontal" collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Clubs</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar
          class="custom"
          placeholder={`Search`}
          debounce={1000}
          onIonInput={search}
        ></IonSearchbar>
        <IonList className="ion-no-padding">
          {bookClubs.map((bookClub) => {
            return (
              <ClubCard
                key={bookClub.id}
                id={bookClub.id}
                name={bookClub.name}
                maxMember={bookClub.maxMemberNumber}
                member={bookClub.members.length}
                image={bookClub.book.imageUrl}
                bookTitle={bookClub.book.title}
                authors={bookClub.book.authors}
              />
            );
          })}
        </IonList>

        <IonInfiniteScroll onIonInfinite={scroll}>
          <IonInfiniteScrollContent loadingSpinner="bubbles"></IonInfiniteScrollContent>
        </IonInfiniteScroll>

        <IonFab slot="fixed" vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => createModal.current?.open()}>
            <IonIcon icon={add}></IonIcon>
          </IonFabButton>
        </IonFab>
        <CreateClubModal ref={createModal} />
      </IonContent>
    </IonPage>
  );
};

export default ClubsTab;
