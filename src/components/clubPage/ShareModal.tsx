import React, {
    forwardRef,
    useImperativeHandle,
    useState,
} from "react";
import {
    IonCol,
    IonContent, IonGrid,
    IonItem, IonLabel,
    IonModal, IonRow,
} from "@ionic/react";
import {
    EmailShareButton,
    WhatsappShareButton,
    LinkedinShareButton,
    FacebookShareButton,
    TwitterShareButton,
    TumblrShareButton, FacebookIcon, WhatsappIcon, EmailIcon, TwitterIcon, LinkedinIcon, TumblrIcon
} from "react-share";

interface ShareModalProps {
    bookClubId: string;
}

export type ModalHandle = {
    open: () => void;
};

export const ShareModal = forwardRef<ModalHandle, ShareModalProps>(
    (
        { bookClubId }: ShareModalProps,
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);

        useImperativeHandle(ref, () => ({
            open() {
                setIsOpen(true);
            },
        }));

        function cancelModal() {
            setIsOpen(false);
        }

        //this needs host url in the future
        const sharedUrl = "localhost:8100/clubs/" + bookClubId + "/view";
        const iconSize = 50;

        return (
            <IonModal isOpen={isOpen} onDidDismiss={cancelModal} initialBreakpoint={0.25} breakpoints={[0, 0.25, 0.5]}>
                <IonContent>
                    <IonItem lines="none">
                        <IonLabel>Share your Club</IonLabel>
                    </IonItem>
                    <IonGrid>
                        <IonRow>
                            <IonCol>
                        <FacebookShareButton url={sharedUrl}>
                            <FacebookIcon size={iconSize} round/>
                        </FacebookShareButton>
                            </IonCol>
                            <IonCol>
                        <TwitterShareButton url={sharedUrl}>
                            <TwitterIcon size={iconSize} round/>
                        </TwitterShareButton>
                            </IonCol>
                                <IonCol>
                        <LinkedinShareButton url={sharedUrl}>
                            <LinkedinIcon size={iconSize} round/>
                        </LinkedinShareButton>
                                </IonCol>
                                    <IonCol>
                        <TumblrShareButton url={sharedUrl}>
                            <TumblrIcon size={iconSize} round/>
                        </TumblrShareButton>
                                    </IonCol>
                                        <IonCol>
                        <WhatsappShareButton url={sharedUrl}>
                            <WhatsappIcon size={iconSize} round/>
                        </WhatsappShareButton>
                                        </IonCol>
                                            <IonCol>
                        <EmailShareButton url={sharedUrl}>
                            <EmailIcon size={iconSize} round/>
                        </EmailShareButton>
                                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonModal>
        );
    }
);
