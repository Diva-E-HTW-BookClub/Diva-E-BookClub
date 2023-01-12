import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonButtons,
  IonModal,
  IonNote,
  IonIcon,
} from "@ionic/react";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import {
  getResourceDocument,
  updateResourceDocument,
} from "../../firebase/firebaseResource";
import { informationCircleOutline } from "ionicons/icons";
import { Resource } from "../../firebase/firebaseBookClub";
import "./EditResourceModal.css";

type FormValues = {
  title: string;
  content: string;
};

interface EditResourceModalProps {
  bookClubId: string;
  resourceId: string;
  onDismiss: () => void;
}

export type ModalHandle = {
  open: () => void;
};

const EditResourceModal = forwardRef<ModalHandle, EditResourceModalProps>(
  ({ bookClubId, resourceId, onDismiss }: EditResourceModalProps, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [resource, setResource] = useState<Resource>();

    useImperativeHandle(ref, () => ({
      open() {
        setIsOpen(true);
      },
    }));

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
    } = useForm<FormValues>({
      mode: "all",
    });

    useEffect(() => {
      getResource();
    }, [isOpen]);

    async function getResource() {
      let resourceDoc = await getResourceDocument(bookClubId, resourceId);
      if (resourceDoc) {
        setResource(resourceDoc);
      }
      setValue("title", resourceDoc?.title);
      setValue("content", resourceDoc?.content);
    }

    function cancelModal() {
      reset({
        title: resource?.title,
        content: resource?.content,
      });
      setIsOpen(false);
    }

    async function submitData(data: any) {
      await updateResourceDocument(bookClubId, resourceId, {
        title: data.title,
        content: data.content,
      }).then(() => {
        setIsOpen(false);
        onDismiss();
      });
    }

    return (
      <IonModal isOpen={isOpen} onDidDismiss={cancelModal}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={cancelModal}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Edit Resource</IonTitle>
            <IonButtons slot="end">
              <IonButton type="submit" form="editResource">
                Save
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <form id="editResource" onSubmit={handleSubmit(submitData)}>
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
                      /^(http(s):\/\/.)[-a-zA-Z\d@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z\d@:%_.~#?&/=]*)$/g,
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
    );
  }
);

export default EditResourceModal;
