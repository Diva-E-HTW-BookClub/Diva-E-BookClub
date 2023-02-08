import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, informationCircleOutline } from "ionicons/icons";
import { createResourceDocument } from "../../firebase/firebaseResource";
import "./CreateResourceModal.css";

type FormValues = {
  title: string;
  content: string;
};

interface CreateResourceModalProps {
  bookClubId: string;
  onDismiss: () => void;
}

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({
  bookClubId,
  onDismiss,
}: CreateResourceModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: any) => state.user.user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      content: "",
    },
    mode: "all",
  });

  function cancelModal() {
    reset({
      title: "",
      content: "",
    });
    setIsOpen(false);
  }

  async function submitData(data: any) {
    let userId = user.uid;
    await createResourceDocument(bookClubId, {
      title: data.title,
      content: data.content,
      moderator: userId,
    }).then(() => {
      setIsOpen(false);
      onDismiss();
    });
  }

  return (
    <>
      <IonButton fill="clear" slot="end" onClick={() => setIsOpen(true)}>
        <IonIcon slot="icon-only" icon={add}></IonIcon>
      </IonButton>
      <IonModal isOpen={isOpen} onDidDismiss={cancelModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton color="secondary" onClick={cancelModal}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Add Resource</IonTitle>
            <IonButtons slot="end">
              <IonButton color="secondary" type="submit" form="createDiscussion">
                Create
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
              <IonNote slot="helper">Type or Name of Link</IonNote>
              {errors.title && (
                <IonNote slot="error" color={"danger"}>
                  {errors.title.message}
                </IonNote>
              )}
            </IonItem>
            <IonItem className={errors.content ? "ion-invalid" : "ion-valid"}>
              <IonLabel position="stacked">Link</IonLabel>
              <IonInput
                placeholder="Enter a Link"
                {...register("content", {
                  required: "Link is required",
                  pattern: {
                    value:
                      /^(http(s):\/\/.)[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&/=]*)$/g,
                    message: "Link is invalid",
                  },
                })}
              />
              <IonNote slot="helper">
                Please don't post suspicious or unsafe links
              </IonNote>
              {errors.content && (
                <IonNote slot="error" color={"danger"}>
                  {errors.content.message}
                </IonNote>
              )}
            </IonItem>
            <div className="ion-padding-top"></div>
            <IonItem lines="none" className="infoItem">
              <IonIcon slot="start" icon={informationCircleOutline} />
              <IonLabel class="ion-text-wrap">
                <p>
                  Link should look like:
                  <br />
                  http://www.example.com or https://www.example.com
                </p>
              </IonLabel>
            </IonItem>
          </form>
        </IonContent>
      </IonModal>
    </>
  );
};
