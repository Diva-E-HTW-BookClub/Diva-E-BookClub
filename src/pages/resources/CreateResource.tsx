
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCard,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { createResourceDocument } from "../../firebase/firebaseResource";
import "./CreateResource.css";

type FormValues = {
  title: string;
  content: string;
}
const AddResource: React.FC = () => {
  let {bookClubId}: {bookClubId: string} = useParams();
  const user = useSelector((state:any) => state.user.user)
  const { register, handleSubmit, setValue, formState: { errors } } =
  useForm<FormValues>({
  });
  
  async function submitData(data: any) {
    let userId = user.uid;
    const result = await createResourceDocument(bookClubId, {
      title: data.title,
      content: data.content,
      moderator: userId,
    })
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Resource</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonGrid>
            <div className="box">
              <div className="divider"></div>
              <form onSubmit={handleSubmit(submitData)}>
                <IonItem>
                  <IonLabel position="stacked">
                      <h1>Title</h1>
                  </IonLabel>
                  <IonInput {...register("title", {})} />
                </IonItem>
                <div className="divider"></div>
                <IonItem>
                <IonLabel position="stacked">
                    <h1>Add a link</h1>
                </IonLabel>
                <IonInput {...register("content", {})} />
              </IonItem>
                <div className="divider"></div>
                <div className="divider"></div>
                <IonRow>
                  <IonCol size="5">
                    <IonButton
                      routerLink="/clubs/clubId"
                      className="cancel-button"
                    >
                      Cancel
                    </IonButton>
                  </IonCol>
                  <IonCol size="5">
                  <IonButton type="submit" routerLink={"/clubs/" + bookClubId + "/view"}>Create</IonButton>
                  </IonCol>
                </IonRow>
              </form>
              <div className="divider"></div>
            </div>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AddResource;
