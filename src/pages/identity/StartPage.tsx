import React from "react";
import {
  IonContent,
  IonPage,
  IonButton, IonLabel, IonImg
} from "@ionic/react";
import "./StartPage.css";
import BlubbleLogo from "../../resources/blubble-logo.png"

const StartPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent color="favorite">
        <div className="startContent ion-padding">
        <IonLabel>
          <div className="welcome-title">WELCOME TO</div>
          <div className="blubble-title">BLUBBLE</div>
        </IonLabel>
        <IonImg className="logo" src={BlubbleLogo}/>
        <p className="font-center">Create an account</p>
        <IonButton expand="block" size="default" class="ion-margin-bottom buttonWidth" routerLink="/register">
          REGISTER
        </IonButton>
        <p className="font-center">Already have an account?</p>
        <IonButton expand="block" size="default" className="buttonWidth" routerLink="/login">
          LOG IN
        </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default StartPage;
