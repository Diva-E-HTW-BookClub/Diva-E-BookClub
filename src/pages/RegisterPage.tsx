import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonInput,
    IonButton,
} from '@ionic/react';
import { createUserWithEmailAndPassword, getAuth,  } from 'firebase/auth';
import { registerUser } from '../firebase/firebaseAuth'
import { useState } from 'react';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmedPassword, setConfirmedPassword] = useState('')

    async function register() {
        const res = await registerUser(email, password)
        console.log(res)
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
                <IonButton onClick={register}>Register</IonButton>

                <p> Already have an account? <IonButton routerLink="/login">Login</IonButton> </p>
            </IonContent>
        </IonPage>
    )
};

export default RegisterPage;