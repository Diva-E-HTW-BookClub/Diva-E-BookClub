import {
  IonIcon,
  IonButton, IonItem, IonLabel
} from "@ionic/react";
import "./ResourceCard.css";
import {ellipsisVertical, link} from "ionicons/icons";
import React from "react";

interface ResourceCardProps {
  title: string;
  content: string;
  moderator: string;
  bookClubId: string;
  resourceId: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  content,
  bookClubId,
  resourceId,
}: ResourceCardProps) => {

  const linkIcon = () => {
    return (<div className="linkIcon">
      <IonIcon size="large" icon={link}></IonIcon>
    </div>)
  }

  return (
      <IonItem detail={false} href={content} target="_blank">
          <div className="ion-padding-start">
        {linkIcon()}
          </div>
        <div className="spacing"></div>
        <IonLabel>
          <div className="title">{title}</div>
          <div className="link">{content}</div>
        </IonLabel>
          <div className="ion-padding-end">
        <IonButton fill="clear" slot="end" routerLink={"/clubs/" + bookClubId + "/resources/" + resourceId + "/edit/"}>
          <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
        </IonButton>
          </div>
        {/*
          <IonGrid fixed className="ion-padding-horizontal">
            <IonRow class="ion-align-items-center ion-justify-content-between">
              <IonCol className="ion-grid-column">
                <div className="flexStart">
                  {linkIcon()}
                  <IonLabel className="flexbox">
                    <div className="title">{title}</div>
                    <div className="link">{content}</div>
                  </IonLabel>
                </div>
              </IonCol>
              <IonCol size="auto" className="ion-float-right">
                <IonButton fill="clear" routerLink={"/clubs/" + bookClubId + "/resources/" + resourceId + "/edit/"}>
                  <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        */}
      </IonItem>
  );
};
