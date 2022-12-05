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
  IonNote
} from "@ionic/react";
import "./LoginPage.css";
import { useHistory } from "react-router-dom";
import { loginUser } from "../../firebase/firebaseAuth";
import { useForm } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const history = useHistory();

  const { register, handleSubmit, setError, formState: { errors } } =
    useForm<FormValues>({
      defaultValues: {
        email: "",
        password: ""
      }
    });

  async function submitData(data: any) {
    const result = await loginUser(data.email, data.password);
    // if result has no errors redirect to home page
    if (result === "") {
      history.push("/home");
    } else if (result === "auth/invalid-email") {
      setError("email", { type: "custom", message: "user with this email doesn't exists" })
    } else if (result === "auth/wrong-password") {
      setError("password", { type: "custom", message: "incorrect password" })
    }
  };

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
          <IonItem>
            <IonLabel position="stacked">Email Address</IonLabel>
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
            <IonLabel position="stacked">Password</IonLabel>
            <IonInput type="password"
              {...register("password", {
                required: "this field is required"
              })}
            />
          </IonItem>
          {errors.password && (
            <IonNote slot="error" color={"danger"}>{errors.password.message}</IonNote>
          )}
          <br />
          <IonButton type="submit">Log in</IonButton>
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
