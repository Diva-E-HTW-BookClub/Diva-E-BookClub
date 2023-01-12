import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { camera, trashOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import {
  deleteCommentDocument,
  getCommentDocument,
  updateCommentDocument,
} from "../../firebase/firebaseComments";
import { usePhotoGallery, base64FromPath } from "../../hooks/usePhotoGallery";
import "./EditComment.css";

type FormValues = {
  passage: string;
  quote: string;
  text: string;
};

const EditComment: React.FC = () => {
  const { takePhoto } = usePhotoGallery();
  const [photo, setPhoto] = useState<string>();
  let { bookClubId }: { bookClubId: string } = useParams();
  let { discussionId }: { discussionId: string } = useParams();
  let { commentId }: { commentId: string } = useParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({});

  async function submitData(data: any) {
    if (photo === "") {
      data.photo = null;
    } else if (photo != null) {
      data.photo = await base64FromPath(photo!);
    }
    await updateCommentDocument(bookClubId, discussionId, commentId, data);
  }

  useEffect(() => {
    getComment();
  }, []);

  async function getComment() {
    let commentDoc = await getCommentDocument(
      bookClubId,
      discussionId,
      commentId
    );
    setValue("passage", commentDoc?.passage);
    setValue("text", commentDoc?.text);
    setPhoto(commentDoc?.photo);
  }

  async function deleteComment() {
    deleteCommentDocument(bookClubId, discussionId, commentId);
  }

  async function makePhoto() {
    let newPhoto = await takePhoto();
    setPhoto(newPhoto);
  }

  async function deletePhoto() {
    setPhoto("");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/clubs" />
          </IonButtons>
          <IonTitle>Edit Comment</IonTitle>
          <IonButtons slot="end"></IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Edit Comment</IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(submitData)}>
          <IonItem lines="none">
            {!photo && (
              <div>
                <IonButton onClick={() => makePhoto()} size="default">
                  <IonIcon slot="icon-only" icon={camera}></IonIcon>
                </IonButton>
                <IonLabel>Add Photo</IonLabel>
              </div>
            )}
            {photo && (
              <div className="wrapPhoto">
                <IonImg src={photo} />
                <IonButton
                  onClick={() => deletePhoto()}
                  color="light"
                  class="deletePhoto"
                >
                  <IonIcon
                    slot="icon-only"
                    color="danger"
                    icon={trashOutline}
                  ></IonIcon>
                </IonButton>
              </div>
            )}
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              <h1>Passage</h1>
            </IonLabel>
            <IonInput {...register("passage", {})} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              <h1>Text</h1>
            </IonLabel>
            <IonInput {...register("text", {})} />
          </IonItem>
          <IonButton
            type="submit"
            routerLink={
              "/clubs/" +
              bookClubId +
              "/discussions/" +
              discussionId +
              "/comments"
            }
          >
            Update
          </IonButton>
          <IonButton
            onClick={() => deleteComment()}
            color="danger"
            routerLink={
              "/clubs/" +
              bookClubId +
              "/discussions/" +
              discussionId +
              "/comments"
            }
          >
            Delete
          </IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default EditComment;
