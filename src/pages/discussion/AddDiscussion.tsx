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
import { createDiscussionDocument } from "../../firebase/firebaseDiscussions";
import { useParams } from "react-router";
import "./AddDiscussion.css";

const AddDiscussion: React.FC = () => {
  let {bookClubId}: {bookClubId: string} = useParams();

  const [progress, setProgress] = useState(0);
  const [discussionTitle, setDiscussionTitle] = useState<string>("")
  const [discussionStartTime, setDiscussionStartTime] = useState<string>("")
  const [discussionDuration, setDiscussionDuration] = useState<string>("")
  const [discussionLocation, setDiscussionLocation] = useState<string>("")
  

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

  async function addDiscussion() {
    createDiscussionDocument(bookClubId, {
      title: discussionTitle,
      participants: [],
      starTime: discussionStartTime,
      duration: discussionDuration,
      location: discussionLocation,
      agenda: "",
    })
    
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Discussion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <div className="divider"></div>
          <IonGrid>
            <div className="box">
              <IonCardTitle>Select a date</IonCardTitle>
              <IonDatetime presentation="date" onIonChange={(e: any) => setDiscussionStartTime(e.target.value)}>
              </IonDatetime>
              <div className="divider"></div>
              <IonRow>
                <IonCol size="5">
                  <IonCardTitle>Duration</IonCardTitle>
                  <IonDatetime presentation="time" onIonChange={(e: any) => setDiscussionDuration(e.target.value)}></IonDatetime>
                </IonCol>
              </IonRow>I

              <div className="divider"></div>
              <IonItem>
                <IonLabel position="stacked">
                  <h1>Title</h1>
                </IonLabel>
                <IonInput required placeholder="Enter a title for your discussion!" onIonInput={(e: any) => setDiscussionTitle(e.target.value)}></IonInput>
              </IonItem>
              <div className="divider"></div>
              <IonItem>
                <IonLabel position="stacked">
                  <h1>Location</h1>
                </IonLabel>
                <IonInput required placeholder="Enter the location for your discussion!" onIonInput={(e: any) => setDiscussionLocation(e.target.value)}></IonInput>
              </IonItem>
              <div className="divider"></div>
              <IonRow>
                <IonCol size="5">
                  <IonButton routerLink={"/clubs/" + bookClubId}>Cancel</IonButton>
                </IonCol>
                <IonCol size="5">
                <IonButton routerLink={"/clubs/" + bookClubId} color="primary" onClick={addDiscussion}>Create</IonButton>
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

export default AddDiscussion;
