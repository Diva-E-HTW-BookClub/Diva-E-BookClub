import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonCard,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/react";
import "./AddResource.css";

const AddDiscussion: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Add Resource</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonGrid>
            <div className="box">
              <div className="divider"></div>
              <IonItem>
                <IonLabel position="stacked">
                  <h1>Title</h1>
                </IonLabel>
                <IonInput placeholder="Enter the title"></IonInput>
              </IonItem>
              <div className="divider"></div>
              <IonItem>
                <IonLabel position="stacked">
                  <h1>Add Link</h1>
                </IonLabel>
                <IonInput placeholder="Enter the link"></IonInput>
              </IonItem>
              <div className="divider"></div>
              <div className="divider"></div>
              <IonRow>
                <IonCol size="5">
                  <IonButton
                    routerLink="/clubs/clubId"
                    className="cancel-button"
                  >
                    Cancel
                  </IonButton>
                </IonCol>
                <IonCol size="5">
                  <IonButton>Done</IonButton>
                </IonCol>
              </IonRow>
              <div className="divider"></div>
            </div>
          </IonGrid>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AddDiscussion;
