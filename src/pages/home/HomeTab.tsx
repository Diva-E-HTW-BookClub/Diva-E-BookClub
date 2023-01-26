import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
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
import {
  getYearArrayOfDiscussions,
  sortDiscussionsByDate,
} from "../../helpers/discussionSort";

const HomeTab: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState<boolean>();
  const user = useSelector((state: any) => state.user.user);
  const [ownClubs, setOwnClubs] = useState<BookClub[]>();
  const [joinedClubs, setJoinedClubs] = useState<BookClub[]>();
  const [weeksOfDiscussions, setWeeksOfDiscussions] = useState<number>(2);
  const [nextDiscussions, setNextDiscussions] = useState<Discussion[]>();
  const [isLoadingClubs, setIsLoadingClubs] = useState<boolean>();
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState<boolean>();

  useEffect(() => {
    getBookClubs();
  }, []);

  useEffect(() => {
    if (
      (ownClubs !== undefined && ownClubs.length > 0) ||
      (joinedClubs !== undefined && joinedClubs.length > 0)
    ) {
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }
  }, [ownClubs, joinedClubs]);

  async function getBookClubs() {
    setIsLoadingDiscussions(true);
    setIsLoadingClubs(true);
    await getBookClubsByModerator(user.uid).then((ownBookClubs) => {
      if (ownBookClubs) {
        setOwnClubs(ownBookClubs);
      }
    });
    await getBookClubsByJoinedMember(user.uid).then((joinedBookClubs) => {
      if (joinedBookClubs) {
        setJoinedClubs(joinedBookClubs);
      }
      setIsLoadingClubs(false);
    });
    getNextDiscussions(weeksOfDiscussions);
  }

  async function getNextDiscussions(weeks: number){
    await getAllDiscussionsOfBookClubsByUser(user.uid, weeks).then(
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
    } else {
      return 1;
    }
  }

  const newUserContent = () => {
    if (isLoadingClubs === false) {
      return (
        <div className="ion-padding-horizontal">
          <IonButton className="startButton" size="default" routerLink="/clubs" expand="block">
            Join or Create a Club
          </IonButton>
        </div>
      );
    }
  };

  const showOwnClubs = () => {
    if (ownClubs !== undefined && ownClubs.length > 0) {
      return (
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
      );
    }
  };

  const showJoinedClubs = () => {
    if (joinedClubs !== undefined && joinedClubs.length > 0) {
      return (
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
      );
    }
  };

  const showNextDiscussions = () => {
    if (nextDiscussions !== undefined && nextDiscussions.length > 0) {
      let discussionYears = getYearArrayOfDiscussions(nextDiscussions);
      return (
        <>
          <div className="h2">Next Discussions</div>
          {discussionYears.map((year, index) => {
            return (
              <IonItemGroup key={index}>
                <IonItemDivider>{year}</IonItemDivider>
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
            );
          })}
        </>
      );
    } else {
      return (
        <div className="ion-margin">
          <IonLabel>
            <p>There are no next discussions</p>
          </IonLabel>
        </div>
      );
    }
  };

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
        {!isNewUser && showOwnClubs()}
        {!isNewUser && showJoinedClubs()}
        {isLoadingDiscussions && (
          <div className="centeredLoader">
            <IonSpinner className="flexbox"></IonSpinner>
            <IonLabel className="flexbox ion-text-wrap">
              Checking for next Discussions
            </IonLabel>
          </div>
        )}
        {showNextDiscussions()}
        {isNewUser && newUserContent()}
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
