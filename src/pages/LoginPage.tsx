import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonInput,
    IonButton,
    useIonToast
} from '@ionic/react';
import { useState } from 'react';
import { loginUser } from '../firebaseFunctions';


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')    

    async function login() {
        const res = await loginUser(email, password)
        presentToast("test")
    }
    const [present] = useIonToast();

    const presentToast = (message:string ) => {
        present({
        message: message,
        duration: 1500,
        position: 'bottom',
        });
    };

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
                <IonButton onClick={login}>Login</IonButton>

                <p> You dont have an account? <IonButton routerLink="/register">Register</IonButton> </p>
            </IonContent>
        </IonPage>
    )
};

export default LoginPage;