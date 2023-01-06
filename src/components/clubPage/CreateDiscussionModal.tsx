import React, {useState} from "react";
import {useSelector} from "react-redux";
import {
    compareDatesAscending,
    datetimeToUtcISOString,
    formatToTimezonedISOString,
    mergeISODateAndISOTime
} from "../../helpers/datetimeFormatter";
import {Controller, useForm} from "react-hook-form";
import {createDiscussionDocument} from "../../firebase/firebaseDiscussions";
import {
    IonButton,
    IonButtons,
    IonContent, IonDatetime, IonDatetimeButton,
    IonHeader, IonIcon, IonInput, IonItem, IonLabel,
    IonModal, IonNote,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {add} from "ionicons/icons";

type FormValues = {
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    participants: [];
    agenda: [];
};

interface CreateDiscussionModalProps {
    bookClubId: string;
    onDismiss: () => void;
}

export const CreateDiscussionModal: React.FC<CreateDiscussionModalProps> = ({bookClubId, onDismiss}: CreateDiscussionModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const user = useSelector((state: any) => state.user.user);

    let today = formatToTimezonedISOString(new Date());
    let todayStartTime = formatToTimezonedISOString(new Date(), "13:00:00");
    let todayEndTime = formatToTimezonedISOString(new Date(), "14:00:00");

    const [minEndTime, setMinEndTime] = useState<string>(todayStartTime);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        getValues,
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

    function cancelModal() {
            reset({
                title: "",
                date: today,
                startTime: todayStartTime,
                endTime: todayEndTime,
                location: "",
                participants: [],
                agenda: [],
            })
        setIsOpen(false);
    }

    async function submitData(data: any) {
        let userId = user.uid;
        let utcStartTime = datetimeToUtcISOString(
            mergeISODateAndISOTime(data.date, data.startTime)
        );
        let utcEndTime = datetimeToUtcISOString(
            mergeISODateAndISOTime(data.date, data.endTime)
        );
        //date & startTime have to contain the same exact time point.
        //it is only used for the merge above. ISO Strings contain date & time anyway
        await createDiscussionDocument(bookClubId, {
            title: data.title,
            date: utcStartTime,
            startTime: utcStartTime,
            endTime: utcEndTime,
            location: data.location,
            participants: [],
            agenda: [],
            moderator: userId,
        }).then(() => {setIsOpen(false); onDismiss()});
    }

    const checkIfDateIsPast = (value: string) => {
        let date = mergeISODateAndISOTime(getValues("date"), value);
        return compareDatesAscending(date);
    };

    const checkIfTimeMismatch = (firstValue: string, secondValue: string) => {
        console.log(compareDatesAscending(firstValue, secondValue))
        return compareDatesAscending(firstValue, secondValue);
    };

    return (
        <>
            <IonButton
                fill="clear"
                slot="end"
                onClick={() => setIsOpen(true)}
            >
                <IonIcon slot="icon-only" icon={add}></IonIcon>
            </IonButton>
            <IonModal swipeToClose isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={cancelModal}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Add Discussion</IonTitle>
                        <IonButtons slot="end">
                            <IonButton type="submit" form="createDiscussion">
                                Create
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
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
                                                            if(checkIfTimeMismatch(e.detail.value, getValues("endTime"))){
                                                                console.log("Times Mismatch");
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
        </>
    )
}