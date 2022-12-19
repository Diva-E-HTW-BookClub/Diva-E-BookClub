import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonDatetimeButton,
  IonModal,
  IonBackButton,
  IonButtons,
} from "@ionic/react";
import React from "react";
import { createDiscussionDocument } from "../../firebase/firebaseDiscussions";
import { useParams } from "react-router";
import "./EditDiscussion.css";
import { useForm, Controller } from "react-hook-form";
import { zonedTimeToUtc } from "date-fns-tz";

type FormValues = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: [];
  agenda: string;
};

const AddDiscussion: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({});

  function mergeDateAndTime(date: string, time: string) {
    let datePart = date.substring(0, 10);
    let timePart = time.substring(10);
    return datePart + timePart;
  }

  function datetimeToUtc(datetime: string) {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcDatetime = zonedTimeToUtc(datetime, timezone);
    return utcDatetime.toISOString();
  }

  async function submitData(data: any) {
    let utcDate = datetimeToUtc(data.date);
    let utcStartTime = datetimeToUtc(
      mergeDateAndTime(data.date, data.startTime)
    );
    let utcEndTime = datetimeToUtc(mergeDateAndTime(data.date, data.endTime));
    await createDiscussionDocument(bookClubId, {
      title: data.title,
      date: utcDate,
      startTime: utcStartTime,
      endTime: utcEndTime,
      location: data.location,
      participants: [],
      agenda: "",
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clubs" />
          </IonButtons>
          <IonTitle>Add Discussion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form onSubmit={handleSubmit(submitData)}>
          <Controller
            name="date"
            control={control}
            render={({ field }) => {
              return (
                <IonDatetime
                  presentation="date"
                  value={field.value}
                  onIonChange={(e) => {
                    if (typeof e.detail.value === "string") {
                      setValue("date", e.detail.value);
                    }
                  }}
                ></IonDatetime>
              );
            }}
          />
          <IonItem>
            Start Time
            <Controller
              name="startTime"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <IonDatetimeButton datetime="start"></IonDatetimeButton>
                    <IonModal keepContentsMounted={true}>
                      <IonDatetime
                        id="start"
                        presentation="time"
                        value={field.value}
                        onIonChange={(e) => {
                          if (typeof e.detail.value === "string") {
                            setValue("startTime", e.detail.value);
                          }
                        }}
                      ></IonDatetime>
                    </IonModal>
                  </>
                );
              }}
            />
            End Time
            <Controller
              name="endTime"
              control={control}
              render={({ field }) => {
                return (
                  <>
                    <IonDatetimeButton datetime="end"></IonDatetimeButton>
                    <IonModal keepContentsMounted={true}>
                      <IonDatetime
                        id="end"
                        presentation="time"
                        value={field.value}
                        onIonChange={(e) => {
                          if (typeof e.detail.value === "string") {
                            setValue("endTime", e.detail.value);
                          }
                        }}
                      ></IonDatetime>
                    </IonModal>
                  </>
                );
              }}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Title</IonLabel>
            <IonInput {...register("title")} />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Location</IonLabel>
            <IonInput {...register("location")} />
          </IonItem>
          <IonButton type="submit" routerLink={"/clubs/" + bookClubId}>
            Create
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddDiscussion;
