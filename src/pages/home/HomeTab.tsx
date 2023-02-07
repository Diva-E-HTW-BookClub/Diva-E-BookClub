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
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./HomeTab.css";
import { isPlatform } from "@ionic/react/";

import { Swiper, SwiperSlide } from "swiper/react";
import { useLocation } from "react-router-dom";

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
import { useHistory } from "react-router";
import { useIonRouter } from "@ionic/react";
import { App } from "@capacitor/app";

const HomeTab: React.FC = () => {
  const [isNewUser, setIsNewUser] = useState<boolean>();
  const user = useSelector((state: any) => state.user.user);
  const [ownClubs, setOwnClubs] = useState<BookClub[]>();
  const [joinedClubs, setJoinedClubs] = useState<BookClub[]>();
  const [weeksOfDiscussions, setWeeksOfDiscussions] = useState<number>(2);
  const [nextDiscussions, setNextDiscussions] = useState<Discussion[]>();
  const [isLoadingClubs, setIsLoadingClubs] = useState<boolean>();
  const [isLoadingDiscussions, setIsLoadingDiscussions] = useState<boolean>();
  const history = useHistory();
  const location = useLocation();
  const isFocused = location.pathname === "/tabs/home";

  // for some reason ionBackButton event is published twice when we click on the hardware back button once
  // the method below listens to hardware back button events and prevents any other default listener from receiving it
  // it counts the event when it receives it and goes one step back in history only if the count is odd
  // https://ionicframework.com/docs/developing/hardware-back-button#basic-usage

  let counter = 0;
  const ionRouter = useIonRouter();

  document.addEventListener("ionBackButton", (ev: any) => {
    ev.detail.register(1, () => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      counter++;
      if (counter % 2 === 1) {
        if (
          !ionRouter.canGoBack() ||
          canUseNotLoggedIn(ionRouter.routeInfo.pathname)
        ) {
          App.exitApp();
        }
        if (!location.pathname.includes("live")) {
          history.goBack();
        }
      }
    });
  });

  function canUseNotLoggedIn(pathname: string) {
    return (
      pathname === "/login" || pathname === "/register" || pathname === "/start"
    );
  }

  useEffect(() => {
    getBookClubs();
  }, [isFocused]);

  useEffect(() => {
    getNextDiscussions(weeksOfDiscussions);
  }, [weeksOfDiscussions]);

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
    setIsLoadingClubs(true);
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
      setIsLoadingClubs(false);
    });
    await getAllDiscussionsOfBookClubsByUser(user.uid, weeksOfDiscussions).then(
      (nextDiscussionsArray) => {
        if (nextDiscussionsArray) {
          setNextDiscussions(sortDiscussionsByDate(nextDiscussionsArray));
        }
        setIsLoadingDiscussions(false);
      }
    );
  }

  async function getNextDiscussions(weeks: number) {
    setIsLoadingDiscussions(true);
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

  function userHasClubs() {
    return !!(
      (ownClubs && ownClubs.length !== 0) ||
      (joinedClubs && joinedClubs.length)
    );
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
          <IonButton
            className="startButton"
            size="default"
            routerLink="/tabs/clubs"
            expand="block"
          >
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

  const getSelectedOptionByWeeks = () => {
    switch (weeksOfDiscussions) {
      case 1:
        return "1 Week";
      case 2:
        return "2 Weeks";
      case 3:
        return "3 Weeks";
      case 4:
        return "1 Month";
      case 8:
        return "2 Months";
    }
  };

  const showNextDiscussions = () => {
    if (nextDiscussions !== undefined && nextDiscussions.length > 0) {
      let discussionYears = getYearArrayOfDiscussions(nextDiscussions);
      return (
        <>
          {discussionYears.map((year, index) => {
            return (
              <IonItemGroup key={index}>
                <IonItemDivider>{year}</IonItemDivider>
                <IonList>
                  {nextDiscussions.map((nextDiscussion, index) => {
                    //bookClubId && bookClubName are promise type
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
                          date={nextDiscussion.date}
                          startTime={nextDiscussion.startTime}
                          endTime={nextDiscussion.endTime}
                          participants={nextDiscussion.participants}
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
    } else if (!userHasClubs()) {
      return (
        <div className="ion-margin">
          <IonLabel>
            <p>There is nothing here yet...</p>
          </IonLabel>
        </div>
      );
    } else {
      return (
        <div className="ion-margin">
          <IonLabel>
            <p>
              There are no next Discussions planned
              <br />
              for the next {getSelectedOptionByWeeks()}
            </p>
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
        {!isNewUser && (ownClubs || joinedClubs) && (
          <>
            <div className="ion-padding-horizontal">
              <div className="flexBetween">
                <div className="nextDiscussionsTitle flexbox">
                  Next Discussions
                </div>
                {isLoadingDiscussions && (
                  <IonSpinner className="flexbox"></IonSpinner>
                )}
              </div>
              <div className="flexBetween">
                <div className="flexbox">Filter by:</div>
                <IonSelect
                  className="flexbox"
                  onIonChange={(event) =>
                    setWeeksOfDiscussions(event.detail.value)
                  }
                  value={weeksOfDiscussions}
                >
                  <IonSelectOption value={1}>1 Week</IonSelectOption>
                  <IonSelectOption value={2}>2 Weeks</IonSelectOption>
                  <IonSelectOption value={3}>3 Weeks</IonSelectOption>
                  <IonSelectOption value={4}>1 Month</IonSelectOption>
                  <IonSelectOption value={8}>2 Months</IonSelectOption>
                </IonSelect>
              </div>
            </div>
          </>
        )}
        {showNextDiscussions()}
        {isNewUser && newUserContent()}
      </IonContent>
    </IonPage>
  );
};

export default HomeTab;
