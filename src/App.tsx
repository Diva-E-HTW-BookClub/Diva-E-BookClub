import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeSharp, chatbubblesSharp, personSharp } from 'ionicons/icons';
import HomeTab from './pages/HomeTab';
import ClubsTab from './pages/ClubsTab';
import ProfileTab from './pages/ProfileTab';
import CreateClubPage from './pages/CreateClubPage';
import Agenda from './pages/Agenda';
import ClubPage from './pages/ClubPage';
import AddDiscussion from './pages/AddDiscussion';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <HomeTab />
          </Route>
          <Route exact path="/clubs">
            <ClubsTab />
          </Route>
          <Route exact path="/clubs/create">
            <CreateClubPage />
          </Route>
          <Route exact path="/clubs/clubId">
            <ClubPage />
          </Route>
          <Route exact path="/AddDiscussion">
            <AddDiscussion />
          </Route>
          <Route path="/profile">
            <ProfileTab />
          </Route>
          <Route path="/agenda">
            <Agenda />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
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
