// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBfRvVX0ijtZ0AV0toa-9kg_ceKRBt7nQg",
  authDomain: "linkedin-clone-2ac77.firebaseapp.com",
  projectId: "linkedin-clone-2ac77",
  storageBucket: "linkedin-clone-2ac77.appspot.com",
  messagingSenderId: "497028141746",
  appId: "1:497028141746:web:ac602492415998d451efab",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };
export default db;
