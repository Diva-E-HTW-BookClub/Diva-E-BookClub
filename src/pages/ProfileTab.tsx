import {
    IonButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput, IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {camera, personCircleOutline} from 'ionicons/icons';
import {useState} from 'react';
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
                <IonItem lines="none">
                    <IonIcon color="medium" class="picture" icon={personCircleOutline}></IonIcon>
                </IonItem>
                {isReadOnly &&
                    <>
                        <IonItem>
                            <IonLabel position="stacked">User Name</IonLabel>
                            <IonInput placeholder="Enter User Name" readonly={true}></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Email Address</IonLabel>
                            <IonInput placeholder="email@address.com" readonly={true}></IonInput>
                        </IonItem>
                        <IonItem lines="none">
                            <IonButton size="default" onClick={() => setIsReadOnly(!isReadOnly)}>Edit
                                Profile</IonButton>
                        </IonItem>
                    </>}
                {!isReadOnly &&
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
                            <IonButton size="default" onClick={() => setIsReadOnly(!isReadOnly)}>Save</IonButton>
                        </IonItem>
                    </>
                }
            </IonContent>
        </IonPage>
    );
};

export default ProfileTab;
