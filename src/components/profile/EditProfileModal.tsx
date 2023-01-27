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

type FormValues = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;

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
            reset,
            getValues,
            setValue,
            formState: { errors },
        } = useForm<FormValues>({
            mode: "all",
        });

        useEffect(() => {
            setValue("username", user.username);
            setValue("email", user.email);
            setValue("password", user.password);
            setValue("confirmPassword", user.password);
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
           // await updateUser(user.uid, data).then(() => setIsOpen(false));
        }

        return (
            <IonModal isOpen={isOpen}>
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
                        <IonItem className={errors.email ? "ion-invalid" : "ion-valid"}>
                            <IonLabel position="stacked">Email Address</IonLabel>
                            <IonInput
                                placeholder="Enter an Email Address"
                                {...register("email", { required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: "This is not an Email",
                                    },
                                })}
                            />
                            <IonNote slot="helper">Your Account Email Address</IonNote>
                            {errors.email && (
                                <IonNote slot="error" color={"danger"}>
                                    {errors.email.message}
                                </IonNote>
                            )}
                        </IonItem>
                        <IonItem className={errors.password ? "ion-invalid" : "ion-valid"}>
                            <IonLabel position="stacked">Password</IonLabel>
                            <IonInput
                                placeholder="Enter a Password"
                                {...register("password", { required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Should contain at least 6 symbols",
                                    },
                                })}
                            />
                            <IonNote slot="helper">Your Account Password</IonNote>
                            {errors.password && (
                                <IonNote slot="error" color={"danger"}>
                                    {errors.password.message}
                                </IonNote>
                            )}
                        </IonItem>
                        <IonItem className={errors.confirmPassword ? "ion-invalid" : "ion-valid"}>
                            <IonLabel position="stacked">Confirm Password</IonLabel>
                            <IonInput
                                placeholder="Enter the Password again"
                                {...register("confirmPassword", { required: "Please confirm your Password",
                                    validate: (value) =>
                                        getValues("password") === value || "Passwords do not match",
                                })}
                            />
                            {errors.confirmPassword && (
                                <IonNote slot="error" color={"danger"}>
                                    {errors.confirmPassword.message}
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
