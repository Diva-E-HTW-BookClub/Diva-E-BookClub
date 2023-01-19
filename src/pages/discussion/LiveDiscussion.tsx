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
} from "firebase/firestore";
import { firebaseDB } from "../../firebase/firebaseConfig";
import io from "socket.io-client"
import "./LiveDiscussion.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { book, pause, play } from "ionicons/icons";
import { getDiscussionAgenda, getDiscussionTitle, updateDiscussionAgenda } from "../../firebase/firebaseDiscussions";
import {
  BookClub,
  getBookClubDocument,
} from "../../firebase/firebaseBookClub";
import { useParams } from "react-router";



interface AgendaPartProps {
  id: number,
  name: string
  elapsedTime: number,
  timeLimit: number
}

const socket = io("http://localhost:3001");
var emitTimes:number[] = []
var emitSum = 0;
var emitStates:boolean[] = []
var maxParticipants = 0;

const LiveDiscussion: React.FC = () => {

  // Information zu der Agenda
  const user = useSelector((state: any) => state.user.user);
  const [agendaParts, setAgendaParts] = useState<any[]>([]);
  const [agendaTitle, setAgendaTitle] = useState<any[]>([]);
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();
  const [isModerator, setIsModerator] = useState<boolean>(false);

  // Liva-Ansicht-Variablen
  const [playingState, setPlayingState] = useState<boolean[]>([false]);
  const [playingStateReceived, setPlayingStateReceived] = useState([false]);
  const [progressTimesReceived, setProgressTimesReceived] = useState<number[]>([0]);
  const [progressSumReceived, setProgressSumReceived] = useState(0);
  const [participantCount, setparticipantCount] = useState(0);

  const joinDiscussionRoom = () => {
    if (discussionId !== "") {
      socket.emit("join_discussion_room", discussionId)
    }
  }

  type FormValues = {
    agenda: {
      name: string;
      timeLimit: number;
      elapsedTime: number;
    }[];
  };

  const changedPlayingState = doc(firebaseDB, "testCollection", "8hh5w2KA9koJTbyMiDuk");

  

  async function saveLiveDiscussion(toBeArchived: boolean){
    var elapsedTimeArray = progressTimesReceived;
    let nameArray = agendaParts.map(e => e.name)
    var timeLimitArray = agendaParts.map(e => e.timeLimit)
    var elapsedTimeArrayInSeconds = elapsedTimeArray.map(function(x, index){
      return timeLimitArray[index] * x
    })
   
    if(agendaParts.length !=0 ){
    updateDiscussionAgenda(bookClubId, discussionId,agendaParts.length, elapsedTimeArrayInSeconds,nameArray,timeLimitArray, maxParticipants, toBeArchived)
    }
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
    //socket.emit("send_playButton", { emitStates, discussionId });
    //socket.emit("send_time", { emitTimes, discussionId });
    //socket.emit("send_sum_time", { emitSum, discussionId });

    // TEST
    socket.emit("send_all_Current_Data", {emitStates, emitTimes, emitSum, discussionId});
    }
    saveLiveDiscussion(false)
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
      }
      else{
        setProgressTimesReceived(data[0])
      }
    });

    socket.on("receive_sum_timeStart", (data) => {
      if(data[0] == -1 || typeof data[0] == 'undefined'){
        setProgressSumReceived(0)
      }
      else{
        setProgressSumReceived(data[0])
      }
    });
    

    // TEST
    socket.on("receive_all_Data", (data) => {
      if(typeof data.emitStates !== "undefined"){
        setPlayingStateReceived(data.emitStates)
      }
      else{
      setPlayingStateReceived(data)
      }
      if(typeof data.emitTimes !== "undefined"){
        setProgressTimesReceived(data.emitTimes)
      }
      else{
      setProgressTimesReceived(data)
      }
      if(typeof data.emitSum !== "undefined"){
        setProgressSumReceived(data.emitSum)
      }
      else{
        setProgressSumReceived(data)
      }
    });
    
    socket.on("changeParticipantCount", (data) => {
      setparticipantCount(data)  
      console.log("Aktueller Count: " + data)
      if(maxParticipants <= data){
        maxParticipants = data;
      }
      console.log("Testlänge: "+ agendaParts.length)
      saveLiveDiscussion(false);
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
    let bookClub = await getBookClubDocument(bookClubId);
    // check if the current user is moderator of the club
    setIsModerator(bookClub?.moderator.includes(user.uid));
    let agendaParts = await getDiscussionAgenda(bookClubId, discussionId);
    let agendaTitle = await getDiscussionTitle(bookClubId, discussionId);
    setAgendaParts(agendaParts)
    setAgendaTitle(agendaTitle)
    for(var i = 0; i < agendaParts.length; i++){
      progressTimesReceived[i] = 0;
      playingStateReceived[i] = false;
      emitTimes[i] = 0
    }
  }
  // convert agenda parts to elapsedTime and timeLimit and sum the values
  //let totalElapsedTime = agendaParts.map(e => e.elapsedTime).reduce((a, b) => a + b, 0);
  let totalTimeLimit = agendaParts.map(e => e.timeLimit).reduce((a, b) => a + b, 0);
  let maxTimes = agendaParts.map(e => e.timeLimit)

  function doubleDigits(number:number){
    var minutes = Math.floor(number/60);
    var seconds = Math.floor(number%60);
    var secondsString = (seconds < 10) ? '0' + seconds.toString() : seconds.toString()
    var finalOutput = minutes.toString() + "." + secondsString;
    return finalOutput
  }

  function addUp(numberArray:any,maxTimes:any){
    var resultSeconds = 0;
    var resultMinutes = 0;
    for(var i = 0; i < numberArray.length; i++){
      var seconds = Math.floor((numberArray[i] * maxTimes[i]));
      resultSeconds += seconds;
    }
    resultMinutes = Math.floor(resultSeconds/60)
    resultSeconds = resultSeconds%60
    
    var resultSecondsString = (resultSeconds < 10) ? '0' + resultSeconds.toString() : resultSeconds.toString()
    var finalOutput = resultMinutes.toString() + "." + resultSecondsString;
    return finalOutput;
  }

  function calculateSum(numberArray:any){
    var resultSeconds = 0;
    for(var i = 0; i < numberArray.length; i++){
      var seconds = Math.floor((numberArray[i] * maxTimes[i]));
      resultSeconds += seconds;
    }
    return resultSeconds
  }


  return (
    <IonPage>
           <div>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Live Ansicht: {agendaTitle}</IonTitle>
          <IonTitle>Aktuelle Teilnehmer: {participantCount}</IonTitle>
        </IonToolbar>
      </IonHeader>
    <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Total discussion time</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRow>
              <IonCol size="8">
                <IonProgressBar className={` ${isRed(progressSumReceived, totalTimeLimit) ? 'isRed' : isDarkOrange(progressSumReceived, totalTimeLimit) ?  'isDarkOrange' : isOrange(progressSumReceived, totalTimeLimit) ? 'isOrange' : 'blue'}`} value={progressSumReceived}></IonProgressBar>
                 </IonCol>
              <IonCol className="timeDisplay" size="4">
                {`${addUp(progressTimesReceived, maxTimes)} / ${doubleDigits(totalTimeLimit)}`}
              </IonCol>
            </IonRow>
          </IonCardContent>
        </IonCard>
        <IonList lines="none">
          {agendaParts.map((agendaPart, index) => {
            return (
              <IonItem className="iten-no-padding" key={index}>
                <IonCard className="cards">
                  <IonCardHeader>
                    {isModerator &&
                    <IonButton className="playButton" fill="solid" color={"favorite"} onClick={() => setButtons(index)}>
                    
                      {!playingStateReceived[index] &&
                        <IonIcon className="button-icon" icon={play}></IonIcon>
                      }
                      {playingStateReceived[index] &&
                        <IonIcon className="button-icon" icon={pause}></IonIcon>
                      }
                    </IonButton>
                    }
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
        <div className="live">
        <IonButton routerLink= {"/clubs/" + bookClubId+ "/view"} onClick={() => saveLiveDiscussion(true)}>
              End discussion 
        </IonButton>
        </div>
      </IonContent>
      </div>
    </IonPage>
  );
};

export default LiveDiscussion;
