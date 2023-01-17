import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./HomeTab.css";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  BookClub,
  getBookClubsByJoinedMember,
  getBookClubsByModerator,
} from "../../firebase/firebaseBookClub";
import { HomeClubCard } from "../../components/home/HomeClubCard";
import {Pagination} from "swiper";

const HomeTab: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const user = useSelector((state: any) => state.user.user);
  const [ownClubs, setOwnClubs] = useState<BookClub[]>();
  const [joinedClubs, setJoinedClubs] = useState<BookClub[]>();

  useEffect(() => {
    getBookClubs();
  }, []);

  async function getBookClubs() {
    await getBookClubsByModerator(user.uid).then((ownBookClubs) => {
      if (ownBookClubs) {
        setOwnClubs(ownBookClubs);
      }
    });
    await getBookClubsByJoinedMember(user.uid).then((joinedBookClubs) => {
      if (joinedBookClubs) {
        setJoinedClubs(joinedBookClubs);
      }
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-no-padding">
        <IonHeader className="ion-padding-horizontal" collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home</IonTitle>
          </IonToolbar>
        </IonHeader>
        {isNewUser && (
          <>
            <IonItem lines="none">
              <IonLabel>
                There are no upcoming discussions.
                <br />
                Join a Club or create your own!
              </IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonButton size="default" routerLink="/clubs">
                Start Now
              </IonButton>
            </IonItem>
          </>
        )}
        {!isNewUser && (
          <>
            <p className="ion-padding-horizontal">Welcome Back</p>
            {ownClubs && (
              <>
                <h2 className="ion-padding-horizontal">Own Clubs</h2>
                <Swiper
                    modules={[Pagination]}
                  className="ion-padding-horizontal ion-padding-vertical"
                    pagination={{clickable: true}}
                  grabCursor={true}
                  spaceBetween={5}
                  slidesPerView={1}
                >
                  {ownClubs.map((club, index) => {
                    return (
                      <SwiperSlide key={`slide_${index}`}>
                        <HomeClubCard
                          name={club.name}
                          maxMember={club.maxMemberNumber}
                          member={club.members.length}
                          image={club.book.imageUrl}
                          bookTitle={club.book.title}
                          authors={club.book.authors}
                          id={club.id}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </>
            )}
          </>
        )}
        {!isNewUser && joinedClubs && (
          <>
            <h2 className="ion-padding-horizontal">Joined Clubs</h2>
            <Swiper
              className="ion-padding-horizontal"
              grabCursor={true}
              spaceBetween={5}
              slidesPerView={1}
            >
              {joinedClubs.map((club, index) => {
                return (
                  <SwiperSlide key={`slide_${index}`}>
                    <HomeClubCard
                      name={club.name}
                      maxMember={club.maxMemberNumber}
                      member={club.members.length}
                      image={club.book.imageUrl}
                      bookTitle={club.book.title}
                      authors={club.book.authors}
                      id={club.id}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
