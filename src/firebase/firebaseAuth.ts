import { resolve } from "dns";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

import { firebaseApp, provideAuth } from "./firebaseConfig";

const auth = provideAuth();

async function getCurrentUser() {
  return await new Promise((resolve, reject) =>{
    const unsubscribe = auth.onAuthStateChanged(function(user) {
        if(user) {
          resolve(user)
        } else {
          resolve(null)
        }
        unsubscribe()
      })
  })
  
}

async function registerUser(email: string, password: string) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Registered
      return "";
    })
    .catch((error) => {
      // Firebase: Error (auth/invalid-email).
      // Firebase: Password should be at least 6 characters (auth/weak-password).
      // Firebase: Error (auth/email-already-in-use).
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      return errorCode;
    });
}

async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      return "";
    })
    .catch((error) => {
      console.log(error.message);
      // Firebase: Error (auth/wrong-password).
      // Firebase: Error (auth/invalid-email).
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      return errorCode;
    });
}

async function logoutUser() {
  signOut(auth)
    .then(() => {
      //Success
    })
    .catch((error) => {
      //Failed with error
    });
}

export { registerUser, loginUser, logoutUser, getCurrentUser };
