import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton
} from "@ionic/react";
import "./StartPage.css";
import { useHistory } from "react-router";

const StartPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Start</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen class="ion-padding">
        <h1 className="welcome-title">WELCOME TO BOOK CLUB APP</h1>
        <p className="font-center">Create an account</p>
        <IonButton expand="block" size="default" class="ion-margin-bottom" routerLink="/register">
          REGISTER
        </IonButton>
        <p className="font-center">Already have an account?</p>
        <IonButton expand="block" size="default" routerLink="/login">
          LOG IN
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default StartPage;
