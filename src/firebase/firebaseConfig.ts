import { Capacitor } from "@capacitor/core";
import { initializeApp } from "firebase/app";
import { getAuth, indexedDBLocalPersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  // Add firebase config data here
};

const firebaseApp = initializeApp(firebaseConfig);
function provideAuth() {
  let auth
  if (Capacitor.isNativePlatform()) {
    auth = initializeAuth(firebaseApp, {
      persistence: indexedDBLocalPersistence
    })
  } else {
    auth = getAuth()
  }
  return auth
}
// Initialize Firebase

// Initialize Cloud Firestore and get a reference to the service
const firebaseDB = getFirestore(firebaseApp);

export { firebaseApp, firebaseDB, provideAuth };
