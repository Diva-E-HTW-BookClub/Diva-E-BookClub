import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonInput,
    IonItem,
    IonSearchbar,
    IonList,
    IonButton,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButtons,
    useIonViewWillEnter
} from '@ionic/react';
import { useState } from 'react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    function loginUser() {
        console.log(email, password)
    }
    return (
        <IonPage>
            <IonHeader>
                <IonTitle>Login Page</IonTitle>
            </IonHeader>
            <IonContent>
                <IonInput 
                        placeholder='email' 
                        onIonChange={(e: any) => setEmail(e.target.value)}>     
                </IonInput>
                <IonInput 
                        type='password'
                        placeholder='password' 
                        onIonChange={(e: any) => setPassword(e.target.value)}>        
                </IonInput>
                <IonButton onClick={loginUser}>Login</IonButton>

                <p> You dont have an account? <IonButton routerLink="/register">Register</IonButton> </p>
            </IonContent>
        </IonPage>
    )
};

export default LoginPage;