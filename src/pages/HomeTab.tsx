import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { ClubCard } from '../components/ClubCard';
import './HomeTab.css';

const HomeTab: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState<boolean>(true)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p>Your next Discussions</p>
        {isNewUser && 
        <><p>There are no upcoming discussions.</p><p>Join a Club or create your own!</p><IonButton>Start Now</IonButton></>}
        {!isNewUser &&
        <><ClubCard name={''} member={0} date={''} time={''} location={''}></ClubCard><ClubCard name={''} member={0} date={''} time={''} location={''}></ClubCard></>}
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
