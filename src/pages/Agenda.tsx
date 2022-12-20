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
} from "@ionic/react";
import {useEffect, useState} from "react";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { addOutline, removeOutline } from "ionicons/icons";
import { addDiscussionAgenda, getDiscussionAgenda } from "../firebase/firebaseDiscussions";
import {useParams} from "react-router";

type FormValues = {
  chapters: {
    name: string;
    min: number;
  }[];
};

const Agenda: React.FC = () => {
  //replace isModerator by an API call for a users roll
  const [isModerator, setIsModerator] = useState<boolean>(true);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);

  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();

  const { register, control, handleSubmit, reset, setValue } =
    useForm<FormValues>({
      defaultValues: {
        chapters: [{ name: "", min: 5 }],
      },
    });

  const { fields, remove, append } = useFieldArray({
    name: "chapters",
    control,
  });

  useEffect(() => {
    getAgenda()
  }, [])

  async function getAgenda() {
    let agendaArray = await getDiscussionAgenda(bookClubId, discussionId);
    setValue(`chapters.0.min`, agendaArray[0].min);
    setValue(`chapters.0.name`, agendaArray[0].name);
    for(let i = 1; i < agendaArray.length; i++){
      append({
        name: agendaArray[i].name,
        min: agendaArray[i].min,
      })
    }
  }

  const [present] = useIonPicker();

  const openPicker = async (index: number) => {
    await present({
      columns: [
        {
          name: "minutes",
          options: [
            {
              text: "5 min",
              value: 5,
            },
            {
              text: "10 min",
              value: 10,
            },
            {
              text: "15 min",
              value: 15,
            },
            {
              text: "20 min",
              value: 20,
            },
            {
              text: "25 min",
              value: 25,
            },
            {
              text: "30 min",
              value: 30,
            },
            {
              text: "35 min",
              value: 35,
            },
            {
              text: "40 min",
              value: 40,
            },
            {
              text: "45 min",
              value: 45,
            },
            {
              text: "10 min",
              value: 10,
            },
          ],
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
            setValue(`chapters.${index}.min`, value.minutes.value);
          },
        },
      ],
    });
  };

  async function submitData(data: any){
    await addDiscussionAgenda(bookClubId, discussionId, data.chapters);
    setIsReadOnly(true);
  }

  const cancelEdit = () => {
    fields.forEach(() =>{
      reset({
        chapters: [
          {
            name: "",
            min: 5,
          },
        ],
      })
    }
    );
    getAgenda();
    setIsReadOnly(true);
  };

  const getPlaceholder = (index: number) => {
    let number = index + 1;
    return "Subchapter " + number;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clubs/clubid" />
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
                <h1>Chapter 7</h1>
                <p>17. November 2022</p>
              </IonLabel>
            </IonListHeader>
            {fields.map((field, index) => {
              return (
                <IonItem key={field.id}>
                  {!isReadOnly && (
                    <IonButton fill="clear" onClick={() => remove(index)}>
                      <IonIcon slot="icon-only" icon={removeOutline}></IonIcon>
                    </IonButton>
                  )}
                  <IonInput
                    placeholder={getPlaceholder(index)}
                    readonly={isReadOnly}
                    {...register(`chapters.${index}.name`)}
                  ></IonInput>
                  <Controller
                    name={`chapters.${index}.min`}
                    control={control}
                    render={({ field }) => (
                      <>
                        {!isReadOnly && (
                          <IonButton
                            {...field}
                            onClick={() => openPicker(index)}
                          >
                            {field.value + " min"}
                          </IonButton>
                        )}
                        {isReadOnly && (
                          <IonText>{field.value + " min"}</IonText>
                        )}
                      </>
                    )}
                  />
                </IonItem>
              );
            })}
          </IonList>
          <IonItem lines="none">
            {!isReadOnly && (
              <IonButton
                fill="clear"
                onClick={() =>
                  append({
                    name: "",
                    min: 5,
                  })
                }
              >
                <IonIcon slot="icon-only" icon={addOutline}></IonIcon>
              </IonButton>
            )}
          </IonItem>
          {!isReadOnly && (
            <>
              <IonButton fill="outline" onClick={cancelEdit}>
                Cancel
              </IonButton>
              <IonButton type="submit">Save</IonButton>
            </>
          )}
        </form>
        {isModerator && isReadOnly && (
          <IonButton onClick={() => setIsReadOnly(!isReadOnly)}>Edit</IonButton>
        )}
        <IonButton routerLink={"/clubs/" + bookClubId + "/discussions/" + discussionId + "/live"}>Live</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Agenda;
