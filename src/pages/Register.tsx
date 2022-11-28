import React from "react";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonNavLink,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import SignIn from "./SignIn";

const Register: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/start" />
          </IonButtons>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>Welcome To</h1>
        <h1>Book Club App</h1>
        <IonItem>
          <IonLabel position="stacked">User Name*</IonLabel>
          <IonInput></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Email Address*</IonLabel>
          <IonInput></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password*</IonLabel>
          <IonInput type="password"></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Confirm Password*</IonLabel>
          <IonInput type="password"></IonInput>
        </IonItem>
        <IonItem lines="none">
          <IonCheckbox slot="start"></IonCheckbox>
          <IonLabel>
            I have taken note of the
            <br />
            data protection regulations
          </IonLabel>
        </IonItem>
        <p>* Mandatory fields</p>
        <IonButton routerLink="/home" expand="block">
          Register
        </IonButton>
        <IonItem lines="none">
          <p>
            Already have an Account?
            <IonNavLink routerDirection="forward" component={() => <SignIn />}>
              <a> Sign In</a>
            </IonNavLink>
          </p>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default Register;
