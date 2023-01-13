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
  IonRouterLink,
  IonNote, IonSpinner
} from "@ionic/react";
import "./LoginPage.css";
import { useHistory } from "react-router-dom";
import { loginUser } from "../../firebase/firebaseAuth";
import { useForm } from "react-hook-form";
import {useState} from "react";

type FormValues = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { register, handleSubmit, setError, formState: { errors } } =
    useForm<FormValues>({
      defaultValues: {
        email: "",
        password: ""
      },
      mode: "all",
    });

  async function submitData(data: any) {
    setIsSubmitting(true);
    await loginUser(data.email, data.password).then((result) => {
      // if result has no errors redirect to home page
      if (result === "") {
        history.push("/home");
      } else if (result === "auth/user-not-found") {
        setError("email", { type: "custom", message: "User does not exists" })
      } else if (result === "auth/wrong-password") {
        setError("password", { type: "custom", message: "Password incorrect" })
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
          <IonTitle>Log in</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <h1>Welcome Back</h1>
        <form onSubmit={handleSubmit(submitData)} >
          <IonItem className={errors.email ? "ion-invalid" : "ion-valid"}>
            <IonLabel position="stacked">Email Address</IonLabel>
            <IonInput
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "email is invalid"
                }
              })}
            />
            {errors.email && (
                <IonNote slot="error" color={"danger"}>{errors.email.message}</IonNote>
            )}
          </IonItem>
          <IonItem className={errors.password ? "ion-invalid" : "ion-valid"}>
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput type="password"
              {...register("password", {
                required: "Password is required"
              })}
            />
            {errors.password && (
                <IonNote slot="error" color={"danger"}>{errors.password.message}</IonNote>
            )}
          </IonItem>
          <IonButton expand="block" type="submit" className="ion-margin-top">
            {isSubmitting ? <IonSpinner></IonSpinner> : "LOG IN"}
          </IonButton>
          <IonItem lines="none">
            <p>
              Don't have an Account?
              <IonRouterLink routerDirection="forward" routerLink="/register"> Register</IonRouterLink>
            </p>
          </IonItem>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
