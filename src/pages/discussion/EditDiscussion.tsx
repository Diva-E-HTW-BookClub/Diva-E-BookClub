import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonGrid,
  IonCardTitle,
  IonCard,
  IonRow,
  IonCol,
  IonProgressBar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/react";
import React, { useRef, useEffect, useState } from "react";
import "./EditDiscussion.css";

const EditDiscussion: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => prevProgress + 0.01);
    }, 50);

    return () => clearInterval(interval);
  }, []);
  if (progress > 1) {
    setTimeout(() => {
      setProgress(0);
    }, 1000);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Discussion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <div className="divider"></div>
          <IonGrid>
            <div className="box">
              <IonCardTitle>Select a date</IonCardTitle>
              <IonDatetime
                presentation="date"
                min="2022-03-01"
                max="2023-05-31"
              >
                {" "}
              </IonDatetime>
              <div className="divider"></div>
              <IonRow>
                <IonCol size="5">
                  <IonCardTitle>Start</IonCardTitle>
                  <IonDatetime presentation="time"></IonDatetime>
                </IonCol>

                <IonCol size="5">
                  <IonCardTitle>End</IonCardTitle>
                  <IonDatetime presentation="time"></IonDatetime>
                </IonCol>
              </IonRow>
              <div className="divider"></div>
              <IonItem>
                <IonLabel position="stacked">
                  {" "}
                  <h1>Name of Chapter</h1>{" "}
                </IonLabel>
                <IonInput placeholder="Enter the name of the chapter"></IonInput>
              </IonItem>
              <div className="divider"></div>
              <IonItem>
                <IonLabel position="stacked">
                  <h1>Location</h1>
                </IonLabel>
                <IonInput placeholder="Enter the location"></IonInput>
              </IonItem>
              <div className="divider"></div>
              <IonRow>
                <IonCol size="5">
                  <IonButton routerLink="/clubs/clubId">Cancel</IonButton>
                </IonCol>
                <IonCol size="5">
                  <IonButton routerLink="/clubs/clubId">Done</IonButton>
                </IonCol>
              </IonRow>
              <div className="divider"></div>
            </div>
          </IonGrid>
        </IonCard>
        <IonProgressBar
          value={progress}
          type="indeterminate"
          color="warning"
        ></IonProgressBar>
      </IonContent>
    </IonPage>
  );
};

export default EditDiscussion;
