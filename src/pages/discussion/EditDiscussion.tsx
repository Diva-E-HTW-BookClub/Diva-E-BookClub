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
  IonButtons,
  IonBackButton, IonDatetimeButton, IonModal, IonNote, IonIcon, IonSpinner,
} from "@ionic/react";
import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useHistory, useParams} from "react-router";
import {
  deleteDiscussionDocument,
  getDiscussionDocument,
  updateDiscussionDocument
} from "../../firebase/firebaseDiscussions";
import "./EditDiscussion.css";
import {
  datetimeToUtcISOString,
  formatToTimezonedISOString,
  mergeISODateAndISOTime
} from "../../helpers/datetimeFormatter";
import {trash} from "ionicons/icons";
import {Discussion} from "../../firebase/firebaseBookClub";

type FormValues = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: [];
  agenda: [];
}

const EditDiscussion: React.FC = () => {
  let {bookClubId}: {bookClubId: string} = useParams();
  let {discussionId}: {discussionId: string} = useParams();
  const [discussion, setDiscussion] = useState<Discussion>();

  const history = useHistory();

  let today = formatToTimezonedISOString(new Date());

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
      startTime: "",
      endTime: "",
      location: "",
      participants: [],
      agenda: [],
    },
    mode: "all",
  });

  async function submitData(data: any) {
    let utcDate = datetimeToUtcISOString(data.date);
    let utcStartTime = datetimeToUtcISOString(
        mergeISODateAndISOTime(data.date, data.startTime)
    );
    let utcEndTime = datetimeToUtcISOString(
        mergeISODateAndISOTime(data.date, data.endTime)
    );
    await updateDiscussionDocument(bookClubId, discussionId,{
      title: data.title,
      date: utcDate,
      startTime: utcStartTime,
      endTime: utcEndTime,
      location: data.location,
    }).then(() => {history.push("/clubs/" + bookClubId + "/view")});
  }

  useEffect(() => {
    getDiscussion()
  }, []);

  async function getDiscussion() {
    let discussionDoc = await getDiscussionDocument(bookClubId, discussionId)
    setDiscussion(discussionDoc);
  }

  if(discussion) {
    setValue("title", discussion.title)
    setValue("date", formatToTimezonedISOString(new Date(discussion.date)))
    setValue("startTime", formatToTimezonedISOString(new Date(discussion.startTime)))
    setValue("endTime", formatToTimezonedISOString(new Date(discussion.endTime)))
    setValue("location", discussion.location)
  }

  async function deleteDiscussion() {
    deleteDiscussionDocument(bookClubId, discussionId)
  }

  if(!discussion){
    return <IonSpinner></IonSpinner>
  }

  return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/clubs" />
            </IonButtons>
            <IonTitle>Edit Discussion</IonTitle>
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
                          min={formatToTimezonedISOString(new Date(discussion.date))}
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
            <IonItem lines="none">
              <IonButton size="default" slot="start" type="submit">
                Save
              </IonButton>
              <IonButton size="default" slot="end" color="danger" onClick={() => deleteDiscussion()} routerLink={"/clubs/" + bookClubId + "/view"}>
                <IonIcon slot="icon-only" icon={trash}></IonIcon>
              </IonButton>
            </IonItem>
          </form>
        </IonContent>
      </IonPage>
  );
};

export default EditDiscussion;
