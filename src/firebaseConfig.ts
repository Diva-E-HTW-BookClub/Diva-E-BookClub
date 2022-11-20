import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite'

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDarZyJqdfwiqwwsHMnzHqm5IPwHgeaUQQ",
  authDomain: "diva-e-htw-bookclub.firebaseapp.com",
  projectId: "diva-e-htw-bookclub",
  storageBucket: "diva-e-htw-bookclub.appspot.com",
  messagingSenderId: "322441309453",
  appId: "1:322441309453:web:b93823d0d867546070d444",
  measurementId: "G-XMMQYQLYFT"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export { firebaseApp }