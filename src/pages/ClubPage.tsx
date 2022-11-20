import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    IonImg,
    IonSegment,
    IonSegmentButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonList,
    IonItem,
    useIonViewWillEnter
} from '@ionic/react';
import './ClubPage.css';
import { calendar, documents } from 'ionicons/icons';
import { useState } from 'react';
import { DiscussionCard } from "../components/DiscussionCard";

const ClubPage: React.FC = () => {
    let clubName = "Diva-e's Reading Club";
    let bookTitle = "Clean Code";
    let bookAuthor = "Robert C. Martin";
    let bookCoverImg = "https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg";
    let bookCurrentChapter = "Chapter 1";
    let clubParticipants = "6";
    let clubParticipantsMax = "12";

    const [data, setData] = useState<string[]>([]);
    const [selectedSegment, setSelectedSegment] = useState<string>("calendar");

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
                    <IonTitle>{clubName}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">{clubName}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonCard>
                    <IonGrid>
                        <IonRow>
                            <IonCol size="4">
                                <IonImg alt={bookTitle} src={bookCoverImg} />
                            </IonCol>
                            <IonCol size="8">
                                <IonCardHeader>
                                    <IonCardTitle>{bookTitle}</IonCardTitle>
                                    <IonCardSubtitle>{bookAuthor}</IonCardSubtitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    <h3>{bookCurrentChapter}</h3>
                                    <h3>{clubParticipants}/{clubParticipantsMax}</h3>
                                </IonCardContent>
                            </IonCol>
                        </IonRow>
                        <IonButton>Edit</IonButton>
                    </IonGrid>

                </IonCard>

                <IonSegment value="calendar">
                    <IonSegmentButton value="calendar" onClick={() => setSelectedSegment("calendar")}>
                        <IonIcon icon={calendar}></IonIcon>
                    </IonSegmentButton>
                    <IonSegmentButton value="resources" onClick={() => setSelectedSegment("resources")}>
                        <IonIcon icon={documents}></IonIcon>
                    </IonSegmentButton>
                </IonSegment>

                <IonList lines="none">
                    {data.map((item, index) => {
                        return (
                            <IonItem key={index}>
                                { selectedSegment === "calendar"
                                    ? <DiscussionCard name={"Diva-E's BookClub"} member={3} date={"20.10.2022"} time={"13:00 - 14:00"} location={"Raum Gute Stube"} chapter={"Chapter 1"} />
                                    : <DiscussionCard name={"Diva-E's Resource"} member={3} date={"20.10.2022"} time={"13:00 - 14:00"} location={"Raum Gute Stube"} chapter={"Chapter 1"} />
                                }
                            </IonItem>
                        )
                    })}
                </IonList>


            </IonContent>
        </IonPage>
    );
};

export default ClubPage;
