import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
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
import EditComment from "./pages/comments/EditComment";

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
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./firebase/firebaseAuth";
import { setUserState } from "./reducers/actions";
import PrivateRoute from "./routes/PrivateRoutes";

setupIonicReact();
const RoutingSystem: React.FC = () => {
return <IonApp>
        <IonReactRouter>
          <IonTabs>
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
              <Route exact path="/home">
                <HomeTab />
              </Route>
              <Route exact path="/clubs">
                <ClubsTab />
              </Route>
              <Route path="/start">
                <StartPage/>
              </Route>
              <Route path="/profile" >
                <ProfileTab/>
              </Route>
              <Route exact path="/discussions/live">
                <LiveDiscussion />
              </Route>
              <Route exact path="/">
                <Redirect to="/start"/>
              </Route>

              <PrivateRoute path="/clubs/:bookClubId/view" component={ClubPage} exact/>
              <PrivateRoute path="/clubs/:bookClubId/discussions/:discussionId/comments" component={Comments} exact/>
              <PrivateRoute path="/clubs/:bookClubId/discussions/:discussionId/comments/:commentId/edit" component={EditComment} exact/>
              <PrivateRoute path="/clubs/:bookClubId/discussions/:discussionId/agenda" component={Agenda} exact/>
              <PrivateRoute path="/clubs/:bookClubId/discussions/:discussionId/live" component={LiveDiscussion}  exact/>
              <PrivateRoute path="/clubs/:bookClubId/discussions/:discussionId/archived" component={ArchivedLiveDiscussion}  exact/>

            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="home" href="/home">
                <IonIcon icon={homeSharp} />
                <IonLabel>Home</IonLabel>
              </IonTabButton>
              <IonTabButton tab="clubs" href="/clubs">
                <IonIcon icon={chatbubblesSharp} />
                <IonLabel>Clubs</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/profile">
                <IonIcon icon={personSharp} />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
}

const App: React.FC = () => {
  const [busy, setBusy] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    getCurrentUser().then((user: any) => {
      if (user) {
        dispatch(setUserState(user))
        //console.log("logged in :)")
      } else {
        //console.log("not logged in :(")
      }
      setBusy(false)
    })
  }, [])
  //Spinner that is displayed while content is loading
  return <IonApp>{busy ? <IonSpinner /> : <RoutingSystem />}</IonApp>
}

export default App;
