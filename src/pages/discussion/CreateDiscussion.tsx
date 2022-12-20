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
  IonNote,
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
  mergeISODateAndISOTime,
} from "../../helpers/datetimeFormatter";

type FormValues = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: [];
  agenda: [];
};

const AddDiscussion: React.FC = () => {
  let { bookClubId }: { bookClubId: string } = useParams();
  const user = useSelector((state: any) => state.user.user);

  let today = formatToTimezonedISOString(new Date());
  let todayStartTime = formatToTimezonedISOString(new Date(), "13:00:00");
  let todayEndTime = formatToTimezonedISOString(new Date(), "14:00:00");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      date: today,
      startTime: todayStartTime,
      endTime: todayEndTime,
      location: "",
      participants: [],
      agenda: [],
    },
    mode: "all",
  });

  async function submitData(data: any) {
    let userId = user.uid;
    let utcDate = datetimeToUtcISOString(data.date);
    let utcStartTime = datetimeToUtcISOString(
      mergeISODateAndISOTime(data.date, data.startTime)
    );
    let utcEndTime = datetimeToUtcISOString(
      mergeISODateAndISOTime(data.date, data.endTime)
    );
    await createDiscussionDocument(bookClubId, {
      title: data.title,
      date: utcDate,
      startTime: utcStartTime,
      endTime: utcEndTime,
      location: data.location,
      participants: [],
      agenda: [],
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
                  min={today}
                  firstDayOfWeek={1}
                  value={field.value}
                  onIonChange={(e) => {
                    if (typeof e.detail.value === "string") {
                      setValue("date", e.detail.value);
                    }
                  }}
                >
                  <span slot="title">Select a Discussion Date</span>
                </IonDatetime>
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
            <IonLabel position="stacked">Title</IonLabel>
            <IonInput
              placeholder="Enter a Title"
              {...register("title", { required: "Title is required" })}
            />
          </IonItem>
          {errors.title && (
            <IonNote slot="error" color={"danger"}>
              {errors.title.message}
            </IonNote>
          )}
          <IonItem>
            <IonLabel position="stacked">Location</IonLabel>
            <IonInput
              placeholder="Enter a Location"
              {...register("location", { required: "Location is required" })}
            />
          </IonItem>
          {errors.location && (
            <IonNote slot="error" color={"danger"}>
              {errors.location.message}
            </IonNote>
          )}
          <IonItem>
            <IonButton size="default" type="submit">
              Create
            </IonButton>
          </IonItem>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default AddDiscussion;
