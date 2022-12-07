import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { BookClub, deleteBookClubDocument, getBookClubDocument, updateBookClubDocument } from "../../firebase/firebaseBookClub";

type FormValues = {
    name: string;
    maxParticipantsNumber: number;
}
const EditClubPage: React.FC = () => {
    let {bookClubId}: {bookClubId: string} = useParams();

    const [bookClubData, setBookClubData] = useState<BookClub>()

    const { register, handleSubmit, setValue, formState: { errors } } =
        useForm<FormValues>({
    });

    useEffect(() => {
        getBookClub();
      }, []);

    async function getBookClub() {
        let bookClub = await getBookClubDocument(bookClubId)
        setBookClubData(bookClub) 
        
        setValue("name", bookClub?.name)
        setValue("maxParticipantsNumber", bookClub?.maxParticipantsNumber)        
      }
    
    

     async function submitData(data: any) {
        const result = await updateBookClubDocument(bookClubId, {
            name: data.name,
            maxParticipantsNumber: data.maxParticipantsNumber,
        })
    }
    async function deleteBookClub() {
        deleteBookClubDocument(bookClubId)
    }
    

    return (
    <IonPage>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonBackButton defaultHref="/clubs" />
                </IonButtons>
                <IonTitle>Edit Club</IonTitle>
                <IonButtons slot="end">
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonHeader collapse="condense">
                <IonToolbar>
                    <IonTitle size="large">Edit Club</IonTitle>
                </IonToolbar>
            </IonHeader>
            <form onSubmit={handleSubmit(submitData)}>
                <IonItem>
                    <IonLabel position="stacked">
                        <h1>Club Name</h1>
                    </IonLabel>
                    <IonInput {...register("name", {})}/>

                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">
                        <h1>Max number of participants</h1>
                    </IonLabel>
                    <IonInput {...register("maxParticipantsNumber", {})}/>

                </IonItem>
                <IonButton type="submit" routerLink={"/clubs/" + bookClubId}>Update</IonButton>
            </form>
            <IonButton onClick={() => deleteBookClub()} color="danger" routerLink={"/clubs"}>Delete Club</IonButton>

        </IonContent>
    </IonPage>
    )
}

export default EditClubPage;
