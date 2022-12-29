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
// import io from "socket.io-client"
import "./LiveDiscussion.css";
import React, { useRef, useEffect, useState } from "react";
import { pause, play } from "ionicons/icons";
import { getDiscussionAgenda } from "../../firebase/firebaseDiscussions";
import { useParams } from "react-router";

interface AgendaPartProps {
  id: number,
  name: string
  elapsedTime: number,
  timeLimit: number
}

// const socket = io("http://localhost:3001");
var progressTimesForServer = [0, 0];
var progressSumForServer = 0;
var isModerator = false;


const LiveDiscussion: React.FC = () => {
  const totalTime1 = 1.00;
  const totalTime2 = 1.00;

  const [agendaParts, setAgendaParts] = useState<any[]>([]);
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();

  const [playingState, setPlayingState] = useState([false, false]);
  const [playingStateReceived, setPlayingStateReceived] = useState([false, false]);
  const [progressTimes, setProgressTimes] = useState([0, 0]);
  const [progressTimesReceived, setProgressTimesReceived] = useState([0, 0]);
  const [progressSumReceived, setProgressSumReceived] = useState(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  var progressSum = 0;

  const changedPlayingState = doc(firebaseDB, "testCollection", "8hh5w2KA9koJTbyMiDuk");

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


  const beModerator = () => {
    isModerator = true;
  }

  const onClickH = (buttonNumber: number) => {
    if (isModerator) {
      createPlayingStatesForButton(2, buttonNumber);
      for (var i = 0; i < agendaParts.length; i++) {
        playingState[i] = createPlayingStatesForButton(agendaParts.length, buttonNumber)[i]
      }

      for (var i = 0; i < agendaParts.length; i++) {
        progressTimes[i] = progressTimesReceived[i]
        console.log("is Received komisch? " + progressSumReceived);
        progressSum = progressSumReceived;
      }

      progressSum = progressSumReceived
      //console.log("volle Summe: " + progressSum)

      // socket.emit("send_playButton", { playingState });
      // socket.emit("send_time", { progressTimes });
      // socket.emit("send_sum_time", { progressSum });
      //console.log(progressTimes)
      //console.log(playingState)
      //console.log(progressSum)
      //setDoc(changedPlayingState, {playingState: playingState, progressTimes: progressTimes, progressSum: progressSum});
    }
  }

  // useEffect(() => {
  //   socket.on("receive_playButton", (data) => {
  //     setPlayingStateReceived(data.playingState)
  //   });

  //   socket.on("receive_time", (data) => {
  //     setProgressTimesReceived(data.progressTimes)
  //   });
  //   socket.on("receive_sum_time", (data) => {
  //     console.log("ist das hier weird? " + data.progressSum);
  //     setProgressSumReceived(data.progressSum)
  //   });

  //   socket.on("progressEmit", (data) => {
  //     if (data != 0) {
  //       console.log("Bars:" + data)
  //       setProgressTimesReceived(data);
  //     }
  //     else {
  //       setProgressTimesReceived([0, 0]);
  //     }
  //   });

  //   socket.on("sumEmit", (data) => {
  //     if (typeof (data) != 'undefined') {
  //       console.log("Sum:" + data.progressSum)
  //       setProgressSumReceived(data.progressSum)
  //     }
  //     else {
  //       setProgressSumReceived(0)
  //     }
  //   });

  //   socket.on("statesEmit", (data) => {
  //     if (data != 0) {
  //       console.log("States:" + data)
  //       setPlayingStateReceived(data)
  //     }
  //     else {
  //       setPlayingStateReceived([false, false])
  //     }
  //   });
  // }, [socket]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (playingStateReceived[0]) {
  //       setProgressTimesReceived(([prevProgress0, prevProgress1]) => [prevProgress0 + 1 / (totalTime1 * 1000), prevProgress1]);
  //       setProgressSumReceived((prevProgress) => prevProgress + 1 / (totalTime1 * 1000 * chapters))
  //       if (isModerator) {
  //         progressTimesForServer[0] = progressTimesForServer[0] + 1 / (totalTime1 * 1000)
  //         progressSumForServer = progressSumForServer + 1 / (totalTime1 * 1000 * chapters)
  //         socket.emit("send_all_Data", { playingState, progressTimesForServer, progressSumForServer });
  //       }
  //     }

  //   }, 100);

  //   return () => clearInterval(interval);
  // }, [playingStateReceived[0]]);

  // useEffect(() => {
  //   const interval2 = setInterval(() => {
  //     if (playingStateReceived[1]) {
  //       setProgressTimesReceived(([prevProgress0, prevProgress1]) => [prevProgress0, prevProgress1 + 1 / (totalTime2 * 1000)]);
  //       setProgressSumReceived((prevProgress) => prevProgress + 1 / (totalTime2 * 1000 * chapters))
  //       if (isModerator) {
  //         progressTimesForServer[1] = progressTimesForServer[1] + 1 / (totalTime2 * 1000)
  //         progressSumForServer = progressSumForServer + 1 / (totalTime2 * 1000 * chapters)
  //         socket.emit("send_all_Data", { playingState, progressTimesForServer, progressSumForServer });
  //       }
  //     }
  //   }, 100);

  //   return () => clearInterval(interval2);
  // }, [playingStateReceived[1]]);


  // const isOrange = (progress: number, totalTime: number) => {
  //   return +(progress * totalTime).toFixed(2) >= totalTime * 0.5
  // }

  // const isDarkOrange = (progress: number, totalTime: number) => {
  //   return +(progress * totalTime).toFixed(2) >= totalTime * 0.79
  // }

  // const isRed = (progress: number, totalTime: number) => {
  //   return +(progress * totalTime).toFixed(2) >= totalTime
  // }
  useEffect(() => {
    getAgendaParts()
  }, []);

  async function getAgendaParts() {
    let agendaParts = await getDiscussionAgenda(bookClubId, discussionId);
    setAgendaParts(agendaParts)
    console.log(getDiscussionAgenda(bookClubId, discussionId))
    console.log(agendaParts.length)
  }
  // convert agenda parts to elapsedTime and timeLimit and sum the values
  let totalElapsedTime = agendaParts.map(e => e.elapsedTime).reduce((a, b) => a + b, 0);
  let totalTimeLimit = agendaParts.map(e => e.timeLimit).reduce((a, b) => a + b, 0);

  function formatTime(seconds: number) {
    return new Date(seconds * 1000).toISOString().substring(14, 19)
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
            <IonCardTitle>Total discussion time</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRow>
              <IonCol size="8">
                <IonProgressBar value={totalElapsedTime / totalTimeLimit}></IonProgressBar>
              </IonCol>
              <IonCol size="4">
                {`${formatTime(totalElapsedTime)}/${formatTime(totalTimeLimit)}`}
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
                    <IonButton fill="outline" onClick={() => setIsStarted(!isStarted)}>
                      {!isStarted &&
                        <IonIcon className="button-icon" icon={play}></IonIcon>
                      }
                      {isStarted &&
                        <IonIcon className="button-icon" icon={pause}></IonIcon>
                      }
                    </IonButton>
                    {/* <IonButton fill="outline" onClick={() => onClickH(0)}></IonButton> */}
                    <IonCardTitle>{agendaPart.name}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="8">
                          <IonProgressBar value={agendaPart.elapsedTime / agendaPart.timeLimit}></IonProgressBar>
                        </IonCol>
                        <IonCol size="4">
                          {`${formatTime(agendaPart.elapsedTime)}/${formatTime(agendaPart.timeLimit)}`}
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonItem>
            );
          })}
        </IonList>

        {/* <IonCard>
          <IonGrid>
            
            <div className="box">
              
              <div className="divider"></div>
              <IonRow>
              <IonCol size="5">
              <IonTitle>Total speaking time:</IonTitle> 
              </IonCol>
              <IonCol size="5">
              <IonTitle>{((progressTimesReceived[0] * totalTime1) + (progressTimesReceived[1] * totalTime1)).toFixed(2) } / {(totalTime1 + totalTime2).toFixed(2)}</IonTitle> 
              <IonTitle>{progressSumReceived}</IonTitle> 
              </IonCol>
            </IonRow>
                <IonProgressBar className={` ${isRed(progressSumReceived, totalTime1) ? 'isRed' : isDarkOrange(progressSumReceived, totalTime1) ?  'isDarkOrange' : isOrange(progressSumReceived, totalTime1) ? 'isOrange' : 'blue'}`} value={progressSumReceived}></IonProgressBar>
                <div className="divider"></div>
             
              
              <div className="divider"></div>
              <IonRow>
              <IonCol size="5">
              <IonTitle>speaking time1:</IonTitle> 
              </IonCol>
              <IonCol size="5">
              <IonTitle>{(progressTimesReceived[0] * totalTime1).toFixed(2)} / {totalTime1 .toFixed(2)}</IonTitle> 
              </IonCol>
            </IonRow>
                <IonProgressBar className={` ${isRed(progressTimesReceived[0], totalTime1) ? 'isRed' : isDarkOrange(progressTimesReceived[0], totalTime1) ?  'isDarkOrange' : isOrange(progressTimesReceived[0], totalTime1) ? 'isOrange' : 'blue'}`} value={progressTimesReceived[0]}></IonProgressBar>
                <div className="divider"></div>
                <IonButton fill="outline" onClick={() => onClickH(0)}>
                Play / Stop
              </IonButton>


              <div className="divider"></div>
              <IonRow>
              <IonCol size="5">
              <IonTitle>speaking time2:</IonTitle> 
              </IonCol>
              <IonCol size="5">
              <IonTitle>{(progressTimesReceived[1] * totalTime1).toFixed(2) } / {totalTime2 .toFixed(2)}</IonTitle> 
              </IonCol>
            </IonRow>
              <div className="divider"></div>
              <IonProgressBar className={` ${isRed(progressTimesReceived[1], totalTime2) ? 'isRed' : isDarkOrange(progressTimesReceived[1], totalTime2) ?  'isDarkOrange' : isOrange(progressTimesReceived[1], totalTime2) ? 'isOrange' : 'blue'}`} value={progressTimesReceived[1]}></IonProgressBar>
                <div className="divider"></div>
                <IonButton fill="outline" onClick={() => onClickH(1)}>
                Play / Stop
              </IonButton>
              <div className="divider"></div>

              <IonButton fill="outline" onClick={() => beModerator()}>
              Moderator
              </IonButton>
              <IonRow>
                
                <IonCol size="10">
                  <IonButton>Done</IonButton>
                </IonCol>
              </IonRow>
              <div className="divider"></div>
            </div>
          </IonGrid>
        </IonCard> */}
      </IonContent>
    </IonPage>
  );
};

export default LiveDiscussion;
