import { IonToast } from '@ionic/core/components';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseApp } from './firebaseConfig';


async function registerUser(email: string, password: string) {
    const auth = getAuth(firebaseApp);
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        
        return "success"
      })
      .catch((error) => {
        console.log(error.message)
        // Firebase: Error (auth/invalid-email).
        // Firebase: Password should be at least 6 characters (auth/weak-password).
        // Firebase: Error (auth/email-already-in-use).
        const errorCode = error.code;
        const errorMessage = error.message;
      })
  };

async function loginUser(email:string, password: string) {
    const auth = getAuth(firebaseApp);

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
    
        
    })
    .catch((error) => {
        console.log(error.message)
        // Firebase: Error (auth/wrong-password).
        // Firebase: Error (auth/inv alid-email).
        const errorCode = error.code;
        const errorMessage = error.message;
    });

}
export { registerUser, loginUser }
