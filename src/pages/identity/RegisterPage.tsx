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
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { registerUser } from "../../firebase/firebaseAuth";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isTermsChecked, setIsTermsChecked] = useState<boolean>(false);
  const [isNameValid, setIsNameValid] = useState<boolean>();
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState<boolean>();
  const [invalidEmailError, setInvalidEmailError] = useState<string>();
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>();
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isConfirmedPasswordValid, setIsConfirmedPasswordValid] = useState<boolean>();
  const [isConfirmedPasswordTouched, setIsConfirmedPasswordTouched] = useState(false);
  const [isTermsCheckedValid, setIsTermsCheckedValid] = useState<boolean>();
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const history = useHistory();

  async function register() {
    if (name.length === 0) {
      setIsNameValid(false);
    } else if (!email.match(emailRegex)) {
      // change the color of the email input bar if the email isn't correct
      setIsEmailValid(false);
      setInvalidEmailError("email is incorrect")
    } else if (password.length < 6) {
      // change the color of the password input bar if the password isn't correct
      setIsPasswordValid(false);
    } else if (password !== confirmedPassword) {
      // change the color of the confirn password input bar if it doesn't match
      setIsConfirmedPasswordValid(false);
    } else if (isTermsChecked === false){
      // change the color of the terms check if it's not checked
      setIsTermsCheckedValid(false);
    } else {
      const result = await registerUser(email, password);
      if (result === "") {
        history.push("/home");
      } else if (result === "auth/email-already-in-use") {
        setIsEmailValid(false);
        setInvalidEmailError("this email already exists");
      }
    }
  }

  // reset the color of the name input bar after user types
  function onNameInput(event: any) {
    setName(event.target.value);
    setIsNameValid(true);
    setIsNameTouched(true);
  }

  // reset the color of the email input bar after user types
  function onEmailInput(event: any) {
    setEmail(event.target.value);
    setIsEmailValid(true);
    setIsEmailTouched(true);
  }

  // reset the color of the password input bar after user types
  function onPasswordInput(event: any) {
    setPassword(event.target.value);
    setIsPasswordValid(true);
    setIsPasswordTouched(true);
  }

  // reset the color of the confirm password input bar after user types
  function onConfirmPasswordInput(event: any) {
    setConfirmedPassword(event.target.value);
    setIsConfirmedPasswordValid(true);
    setIsConfirmedPasswordTouched(true);
  }

  // reset the color of the terms check
  function onTermsCheck(event: any) {
    setIsTermsChecked(event.detail.checked);
    setIsTermsCheckedValid(true);
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
        <IonItem className={`${isNameValid === false && 'ion-invalid'} ${isNameTouched && 'ion-touched'}`}>
          <IonLabel position="floating">User Name</IonLabel>
          <IonInput onIonChange={onNameInput}></IonInput>
          {isNameValid === false && (
            <IonNote slot="error">please enter you name</IonNote>
          )}
        </IonItem>

        <IonItem className={`${isEmailValid === false && 'ion-invalid'} ${isEmailTouched && 'ion-touched'}`}>
          <IonLabel position="floating">Email Address</IonLabel>
          <IonInput type="email" onIonChange={onEmailInput}></IonInput>
          {isEmailValid === false && (
            <IonNote slot="error">{invalidEmailError}</IonNote>
          )}
        </IonItem>

        <IonItem className={`${isPasswordValid === false && 'ion-invalid'} ${isPasswordTouched && 'ion-touched'}`}>
          <IonLabel position="floating">Password</IonLabel>
          <IonInput type="password" onIonChange={onPasswordInput}></IonInput>
          {isPasswordValid === false && (
            <IonNote slot="error">min 6 characters</IonNote>
          )}
        </IonItem>

        <IonItem className={`${isConfirmedPasswordValid === false && 'ion-invalid'} ${isConfirmedPasswordTouched && 'ion-touched'}`}>
          <IonLabel position="floating">Confirm Password</IonLabel>
          <IonInput type="password" onIonChange={onConfirmPasswordInput}></IonInput>
          {isConfirmedPasswordValid === false && (
            <IonNote slot="error">should match the password above</IonNote>
          )}
        </IonItem>
        <IonItem lines="none">
          <IonCheckbox slot="start" onIonChange={onTermsCheck}></IonCheckbox>
          <IonLabel color={`${isTermsCheckedValid === false && 'danger'}`}>
            I have taken note of the
            <br />
            data protection regulations
          </IonLabel>
        </IonItem>
        <IonButton onClick={register}>Register</IonButton>
        <IonItem lines="none">
          <p>
            Already have an account?
            <IonRouterLink routerDirection="forward" routerLink="/login"> Log in</IonRouterLink>
          </p>
        </IonItem>
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
