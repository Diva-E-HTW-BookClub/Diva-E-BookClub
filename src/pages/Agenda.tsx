import {
  IonButton,
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonPicker,
  IonSpinner,
  IonNote,
  useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { addOutline, removeOutline } from "ionicons/icons";
import {
  addDiscussionAgenda,
  getDiscussionDocument,
} from "../firebase/firebaseDiscussions";
import { useParams } from "react-router";
import { Discussion } from "../firebase/firebaseBookClub";
import {
  getDistanceInMinutes,
  getTimeSlotString,
  getTimezonedDate,
} from "../helpers/datetimeFormatter";

import "./Agenda.css";
import {useSelector} from "react-redux";

type FormValues = {
  agenda: {
    name: string;
    timeLimit: number;
    elapsedTime: number;
  }[];
};

const Agenda: React.FC = () => {
  const [isModerator, setIsModerator] = useState<boolean>(true);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [discussionData, setDiscussionData] = useState<Discussion>();
  const [totalTime, setTotalTime] = useState<number>(0);
  const user = useSelector((state: any) => state.user.user);

  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();

  useIonViewWillEnter(() => {
    if(window.localStorage){
      if( !localStorage.getItem("firstLoad")){
        localStorage["firstLoad"] = true;
        window.location.reload();
      }
      else{
        localStorage.removeItem("firstLoad");
      }
    }
  });
  const {
    register,
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
  });

  const { fields, remove, append } = useFieldArray({
    name: "agenda",
    control,
  });

  const resetFields = () => {
    fields.forEach(() => {
      reset({
        agenda: [],
      });
    });
  };

  useEffect(() => {
    getDiscussion();
  }, []);

  async function getDiscussion() {
    let discussionData = await getDiscussionDocument(bookClubId, discussionId);
    setDiscussionData(discussionData);
    setIsModerator(discussionData?.moderator.includes(user.uid))
    insertAgendaIntoFields(discussionData);
    calcTotalTime();
  }

  function insertAgendaIntoFields(data: any) {
    //reset Fields before appending values to avoid multiple appending
    resetFields();
    let agendaArray = data.agenda;
    for (let i = 0; i < agendaArray.length; i++) {
      append({
        name: agendaArray[i].name,
        timeLimit: agendaArray[i].timeLimit,
        elapsedTime: agendaArray[i].elapsedTime
      });
    }
  }

  function calcTotalTime() {
    // convert agenda parts to timeLimit and sum the values
    let time = getValues().agenda.map(e => e.timeLimit).reduce((a, b) => a + b, 0) / 60;
    setTotalTime(time);
  }

  const [present] = useIonPicker();

  const pickerOptions = () => {
    let options = [];
    for (let i = 0; i <= 60; i++) {
      let textLabel = i + " min";
      options.push({ text: textLabel, value: i });
    }
    return options;
  };

  const openPicker = async (index: number) => {
    await present({
      columns: [
        {
          name: "minutes",
          options: pickerOptions(),
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Confirm",
          handler: (value) => {
            setValue(`agenda.${index}.timeLimit`, value.minutes.value * 60);
            //recalculate total time if a time value was changed
            calcTotalTime();
          },
        },
      ],
    });
  };

  const inputFields = () => {
    return (
      <div className="inputFields">
        {fields.map((field, index) => {
          return (
            <IonItem key={field.id}>
              {!isReadOnly && (
                <IonButton
                  fill="clear"
                  onClick={() => {
                    remove(index);
                    calcTotalTime();
                  }}
                >
                  <IonIcon slot="icon-only" icon={removeOutline}></IonIcon>
                </IonButton>
              )}
              <IonInput
                placeholder={"Subchapter " + (index + 1)}
                readonly={isReadOnly}
                {...register(`agenda.${index}.name`, {
                  required: "Enter Title",
                })}
              ></IonInput>
              {errors.agenda?.[index]?.name && (
                <IonNote color="danger" slot="helper">
                  {errors.agenda?.[index]?.name?.message}
                </IonNote>
              )}
              <Controller
                name={`agenda.${index}.timeLimit`}
                control={control}
                render={({ field }) => (
                  <>
                    {!isReadOnly && (
                      <IonButton {...field} onClick={() => openPicker(index)}>
                        {(field.value / 60) + " min"}
                      </IonButton>
                    )}
                    {isReadOnly && <IonText>{(field.value / 60) + " min"}</IonText>}
                  </>
                )}
                rules={{ required: true, min: 1 }}
              />
              {errors.agenda?.[index]?.timeLimit && (
                <IonNote color="danger" slot="helper">
                  Select a Time
                </IonNote>
              )}
            </IonItem>
          );
        })}
      </div>
    );
  };

  async function submitData(data: any) {
    await addDiscussionAgenda(bookClubId, discussionId, data.agenda);
    setIsReadOnly(true);
  }

  const cancelEdit = async () => {
    await getDiscussion();
    setIsReadOnly(true);
  };

  if (!discussionData) {
    return <IonSpinner></IonSpinner>;
  }

 

  return (
    <IonPage className="parent">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={"/tabs/home/" + bookClubId + "/view"} />
          </IonButtons>
          <IonTitle>Agenda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form onSubmit={handleSubmit(submitData)}>
          <IonList>
            <IonListHeader className="agendaTitleDiv">
              <IonLabel>
                <h1 className="agendaTitle">{discussionData.title }</h1>
              </IonLabel>
              <div className="agendaDate">
                <IonLabel>
                  <h2 id="date">{getTimezonedDate(discussionData.date)}</h2>
                </IonLabel>
                <IonLabel>
                  <p>
                    {getTimeSlotString(
                        discussionData.startTime,
                        discussionData.endTime
                    )}
                  </p>
                </IonLabel>
              </div>
            </IonListHeader>
            {inputFields()}
          </IonList>
          <IonItem lines="none">
            {!isReadOnly && (
              <IonButton
                fill="clear"
                onClick={() => {
                  append({
                    name: "",
                    timeLimit: 5 * 60,
                    elapsedTime: 0
                  });
                  calcTotalTime();
                }}
              >
                <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
              </IonButton>
            )}
          </IonItem>
          <IonItem>
            <IonInput readonly>Total</IonInput>
            <IonText>{totalTime + " min"}</IonText>
            {totalTime >
              getDistanceInMinutes(
                discussionData.startTime,
                discussionData.endTime
              ) && (
              <IonNote color="danger" slot="helper">
                Total Time exceeds Planned Time
              </IonNote>
            )}
          </IonItem>
          <IonItem lines="none">
            <IonInput readonly>Planned</IonInput>
            <IonText>
              {getDistanceInMinutes(
                discussionData.startTime,
                discussionData.endTime
              ) + " min"}
            </IonText>
          </IonItem>
          {isModerator && isReadOnly && (
                <IonButton className="edit" onClick={() => setIsReadOnly(!isReadOnly)}>
                  Edit
                </IonButton>
          )}
          {!isReadOnly && (
            <>
                <IonButton className="edit" fill="outline" onClick={cancelEdit}>
                  Cancel
                </IonButton>
                <IonButton className="liveButton" type="submit">Save</IonButton>
            </>
          )}
        </form>
        {isReadOnly && (
          <IonButton className="liveButton" type="submit"
            routerLink={
              "/live/" + bookClubId + "/discussions/" + discussionId + "/view"
            }
          >
            Live
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Agenda;

