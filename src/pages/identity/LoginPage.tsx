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
  IonNote,
  IonSpinner, IonImg, IonSkeletonText,
} from "@ionic/react";
import "./LoginPage.css";
import { useHistory } from "react-router-dom";
import { loginUser } from "../../firebase/firebaseAuth";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import BlubbleLogo from "../../resources/blubble-logo.png"

type FormValues = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const history = useHistory();
  const [isLoadingLogo, setIsLoadingLogo] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  async function submitData(data: any) {
    setIsSubmitting(true);
    await loginUser(data.email, data.password).then((result) => {
      // if result has no errors redirect to home page
      if (result === "") {
        history.replace("/tabs/home");
        window.location.reload();
      } else if (result === "auth/user-not-found") {
        setError("email", { type: "custom", message: "User does not exists" });
      } else if (result === "auth/wrong-password") {
        setError("password", { type: "custom", message: "Password incorrect" });
      }
      setIsSubmitting(false);
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/start" text="Start" />
          </IonButtons>
          <IonTitle>Log in</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div className="loginContent">
          <div>
            {isLoadingLogo && <IonSkeletonText animated className="loginLogoSkeleton"></IonSkeletonText>}
          <IonImg onIonImgDidLoad={() => setTimeout(() => setIsLoadingLogo(false), 200)} className={isLoadingLogo ? "hideLogoLogin" : "logoLogin"} src={BlubbleLogo}/>
          <IonLabel>
            <div className="welcome-title"> Welcome Back</div>
          </IonLabel>
          </div>
        <form id="login" onSubmit={handleSubmit(submitData)} className="loginForm">
          <IonItem className={errors.email ? "ion-invalid" : "ion-valid"}>
            <IonLabel position="stacked">Email Address</IonLabel>
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
              })}
            />
            {errors.password && (
              <IonNote slot="error" color={"danger"}>
                {errors.password.message}
              </IonNote>
            )}
          </IonItem>
        </form>
          <div>
          <IonButton form="login" expand="block" type="submit" className="ion-margin-top buttonWidth">
            {isSubmitting ? <IonSpinner></IonSpinner> : "LOG IN"}
          </IonButton>
          <div className="verticalSpacing"></div>
          <IonLabel className="registerLoginLink">
            <div>
              Don't have an Account?
              <IonRouterLink routerDirection="back" routerLink="/register">
                {" "}
                Register
              </IonRouterLink>
            </div>
          </IonLabel>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
