import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonInput,
    IonButton,
} from '@ionic/react';
import { useState } from 'react';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')

    function registerUser() {
        console.log(email, password, confirmedPassword)
    }
    return (
        <IonPage>
            <IonHeader>
                <IonTitle>Register Page</IonTitle>
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
                <IonInput 
                        type='password'
                        placeholder='confirm password' 
                        onIonChange={(e: any) => setConfirmedPassword(e.target.value)}>        
                </IonInput>
                <IonButton onClick={registerUser}>Register</IonButton>

                <p> Already have an account? <IonButton routerLink="/login">Login</IonButton> </p>
            </IonContent>
        </IonPage>
    )
};

export default RegisterPage;