import {
    IonCard,
    IonIcon,
    IonCol,
    IonGrid,
    IonRow,
    IonButton

} from "@ionic/react";
import { documentTextOutline, peopleCircle } from "ionicons/icons";

interface ResourceCardProps {
    title: string;
    date: string;
    type: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ title, date, type }: ResourceCardProps) => {
    return (
        <IonCard>
            <IonGrid>
                <IonRow>
                    <IonCol size="1">
                        <IonIcon icon={documentTextOutline}></IonIcon>
                    </IonCol>

                    <IonCol size="4">
                        {title}
                    </IonCol>

                    <IonCol size="4">
                        {date}<br></br>
                        Type: {type}
                    </IonCol>

                    <IonCol size="3">
                        <IonButton routerLink="/resources/edit">Edit</IonButton>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCard>
    )
}