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
} from "@ionic/react";
import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import {updateUser} from "../../firebase/firebaseAuth";

type FormValues = {
    username: string;
};

interface EditProfileModalProps {
    user: any;
    onDismiss: () => void;
}

export type ModalHandle = {
    open: () => void;
};

const EditProfileModal = forwardRef<ModalHandle, EditProfileModalProps>(
    ({ user, onDismiss }: EditProfileModalProps, ref) => {
        const [isOpen, setIsOpen] = useState(false);

        const {
            register,
            handleSubmit,
            setValue,
            formState: { errors },
        } = useForm<FormValues>({
            mode: "all",
        });

        useEffect(() => {
            setValue("username", user.username);
        }, [user, isOpen])

        useImperativeHandle(ref, () => ({
            open() {
                setIsOpen(true);
            },
        }));

        function cancelModal() {
            setIsOpen(false);
        }

        async function submitData(data: any) {
           await updateUser(user.id, data.username).then(() => setIsOpen(false));
        }

        return (
            <IonModal isOpen={isOpen} initialBreakpoint={0.8} onDidDismiss={() => {onDismiss(); setIsOpen(false)}}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={cancelModal}>Cancel</IonButton>
                        </IonButtons>
                        <IonTitle>Edit Profile</IonTitle>
                        <IonButtons slot="end">
                            <IonButton type="submit" form="editProfile">
                                Save
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <form id="editProfile" onSubmit={handleSubmit(submitData)}>
                        <IonItem className={errors.username ? "ion-invalid" : "ion-valid"}>
                            <IonLabel position="stacked">Username</IonLabel>
                            <IonInput
                                placeholder="Enter a Username"
                                {...register("username", { required: "Username is required" })}
                            />
                            <IonNote slot="helper">The name displayed on your comments</IonNote>
                            {errors.username && (
                                <IonNote slot="error" color={"danger"}>
                                    {errors.username.message}
                                </IonNote>
                            )}
                        </IonItem>
                    </form>
                </IonContent>
            </IonModal>
        );
    }
);

export default EditProfileModal;
