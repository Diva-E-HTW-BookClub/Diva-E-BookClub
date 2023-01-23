import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { camera, personCircleOutline } from "ionicons/icons";
import { useState } from "react";
import "./ProfileTab.css";
import { logoutUser } from "../../firebase/firebaseAuth";
import { useSelector } from "react-redux";

const ProfileTab: React.FC = () => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
  const user = useSelector((state: any) => state.user.user);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem lines="none">
          <IonIcon
            color="medium"
            class="picture"
            icon={personCircleOutline}
          ></IonIcon>
        </IonItem>

        <div className="notLogged">{!user && "You are not logged in!"}</div>
        {isReadOnly && user && (
          <>
            <IonItem>
              <IonLabel position="stacked">User Name</IonLabel>
              <IonInput
                placeholder="Enter User Name"
                readonly={true}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email Address</IonLabel>
              <h4>{user.email}</h4>
            </IonItem>
            <IonItem lines="none">
              <div className="editButton">
                <IonButton
                  size="default"
                  onClick={() => setIsReadOnly(!isReadOnly)}
                >
                  Edit Profile
                </IonButton>
              </div>
              <IonButton size="default" onClick={logoutUser} >
                logout
              </IonButton>
            </IonItem>
          </>
        )}
        {!isReadOnly && (
          <>
            <IonItem lines="none">
              <IonIcon color="medium" icon={camera} size="large"></IonIcon>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">User Name*</IonLabel>
              <IonInput placeholder="Enter User Name"></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email Address*</IonLabel>
              <IonInput placeholder="email@address.com"></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password*</IonLabel>
              <IonInput placeholder="********"></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Confirm Password*</IonLabel>
              <IonInput placeholder="********"></IonInput>
            </IonItem>
            <IonItem lines="none">
              <p>*Mandatory Fields</p>
            </IonItem>
            <IonItem lines="none">
              <div className="editButton">
                <IonButton
                  size="default"
                  onClick={() => setIsReadOnly(!isReadOnly)}
                >
                  Save
                </IonButton>
              </div>
            </IonItem>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
