import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton, IonItemGroup, IonItemDivider,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./HomeTab.css";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  BookClub, Discussion, getAllDiscussionsOfBookClubsByUser,
  getBookClubsByJoinedMember,
  getBookClubsByModerator,
} from "../../firebase/firebaseBookClub";
import { HomeClubCard } from "../../components/home/HomeClubCard";
import {Pagination} from "swiper";
import {HomeDiscussionCard} from "../../components/home/HomeDiscussionCard";

const HomeTab: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const user = useSelector((state: any) => state.user.user);
  const [ownClubs, setOwnClubs] = useState<BookClub[]>();
  const [joinedClubs, setJoinedClubs] = useState<BookClub[]>();
  const [nextDiscussions, setNextDiscussions] = useState<Discussion[]>()

  useEffect(() => {
    getBookClubs();
  }, []);

  async function getBookClubs() {
    await getBookClubsByModerator(user.uid).then((ownBookClubs) => {
      if (ownBookClubs) {
        setOwnClubs(ownBookClubs);
      }
      })
    await getBookClubsByJoinedMember(user.uid).then((joinedBookClubs) => {
      if (joinedBookClubs) {
        setJoinedClubs(joinedBookClubs);
      }
    });
    await getAllDiscussionsOfBookClubsByUser(user.uid).then((nextDiscussionsArray) => {
      if(nextDiscussionsArray){
        setNextDiscussions(nextDiscussionsArray);
      }
    })
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
            {ownClubs && (
              <>
                <h2 className="h2">Own Clubs</h2>
                <Swiper
                    modules={[Pagination]}
                  className="ion-padding-horizontal"
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
            <h2 className="h2">Joined Clubs</h2>
            <Swiper
                modules={[Pagination]}
                className="ion-padding-horizontal"
                pagination={{clickable: true}}
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
        {nextDiscussions && (
            <IonItemGroup>
              <IonItemDivider>2023</IonItemDivider>
            {nextDiscussions.map((nextDiscussion, index) => {
              return (
                  <IonItem key={index}>
                    <HomeDiscussionCard
                        bookClubId={"id"}
                        bookClubName={"BookClubName"}
                        discussionId={nextDiscussion.id} title={nextDiscussion.title}
                        date={nextDiscussion.date} startTime={nextDiscussion.startTime}
                        endTime={nextDiscussion.endTime}
                        discussionLocation={nextDiscussion.location}
                        isModerator={true}
                        isMember={true}
                    />
                  </IonItem>
              )})}
            </IonItemGroup>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
