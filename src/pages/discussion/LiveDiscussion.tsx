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
  IonButton,
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
import io from "socket.io-client"
import "./LiveDiscussion.css";
import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { pause, play } from "ionicons/icons";
import { getDiscussionAgenda } from "../../firebase/firebaseDiscussions";
import { useParams } from "react-router";

interface AgendaPartProps {
  id: number,
  name: string
  elapsedTime: number,
  timeLimit: number
}

const socket = io("http://localhost:3001");
var isModerator = false;
var emitTimes:number[] = []
var emitSum = 0;
var emitStates:boolean[] = []

const LiveDiscussion: React.FC = () => {

  // Information zu der Agenda
  const user = useSelector((state: any) => state.user.user);
  const [agendaParts, setAgendaParts] = useState<any[]>([]);
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();

  // Liva-Ansicht-Variablen
  const [playingState, setPlayingState] = useState<boolean[]>([]);
  const [playingStateReceived, setPlayingStateReceived] = useState([false]);
  const [progressTimesReceived, setProgressTimesReceived] = useState<number[]>([]);
  const [progressSumReceived, setProgressSumReceived] = useState(0);

  // Discusscion Room
  // const [discussionRoom, setDiscussionRoom] = useState("")


  const joinDiscussionRoom = () => {
    if (discussionId !== "") {
      socket.emit("join_discussion_room", discussionId)
    }
  }


  const changedPlayingState = doc(firebaseDB, "testCollection", "8hh5w2KA9koJTbyMiDuk");

  const beModerator = () => {
    isModerator = true;
  }

  function createPlayingStatesForButton(length: number, index: number) {
    var timeTable = []
    for (var i = 0; i < length; i++) {
      timeTable[i] = false;
    }
    if (!playingState[index]) {
      timeTable[index] = true;
    }
    
    return timeTable;
  }

  const setButtons = (buttonNumber: number) => {
    if(isModerator){
    emitStates =  createPlayingStatesForButton(agendaParts.length, buttonNumber);
    emitTimes = progressTimesReceived;
    emitSum = progressSumReceived;
    
    setPlayingState(createPlayingStatesForButton(agendaParts.length,buttonNumber))

    // Send data to server
    socket.emit("send_playButton", { emitStates, discussionId });
    socket.emit("send_time", { emitTimes, discussionId });
    socket.emit("send_sum_time", { emitSum, discussionId });
    }
  }

  
  useEffect(() => {
    getAgendaParts()
    joinDiscussionRoom();
    socket.emit("request_data", { emitSum, discussionId});
    console.log("ID: " + discussionId)
  }, []);

  
  useEffect(() => {

    socket.on("receive_playButtonStart", (data) => {
     console.log(data)
    });

    socket.on("receive_timeStart", (data) => {
      if(data[0] == -1 || typeof data[0] == 'undefined'){
        var arrayForTimes= [0,0];
        for(var i = 0; i < agendaParts.length; i++){
        arrayForTimes[i] = 0;
        }
        getAgendaParts()
        console.log("Kreirtes Ding: " + arrayForTimes)
      }
      else{
        setProgressTimesReceived(data[0])
      }
      console.log("All times: " + progressTimesReceived)
    });

    socket.on("receive_sum_timeStart", (data) => {
      console.log("Darf nur ein Wert sein: " + data[0])
      if(data[0] == -1 || typeof data[0] == 'undefined'){
        setProgressSumReceived(0)
      }
      else{
        setProgressSumReceived(data[0])
      }
    });
    
    
    socket.on("receive_playButton", (data) => {
      if(typeof data.emitStates !== "undefined"){
        setPlayingStateReceived(data.emitStates)
      }
      else{
      setPlayingStateReceived(data)
      }
    });

    socket.on("receive_time", (data) => {
      if(typeof data.emitTimes !== "undefined"){
        setProgressTimesReceived(data.emitTimes)
      }
      else{
      setProgressTimesReceived(data)
      }
    });

    socket.on("receive_sum_time", (data) => {
      if(typeof data.emitSum !== "undefined"){
        setProgressSumReceived(data.emitSum)
      }
      else{
        setProgressSumReceived(data)
      }
    });    
  }, [socket]);

  
  useEffect(() => {
    const interval = setInterval(() => {
        setProgressTimesReceived((progressTimesReceived) =>{
          for(var i = 0; i < agendaParts.length; i++){
            if(playingStateReceived[i] == true){
            progressTimesReceived[i] = progressTimesReceived[i] + 1/(10*maxTimes[i])
            setProgressSumReceived((prevProgress) => prevProgress + 1/(10*totalTimeLimit)) 
            emitTimes[i] = emitTimes[i]+ 1/(10*maxTimes[i]); 
            emitSum = emitSum + 1/(10*totalTimeLimit)
            }
          }
          return progressTimesReceived} )
    }, 100);

    return () => clearInterval(interval);
  }, [playingStateReceived]);

useEffect(() => {
  const interval = setInterval(() => {
    for(var i = 0; i < agendaParts.length; i++){
      if(playingStateReceived[i] == true){
        if(isModerator ){
          socket.emit("send_all_Data", {emitStates, emitTimes, emitSum, discussionId})
        }
      }
    }
},1000);

return () => clearInterval(interval);
},[playingStateReceived]);


  // Colors for Progress
   const isOrange = (progress: number, totalTime: number) => {
     return +(progress * totalTime).toFixed(2) >= totalTime * 0.5
   }

   const isDarkOrange = (progress: number, totalTime: number) => {
     return +(progress * totalTime).toFixed(2) >= totalTime * 0.79
   }

   const isRed = (progress: number, totalTime: number) => {
     return +(progress * totalTime).toFixed(2) >= totalTime
   }




  async function getAgendaParts() {
    let agendaParts = await getDiscussionAgenda(bookClubId, discussionId);
    setAgendaParts(agendaParts)
    for(var i = 0; i < agendaParts.length; i++){
      progressTimesReceived[i] = 0;
      playingStateReceived[i] = false;
      emitTimes[i] = 0
    }
  }
  // convert agenda parts to elapsedTime and timeLimit and sum the values
  // let totalElapsedTime = agendaParts.map(e => e.elapsedTime).reduce((a, b) => a + b, 0);
  let totalTimeLimit = agendaParts.map(e => e.timeLimit).reduce((a, b) => a + b, 0);
  let maxTimes = agendaParts.map(e => e.timeLimit)

  function doubleDigits(number:number){
    var minutes = Math.floor(number/60);
    var seconds = Math.floor(number%60);
    var secondsString = (seconds < 10) ? '0' + seconds.toString() : seconds.toString()
    var finalOutput = minutes.toString() + "." + secondsString;
    return finalOutput
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Live Ansicht</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
          <IonCardTitle> {`${isModerator}`}</IonCardTitle>
            <IonCardTitle>Total discussion time</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRow>
              <IonCol size="8">
                <IonProgressBar className={` ${isRed(progressSumReceived, totalTimeLimit) ? 'isRed' : isDarkOrange(progressSumReceived, totalTimeLimit) ?  'isDarkOrange' : isOrange(progressSumReceived, totalTimeLimit) ? 'isOrange' : 'blue'}`} value={progressSumReceived}></IonProgressBar>
              </IonCol>
              <IonCol className="timeDisplay" size="4">
                {`${doubleDigits(progressSumReceived * totalTimeLimit)} / ${doubleDigits(totalTimeLimit)}`}
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
        <IonList lines="none">
          {agendaParts.map((agendaPart, index) => {
            return (
              <IonItem className="iten-no-padding" key={index}>
                <IonCard>
                  <IonCardHeader>
                    <IonButton className="playButton" fill="outline" onClick={() => setButtons(index)}>
                      {!playingStateReceived[index] &&
                        <IonIcon className="button-icon" icon={play}></IonIcon>
                      }
                      {playingStateReceived[index] &&
                        <IonIcon className="button-icon" icon={pause}></IonIcon>
                      }
                    </IonButton>
                    <IonCardTitle className="playTitle">{agendaPart.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="8">
                        <IonProgressBar className={` ${isRed(progressTimesReceived[index], agendaPart.timeLimit) ? 'isRed' : isDarkOrange(progressTimesReceived[index], agendaPart.timeLimit) ?  'isDarkOrange' : isOrange(progressTimesReceived[index], agendaPart.timeLimit) ? 'isOrange' : 'blue'}`} value={progressTimesReceived[index]}></IonProgressBar>
                        </IonCol>
                        <IonCol className="timeDisplay" size="4">
                          {`${doubleDigits(progressTimesReceived[index] * agendaPart.timeLimit)} / ${doubleDigits(agendaPart.timeLimit)}`}
                           </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonItem>
            );
          })}
        </IonList>
        <IonButton fill="outline" onClick={() => beModerator()}>
              Moderator
              </IonButton>
        
      </IonContent>
    </IonPage>
  );
};

export default LiveDiscussion;
