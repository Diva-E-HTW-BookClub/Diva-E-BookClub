import axios from "axios";
import { resolve } from "dns";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { API_URL, REQUEST_CONFIG } from "../constants";

import { firebaseApp, provideAuth, firebaseDB } from "./firebaseConfig";

const auth = provideAuth();

type User = {
  id: string;
  name: string;
};

async function getCurrentUser() {
  return await new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(function (user) {
      if (user) {
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

async function registerUser(email: string, password: string, username: string) {
  return createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      return saveUser(userCredential.user.uid, username);
    })
    .then(result => {
      // Registered
      return "";
    })
    .catch(error => {
      // Firebase: Error (auth/invalid-email).
      // Firebase: Password should be at least 6 characters (auth/weak-password).
      // Firebase: Error (auth/email-already-in-use).
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      return errorCode;
    });
}

async function saveUser(userId: string, username: string) {
  let params = new URLSearchParams({ "userId": userId })
  let url = API_URL + "profile/username?" + params
  await axios.post(url, {
    username: username
  }, REQUEST_CONFIG)
    .catch(error => {
      console.log(error);
    });
}

async function updateUser(userId: string, data: any){
  let params = new URLSearchParams({ "userId": userId })
  let url = API_URL + "profile/username?" + params
  await axios.patch(url, {
    username: data.username,
    email: data.email,
    password: data.password,
  }, REQUEST_CONFIG)
      .catch(error => {
        console.log(error);
      })
}

async function getUsername(userId: string) {
  let params = new URLSearchParams({ "userId": userId })
  let url = API_URL + "profile/username?" + params
  return await axios.get(url, REQUEST_CONFIG)
    .then(response => response.data)
    .then(data => data.username)
    .catch(error => {
        console.log(error);
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
      window.location.reload();
      //Success
    })
    .catch((error) => {
      //Failed with error
    });
}

export { registerUser, loginUser, logoutUser, getCurrentUser, getUsername, updateUser };
