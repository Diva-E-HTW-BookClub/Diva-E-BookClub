import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonNote,
  IonTitle,
  IonToolbar,
  useIonPicker,
  useIonToast,
} from "@ionic/react";
import { createBookClubDocument } from "../../firebase/firebaseBookClub";
import { BookCard } from "./BookCard";
import { useHistory } from "react-router-dom";
import SelectBookModal from "./SelectBookModal";
import { alertCircleOutline } from "ionicons/icons";

type FormValues = {
  name: string;
  maxMemberNumber: number;
};

export type ModalHandle = {
  open: () => void;
};

const CreateClubModal = forwardRef<ModalHandle>((props, ref) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [book, setBook] = useState<any>();
  const [maxMember, setMaxMember] = useState<number>(1);
  const user = useSelector((state: any) => state.user.user);
  const selectBookModal = useRef<ModalHandle>(null);

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
    defaultValues: {
      name: "",
      maxMemberNumber: 1,
    },
    mode: "all",
  });

  const [presentPicker] = useIonPicker();

  const pickerOptions = () => {
    let options = [];
    for (let i = 1; i <= 50; i++) {
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
            setValue("maxMemberNumber", value.maxMember.value);
            setMaxMember(value.maxMember.value);
          },
        },
      ],
    });
  };

  const [presentToast] = useIonToast();

  const bookErrorToast = () => {
    presentToast({
      message: "Please Select a Book",
      duration: 2500,
      icon: alertCircleOutline,
      color: "danger",
    });
  };

  function cancelModal() {
    reset({
      name: "",
      maxMemberNumber: 1,
    });
    setMaxMember(1);
    setIsOpen(false);
    setBook(null);
  }

  async function submitData(data: any) {
    let userId = user.uid;
    if (book) {
      await createBookClubDocument({
        id: "",
        name: data.name,
        moderator: [userId],
        members: [userId],
        maxMemberNumber: data.maxMemberNumber,
        book: {
          title: book.title,
          authors: book.authors,
          imageUrl: book.image,
        },
        discussions: [],
        resources: [],
        owner: userId,
      }).then((bookClubId) => {
        cancelModal();
        setTimeout(() => history.push(`/tabs/clubs/${bookClubId}/view`), 200);
      });
    } else {
      bookErrorToast();
    }
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={cancelModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={cancelModal}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Create Club</IonTitle>
          <IonButtons slot="end">
            <IonButton type="submit" form="createClub">
              Create
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding">
        <form
          id="createClub"
          className="ion-padding-horizontal"
          onSubmit={handleSubmit(submitData)}
        >
          {book && (
            <div className="ion-padding-top">
              <BookCard
                image={book.image}
                title={book.title}
                author={book.author}
              />
            </div>
          )}
          <div className="ion-padding-top">
            <IonButton
              expand="block"
              onClick={() => selectBookModal.current?.open()}
            >
              Select Book
            </IonButton>
          </div>
          <IonItem className={errors.name ? "ion-invalid" : "ion-valid"}>
            <IonLabel position="stacked">Club Name</IonLabel>
            <IonInput
              placeholder="Enter a Name"
              {...register("name", { required: "Club Name is required" })}
            />
            <IonNote slot="helper">
              Name by which others can find your Club
            </IonNote>
            {errors.name && (
              <IonNote slot="error" color={"danger"}>
                {errors.name.message}
              </IonNote>
            )}
          </IonItem>
          <IonItem
            className={errors.maxMemberNumber ? "ion-invalid" : "ion-valid"}
          >
            <IonLabel>Max number of members</IonLabel>
            <IonChip
              onClick={() => openPicker()}
              {...register("maxMemberNumber")}
            >
              {maxMember}
            </IonChip>
            <IonNote slot="helper">
              Amount of people that can join your Club
              <br />
              (including yourself)
            </IonNote>
          </IonItem>
        </form>
        <SelectBookModal
          setBook={setBook}
          ref={selectBookModal}
        ></SelectBookModal>
      </IonContent>
    </IonModal>
  );
});

export default CreateClubModal;
