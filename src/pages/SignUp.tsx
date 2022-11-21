import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import "./SignUp.css";

const SignUp: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sign up </IonTitle>
        </IonToolbar>

        <IonHeader collapse="condense">
          <IonToolbar>
            <h2>WELCOME TO BOOK CLUP APP</h2>
          </IonToolbar>
        </IonHeader>
      </IonHeader>
      <IonContent fullscreen class="ion-padding">
        <IonToolbar class="ion-align-self-center">
          <IonTitle size="small">create an account</IonTitle>
        </IonToolbar>
        <IonButton expand="block" size="default" class="ion-margin-bottom">
          REGISTER
        </IonButton>

        <IonToolbar class="ion-align-self-center">
          <IonTitle size="small" class="ion-margin-top">
            already have an Account?
          </IonTitle>
        </IonToolbar>
        <IonButton expand="block" size="default">
          LOG IN
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default SignUp;
