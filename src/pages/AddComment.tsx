import {
    IonBackButton, IonButton,
    IonButtons,
    IonContent,
    IonHeader, IonIcon, IonItem, IonLabel,
    IonPage, IonText, IonTextarea,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import React from "react";
import {camera, document} from "ionicons/icons";

const AddComment: React.FC = () => {
    return(
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/comments"/>
                    </IonButtons>
                    <IonTitle>Add Comment</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Add Comment</IonTitle>
                    </IonToolbar>
                </IonHeader>
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
                <IonItem lines="none">
                    <IonButton size="default" routerDirection="back" routerLink="/comments" fill="outline">Cancel</IonButton>
                    <IonButton size="default" routerLink="/comments">Save</IonButton>
                </IonItem>
            </IonContent>
        </IonPage>
    )
}

export default AddComment;