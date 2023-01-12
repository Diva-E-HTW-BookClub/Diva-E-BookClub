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

type FormValues = {
  agenda: {
    name: string;
    timeLimit: number;
    elapsedTime: number;
  }[];
};

const Agenda: React.FC = () => {
  //replace isModerator by an API call for a users roll
  const [isModerator, setIsModerator] = useState<boolean>(true);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const [discussionData, setDiscussionData] = useState<Discussion>();
  const [totalTime, setTotalTime] = useState<number>(0);

  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();

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
      <>
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
      </>
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref={"/clubs/" + bookClubId + "/view"} />
          </IonButtons>
          <IonTitle>Agenda</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Agenda</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(submitData)}>
          <IonList>
            <IonListHeader>
              <IonLabel>
                <h1>{discussionData.title}</h1>
                <h2>{getTimezonedDate(discussionData.date)}</h2>
                <p>
                  {getTimeSlotString(
                    discussionData.startTime,
                    discussionData.endTime
                  )}
                </p>
              </IonLabel>
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
            <IonButton onClick={() => setIsReadOnly(!isReadOnly)}>
              Edit
            </IonButton>
          )}
          {!isReadOnly && (
            <>
              <IonButton fill="outline" onClick={cancelEdit}>
                Cancel
              </IonButton>
              <IonButton type="submit">Save</IonButton>
            </>
          )}
        </form>
        {isReadOnly && (
          <IonButton
            routerLink={
              "/clubs/" + bookClubId + "/discussions/" + discussionId + "/live"
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

