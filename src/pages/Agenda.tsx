import { IonBadge, IonButton, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonList, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';

const Agenda: React.FC = () => {
    const [isModerator, setIsModerator] = useState<boolean>(true);
    const [isReadOnly, setIsReadOnly] = useState<boolean>(true);
    const [chapterOne, setChapterOne] = useState<string>("Use Exceptions Rather Than Return Codes (S. 103)");
    const [oldChapterOne, setOldChapterOne] = useState<string>("");
    const cancelAdapt = () => {setIsReadOnly(true); setChapterOne(oldChapterOne)}
    const replaceString = () => {setOldChapterOne(chapterOne)}
    useEffect(() => {replaceString()}, [])

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Agenda</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Agenda</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonGrid>
            <IonRow>
                <IonCol>
                    <IonText><h1>Agenda for Chapter 7</h1></IonText>
                </IonCol>
                <IonCol>
                    <IonItem lines="none">
                        <IonBadge>17. November 2022</IonBadge>
                    </IonItem>
                </IonCol>  
            </IonRow>
        </IonGrid>  
          <IonList>
            <IonItem>
                <IonInput onIonInput={(e: any) => setChapterOne(e.target.value)} readonly={isReadOnly} value={chapterOne}></IonInput>
                <IonBadge slot="end">5 min</IonBadge>
            </IonItem>
            <IonItem>
                <IonInput readonly value="Write Your Try-Catch-Finally Statement First (S. 104)"></IonInput>
                <IonBadge slot="end">5 min</IonBadge>
            </IonItem>
            <IonItem>
                <IonInput readonly value="Use Unchecked Exceptions (S. 105)"></IonInput>
                <IonBadge slot="end">5 min</IonBadge>
            </IonItem>
            <IonItem>
                <IonLabel>Profite Context with Exceptions (S. 106)</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Define Exception Classes i. T. of a Caller's Needs (S.107)</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Define the Normal Flow (S. 107)</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Don't Return Null (S. 109)</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Don't Pass Null (S. 110)</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Conclusion (S. 111)</IonLabel>
            </IonItem>
          </IonList>
          {isModerator && isReadOnly && <IonButton onClick={()=>setIsReadOnly(!isReadOnly)}>Adapt</IonButton>}
          {!isReadOnly && <div><IonButton onClick={cancelAdapt}>Cancel</IonButton><br></br>
          <IonButton onClick={()=>setIsReadOnly(!isReadOnly)}>Save</IonButton></div>}
        </IonContent>
      </IonPage>
    );
  };
  
  export default Agenda;