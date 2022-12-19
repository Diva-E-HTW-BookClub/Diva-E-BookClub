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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { deleteCommentDocument } from "../../firebase/firebaseComments";
import { deleteResourceDocument, getResourceDocument, updateResourceDocument } from "../../firebase/firebaseResource";
import "./CreateResource.css";

type FormValues = {
  title: string;
  content: string;

}
const EditResource: React.FC = () => {
  let {bookClubId}: {bookClubId: string} = useParams();
  let {resourceId}: {resourceId: string} = useParams();

  const { register, handleSubmit, setValue, formState: { errors } } =
        useForm<FormValues>({
    });
  
  async function submitData(data: any) {
      const result = await updateResourceDocument(bookClubId, resourceId, data)
  }

  useEffect(() => {
    getResource()
  }, []);

  async function getResource() {
    let resourceDoc = await getResourceDocument(bookClubId, resourceId)

    setValue("title", resourceDoc?.title)
    setValue("content", resourceDoc?.content)   
  }
  async function deleteResource() {
    deleteResourceDocument(bookClubId, resourceId)
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit Resource</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
          <IonHeader collapse="condense">
              <IonToolbar>
                  <IonTitle size="large">Edit Resource</IonTitle>
              </IonToolbar>
          </IonHeader>
          <form onSubmit={handleSubmit(submitData)}>
              <IonItem>
                  <IonLabel position="stacked">
                      <h1>Title</h1>
                  </IonLabel>
                  <IonInput {...register("title", {})} />
              </IonItem>
              <IonItem>
                  <IonLabel position="stacked">
                      <h1>Add a link</h1>
                  </IonLabel>
                  <IonInput {...register("content", {})} />
              </IonItem>
              <IonButton type="submit" routerLink={"/clubs/" + bookClubId+ "/view"}>Update</IonButton>
          </form>
          <IonButton onClick={() => deleteResource()} color="danger" routerLink={"/clubs/" + bookClubId + "/view/"}>Delete Resource</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditResource;
