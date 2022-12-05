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
  IonNote
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { registerUser } from "../../firebase/firebaseAuth";
import { useForm, Controller } from "react-hook-form";

type FormValues = {
  username: string;
  email: string;
  password: string;
  confirmedPassword: string;
  termsAccepted: boolean;
};

const RegisterPage: React.FC = () => {
  const history = useHistory();

  const { register, control, handleSubmit, setValue, setError, formState: { errors } } =
    useForm<FormValues>({
      defaultValues: {
        username: "",
        email: "",
        password: "",
        confirmedPassword: "",
        termsAccepted: false
      }
    });

  async function submitData(data: any) {
    // minLength doesn't work for password input, check the password manually
    if (data.password.length < 6) {
      setError("password", { type: "custom", message: "password should contain min 6 symbols" })
    }
    // check that password matches confirmed password
    else if (data.password !== data.confirmedPassword) {
      setError("confirmedPassword", { type: "custom", message: "doesn't match" })
    }
    // check that user accepted the terms
    else if (data.termsAccepted === false) {
      setError("termsAccepted", { type: "custom", message: "this check is required" })
    } else {
      const result = await registerUser(data.email, data.password);
      // if result has no errors redirect to home page
      if (result === "") {
        history.push("/home");
      } else if (result === "auth/email-already-in-use") {
        setError("email", { type: "custom", message: "user with this email already exists" })
      } else if (result === "auth/weak-password") {
        setError("password", { type: "custom", message: "password should contain min 6 symbols" })
      }
    }
  };

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
        <form onSubmit={handleSubmit(submitData)} >
          <IonItem>
            <IonLabel position="floating">Username</IonLabel>
            <IonInput
              {...register("username", {
                required: "this field is required"
              })}
            />
          </IonItem>
          {errors.username && (
            <IonNote slot="error" color={"danger"}>{errors.username.message}</IonNote>
          )}

          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              {...register("email", {
                required: "this field is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "email is invalid"
                }
              })}
            />
          </IonItem>
          {errors.email && (
            <IonNote slot="error" color={"danger"}>{errors.email.message}</IonNote>
          )}

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput type="password"
              {...register("password", {
                required: "this field is required"
              })}
            />
          </IonItem>
          {errors.password && (
            <IonNote slot="error" color={"danger"}>{errors.password.message}</IonNote>
          )}

          <IonItem>
            <IonLabel position="floating">Confirm password</IonLabel>
            <IonInput type="password"
              {...register("confirmedPassword", {
                required: "this field is required"
              })}
            />
          </IonItem>
          {errors.confirmedPassword && (
            <IonNote slot="error" color={"danger"}>{errors.confirmedPassword.message}</IonNote>
          )}

          <IonItem>
            <IonLabel>
              I have taken note of the
              <br />
              data protection regulations
            </IonLabel>
            <Controller
              name="termsAccepted"
              control={control}
              render={({ field }) => {
                return (
                  <IonCheckbox
                    slot="start"
                    checked={field.value}
                    onIonChange={e => {
                      setValue("termsAccepted", e.detail.checked);
                    }}
                  />
                );
              }}
            />
          </IonItem>
          {errors.termsAccepted && (
            <IonNote slot="error" color={"danger"}>{errors.termsAccepted.message}</IonNote>
          )}
          <br/>
          <IonButton type="submit">Register</IonButton>
          <IonItem lines="none">
            <p>
              Already have an account?
              <IonRouterLink routerDirection="forward" routerLink="/login"> Log in</IonRouterLink>
            </p>
          </IonItem>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
