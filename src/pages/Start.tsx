import React from "react";
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton, IonNavLink,
} from "@ionic/react";
import "./Start.css";
import SignIn from "./SignIn";
import Register from "./Register";

const Start: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Start</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen class="ion-padding">
                <h1>WELCOME TO BOOK CLUB APP</h1>
                <p>create an account</p>
                <IonNavLink routerDirection="forward" component={() => <Register/>}>
                    <IonButton expand="block" size="default" class="ion-margin-bottom">
                        REGISTER
                    </IonButton>
                </IonNavLink>
                <p>already have an Account?</p>
                <IonNavLink routerDirection="forward" component={() => <SignIn/>}>
                    <IonButton expand="block" size="default">
                        LOG IN
                    </IonButton>
                </IonNavLink>
            </IonContent>
        </IonPage>
    );
};

export default Start;
