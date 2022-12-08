import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { BookClub, Comment, getBookClubDocument, updateBookClubDocument } from "../../firebase/firebaseBookClub";
import { deleteCommentDocument, getCommentDocument, updateCommentDocument } from "../../firebase/firebaseComments";


type FormValues = {
    passage: string;
    quote: string;
    text: string;
}
const EditComment: React.FC = () => {
    let {bookClubId}: {bookClubId: string} = useParams();
    let {discussionId}: {discussionId: string} = useParams();
    let {commentId}: {commentId: string} = useParams();

    const { register, handleSubmit, setValue, formState: { errors } } =
        useForm<FormValues>({
    });

    async function submitData(data: any) {
        const result = await updateCommentDocument(bookClubId, discussionId, commentId, {
            passage: data.passage,
            quote: data.quote,
            text: data.text,
        })
        console.log(result)
    }
    
    useEffect(() => {
        getComment();
      }, []);
    async function getComment() {
        let commentDoc = await getCommentDocument(bookClubId, discussionId, commentId)


        setValue("passage", commentDoc?.passage)
        setValue("quote", commentDoc?.quote)
        setValue("text", commentDoc?.text)   
      }
      async function deleteComment() {
        deleteCommentDocument(bookClubId, discussionId, commentId)
    }

    return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/clubs" />
                </IonButtons>
                <IonTitle>Edit Comment</IonTitle>
                <IonButtons slot="end">
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Edit Comment</IonTitle>
                </IonToolbar>
            </IonHeader>
            <form onSubmit={handleSubmit(submitData)}>
                <IonItem>
                    <IonLabel position="stacked">
                        <h1>Passage</h1>
                    </IonLabel>
                    <IonInput {...register("passage", {})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">
                        <h1>Quote</h1>
                    </IonLabel>
                    <IonInput {...register("quote", {})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">
                        <h1>Text</h1>
                    </IonLabel>
                    <IonInput {...register("text", {})} />
                </IonItem>
                <IonButton type="submit" routerLink={"/clubs/" + bookClubId+ "/discussions/" + discussionId + "/comments"}>Update</IonButton>
            </form>
            <IonButton onClick={() => deleteComment()} color="danger" routerLink={"/clubs/" + bookClubId + "/discussions/" + discussionId + "/comments"}>Delete Club</IonButton>
        </IonContent>
    </IonPage>
    )
}

export default EditComment;
