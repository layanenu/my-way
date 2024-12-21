import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBz_jV87comewdtZSyVcBsCGWNPskgK9CE",
  authDomain: "myway-45b76.firebaseapp.com",
  projectId: "myway-45b76",
  storageBucket: "myway-45b76.appspot.com",
  messagingSenderId: "686559017495",
  appId: "1:686559017495:web:52087f8ad281288aab7a52",
  measurementId: "G-CHLQ9K4EML",
};

const app = initializeApp(firebaseConfig);

const database = getFirestore(app);

export { database };
