import {
  IonIcon,
  IonButton,
  IonItem,
  IonLabel,
  IonPopover,
  IonList,
  useIonActionSheet,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import "./ResourceCard.css";
import {
  alertCircleOutline,
  ellipsisVertical,
  link,
  pencil,
  trashOutline,
} from "ionicons/icons";
import React, { useRef, useState } from "react";
import { deleteResourceDocument } from "../../firebase/firebaseResource";
import EditResourceModal, { ModalHandle } from "./EditResourceModal";
import { useSelector } from "react-redux";

interface ResourceCardProps {
  title: string;
  content: string;
  moderator: string;
  isBookClubModerator?: boolean;
  isMember?: boolean;
  bookClubId: string;
  resourceId: string;
  updatePage: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  title,
  content,
  bookClubId,
  moderator,
  isBookClubModerator,
  isMember,
  resourceId,
  updatePage,
}: ResourceCardProps) => {
  const user = useSelector((state: any) => state.user.user);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popover = useRef<HTMLIonPopoverElement>(null);
  const editModal = useRef<ModalHandle>(null);
  const [presentDelete] = useIonActionSheet();
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();

  const isResourceModerator = () => {
    return moderator === user.uid;
  };

  async function deleteResource() {
    await deleteResourceDocument(bookClubId, resourceId).then(updatePage);
  }

  const actionSheet = () =>
    presentDelete({
      header: "Delete Resource",
      subHeader: title,
      backdropDismiss: false,
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          data: {
            action: "delete",
          },
        },
        {
          text: "Cancel",
          role: "cancel",
          data: {
            action: "cancel",
          },
        },
      ],
      onDidDismiss: ({ detail }) => {
        if (detail.data.action === "delete") {
          deleteResource();
        }
      },
    });

  const alert = () =>
    presentAlert({
      header: "Open this Link?",
      message: content,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Open",
          role: "confirm",
          handler: () => {
            window.open(content);
          },
        },
      ],
    });

  const presentJoinToast = () => {
    presentToast({
      message: "Please join to access this Book Club and its Discussions",
      duration: 2500,
      icon: alertCircleOutline,
      color: "danger",
    });
  };

  const openPrivateLink = (destination: string) => {
    if (isMember) {
      switch (destination) {
        case "link": {
          alert();
          return;
        }
      }
    } else {
      presentJoinToast();
    }
  };

  const openPopover = (e: any) => {
    popover.current!.event = e;
    setPopoverOpen(true);
  };

  const moderatorPopover = () => {
    return (
      <IonPopover
        ref={popover}
        isOpen={popoverOpen}
        dismissOnSelect={true}
        onDidDismiss={() => setPopoverOpen(false)}
      >
        <IonList lines="full">
          <IonItem
            button
            detail={false}
            onClick={() => editModal.current?.open()}
          >
            <IonLabel class="ion-padding-start">Edit</IonLabel>
            <IonIcon class="ion-padding-end" slot="end" icon={pencil}></IonIcon>
          </IonItem>
          <IonItem button detail={false} onClick={actionSheet} lines="none">
            <IonLabel class="ion-padding-start" color="danger">
              Delete
            </IonLabel>
            <IonIcon
              class="ion-padding-end"
              color="danger"
              slot="end"
              icon={trashOutline}
            ></IonIcon>
          </IonItem>
        </IonList>
      </IonPopover>
    );
  };

  const linkIcon = () => {
    return (
      <div
        className={isMember ? "linkIcon" : "linkIconDisabled"}
        onClick={() => openPrivateLink("link")}
      >
        <IonIcon
          color={isMember ? "" : "medium"}
          size="large"
          icon={link}
        ></IonIcon>
      </div>
    );
  };

  const innerOnClick = (event: any) => {
    event.stopPropagation();
    openPopover(event);
  };

  return (
    <IonItem button detail={false}>
      <div className="ion-padding-start">{linkIcon()}</div>
      <div className="spacing"></div>
      <IonLabel
        color={!isMember ? "medium" : ""}
        onClick={() => openPrivateLink("link")}
      >
        <div className="title">{title}</div>
        <div className={isMember ? "link" : "linkDisabled"}>{content}</div>
      </IonLabel>
      <div className="ion-padding-end">
        {((isMember && isResourceModerator()) || isBookClubModerator) && (
          <IonButton fill="clear" slot="end" onClick={innerOnClick}>
            <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
          </IonButton>
        )}
        {moderatorPopover()}
        {updatePage && (
          <EditResourceModal
            bookClubId={bookClubId}
            resourceId={resourceId}
            onDismiss={updatePage}
            ref={editModal}
          />
        )}
      </div>
    </IonItem>
  );
};
