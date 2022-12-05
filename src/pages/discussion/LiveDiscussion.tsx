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
import "./LiveDiscussion.css";
import React, { useRef, useEffect, useState } from "react";

const LiveDiscussion: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalTime = 0.10;



  const onClickH = () =>{ 
  setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if(isPlaying){
      setProgress((prevProgress) => prevProgress + 1/(totalTime*100));
      console.log(progress)
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (progress == totalTime) {
    setTimeout(() => {
      //setProgress(0);
    }, 1);
  }


const isOrange = () => {
    return +(progress*totalTime).toFixed(2) >= totalTime* 0.5
}

const isDarkOrange = () => {
  return +(progress*totalTime).toFixed(2) >= totalTime * 0.8
}

const isRed = () => {
  return +(progress*totalTime).toFixed(2) >= totalTime 
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
              <IonTitle>{(progress * totalTime).toFixed(2) } / {totalTime.toFixed(2)}</IonTitle> 
              </IonCol>
            </IonRow>
                <IonProgressBar className={` ${isRed() ? 'isRed' : isDarkOrange() ?  'isDarkOrange' : isOrange() ? 'isOrange' : 'blue'}`} value={progress}></IonProgressBar>
                <div className="divider"></div>
                <IonButton fill="outline" onClick={onClickH}>
                Play / Stop
              </IonButton>
             
              
              <div className="divider"></div>
              
              <div className="divider"></div>
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
