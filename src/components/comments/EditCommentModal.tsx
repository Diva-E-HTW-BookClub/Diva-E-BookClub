import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import {
  alertCircleOutline,
  camera,
  informationCircleOutline,
  trashOutline,
} from "ionicons/icons";
import {
  base64FromPath,
  getFileSizeFromBase64,
  usePhotoGallery,
} from "../../hooks/usePhotoGallery";
import {
  getCommentDocument,
  updateCommentDocument,
} from "../../firebase/firebaseComments";
import { Comment } from "../../firebase/firebaseBookClub";

type FormValues = {
  passage: string;
  text: string;
};

interface EditCommentModalProps {
  bookClubId: string;
  discussionId: string;
  commentId: string;
  onDismiss: () => void;
}

export type ModalHandle = {
  open: () => void;
};

export const EditCommentModal = forwardRef<ModalHandle, EditCommentModalProps>(
  (
    { bookClubId, discussionId, commentId, onDismiss }: EditCommentModalProps,
    ref
  ) => {
    const { takePhoto } = usePhotoGallery();
    const [isOpen, setIsOpen] = useState(false);
    const [photo, setPhoto] = useState<string>();
    const [comment, setComment] = useState<Comment>();
    const [present] = useIonToast();

    const {
      register,
      handleSubmit,
      reset,
      setValue,
      formState: { errors },
    } = useForm<FormValues>({
      mode: "all",
    });

    useImperativeHandle(ref, () => ({
      open() {
        setIsOpen(true);
      },
    }));

    useEffect(() => {
      getComment();
    }, [isOpen]);

    async function getComment() {
      await getCommentDocument(bookClubId, discussionId, commentId).then(
        (commentDoc) => {
          if (commentDoc) {
            setComment(commentDoc);
          }
          setValue("passage", commentDoc?.passage);
          setValue("text", commentDoc?.text);
          setPhoto(commentDoc?.photo);
        }
      );
    }

    async function makePhoto() {
      let newPhoto = await takePhoto();
      if (newPhoto) {
        let base64String = await base64FromPath(newPhoto);
        if (getFileSizeFromBase64(base64String) > 1048487) {
          presentToast();
        } else {
          setPhoto(newPhoto);
        }
      }
    }

    const presentToast = () => {
      present({
        message: "Photo is larger than 1Mb. Please select a smaller image",
        duration: 2500,
        icon: alertCircleOutline,
        color: "danger",
      });
    };

    async function deletePhoto() {
      setPhoto(undefined);
    }

    function cancelModal() {
      reset({
        passage: comment?.passage,
        text: comment?.text,
      });
      setPhoto(comment?.photo);
      setIsOpen(false);
    }

    async function submitData(data: any) {
      if (photo != null && photo !== "") {
        data.photo = await base64FromPath(photo);
      } else {
        data.photo = "";
      }
      await updateCommentDocument(bookClubId, discussionId, commentId, {
        passage: data.passage,
        text: data.text,
        photo: data.photo,
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
              <IonButton
                  color="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  cancelModal();
                }}
              >
                Cancel
              </IonButton>
            </IonButtons>
            <IonTitle>Edit Comment</IonTitle>
            <IonButtons slot="end">
              <IonButton color="secondary" type="submit" form="createComment">
                Save
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <form
            id="createComment"
            onSubmit={(e) => {
              e.stopPropagation();
              handleSubmit(submitData);
            }}
          >
            <IonItem>
              {!photo && (
                <div className="ion-padding-vertical">
                  <IonButton
                    fill="outline"
                    onClick={() => makePhoto()}
                    size="default"
                  >
                    <IonIcon
                      size="large"
                      slot="icon-only"
                      icon={camera}
                    ></IonIcon>
                  </IonButton>
                  <IonLabel>
                    <p>Take Photo</p>
                  </IonLabel>
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
            <IonItem className={errors.passage ? "ion-invalid" : "ion-valid"}>
              <IonLabel position="stacked">Passage</IonLabel>
              <IonTextarea
                autoGrow={true}
                placeholder="Enter a Passage"
                {...register("passage")}
              />
              <IonNote slot="helper">
                Line or Paragraph you want to quote (optional)
              </IonNote>
              {errors.passage && (
                <IonNote slot="error" color={"danger"}>
                  {errors.passage.message}
                </IonNote>
              )}
            </IonItem>
            <IonItem className={errors.text ? "ion-invalid" : "ion-valid"}>
              <IonLabel position="stacked">Comment</IonLabel>
              <IonTextarea
                autoGrow={true}
                placeholder="Enter a Comment"
                {...register("text", {
                  required: {
                    value: photo === undefined,
                    message: "Comment is required",
                  },
                })}
              />
              <IonNote slot="helper">Your Comment or Question</IonNote>
              {errors.text && (
                <IonNote slot="error" color={"danger"}>
                  {errors.text.message}
                </IonNote>
              )}
            </IonItem>
            <div className="ion-padding-top"></div>
            <IonItem lines="none" className="infoItem">
              <IonIcon slot="start" icon={informationCircleOutline} />
              <IonLabel class="ion-text-wrap">
                <p>
                  You can also just upload a picture without adding a Passage or
                  Comment.
                </p>
              </IonLabel>
            </IonItem>
          </form>
        </IonContent>
      </IonModal>
    );
  }
);
