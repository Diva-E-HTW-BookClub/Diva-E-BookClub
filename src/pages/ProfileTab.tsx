import { IonButton, IonContent, IonHeader, IonIcon, IonInput, IonLabel, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { camera, personCircleOutline } from 'ionicons/icons';
import { useState } from 'react';
import './ProfileTab.css';

const ProfileTab: React.FC = () => {
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)
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
        <IonIcon icon={personCircleOutline} size="large"></IonIcon>
        <div></div>
        {isReadOnly && 
        <><IonLabel position="stacked">User Name</IonLabel><IonInput placeholder="Enter User Name" readonly={true}></IonInput>
        <IonLabel position="stacked">Email Address</IonLabel><IonInput placeholder="email@address.com" readonly={true}></IonInput><IonButton onClick={() => setIsReadOnly(!isReadOnly)}>Edit Profile</IonButton></>}
        {!isReadOnly &&
        <><IonIcon icon={camera}></IonIcon>
        <div></div>
        <IonLabel position="stacked">User Name*</IonLabel><IonInput placeholder="Enter User Name"></IonInput>
        <IonLabel position="stacked">Email Address*</IonLabel><IonInput placeholder="email@address.com"></IonInput>
        <IonLabel position="stacked">Password*</IonLabel><IonInput placeholder="********"></IonInput>
        <IonLabel position="stacked">Confirm Password*</IonLabel><IonInput placeholder="********"></IonInput>
        <p>*Mandatory Fields</p>
        <IonButton onClick={() => setIsReadOnly(!isReadOnly)}>Save</IonButton></>}
      </IonContent>
    </IonPage>
  );
};

export default ProfileTab;
