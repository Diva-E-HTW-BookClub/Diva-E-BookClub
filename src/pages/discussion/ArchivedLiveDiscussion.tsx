import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCard,
  IonRow,
  IonCol,
  IonButtons,
  IonBackButton,
  IonButton,
  IonProgressBar,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonCardContent,
  IonItem,
} from "@ionic/react";
import {
  doc,
} from "firebase/firestore";
import { firebaseDB } from "../../firebase/firebaseConfig";
import "./LiveDiscussion.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDiscussionAgenda,getDiscussionTitle, getDiscussionMaxParticipants,  } from "../../firebase/firebaseDiscussions";
import { useParams } from "react-router";
import { useLocation } from "react-router-dom";

interface AgendaPartProps {
  id: number,
  name: string
  elapsedTime: number,
  timeLimit: number
}
var emitTimes:number[] = []

const LiveDiscussion: React.FC = () => {

  // Information zu der Agenda
  const user = useSelector((state: any) => state.user.user);
  const [agendaParts, setAgendaParts] = useState<any[]>([]);
  const [agendaTitle, setAgendaTitle] = useState<any[]>([]);
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();
  const [maxParticipants, setMaxParticipants] = useState<number>(0);
  const location = useLocation();


  // Liva-Ansicht-Variablen
  const [progressTimesReceived, setProgressTimesReceived] = useState<number[]>([]);

  const changedPlayingState = doc(firebaseDB, "testCollection", "8hh5w2KA9koJTbyMiDuk");

  
  useEffect(() => {
    getAgendaParts()
  }, []);

  // Colors for Progress
   const isOrange = (progress: number, totalTime: number) => {
     return +(progress).toFixed(2) >= totalTime * 0.5
   }

   const isDarkOrange = (progress: number, totalTime: number) => {
     return +(progress).toFixed(2) >= totalTime * 0.79
   }

   const isRed = (progress: number, totalTime: number) => {
     return +(progress).toFixed(2) >= totalTime
   }

  async function getAgendaParts() {   
    
    let agendaParts = await getDiscussionAgenda(bookClubId, discussionId);
    let agendaTitle = await getDiscussionTitle(bookClubId, discussionId);
    let maxParticipants = await getDiscussionMaxParticipants(bookClubId, discussionId);
    setAgendaParts(agendaParts)
    setAgendaTitle(agendaTitle)
    setMaxParticipants(maxParticipants);
    for(var i = 0; i < agendaParts.length; i++){
      progressTimesReceived[i] = 0;
      emitTimes[i] = 0
    }
  }

  const getCurrentTab = () => {
    if (location.pathname.includes("/tabs/home")) {
      return "home";
    }
    if (location.pathname.includes("/tabs/clubs")) {
      return "clubs";
    }
  };

  // convert agenda parts to elapsedTime and timeLimit and sum the values
  let totalElapsedTime = agendaParts.map(e => e.elapsedTime).reduce((a, b) => a + b, 0);
  let totalTimeLimit = agendaParts.map(e => e.timeLimit).reduce((a, b) => a + b, 0);

 
  function doubleDigits(number:number){
    var minutes = Math.floor(number/60);
    var seconds = Math.floor(number%60);
    var secondsString = (seconds < 10) ? '0' + seconds.toString() : seconds.toString()
    var finalOutput = minutes.toString() + ":" + secondsString;
    return finalOutput
  }

  return (
    <IonPage>
      <IonHeader translucent>
        <IonToolbar>
        <IonButtons slot="start">
        <IonBackButton defaultHref={"/tabs/" + getCurrentTab() + "/" + bookClubId + "/view"}></IonBackButton>
        </IonButtons>
        <IonTitle>Archived Discussion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <div className="divider-small"></div>
      <div className="h2">{agendaTitle}</div>
      <IonCard className="cards time-bar">
          <IonCardHeader className="titleHeader">
          <IonCardTitle className="playTitle">Total discussion time</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol className="timeDisplay" size="12">
                  <div className="timeDisplayContainer">
                    {`${doubleDigits(totalElapsedTime)} / ${doubleDigits(totalTimeLimit)} min`}
                  </div>
                </IonCol>
              </IonRow>   
            <IonRow>
              <IonCol size="12" className="progressbarContainer">
                <IonProgressBar className={` ${isRed(totalElapsedTime, totalTimeLimit) ? 'isRed' : isDarkOrange(totalElapsedTime, totalTimeLimit) ?  'isDarkOrange' : isOrange(totalElapsedTime, totalTimeLimit) ? 'isOrange' : 'blue'}`} value={totalElapsedTime/totalTimeLimit}></IonProgressBar>
              </IonCol>
      
            </IonRow>
            </IonGrid>
            </IonCardContent>
            </IonCard>
        <IonList lines="none">
          {agendaParts.map((agendaPart, index) => {
            return (
              <IonItem className="iten-no-padding" key={index}>
                <IonCard className="time-bar">
                  <IonCardHeader className="titleHeader">
                    
                    <IonCardTitle className="playTitle">{agendaPart.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                      <IonCol className="timeDisplay" size="12">
                        <div className="timeDisplayContainer">
                          {`${doubleDigits(agendaPart.elapsedTime)} / ${doubleDigits(agendaPart.timeLimit)} min`}
                          </div>
                           </IonCol>
                      </IonRow>
                      <IonRow>
                        <IonCol size="12" className="progressbarContainer">
                        <IonProgressBar className={` ${isRed(agendaPart.elapsedTime, agendaPart.timeLimit) ? 'isRed' : isDarkOrange(agendaPart.elapsedTime, agendaPart.timeLimit) ?  'isDarkOrange' : isOrange(agendaPart.elapsedTime, agendaPart.timeLimit) ? 'isOrange' : 'blue'}`} value={agendaPart.elapsedTime/agendaPart.timeLimit}></IonProgressBar>
                        </IonCol>
                        
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                  </IonCard>
              </IonItem>
            );
          })}
        </IonList>
        <div className="h2">Max participants: {maxParticipants}</div>
        <div className="divider-small"></div>
        <IonButton className="live" routerDirection="back" routerLink={"/tabs/home"} >
              Leave discussion
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default LiveDiscussion;
