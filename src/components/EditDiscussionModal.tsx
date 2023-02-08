import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonDatetimeButton,
  IonModal,
  IonNote,
} from "@ionic/react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import {
  getDiscussionDocument,
  updateDiscussionDocument,
} from "../firebase/firebaseDiscussions";
import {
  compareDatesAscending,
  datetimeToUtcISOString,
  formatToTimezonedISOString,
  mergeISODateAndISOTime,
} from "../helpers/datetimeFormatter";
import { Discussion } from "../firebase/firebaseBookClub";

type FormValues = {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
};

interface EditDiscussionModalProps {
  bookClubId: string;
  discussionId: string;
  onDismiss: () => void;
}

export type ModalHandle = {
  open: () => void;
};

const EditDiscussionModal = forwardRef<ModalHandle, EditDiscussionModalProps>(
  ({ bookClubId, discussionId, onDismiss }: EditDiscussionModalProps, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [discussion, setDiscussion] = useState<Discussion>();

    let today = formatToTimezonedISOString(new Date());

    const [minEndTime, setMinEndTime] = useState<string>();

    const {
      register,
      handleSubmit,
      control,
      setValue,
      reset,
      getValues,
      formState: { errors },
    } = useForm<FormValues>({
      mode: "all",
    });

    useEffect(() => {
      getDiscussion();
    }, []);

    useImperativeHandle(ref, () => ({
      open() {
        setIsOpen(true);
      },
    }));

    async function getDiscussion() {
      let discussionDoc = await getDiscussionDocument(bookClubId, discussionId);
      setDiscussion(discussionDoc);
      setMinEndTime(
        formatToTimezonedISOString(new Date(discussionDoc?.startTime))
      );
      setValue("title", discussionDoc?.title);
      setValue(
        "date",
        formatToTimezonedISOString(new Date(discussionDoc?.startTime))
      );
      setValue(
        "startTime",
        formatToTimezonedISOString(new Date(discussionDoc?.startTime))
      );
      setValue(
        "endTime",
        formatToTimezonedISOString(new Date(discussionDoc?.endTime))
      );
      setValue("location", discussionDoc?.location);
    }

    function cancelModal() {
      if (discussion) {
        reset({
          title: discussion?.title,
          date: formatToTimezonedISOString(new Date(discussion.startTime)),
          startTime: formatToTimezonedISOString(new Date(discussion.startTime)),
          endTime: formatToTimezonedISOString(new Date(discussion.endTime)),
          location: discussion.location,
        });
      }
      setIsOpen(false);
    }

    async function submitData(data: any) {
      let utcStartTime = datetimeToUtcISOString(
        mergeISODateAndISOTime(data.date, data.startTime)
      );
      let utcEndTime = datetimeToUtcISOString(
        mergeISODateAndISOTime(data.date, data.endTime)
      );
      //date & startTime have to contain the same exact time point.
      //it is only used for the merge above. ISO Strings contain date & time anyway
      await updateDiscussionDocument(bookClubId, discussionId, {
        title: data.title,
        date: utcStartTime,
        startTime: utcStartTime,
        endTime: utcEndTime,
        location: data.location,
      }).then(() => {
        onDismiss();
        setIsOpen(false);
      });
    }

    const checkIfDateIsPast = (value: string) => {
      let date = mergeISODateAndISOTime(getValues("date"), value);
      return compareDatesAscending(date);
    };

    const checkIfTimeMismatch = (firstValue: string, secondValue: string) => {
      return compareDatesAscending(firstValue, secondValue);
    };

    return (
      <IonModal isOpen={isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="secondary" onClick={cancelModal}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Edit Discussion</IonTitle>
            <IonButtons slot="end">
              <IonButton color="secondary" type="submit" form="createDiscussion">
                Save
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <form id="createDiscussion" onSubmit={handleSubmit(submitData)}>
            <IonItem className={errors.title ? "ion-invalid" : "ion-valid"}>
              <IonLabel position="stacked">Title</IonLabel>
              <IonInput
                placeholder="Enter a Title"
                {...register("title", { required: "Title is required" })}
              />
              <IonNote slot="helper">Topic or Chapter of Discussion</IonNote>
              {errors.title && (
                <IonNote slot="error" color={"danger"}>
                  {errors.title.message}
                </IonNote>
              )}
            </IonItem>
            <IonItem className={errors.location ? "ion-invalid" : "ion-valid"}>
              <IonLabel position="stacked">Location</IonLabel>
              <IonInput
                placeholder="Enter a Location"
                {...register("location", { required: "Location is required" })}
              />
              <IonNote slot="helper">Meeting Address or Link</IonNote>
              {errors.location && (
                <IonNote slot="error" color={"danger"}>
                  {errors.location.message}
                </IonNote>
              )}
            </IonItem>
            <IonItem>
              <IonLabel>Date</IonLabel>
              <Controller
                name="date"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      <IonDatetimeButton datetime="date"></IonDatetimeButton>
                      <IonModal keepContentsMounted={true}>
                        <IonDatetime
                          id="date"
                          presentation="date"
                          min={today}
                          firstDayOfWeek={1}
                          value={field.value}
                          onIonChange={(e) => {
                            if (typeof e.detail.value === "string") {
                              setValue("date", e.detail.value);
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
              <IonLabel>Start</IonLabel>
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
                              setMinEndTime(e.detail.value);
                              if (
                                checkIfTimeMismatch(
                                  e.detail.value,
                                  getValues("endTime")
                                )
                              ) {
                                setValue("endTime", e.detail.value);
                              }
                            }
                          }}
                        ></IonDatetime>
                      </IonModal>
                    </>
                  );
                }}
                rules={{
                  validate: {
                    dateIsPast: (value) =>
                      checkIfDateIsPast(value) || "Start is in the past",
                    timeMismatch: (value) =>
                      !checkIfTimeMismatch(value, getValues("endTime")) ||
                      "Start equals or is past End",
                  },
                }}
              />
            </IonItem>
            <IonItem className={errors.startTime ? "ion-invalid" : "ion-valid"}>
              <IonLabel>End</IonLabel>
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
                          min={minEndTime}
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
              <IonNote slot="helper">Date of having the Discussion</IonNote>
              {errors.startTime && (
                <IonNote slot="error" color={"danger"}>
                  {errors.startTime.message}
                </IonNote>
              )}
            </IonItem>
          </form>
        </IonContent>
      </IonModal>
    );
  }
);

export default EditDiscussionModal;
