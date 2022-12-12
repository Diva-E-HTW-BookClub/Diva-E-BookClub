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
  IonButtons,
  IonBackButton,
} from "@ionic/react";
import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { deleteDiscussionDocument, getDiscussionDocument, updateDiscussionDocument } from "../../firebase/firebaseDiscussions";
import "./EditDiscussion.css";

type FormValues = {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
}

const EditDiscussion: React.FC = () => {
  let {bookClubId}: {bookClubId: string} = useParams();
  let {discussionId}: {discussionId: string} = useParams();


  const { register, handleSubmit, setValue, formState: { errors } } =
        useForm<FormValues>({
    });
  
    async function submitData(data: any) {
      const result = await updateDiscussionDocument(bookClubId, discussionId, {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        location: data.location,
      })
      console.log(result)
  }
    
  useEffect(() => {
    getDiscussion()
  }, []);

  async function getDiscussion() {
    let commentDoc = await getDiscussionDocument(bookClubId, discussionId)

    setValue("title", commentDoc?.title)
    setValue("startTime", commentDoc?.startTime)
    setValue("endTime", commentDoc?.endTime)  
    setValue("location", commentDoc?.location)   
  }

  async function deleteDiscussion() {
    deleteDiscussionDocument(bookClubId, discussionId)
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
              <IonBackButton defaultHref="/clubs" />
          </IonButtons>
          <IonTitle>Edit Discussion</IonTitle>
          <IonButtons slot="end">
          </IonButtons>
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
              <IonButton type="submit" routerLink={"/clubs/" + bookClubId + "/view"}>Update</IonButton>
            </form>
            <IonButton color="danger" onClick={() => deleteDiscussion()} routerLink={"/clubs/" + bookClubId}> Delete </IonButton>
          </div>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default EditDiscussion;
