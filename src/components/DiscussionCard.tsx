import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonImg,
    IonRow
} from "@ionic/react";

interface DiscussionCardProps {
    name: string,
    member: number,
    date: string,
    time: string,
    location: string,
    chapter : string
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({ name, member, date, time, location, chapter }: DiscussionCardProps) => {
    return (
        <IonCard>
            <IonGrid>
                <IonRow>
                    <IonCol size="4">
                        <IonImg alt="Clean Code" src="https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg" />
                    </IonCol>
                    <IonCol size="8">
                        <IonCardHeader>
                            <IonCardTitle>{name}</IonCardTitle>
                            <IonCardSubtitle>{member} people</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            Next discussion<br />
                            {chapter}<br />
                            {time}<br />
                            {date}<br />
                            {location}
                        </IonCardContent>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCard>
    )
}