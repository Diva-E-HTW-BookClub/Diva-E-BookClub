import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonNav,
  IonRouterOutlet,
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
import CreateClubPage from "./pages/clubs/CreateClubPage";
import LoginPage from "./pages/identity/LoginPage";
import RegisterPage from "./pages/identity/RegisterPage";
import Agenda from "./pages/Agenda";
import ClubPage from "./pages/clubs/ClubPage";
import AddDiscussion from "./pages/discussion/CreateDiscussion";
import LiveDiscussion from "./pages/discussion/LiveDiscussion";
import AddResource from "./pages/resources/AddResource";
import StartPage from "./pages/identity/StartPage";
import Comments from "./pages/comments/Comments";

import EditResource from "./pages/resources/EditResource";
import EditClubPage from "./pages/clubs/EditClubPage";
import EditDiscussion from "./pages/discussion/EditDiscussion";
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

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
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
          <Route exact path="/create_club">
            <CreateClubPage />
          </Route>
          <Route exact path="/clubs/:bookClubId/view">
            <ClubPage />
          </Route>
          <Route exact path="/clubs/:bookClubId/edit">
            <EditClubPage />
          </Route>
          <Route exact path="/resources/add">
            <AddResource />
          </Route>
          <Route exact path="/resources/edit">
            <EditResource />
          </Route>
          <Route exact path="/clubs/:bookClubId/discussions/add">
            <AddDiscussion />
          </Route>
          <Route exact path="/discussions/live">
            <LiveDiscussion />
          </Route>
          <Route exact path="/clubs/:bookClubId/discussions/:discussionId/comments">
            <Comments />
          </Route>
          <Route exact path="/clubs/:bookClubId/discussions/:discussionId/edit">
            <EditDiscussion />
          </Route>
          <Route exact path="/clubs/:bookClubId/discussions/:discussionId/comments/:commentId/edit">
            <EditComment />
          </Route>
          <Route exact path="/profile">
            <ProfileTab />
          </Route>
          <Route exact path="/agenda">
            <Agenda />
          </Route>
          <Route path="/start">
            <StartPage/>
          </Route>

          <Route exact path="/">
            <Redirect to="/start"/>
          </Route>
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
);

export default App;
