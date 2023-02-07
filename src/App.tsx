import { Redirect, Route } from "react-router-dom";
import {
  IonApp, IonContent,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { homeSharp, chatbubblesSharp, personSharp } from "ionicons/icons";
import HomeTab from "./pages/home/HomeTab";
import ClubsTab from "./pages/clubs/ClubsTab";
import ProfileTab from "./pages/profile/ProfileTab";
import LoginPage from "./pages/identity/LoginPage";
import RegisterPage from "./pages/identity/RegisterPage";
import Agenda from "./pages/Agenda";
import ClubPage from "./pages/clubs/ClubPage";
import LiveDiscussion from "./pages/discussion/LiveDiscussion";
import ArchivedLiveDiscussion from "./pages/discussion/ArchivedLiveDiscussion";
import StartPage from "./pages/identity/StartPage";
import Comments from "./pages/comments/Comments";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/general.css";
import { useEffect, useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import { getCurrentUser } from "./firebase/firebaseAuth";
import { setUserState } from "./reducers/actions";

setupIonicReact();
const RoutingSystem: React.FC = () => {
  const isLoggedIn = useSelector((state:any) => state.user.user)

return <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/login">
              <LoginPage />
            </Route>
            <Route exact path="/register">
              <RegisterPage />
            </Route>
            <Route exact path="/start">
              <StartPage />
            </Route>
            <Route path="/tabs" render={() => <TabRouting />}/>
            <Route path="/live/:bookClubId/discussions/:discussionId/view" render={() => {return isLoggedIn ? <LiveDiscussion/> : <Redirect to="/login"/>}} exact/>
            <Route exact path="/">
              {isLoggedIn ? <Redirect to="/tabs" /> : <Redirect to="/start" />}
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
}

export const TabRouting: React.FC = () => {
  const isLoggedIn = useSelector((state:any) => state.user.user)
  const [selectedTab, setSelectedTab] = useState();

  const authRouteCheck = (component: JSX.Element) => {
    return isLoggedIn ? component : <Redirect to="/login"/>;
  }

  const isSelected = (tab: string) => {
    return tab === selectedTab;
  }

  return (
  <IonContent>
    <IonTabs onIonTabsWillChange={(e: any) => setSelectedTab(e.detail.tab)}>
      <IonRouterOutlet>
        <Route exact path="/tabs">
          <Redirect to="/tabs/home"/>
        </Route>
        <Route path="/tabs/clubs" render={() => authRouteCheck(<ClubsTab/>)} exact/>
        <Route path="/tabs/home" render={() => authRouteCheck(<HomeTab isSelected={isSelected("home")}/>)} exact/>
        <Route path="/tabs/home/:bookClubId/view" render={() => authRouteCheck(<ClubPage/>)} exact/>
        <Route path="/tabs/home/:bookClubId/discussions/:discussionId/comments" render={() => authRouteCheck(<Comments/>)} exact/>
        <Route path="/tabs/home/:bookClubId/discussions/:discussionId/agenda" render={() => authRouteCheck(<Agenda/>)} exact/>
        <Route path="/tabs/home/:bookClubId/discussions/:discussionId/archived"
               render={() => authRouteCheck(<ArchivedLiveDiscussion/>)} exact/>
        <Route path="/tabs/profile" render={() => authRouteCheck(<ProfileTab/>)} exact/>
        <Route path="/tabs/clubs/:bookClubId/view" render={() => authRouteCheck(<ClubPage/>)} exact/>
        <Route path="/tabs/clubs/:bookClubId/discussions/:discussionId/comments" render={() => authRouteCheck(<Comments/>)} exact/>
        <Route path="/tabs/clubs/:bookClubId/discussions/:discussionId/agenda" render={() => authRouteCheck(<Agenda/>)} exact/>
        <Route path="/tabs/clubs/:bookClubId/discussions/:discussionId/archived"
               render={() => authRouteCheck(<ArchivedLiveDiscussion/>)} exact/>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/tabs/home">
          <IonIcon icon={homeSharp}/>
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="clubs" href="/tabs/clubs">
          <IonIcon icon={chatbubblesSharp}/>
          <IonLabel>Clubs</IonLabel>
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile">
          <IonIcon icon={personSharp}/>
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  </IonContent>
  )
}

const App: React.FC = () => {
  const [busy, setBusy] = useState(true)
  const dispatch = useDispatch();

  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      if (currentUser) {
        dispatch(setUserState(currentUser))
        //console.log("logged in :)")
      } else {
        //console.log("not logged in :(")
      }
      setBusy(false);
    })
  }, [])
  //Spinner that is displayed while content is loading
  return <IonApp>{busy ? <IonSpinner /> : <RoutingSystem />}</IonApp>
}

export default App;
