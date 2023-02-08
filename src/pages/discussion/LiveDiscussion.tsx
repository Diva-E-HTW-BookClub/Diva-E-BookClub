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
  IonIcon,
  useIonViewWillEnter,
  IonSpinner,
} from "@ionic/react";
import io from "socket.io-client";
import "./LiveDiscussion.css";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { book, pause, play } from "ionicons/icons";
import {
  getDiscussionAgenda,
  getDiscussionTitle,
  updateDiscussionAgenda,
} from "../../firebase/firebaseDiscussions";
import { getBookClubDocument } from "../../firebase/firebaseBookClub";
import { useParams } from "react-router";
import { SOCKET_IO_URL } from "../../constants";

const socket = io(SOCKET_IO_URL, {
  transports: ["websocket"],
});
var emitTimes: number[] = [];
var emitSum = 0;
var emitStates: boolean[] = [];
var maxParticipants = 0;

const LiveDiscussion: React.FC = () => {
  useIonViewWillEnter(() => {});

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
  const [progressTimesReceived, setProgressTimesReceived] = useState<number[]>([
    0,
  ]);
  const [progressSumReceived, setProgressSumReceived] = useState(0);
  const [participantCount, setparticipantCount] = useState(0);

  const joinDiscussionRoom = () => {
    if (discussionId !== "") {
      socket.emit("join_discussion_room", discussionId);
    }
  };

  const leaveDiscussionRoom = () => {
    if (discussionId !== "") {
      socket.emit("leaveRoom", { discussionId });
    }
  };

  // live discussion will be stored in the database
  async function saveLiveDiscussion(toBeArchived: boolean) {
    var elapsedTimeArray = progressTimesReceived;
    let nameArray = agendaParts.map((e) => e.name);
    var timeLimitArray = agendaParts.map((e) => e.timeLimit);
    var elapsedTimeArrayInSeconds = elapsedTimeArray.map(function (x, index) {
      return timeLimitArray[index] * x;
    });

    if (agendaParts.length != 0) {
      await updateDiscussionAgenda(
        bookClubId,
        discussionId,
        agendaParts.length,
        elapsedTimeArrayInSeconds,
        nameArray,
        timeLimitArray,
        maxParticipants,
        toBeArchived
      );
    }
  }

  function createPlayingStatesForButton(length: number, index: number) {
    var timeTable = [];
    for (var i = 0; i < length; i++) {
      timeTable[i] = false;
    }
    if (index !== -1) {
      if (!playingState[index]) {
        timeTable[index] = true;
      }
    }
    return timeTable;
  }

  const setButtons = (buttonNumber: number) => {
    if (isModerator) {
      emitStates = createPlayingStatesForButton(
        agendaParts.length,
        buttonNumber
      );
      emitTimes = progressTimesReceived;
      emitSum = progressSumReceived;

      setPlayingState(
        createPlayingStatesForButton(agendaParts.length, buttonNumber)
      );

      // send the data to everyone in the room
      socket.emit("send_all_Current_Data", {
        emitStates,
        emitTimes,
        emitSum,
        discussionId,
      });
    }
    saveLiveDiscussion(false);
  };

  function endDiscussion() {
    setButtons(-1);
    saveLiveDiscussion(true);
    leaveDiscussionRoom();
  }

  useEffect(() => {
    getAgendaParts();
    joinDiscussionRoom();
    socket.emit("request_data", { emitSum, discussionId });
    if (isModerator) {
      socket.emit("get_moderator", isModerator);
    }
  }, [useIonViewWillEnter]);

  useEffect(() => {
    socket.on("receive_playButtonStart", (data) => {});
    socket.on("receive_playButton", (data) => {
      if (typeof data.emitStates !== "undefined") {
        setPlayingStateReceived(data.emitStates);
      } else {
        setPlayingStateReceived(data);
      }
    });

    socket.on("receive_time", (data) => {
      if (typeof data.emitTimes !== "undefined") {
        setProgressTimesReceived(data.emitTimes);
      } else {
        setProgressTimesReceived(data);
      }
    });

    socket.on("receive_sum_time", (data) => {
      if (typeof data.emitSum !== "undefined") {
        setProgressSumReceived(data.emitSum);
      } else {
        setProgressSumReceived(data);
      }
    });

    socket.on("receive_timeStart", (data) => {
      if (data[0] === -1 || typeof data[0] === "undefined") {
        var arrayForTimes = [0, 0];
        for (var i = 0; i < agendaParts.length; i++) {
          arrayForTimes[i] = 0;
        }
        getAgendaParts();
      } else {
        setProgressTimesReceived(data[0]);
      }
    });

    socket.on("receive_sum_timeStart", (data) => {
      if (data[0] === -1 || typeof data[0] === "undefined") {
        setProgressSumReceived(0);
      } else {
        setProgressSumReceived(data[0]);
      }
    });

    socket.on("receive_all_Data", (data) => {
      if (typeof data.emitStates !== "undefined") {
        setPlayingStateReceived(data.emitStates);
      } else {
        setPlayingStateReceived(data);
      }
      if (typeof data.emitTimes !== "undefined") {
        setProgressTimesReceived(data.emitTimes);
      } else {
        setProgressTimesReceived(data);
      }
      if (typeof data.emitSum !== "undefined") {
        setProgressSumReceived(data.emitSum);
      } else {
        setProgressSumReceived(data);
      }
    });

    socket.on("changeParticipantCount", (data) => {
      setparticipantCount(data);
      if (maxParticipants <= data) {
        maxParticipants = data;
      }
      saveLiveDiscussion(false);
    });
  }, [socket]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressTimesReceived((progressTimesReceived) => {
        for (var i = 0; i < agendaParts.length; i++) {
          if (playingStateReceived[i]) {
            progressTimesReceived[i] =
              progressTimesReceived[i] + 1 / (10 * maxTimes[i]);
            setProgressSumReceived(
              (prevProgress) => prevProgress + 1 / (10 * totalTimeLimit)
            );
            emitTimes[i] = emitTimes[i] + 1 / (10 * maxTimes[i]);
            emitSum = emitSum + 1 / (10 * totalTimeLimit);
          }
        }
        return progressTimesReceived;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [playingStateReceived]);

  useEffect(() => {
    const interval = setInterval(() => {
      for (var i = 0; i < agendaParts.length; i++) {
        if (playingStateReceived[i]) {
          if (isModerator) {
            socket.emit("send_all_Data", {
              emitStates,
              emitTimes,
              emitSum,
              discussionId,
            });
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playingStateReceived]);

  // Colors for Progress
  const isOrange = (progress: number, totalTime: number) => {
    return +(progress * totalTime).toFixed(2) >= totalTime * 0.5;
  };

  const isDarkOrange = (progress: number, totalTime: number) => {
    return +(progress * totalTime).toFixed(2) >= totalTime * 0.79;
  };

  const isRed = (progress: number, totalTime: number) => {
    return +(progress * totalTime).toFixed(2) >= totalTime;
  };

  async function getAgendaParts() {
    let bookClub = await getBookClubDocument(bookClubId);
    // check if the current user is moderator of the club
    setIsModerator(bookClub?.moderator.includes(user.uid));
    let agendaParts = await getDiscussionAgenda(bookClubId, discussionId);
    let agendaTitle = await getDiscussionTitle(bookClubId, discussionId);
    setAgendaParts(agendaParts);
    setAgendaTitle(agendaTitle);
    for (var i = 0; i < agendaParts.length; i++) {
      progressTimesReceived[i] = 0;
      playingStateReceived[i] = false;
      emitTimes[i] = 0;
    }
  }

  if (!agendaParts) {
    return <IonSpinner></IonSpinner>;
  }

  // convert agenda parts to elapsedTime and timeLimit and sum the values
  //let totalElapsedTime = agendaParts.map(e => e.elapsedTime).reduce((a, b) => a + b, 0);
  let totalTimeLimit = agendaParts
    .map((e) => e.timeLimit)
    .reduce((a, b) => a + b, 0);
  let maxTimes = agendaParts.map((e) => e.timeLimit);

  function doubleDigits(number: number) {
    var minutes = Math.floor(number / 60);
    var seconds = Math.floor(number % 60);
    var secondsString =
      seconds < 10 ? "0" + seconds.toString() : seconds.toString();
    var finalOutput = minutes.toString() + ":" + secondsString;
    return finalOutput;
  }

  function addUp(numberArray: any, maxTimes: any) {
    var resultSeconds = 0;
    var resultMinutes = 0;
    for (var i = 0; i < numberArray.length; i++) {
      var seconds = Math.floor(numberArray[i] * maxTimes[i]);
      resultSeconds += seconds;
    }
    resultMinutes = Math.floor(resultSeconds / 60);
    resultSeconds = resultSeconds % 60;

    var resultSecondsString =
      resultSeconds < 10
        ? "0" + resultSeconds.toString()
        : resultSeconds.toString();
    var finalOutput = resultMinutes.toString() + ":" + resultSecondsString;
    return finalOutput;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Live Discussion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      <div className="divider-small"></div>
      <div className="h2">{agendaTitle}</div>
        <IonCard className="cards time-bar">
        <IonCardHeader className="titleHeader">
            <IonCardTitle className="playTitle">
              Total discussion time
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonRow>
            <IonCol className="timeDisplay" size="12">
                <div className="timeDisplayContainer">
                  {`${addUp(progressTimesReceived, maxTimes)} / ${doubleDigits(
                    totalTimeLimit
                  )} min`}
                </div>
              </IonCol>
              <IonCol size="12" className="progressbarContainer">
                <IonProgressBar
                  className={` ${
                    isRed(progressSumReceived, totalTimeLimit)
                      ? "isRed"
                      : isDarkOrange(progressSumReceived, totalTimeLimit)
                      ? "isDarkOrange"
                      : isOrange(progressSumReceived, totalTimeLimit)
                      ? "isOrange"
                      : "blue"
                  }`}
                  value={progressSumReceived}
                ></IonProgressBar>
              </IonCol>
              
            </IonRow>
          </IonCardContent>
        </IonCard>
        <IonList lines="none">
          {agendaParts.map((agendaPart, index) => {
            return (
              <IonItem className="iten-no-padding" key={index}>
                <IonCard
                  className={` ${
                    playingStateReceived[index] ? "isPlaying" : "notPlaying"
                  } `}
                >
                  
                  <IonCardHeader className="titleHeader">
                    <IonCardTitle className="playTitle">
                      {agendaPart.name}
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="6">
                        
                    {isModerator && (
                      <IonButton
                        className="playButton"
                        fill="solid"
                        color="favorite"
                        onClick={() => setButtons(index)}
                      >
                        {!playingStateReceived[index] && (
                          <IonIcon
                            className="button-icon"
                            icon={play}
                          ></IonIcon>
                        )}
                        {playingStateReceived[index] && (
                          <IonIcon
                            className="button-icon"
                            icon={pause}
                          ></IonIcon>
                        )}
                      </IonButton>
                    )}
                    
                        </IonCol>
                        <IonCol className="timeDisplay" size="6">
                          <div className="timeDisplayContainer">
                            {`${doubleDigits(
                              progressTimesReceived[index] *
                                agendaPart.timeLimit
                            )} / ${doubleDigits(agendaPart.timeLimit)} min`}
                          </div>
                        </IonCol>
                      </IonRow>
                     
                      <IonRow>
                        <IonCol size="12" className="progressbarContainer">
                          <IonProgressBar
                            className={` ${
                              isRed(
                                progressTimesReceived[index],
                                agendaPart.timeLimit
                              )
                                ? "isRed"
                                : isDarkOrange(
                                    progressTimesReceived[index],
                                    agendaPart.timeLimit
                                  )
                                ? "isDarkOrange"
                                : isOrange(
                                    progressTimesReceived[index],
                                    agendaPart.timeLimit
                                  )
                                ? "isOrange"
                                : "blue"
                            }`}
                            value={progressTimesReceived[index]}
                          ></IonProgressBar>
                        </IonCol>
                        
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonItem>
            );
          })}
        </IonList>
        <div className="h2">Current participants: {participantCount}</div>
        <div className="divider-small"></div>
        {isModerator && (
          <IonButton
            className="live"
            routerDirection="back"
            routerLink={"/tabs/home"}
            onClick={() => endDiscussion()}
          >
            End discussion
          </IonButton>
        )}
        {!isModerator && (
          <IonButton
            className="live"
            routerDirection="back"
            routerLink={"/tabs/home"}
            onClick={() => leaveDiscussionRoom()}
          >
            Leave discussion
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default LiveDiscussion;

