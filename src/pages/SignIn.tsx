import React from "react";
import {
    IonButton, IonButtons, IonBackButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar, IonNavLink
} from "@ionic/react";
import Register from "./Register";

const SignIn: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/start"/>
                    </IonButtons>
                    <IonTitle>Sign In</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <h1>Welcome Back</h1>
                <IonItem>
                    <IonLabel position="stacked">User Name or Email Address</IonLabel>
                    <IonInput></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Password</IonLabel>
                    <IonInput type="password"></IonInput>
                </IonItem>
                <IonButton routerLink="/home" expand="block">
                    Sign In
                </IonButton>
                <IonItem lines="none">
                    <p>Don't have an Account?
                        <IonNavLink routerDirection="forward" component={() => <Register/>}>
                            <a> Register</a>
                        </IonNavLink>
                    </p>
                </IonItem>
            </IonContent>
        </IonPage>
    )
}

export default SignIn;