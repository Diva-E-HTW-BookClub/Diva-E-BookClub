import {IonCard, IonCardSubtitle, IonCardTitle, IonIcon} from "@ionic/react";
import {personCircleOutline} from "ionicons/icons";

interface CommentCardProps{
    userName: String;
    pageLine: String;
    quote: String;
    note: String;
}

export const CommentCard: React.FC<CommentCardProps> = ({userName, pageLine, quote, note}) => {
    return (
        <IonCard>
            <IonCardTitle>
                <IonIcon size="large" icon={personCircleOutline}></IonIcon>
                {userName}
            </IonCardTitle>
            <IonCardSubtitle>{pageLine}</IonCardSubtitle>
            <p>{quote}</p>
            <p>{note}</p>
        </IonCard>
    );
}