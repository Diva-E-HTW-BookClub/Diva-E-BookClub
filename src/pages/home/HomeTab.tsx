import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonItemGroup,
  IonItemDivider,
  IonList,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./HomeTab.css";
import { isPlatform } from "@ionic/react/";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css/bundle";
import { useSelector } from "react-redux";
import {
  BookClub,
  Discussion,
  getAllDiscussionsOfBookClubsByUser,
  getBookClubsByJoinedMember,
  getBookClubsByModerator,
} from "../../firebase/firebaseBookClub";
import { HomeClubCard } from "../../components/home/HomeClubCard";
import { Pagination } from "swiper";
import { HomeDiscussionCard } from "../../components/home/HomeDiscussionCard";
import { sortDiscussionsByDate } from "../../helpers/discussionSort";

const HomeTab: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const user = useSelector((state: any) => state.user.user);
  const [ownClubs, setOwnClubs] = useState<BookClub[]>();
  const [joinedClubs, setJoinedClubs] = useState<BookClub[]>();
  const [nextDiscussions, setNextDiscussions] = useState<Discussion[]>();
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState<boolean>();

  useEffect(() => {
    getBookClubs();
  }, []);

  async function getBookClubs() {
    setIsLoadingDiscussions(true);
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
    await getAllDiscussionsOfBookClubsByUser(user.uid).then(
      (nextDiscussionsArray) => {
        if (nextDiscussionsArray) {
          setNextDiscussions(sortDiscussionsByDate(nextDiscussionsArray));
        }
        setIsLoadingDiscussions(false);
      }
    );
  }

  async function handleRefresh(event: CustomEvent<RefresherEventDetail>) {
    await getBookClubs().then(() => {
      event.detail.complete();
    });
  }

  function getNumberOfVisibleSlides() {
    if (isPlatform("tablet" || "ipad")) {
      return 2;
    } else if (isPlatform("desktop")) {
      return 3;
    } else {
      return 1;
    }
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
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
                <div className="h2">Own Clubs</div>
                <Swiper
                  modules={[Pagination]}
                  className="ion-padding-horizontal"
                  pagination={{ clickable: true }}
                  grabCursor={true}
                  spaceBetween={5}
                  slidesPerView={getNumberOfVisibleSlides()}
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
            <div className="h2">Joined Clubs</div>
            <Swiper
              modules={[Pagination]}
              className="ion-padding-horizontal"
              pagination={{ clickable: true }}
              grabCursor={true}
              spaceBetween={5}
              slidesPerView={getNumberOfVisibleSlides()}
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
        {isLoadingDiscussions && (
          <div className="centeredLoader">
            <IonSpinner className="flexbox"></IonSpinner>
            <IonLabel className="flexbox ion-text-wrap">
              Checking for next Discussions
            </IonLabel>
          </div>
        )}
        {nextDiscussions && (
          <>
            <div className="h2">Next Discussions</div>
            <IonItemGroup>
              <IonItemDivider>2023</IonItemDivider>
              <IonList>
                {nextDiscussions.map((nextDiscussion, index) => {
                  if (
                    nextDiscussion.bookClubId &&
                    nextDiscussion.bookClubName
                  ) {
                    return (
                      <HomeDiscussionCard
                        key={index}
                        bookClubId={nextDiscussion.bookClubId}
                        bookClubName={nextDiscussion.bookClubName}
                        discussionId={nextDiscussion.id}
                        title={nextDiscussion.title}
                        date={nextDiscussion.date}
                        startTime={nextDiscussion.startTime}
                        endTime={nextDiscussion.endTime}
                        discussionLocation={nextDiscussion.location}
                        isModerator={true}
                        isMember={true}
                      />
                    );
                  }
                })}
              </IonList>
            </IonItemGroup>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
