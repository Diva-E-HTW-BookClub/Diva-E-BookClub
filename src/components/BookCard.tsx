import {
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonImg,
    IonRow
} from "@ionic/react";

interface BookCardProps {
    image: string,
    title: string,
    author: string,
    selected: boolean
}

export const BookCard: React.FC<BookCardProps> = ({ image, title, author, selected }: BookCardProps) => {
    return (
        <IonCard color={selected ? "secondary" : "none"}>
            <IonGrid>
                <IonRow>
                    <IonCol size="4">
                        <IonImg alt={title} src={image} />
                    </IonCol>
                    <IonCol size="8">
                        <IonCardHeader>
                            <IonCardTitle>{title}</IonCardTitle>
                            <IonCardSubtitle>{author}</IonCardSubtitle>
                        </IonCardHeader>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCard>
    )
}