import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonInput,
  IonButton,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonToolbar,
  IonItem,
  IonCheckbox,
  IonRouterLink,
  IonNote,
  IonSpinner,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { registerUser } from "../../firebase/firebaseAuth";
import { useForm } from "react-hook-form";
import { useState } from "react";

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  termsAccepted: boolean;
};

const RegisterPage: React.FC = () => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmedPassword: "",
      termsAccepted: false,
    },
    mode: "all",
  });

  async function submitData(data: any) {
    setIsSubmitting(true);
    await registerUser(data.email, data.password).then((result) => {
      // if result has no errors redirect to home page
      if (result === "") {
        history.push("/home");
      } else if (result === "auth/email-already-in-use") {
        setError("email", {
          type: "custom",
          message: "User with this Email already exists",
        });
      }
      setIsSubmitting(false);
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/start" />
          </IonButtons>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>Welcome to Book Club App</h1>
        <form onSubmit={handleSubmit(submitData)}>
          <IonItem>
            <IonLabel position="stacked">Username</IonLabel>
            <IonInput
              {...register("username", {
                required: "Username is required",
              })}
            />
            {errors.username && (
              <IonNote slot="error" color={"danger"}>
                {errors.username.message}
              </IonNote>
            )}
          </IonItem>

          <IonItem className={errors.email ? "ion-invalid" : "ion-valid"}>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "email is invalid",
                },
              })}
            />
            {errors.email && (
              <IonNote slot="error" color={"danger"}>
                {errors.email.message}
              </IonNote>
            )}
          </IonItem>

          <IonItem className={errors.password ? "ion-invalid" : "ion-valid"}>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Should contain at least 6 symbols",
                },
              })}
            />
            {errors.password && (
              <IonNote slot="error" color={"danger"}>
                {errors.password.message}
              </IonNote>
            )}
          </IonItem>

          <IonItem
            className={errors.confirmedPassword ? "ion-invalid" : "ion-valid"}
          >
            <IonLabel position="stacked">Confirm password</IonLabel>
            <IonInput
              type="password"
              {...register("confirmedPassword", {
                required: "Please confirm your Password",
                validate: (value) =>
                  getValues("password") === value || "Passwords do not match",
              })}
            />
            {errors.confirmedPassword && (
              <IonNote slot="error" color={"danger"}>
                {errors.confirmedPassword.message}
              </IonNote>
            )}
          </IonItem>
          <IonItem>
            <IonLabel>
              I have taken note of the
              <br />
              data protection regulations
            </IonLabel>
            <IonCheckbox
                {...register("termsAccepted", {required: "Please accept our Terms and Conditions"})}
                slot="end"
                onIonChange={(e) => {e.detail.checked ? setValue("termsAccepted", true) : setValue("termsAccepted", false)}}>
            </IonCheckbox>
            {errors.termsAccepted && <IonNote slot="helper" color="danger">{errors.termsAccepted.message}</IonNote>}
          </IonItem>
          <br />
          <IonButton expand="block" type="submit">
            {isSubmitting ? <IonSpinner></IonSpinner> : "REGISTER"}
          </IonButton>
          <IonItem lines="none">
            <p className="font-center">
              Already have an account?
              <IonRouterLink routerDirection="forward" routerLink="/login">
                {" "}
                Log in
              </IonRouterLink>
            </p>
          </IonItem>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
