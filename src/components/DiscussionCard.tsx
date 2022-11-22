import {
    IonCard,
    IonIcon,
    IonCol,
    IonGrid,
    IonRow,
    IonButton

} from "@ionic/react";
import {peopleCircle} from "ionicons/icons";

interface DiscussionCardProps {
    chapter: string,
    member: number,
    date: string,
    time: string,
    location: string
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
                                                                  chapter,
                                                                  member,
                                                                  date,
                                                                  time,
                                                                  location
                                                              }: DiscussionCardProps) => {
    return (
        <IonCard>
            <IonGrid>
                <IonRow>
                    <IonCol size="4">
                        {chapter}<br></br>
                        {date}
                    </IonCol>

                    <IonCol size="4">
                        <IonIcon icon={peopleCircle}></IonIcon>
                        {member}
                    </IonCol>

                    <IonCol size="4">
                        {time} <br></br>
                        {location}
                    </IonCol>
                </IonRow>

                <IonRow>
                    <IonCol size="4">
                        <IonButton routerLink="/agenda">Outline</IonButton>
                    </IonCol>
                    <IonCol size="4">
                        <IonButton>Comments</IonButton>
                    </IonCol>
                    <IonCol size="4">
                        <IonButton>Edit</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCard>
    )
}