import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import { logoutUser } from "../firebaseFunctions";
import "./ProfileTab.css";

const ProfileTab: React.FC = () => {
  async function login() {
    const res = logoutUser();
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton routerLink="/login">Login</IonButton>
        <IonButton routerLink="/register" color="secondary">
          Register
        </IonButton>
        <IonButton onClick={login}>Logout</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
