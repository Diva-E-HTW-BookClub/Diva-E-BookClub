import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonChip,
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
  useIonActionSheet,
  useIonPicker,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import {
  BookClub,
  deleteBookClubDocument,
  updateBookClubDocument,
} from "../../firebase/firebaseBookClub";
import { trashOutline } from "ionicons/icons";
import "../../pages/clubs/ClubPage.css";
import { useHistory } from "react-router-dom";

type FormValues = {
  name: string;
  maxMemberNumber: number;
};

interface EditClubModalProps {
  bookClubId: string;
  bookClubData: BookClub;
  onDismiss: () => any;
}

export const EditClubModal: React.FC<EditClubModalProps> = ({
  bookClubId,
  bookClubData,
  onDismiss,
}: EditClubModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [maxMember, setMaxMember] = useState<number>();
  const history = useHistory();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "all",
    defaultValues: {
      name: "",
      maxMemberNumber: 0,
    },
  });

  useEffect(() => {
    if (bookClubData) {
      setValue("name", bookClubData.name);
      setValue("maxMemberNumber", bookClubData.maxMemberNumber);
      setMaxMember(bookClubData.maxMemberNumber);
    }
  }, [bookClubData]);

  function cancelModal() {
    if (bookClubData)
      reset({
        name: bookClubData.name,
        maxMemberNumber: bookClubData.maxMemberNumber,
      });
    setIsOpen(false);
  }

  async function submitData(data: any) {
    data.book = bookClubData.book;
    await updateBookClubDocument(bookClubId, data).then(() => {
      setIsOpen(false);
      onDismiss();
    });
  }
  async function deleteBookClub() {
    await deleteBookClubDocument(bookClubId).then(() => {
      setIsOpen(false);
      setTimeout(() => history.push("/tabs/home"), 200);
    });
  }

  const [presentPicker] = useIonPicker();

  const pickerOptions = () => {
    let options = [];
    for (let i = bookClubData ? bookClubData.members.length : 0; i <= 50; i++) {
      let textLabel = i.toString();
      options.push({ text: textLabel, value: i });
    }
    return options;
  };

  const openPicker = async () => {
    await presentPicker({
      columns: [
        {
          name: "maxMember",
          options: pickerOptions(),
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Confirm",
          handler: (value) => {
            if (
              bookClubData &&
              value.maxMember.value < bookClubData.members.length
            ) {
              console.log("Members > Max Error");
            } else {
              setValue("maxMemberNumber", value.maxMember.value);
              setMaxMember(value.maxMember.value);
            }
          },
        },
      ],
    });
  };

  const [presentActionSheet] = useIonActionSheet();

  const actionSheet = () =>
    presentActionSheet({
      header: "Delete Club",
      subHeader: bookClubData?.name || "",
      backdropDismiss: false,
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          data: {
            action: "delete",
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        if (detail.data.action === "delete") {
          deleteBookClub();
        }
      },
    });

  return (
    <>
      <IonButton onClick={() => setIsOpen(true)}>Edit</IonButton>
      <IonModal onDidDismiss={() => setIsOpen(false)} isOpen={isOpen}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={cancelModal}>Cancel</IonButton>
            </IonButtons>
            <IonTitle>Edit Club</IonTitle>
            <IonButtons slot="end">
              <IonButton form="editClub" type="submit">
                Save
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <form id="editClub" onSubmit={handleSubmit(submitData)}>
            <IonItem className={errors.name ? "ion-invalid" : "ion-valid"}>
              <IonLabel position="stacked">Club Name</IonLabel>
              <IonInput
                {...register("name", { required: "Please enter a Club Name" })}
              />
              {errors.name && (
                <IonNote slot="error" color={"danger"}>
                  {errors.name.message}
                </IonNote>
              )}
            </IonItem>
            <IonItem>
              <IonLabel>Max number of members</IonLabel>
              <IonChip
                onClick={() => openPicker()}
                {...register("maxMemberNumber")}
              >
                {maxMember}
              </IonChip>
              <IonNote slot="helper">
                Cannot be less than current number of Members
              </IonNote>
            </IonItem>
            <IonItem lines="none">
              <IonButton
                slot="start"
                fill="clear"
                onClick={actionSheet}
                color="danger"
              >
                <IonIcon slot="icon-only" icon={trashOutline}></IonIcon>
              </IonButton>
            </IonItem>
          </form>
        </IonContent>
      </IonModal>
    </>
  );
};
