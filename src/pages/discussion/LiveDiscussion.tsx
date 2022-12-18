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
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonProgressBar
} from "@ionic/react";
import io from "socket.io-client"
import "./LiveDiscussion.css";
import React, { useRef, useEffect, useState } from "react";

const socket = io("http://localhost:3001");

const LiveDiscussion: React.FC = () => {
const [message, setMessage] = useState("");
const [messageReceived, setMessageReceived] = useState("");
const [isPlaying, setIsPlaying] = useState(false);
const [isPlayingReceived, setIsPlayingReceived] = useState(false);
const [isPlaying2, setIsPlaying2] = useState(false);
const [progress1, setProgress1] = useState(0);
const [progress2, setProgress2] = useState(0);
const [progress1Received, setProgress1Received] = useState(0);
const totalTime1 = 0.10;
const totalTime2 = 0.10;

const [playingState, setPlayingState] = useState([false, false]);
const [playingStateReceived, setPlayingStateReceived] = useState([false, false]);
const [progresses, setProgresses] = useState([0,0]);



  const onClickH1 = () =>{ 
  //setIsPlaying(!isPlaying)
  setPlayingState([!playingState[0],false]);
  //socket.emit("send_playButton", {isPlaying});
  socket.emit("send_playButton", {playingState}); 
  //socket.emit("send_time", {progress1});  
  }

  const onClickH2 = () =>{ 
    setIsPlaying(!isPlaying2)
    socket.emit("send_playButton", {isPlaying2}); 
    socket.emit("send_time", {progress2});  
    }

  useEffect(() => {
    const interval = setInterval(() => {
      if(isPlayingReceived){
      setProgress1((prevProgress) => prevProgress + 1/(totalTime1*100));
      console.log(progress1)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlayingReceived]);

  useEffect(() => {
    const interval2 = setInterval(() => {
      if(isPlaying2){
        setProgress2((prevProgress) => prevProgress + 1/(totalTime2*100));
        }
    }, 1000);

    return () => clearInterval(interval2);
  }, [isPlaying2]);

  if (progress1 == totalTime1) {
    setTimeout(() => {
      //setProgress(0);
    }, 1);
  }

  if (progress2 == totalTime2) {
    setTimeout(() => {
      //setProgress(0);
    }, 1);
  }


  useEffect(() => {
    socket.on("receive_playButton", (data) => {
      
      setPlayingStateReceived(data.playingState)
      
    });
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message)
    });
    
    socket.on("receive_time", (data) => {
      setProgress1Received(data.progress1)
      
    });
    /*
    socket.on("testEmit", (data) => {
      console.log("newUser!")
      
    });
    */
  }, [socket]);

const isOrange = (progress: number, totalTime: number) => {
    return +(progress*totalTime).toFixed(2) >= totalTime* 0.5
}

const isDarkOrange = (progress: number, totalTime: number) => {
  return +(progress1*totalTime1).toFixed(2) >= totalTime1 * 0.8
}

const isRed = (progress: number, totalTime: number) => {
  return +(progress1*totalTime1).toFixed(2) >= totalTime1 
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
          <IonGrid>
            
            <div className="box">
              
              <div className="divider"></div>
              <IonRow>
              <IonCol size="5">
              <IonTitle>Total speaking time:</IonTitle> 
              </IonCol>
              <IonCol size="5">
              <IonTitle>{((progress1 * totalTime1) + (progress2 * totalTime1)).toFixed(2) } / {(totalTime1 + totalTime2).toFixed(2)}</IonTitle>  
              </IonCol>
            </IonRow>
                <IonProgressBar className={` ${isRed(progress1, totalTime1) ? 'isRed' : isDarkOrange(progress1, totalTime1) ?  'isDarkOrange' : isOrange(progress1, totalTime1) ? 'isOrange' : 'blue'}`} value={progress1 + progress2}></IonProgressBar>
                <div className="divider"></div>
             
              
              <div className="divider"></div>
              <IonRow>
              <IonCol size="5">
              <IonTitle>speaking time1:</IonTitle> 
              </IonCol>
              <IonCol size="5">
              <IonTitle>{(progress1 * totalTime1).toFixed(2) } / {totalTime1 .toFixed(2)}</IonTitle> 
              </IonCol>
            </IonRow>
                <IonProgressBar className={` ${isRed(progress1, totalTime1) ? 'isRed' : isDarkOrange(progress1, totalTime1) ?  'isDarkOrange' : isOrange(progress1, totalTime1) ? 'isOrange' : 'blue'}`} value={progress1}></IonProgressBar>
                <div className="divider"></div>
                <IonButton fill="outline" onClick={onClickH1}>
                Play / Stop
              </IonButton>


              <div className="divider"></div>
              <IonRow>
              <IonCol size="5">
              <IonTitle>speaking time2:</IonTitle> 
              </IonCol>
              <IonCol size="5">
              <IonTitle>{(progress2 * totalTime1).toFixed(2) } / {totalTime2 .toFixed(2)}</IonTitle> 
              </IonCol>
            </IonRow>
              <div className="divider"></div>
              <IonProgressBar className={` ${isRed(progress2, totalTime2) ? 'isRed' : isDarkOrange(progress2, totalTime2) ?  'isDarkOrange' : isOrange(progress2, totalTime2) ? 'isOrange' : 'blue'}`} value={progress2}></IonProgressBar>
                <div className="divider"></div>
                <IonButton fill="outline" onClick={onClickH2}>
                Play / Stop
              </IonButton>
              <div className="divider"></div>
              <h1>Player 1 läuft?</h1>
    {String(playingStateReceived[0])}
              <div className="divider"></div>
              <IonRow>
                
                <IonCol size="10">
                  <IonButton>Done</IonButton>
                </IonCol>
              </IonRow>
              <div className="divider"></div>
            </div>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default LiveDiscussion;
