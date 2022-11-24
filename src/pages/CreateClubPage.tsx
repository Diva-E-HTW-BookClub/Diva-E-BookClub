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
    useIonViewWillEnter
} from '@ionic/react';
import './CreateClubPage.css';
import { useState } from 'react';
import { BookCard } from "../components/BookCard";
import { incrementBookClubMemberCount } from '../firebase/firebaseBookClub';

const CreateClubPage: React.FC = () => {
    const [data, setData] = useState<string[]>([]);
    const [selectedBookIndex, setSelectedBookIndex] = useState<number>();

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

    async function test() {
        incrementBookClubMemberCount("HhIpIHAI7xUrRoU1EZUI", 5)
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>New Club</IonTitle>
                    <IonButtons slot="end">
                        <IonButton href="/clubs" color="primary" >Create</IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonButton onClick={test}>create test club</IonButton>
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
                                <BookCard image={"https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg"} title={"Clean code"} author={"Robert C. Martin"} selected={selectedBookIndex === index} />
                            </IonItem>
                        )
                    })}
                </IonList>

                <IonInfiniteScroll onIonInfinite={loadData}>
                    <IonInfiniteScrollContent loadingSpinner="bubbles">
                    </IonInfiniteScrollContent>
                </IonInfiniteScroll>

            </IonContent>
        </IonPage>
    );
};

export default CreateClubPage;
