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

function getCurrentUser() {
  return new Promise((resolve, reject) =>{
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
  const auth = getAuth(firebaseApp);
  signOut(auth)
    .then(() => {
      //Success
    })
    .catch((error) => {
      //Failed with error
    });
}

export { registerUser, loginUser, logoutUser, getCurrentUser };
