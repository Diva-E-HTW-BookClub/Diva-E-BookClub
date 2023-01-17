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
          <>
            <ClubCard
              id="TESTID"
              name={"Diva-E's BookClub"}
              member={3}
              image={"https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg"}
              date={"20.10.2022"}
              time={"13:00 - 14:00"}
              location={"Raum Gute Stube"}
            />
            <ClubCard
              id="TESTID2"
              name={"Diva-E's BookClub"}
              member={3}
              image={"https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg"}
              date={"20.10.2022"}
              time={"13:00 - 14:00"}
              location={"Raum Gute Stube"}
            />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
