import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonDatetime,
  IonGrid,
  IonCardTitle,
  IonCard,
  IonRow,
  IonCol,
  IonProgressBar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/react";
import React, { useRef, useEffect, useState } from "react";
import { createDiscussionDocument, getDiscussionDocument } from "../../firebase/firebaseDiscussions";
import { useParams } from "react-router";
import "./EditDiscussion.css";
import { useForm } from "react-hook-form";

type FormValues = {
  title: string;
  startTime: string;
  endTime: string;
  location: string;

  participants: [];
  agenda: string;
}


const AddDiscussion: React.FC = () => {
  let {bookClubId}: {bookClubId: string} = useParams();

  const { register, handleSubmit, setValue, formState: { errors } } =
  useForm<FormValues>({
  });

  async function submitData(data: any) {
    const result = await createDiscussionDocument(bookClubId, {
      title: data.title,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location,

      participants: [],
      agenda: "",
    })
}
  useEffect(() => {
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Discussion</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <div className="divider"></div>
          <IonGrid>
          <div className="box">
            <form onSubmit={handleSubmit(submitData)}>
              <IonItem>
                <IonLabel position="stacked">
                    <h1>Title</h1>
                </IonLabel>
                <IonInput {...register("title", {})} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                    <h1>Start Time</h1>
                </IonLabel>
                <IonInput type="datetime-local" {...register("startTime", {})} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                    <h1>End Time</h1>
                </IonLabel>
                <IonInput type="datetime-local" {...register("endTime", {})} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                    <h1>Location</h1>
                </IonLabel>
                <IonInput {...register("location", {})} />
              </IonItem>
              <IonButton type="submit" routerLink={"/clubs/" + bookClubId + "/view"}>Create</IonButton>
            </form>
          </div>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AddDiscussion;
