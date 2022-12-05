import { IonToast } from "@ionic/core/components";
import { NONAME } from "dns";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { firebaseApp, firebaseDB } from "./firebaseConfig";

const auth = getAuth();

export var currentUser: any;

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    // ...
    //Redux - Statemanager for react
    console.log("signed in");
  } else {
    // User is signed out
    // ...
    console.log("not signed in");
  }
});

async function registerUser(email: string, password: string) {
  const auth = getAuth(firebaseApp);
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Registered
      currentUser = userCredential.user;
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
  const auth = getAuth(firebaseApp);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      
    })
    .catch((error) => {
      console.log(error.message);
      // Firebase: Error (auth/wrong-password).
      // Firebase: Error (auth/invalid-email).
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

async function logoutUser() {
  const auth = getAuth(firebaseApp);
  signOut(auth)
    .then(() => {
      //Success
    })
    .catch((error) => {
      //Failed with error
    });
}

export { registerUser, loginUser, logoutUser };
