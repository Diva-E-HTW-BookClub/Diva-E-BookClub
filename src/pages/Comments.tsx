import {
    IonBackButton,
    IonButtons,
    IonContent, IonFab,
    IonFabButton,
    IonHeader, IonIcon,
    IonPage,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import './Comments.css';
import React, {useState} from "react";
import {CommentCard} from "../components/CommentCard";
import {add} from "ionicons/icons";

const Comments: React.FC = () => {
    const [data, setData] = useState<string[]>([])

    const pushData = () => {
        const max = data.length + 5;
        const min = max - 5;
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
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/clubs"/>
                </IonButtons>
                <IonToolbar>
                    <IonTitle>Comments</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Comments</IonTitle>
                    </IonToolbar>
                </IonHeader>
                {data.map((item, index) => {
                    return <CommentCard key={index} userName={"Sönke"} pageLine={"P.20-21 L.18-20"} quote={"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."} note={"WTF is this?"}/>
                })}
                <IonFab slot="fixed" vertical="bottom" horizontal="end">
                    <IonFabButton routerLink="/comments/addComment">
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Comments;
