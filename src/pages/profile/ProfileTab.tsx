import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar, useIonAlert,
} from "@ionic/react";
import { personCircleOutline } from "ionicons/icons";
import {useEffect, useRef, useState} from "react";
import "./ProfileTab.css";
import { logoutUser, getUsername } from "../../firebase/firebaseAuth";
import { useSelector } from "react-redux";
import EditProfileModal, {ModalHandle} from "../../components/profile/EditProfileModal";

const ProfileTab: React.FC = () => {
  const [user, setUser] = useState<any>({});
  const [presentAlert] = useIonAlert();
  let userIdAndEmail = useSelector((state: any) => state.user.user);
  const editModal = useRef<ModalHandle>(null)

  useEffect(() => {
    getProfileData();
  }, []);

  async function getProfileData () {
    getUsername(userIdAndEmail.uid).then(username => {
      setUser({
        id: userIdAndEmail.uid,
        email: userIdAndEmail.email,
        username: username,
      })
    })
  }

  const alert = () => presentAlert({
    header: "Are you Sure?",
    buttons: [{
      text: "Cancel",
      role: "cancel",
    },
      {
        text: "Log Out",
        role: "destructive",
        handler: () => {
          logoutUser()
        }
      }],
  })

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
        {user && (
          <>
            <IonItem>
              <IonLabel position="stacked">User Name</IonLabel>
              <div>{user.username}</div>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email Address</IonLabel>
              <div>{user.email}</div>
            </IonItem>
            <div className="verticalSpacing"></div>
            <div className="buttonSpacing">
                <IonButton
                    expand="block"
                  onClick={() => editModal.current?.open()}
                >
                  Edit Profile
                </IonButton>
            </div>
            <div className="buttonSpacing">
              <IonButton onClick={alert}
                         expand="block">
                Log Out
              </IonButton>
            </div>
          </>
        )}
        <EditProfileModal user={user} onDismiss={getProfileData} ref={editModal} />
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
