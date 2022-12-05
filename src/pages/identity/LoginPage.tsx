import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonInput,
  IonButton,
  useIonToast,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonItem,
  IonRouterLink
} from "@ionic/react";
import "./LoginPage.css";
import { useState } from "react";
import { loginUser } from "../../firebase/firebaseAuth";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    const res = await loginUser(email, password);
    presentToast("test");
  }
  const [present] = useIonToast();

  const presentToast = (message: string) => {
    present({
      message: message,
      duration: 1500,
      position: "bottom",
    });
  };

  return (

    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/start" />
          </IonButtons>
          <IonTitle>Log in</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>Welcome Back</h1>
        <IonItem>
          <IonLabel position="stacked">Email Address</IonLabel>
          <IonInput onIonChange={(e: any) => setEmail(e.target.value)}></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput type="password" onIonChange={(e: any) => setPassword(e.target.value)}></IonInput>
        </IonItem>
        <IonButton onClick={login}>Log in</IonButton>
        <IonItem lines="none">
          <p>
            Don't have an Account?
            <IonRouterLink routerDirection="forward" routerLink="/register"> Register</IonRouterLink>
          </p>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
