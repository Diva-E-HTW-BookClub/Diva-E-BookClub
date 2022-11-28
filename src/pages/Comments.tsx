import {
    IonBackButton, IonButton,
    IonButtons,
    IonContent, IonFab,
    IonFabButton,
    IonHeader, IonIcon, IonItem, IonLabel, IonModal,
    IonPage, IonText, IonTextarea,
    IonTitle,
    IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import './Comments.css';
import React, {useState} from "react";
import {CommentCard} from "../components/CommentCard";
import {add, camera, document} from "ionicons/icons";

const Comments: React.FC = () => {
    const [data, setData] = useState<string[]>([])
    const [isOpen, setIsOpen] = useState(false)

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
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/clubs"/>
                    </IonButtons>
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
                    <IonFabButton onClick={() => setIsOpen(true)}>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>
                <IonModal isOpen={isOpen}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Add Comment</IonTitle>
                            <IonButtons slot="start">
                                <IonButton onClick={() => setIsOpen(false)}>Cancel</IonButton>
                            </IonButtons>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setIsOpen(false)}>Post</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonItem lines="none">
                            <h1>Write a Comment</h1>
                        </IonItem>
                        <IonItem>
                            <IonLabel>
                                <h1>Effective Java</h1>
                                <h2>Joshua Bloch</h2>
                            </IonLabel>
                            <IonText>Chapter 2</IonText>
                        </IonItem>
                        <IonItem lines="none">
                            <div>
                                <IonButton size="default">
                                    <IonIcon slot="icon-only" icon={camera}></IonIcon>
                                </IonButton>
                                <IonLabel>Add Photo</IonLabel>
                            </div>
                            <div>
                                <IonButton size="default">
                                    <IonIcon slot="icon-only" icon={document}></IonIcon>
                                </IonButton>
                                <IonLabel>Add Document</IonLabel>
                            </div>
                        </IonItem>
                        <IonItem lines="none">
                            <IonLabel>Passage Quotation</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonTextarea cols={5}></IonTextarea>
                        </IonItem>
                        <IonItem lines="none">
                            <IonLabel>Notes</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonTextarea cols={5}></IonTextarea>
                        </IonItem>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    );
};

export default Comments;
