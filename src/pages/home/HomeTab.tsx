import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";
import React, { useState } from "react";
import { ClubCard } from "../../components/ClubCard";
import "./HomeTab.css";

const HomeTab: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState<boolean>(true);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem class="nextDiscussions">Your next Discussions</IonItem>
        {isNewUser && (
          <>
            <IonItem lines="none">
              <IonLabel>
                <div className="label"> 
                There are no upcoming discussions.
                <br />
                Join a Club or create your own!
                </div>
              </IonLabel>
            </IonItem>
         
            <IonItem lines="none">
            <div className="startButton"> 
            <IonButton  size="default" routerLink="/clubs">
                Start Now
              </IonButton>
              </div>
            </IonItem>
    
          </>
        )}
        {!isNewUser && (
          <></>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
