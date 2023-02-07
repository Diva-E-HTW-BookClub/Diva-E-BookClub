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
  IonProgressBar,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonCardContent,
  IonItem,
  IonIcon
} from "@ionic/react";
import {
  doc,
  setDoc,
} from "firebase/firestore";
import { firebaseDB } from "../../firebase/firebaseConfig";
import "./LiveDiscussion.css";
import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { pause, play } from "ionicons/icons";
import { getDiscussionAgenda,getDiscussionTitle, getDiscussionMaxParticipants,  } from "../../firebase/firebaseDiscussions";
import { useParams } from "react-router";
import { API_URL, SOCKET_IO_URL } from "../../constants";

interface AgendaPartProps {
  id: number,
  name: string
  elapsedTime: number,
  timeLimit: number
}
var isModerator = false;
var emitTimes:number[] = []
var emitSum = 0;
var emitStates:boolean[] = []

const LiveDiscussion: React.FC = () => {

  // Information zu der Agenda
  const user = useSelector((state: any) => state.user.user);
  const [agendaParts, setAgendaParts] = useState<any[]>([]);
  const [agendaTitle, setAgendaTitle] = useState<any[]>([]);
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();
  const [maxParticipants, setMaxParticipants] = useState<number>(0);


  // Liva-Ansicht-Variablen
  const [progressTimesReceived, setProgressTimesReceived] = useState<number[]>([]);
  const [participantCount, setparticipantCount] = useState(0);

  const changedPlayingState = doc(firebaseDB, "testCollection", "8hh5w2KA9koJTbyMiDuk");

  
  useEffect(() => {
    getAgendaParts()
    console.log("ID: " + discussionId)
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
    console.log(agendaTitle)
    setAgendaParts(agendaParts)
    setAgendaTitle(agendaTitle)
    setMaxParticipants(maxParticipants);
    console.log(maxParticipants)
    for(var i = 0; i < agendaParts.length; i++){
      progressTimesReceived[i] = 0;
      emitTimes[i] = 0
    }
  }
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Archivierte Ansicht: {agendaTitle}</IonTitle>
          
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <div className="divider-small"></div>
      <IonCard className="cards time-bar">
          <IonCardHeader>
            <IonCardTitle>Total discussion time</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRow>
              <IonCol size="8">
                <IonProgressBar className={` ${isRed(totalElapsedTime, totalTimeLimit) ? 'isRed' : isDarkOrange(totalElapsedTime, totalTimeLimit) ?  'isDarkOrange' : isOrange(totalElapsedTime, totalTimeLimit) ? 'isOrange' : 'blue'}`} value={totalElapsedTime/totalTimeLimit}></IonProgressBar>
              </IonCol>
              <IonCol className="timeDisplay" size="4">
                {`${doubleDigits(totalElapsedTime)} / ${doubleDigits(totalTimeLimit)} min`}
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
        <IonList lines="none">
          {agendaParts.map((agendaPart, index) => {
            return (
              <IonItem className="iten-no-padding" key={index}>
                <IonCard className="time-bar">
                  <IonCardHeader>
                    
                    <IonCardTitle className="playTitle">{agendaPart.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="8">
                        <IonProgressBar className={` ${isRed(agendaPart.elapsedTime, agendaPart.timeLimit) ? 'isRed' : isDarkOrange(agendaPart.elapsedTime, agendaPart.timeLimit) ?  'isDarkOrange' : isOrange(agendaPart.elapsedTime, agendaPart.timeLimit) ? 'isOrange' : 'blue'}`} value={agendaPart.elapsedTime/agendaPart.timeLimit}></IonProgressBar>
                        </IonCol>
                        <IonCol className="timeDisplay" size="4">
                          {`${doubleDigits(agendaPart.elapsedTime)} / ${doubleDigits(agendaPart.timeLimit)} min`}
                           </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonItem>
            );
          })}
        </IonList>
        <div className="h2">Maximale Teilnehmer: {maxParticipants}</div>
        <div className="divider-small"></div>

      </IonContent>
    </IonPage>
  );
};

export default LiveDiscussion;
