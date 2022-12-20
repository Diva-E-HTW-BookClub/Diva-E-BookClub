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
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import {
  datetimeToUtcISOString,
  formatToTimezonedISOString,
  mergeISODateAndISOTime
} from "../../helpers/datetimeFormatter";

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
  const user = useSelector((state: any) => state.user.user);

  let defaultDate = formatToTimezonedISOString(new Date());
  let defaultStartTime = formatToTimezonedISOString(new Date(), "13:00:00");
  let defaultEndTime = formatToTimezonedISOString(new Date(), "14:00:00");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      date: defaultDate,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      location: "",
      participants: [],
      agenda: "",
    },
  });

  async function submitData(data: any) {
    let userId = user.uid;
    let utcDate = datetimeToUtcISOString(data.date);
    let utcStartTime = datetimeToUtcISOString(
      mergeISODateAndISOTime(data.date, data.startTime)
    );
    let utcEndTime = datetimeToUtcISOString(mergeISODateAndISOTime(data.date, data.endTime));
    await createDiscussionDocument(bookClubId, {
      title: data.title,
      date: utcDate,
      startTime: utcStartTime,
      endTime: utcEndTime,
      location: data.location,
      participants: [],
      agenda: "",
      moderator: userId,
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
          <IonButton
            type="submit"
            routerLink={"/clubs/" + bookClubId + "/view"}
          >
            Create
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddDiscussion;
